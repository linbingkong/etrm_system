from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from app.schemas.independent_storage_dayahead import (
    POINTS_PER_DAY,
    IndependentStorageDayAheadBidRequest,
    IndependentStorageDayAheadBidResponse,
    StorageBidSegment,
)


@dataclass(frozen=True)
class StrategyProfile:
    power_weights: tuple[float, ...]
    charge_quantiles: tuple[float, ...]
    discharge_quantiles: tuple[float, ...]


STRATEGY_PROFILES: dict[str, StrategyProfile] = {
    "conservative": StrategyProfile((0.9, 0.1), (0.8, 0.35), (0.2, 0.7)),
    "balanced": StrategyProfile((0.8, 0.2), (0.65, 0.15), (0.35, 0.85)),
    "aggressive": StrategyProfile((0.6, 0.25, 0.15), (0.5, 0.25, 0.05), (0.5, 0.8, 0.95)),
}


class IndependentStorageDayAheadBidService:
    def generate(self, request: IndependentStorageDayAheadBidRequest) -> IndependentStorageDayAheadBidResponse:
        power, soc, profit_components, solver_status = _solve_power_curve(request)
        charge_segments = _make_segments("charge", request, power)
        discharge_segments = _make_segments("discharge", request, power)
        validation_errors = _validate_output(request, power, soc, charge_segments, discharge_segments, solver_status)
        packet = _export_packet(request, power, soc, charge_segments, discharge_segments, profit_components, solver_status)

        return IndependentStorageDayAheadBidResponse(
            station_id=request.station_id,
            node_id=request.node_id,
            market_date=request.market_date,
            strategy="milp_optimization",
            validation_passed=not validation_errors,
            validation_errors=validation_errors,
            submission_packet=packet,
            charge_segments=charge_segments,
            discharge_segments=discharge_segments,
            derived_feasible_power_mw=power,
            derived_soc=soc,
        )


def _solve_power_curve(request: IndependentStorageDayAheadBidRequest) -> tuple[list[float], list[float], dict[str, float], str]:
    try:
        import pulp
    except ImportError:
        power = _greedy_power_curve(request)
        soc = _simulate_soc(request, power)
        return power, soc, _profit_components(request, power), "pulp_unavailable"

    interval_hours = request.time_step_min / 60.0
    model = pulp.LpProblem("storage_day_ahead_milp", pulp.LpMaximize)
    charge = [pulp.LpVariable(f"charge_{index}", lowBound=0) for index in range(POINTS_PER_DAY)]
    discharge = [pulp.LpVariable(f"discharge_{index}", lowBound=0) for index in range(POINTS_PER_DAY)]
    soc = [pulp.LpVariable(f"soc_{index}", lowBound=request.soc_min, upBound=request.soc_max) for index in range(POINTS_PER_DAY + 1)]
    is_charge = [pulp.LpVariable(f"is_charge_{index}", cat="Binary") for index in range(POINTS_PER_DAY)]
    is_discharge = [pulp.LpVariable(f"is_discharge_{index}", cat="Binary") for index in range(POINTS_PER_DAY)]
    is_idle = [pulp.LpVariable(f"is_idle_{index}", cat="Binary") for index in range(POINTS_PER_DAY)]

    model += soc[0] == request.soc_initial
    if request.soc_terminal_target is not None:
        model += soc[POINTS_PER_DAY] == request.soc_terminal_target

    for index in range(POINTS_PER_DAY):
        model += is_charge[index] + is_discharge[index] + is_idle[index] == 1
        model += charge[index] <= request.p_charge_max_mw * is_charge[index]
        model += discharge[index] <= request.p_discharge_max_mw * is_discharge[index]
        model += (
            soc[index + 1]
            == soc[index]
            + charge[index] * interval_hours * request.eta_charge / request.storage_capacity_mwh
            - discharge[index] * interval_hours / (request.storage_capacity_mwh * request.eta_discharge)
        )

    _add_minimum_duration_constraints(model, is_charge, request.min_charge_steps, "charge")
    _add_minimum_duration_constraints(model, is_discharge, request.min_discharge_steps, "discharge")
    _add_minimum_duration_constraints(model, is_idle, request.min_idle_steps, "idle")

    model += pulp.lpSum(
        discharge[index]
        * (
            request.discharge_price_signal[index]
            - request.degradation_cost_yuan_per_mwh
            - request.variable_fee_yuan_per_mwh
            - request.risk_margin_yuan_per_mwh
            - request.required_profit_spread_yuan_per_mwh
        )
        * interval_hours
        - charge[index] * (request.charge_price_signal[index] + request.variable_fee_yuan_per_mwh) * interval_hours
        for index in range(POINTS_PER_DAY)
    )

    solver = pulp.PULP_CBC_CMD(msg=False, timeLimit=request.solver_time_limit_sec, gapRel=request.mip_gap)
    model.solve(solver)
    solver_status = pulp.LpStatus.get(model.status, str(model.status))
    if solver_status != "Optimal":
        power = _greedy_power_curve(request)
        return power, _simulate_soc(request, power), _profit_components(request, power), solver_status

    power = [
        _round_power((pulp.value(discharge[index]) or 0.0) - (pulp.value(charge[index]) or 0.0))
        for index in range(POINTS_PER_DAY)
    ]
    soc_values = [round(float(pulp.value(value) or 0.0), 10) for value in soc]
    return power, soc_values, _profit_components(request, power), solver_status


def _add_minimum_duration_constraints(model: Any, state: list[Any], minimum_steps: int, name: str) -> None:
    if minimum_steps <= 1:
        return
    previous = 0
    for index in range(POINTS_PER_DAY):
        import pulp

        start = pulp.LpVariable(f"start_{name}_{index}", cat="Binary")
        model += start >= state[index] - previous
        model += start <= state[index]
        if index + minimum_steps <= POINTS_PER_DAY:
            model += sum(state[slot] for slot in range(index, index + minimum_steps)) >= minimum_steps * start
        else:
            model += start == 0
        previous = state[index]


def _greedy_power_curve(request: IndependentStorageDayAheadBidRequest) -> list[float]:
    spread = max(request.discharge_price_signal) - min(request.charge_price_signal)
    if spread < request.required_profit_spread_yuan_per_mwh:
        return [0.0] * POINTS_PER_DAY
    charge_slots = set(sorted(range(POINTS_PER_DAY), key=lambda index: request.charge_price_signal[index])[:16])
    discharge_slots = set(sorted(range(POINTS_PER_DAY), key=lambda index: request.discharge_price_signal[index], reverse=True)[:16])
    power = [0.0] * POINTS_PER_DAY
    for index in range(POINTS_PER_DAY):
      if index in charge_slots and index not in discharge_slots:
          power[index] = -request.p_charge_max_mw
      elif index in discharge_slots:
          power[index] = request.p_discharge_max_mw
    return _clip_power_by_soc(request, power)


def _clip_power_by_soc(request: IndependentStorageDayAheadBidRequest, power: list[float]) -> list[float]:
    interval_hours = request.time_step_min / 60.0
    soc = request.soc_initial
    clipped: list[float] = []
    for value in power:
        if value < 0:
            room_mwh = max(0.0, (request.soc_max - soc) * request.storage_capacity_mwh)
            value = -min(abs(value), room_mwh / (interval_hours * request.eta_charge))
        elif value > 0:
            available_mwh = max(0.0, (soc - request.soc_min) * request.storage_capacity_mwh)
            value = min(value, available_mwh * request.eta_discharge / interval_hours)
        value = _round_power(value)
        clipped.append(value)
        soc = _advance_soc(request, soc, value)
    return clipped


def _simulate_soc(request: IndependentStorageDayAheadBidRequest, power: list[float]) -> list[float]:
    soc = request.soc_initial
    result = [round(soc, 10)]
    for value in power:
        soc = _advance_soc(request, soc, value)
        result.append(round(soc, 10))
    return result


def _advance_soc(request: IndependentStorageDayAheadBidRequest, soc: float, power: float) -> float:
    interval_hours = request.time_step_min / 60.0
    if power < 0:
        return min(request.soc_max, soc + abs(power) * interval_hours * request.eta_charge / request.storage_capacity_mwh)
    if power > 0:
        return max(request.soc_min, soc - power * interval_hours / (request.storage_capacity_mwh * request.eta_discharge))
    return soc


def _make_segments(side: str, request: IndependentStorageDayAheadBidRequest, power: list[float]) -> list[StorageBidSegment]:
    samples = []
    for index, value in enumerate(power):
        if side == "charge" and value < 0:
            samples.append((abs(value), request.charge_price_signal[index]))
        if side == "discharge" and value > 0:
            samples.append((value, request.discharge_price_signal[index]))
    if not samples:
        return []

    max_power = max(value for value, _price in samples)
    if max_power < 2.0:
        return []

    profile = STRATEGY_PROFILES[request.trading_strategy]
    weights = _effective_weights(profile.power_weights, max_power)
    prices = [price for _power, price in samples]
    quantiles = profile.charge_quantiles if side == "charge" else profile.discharge_quantiles

    positive_segments = []
    start = 0.0
    for weight, quantile in zip(weights, quantiles):
        end = min(max_power, start + max_power * weight)
        positive_segments.append((start, end, _bounded_price(_quantile(prices, quantile), request)))
        start = end

    segments: list[StorageBidSegment] = []
    if side == "charge":
        for start, end, price in reversed(positive_segments):
            segments.append(StorageBidSegment(p_start=round(-end, 4), p_end=round(-start, 4), price=price))
    else:
        for start, end, price in positive_segments:
            segments.append(StorageBidSegment(p_start=round(start, 4), p_end=round(end, 4), price=price))
    return _merge_segments_by_price(segments, request.merge_price_gap_yuan_per_mwh)


def _effective_weights(weights: tuple[float, ...], max_power: float) -> list[float]:
    effective = [weight for weight in weights if max_power * weight >= 2.0]
    if not effective:
        return [1.0]
    total = sum(effective)
    return [weight / total for weight in effective]


def _merge_segments_by_price(segments: list[StorageBidSegment], merge_gap: float) -> list[StorageBidSegment]:
    if len(segments) <= 1 or merge_gap <= 0:
        return segments
    merged = [segments[0]]
    for segment in segments[1:]:
        current = merged[-1]
        if abs(segment.price - current.price) < merge_gap:
            current.p_end = segment.p_end
            current.price = round((current.price + segment.price) / 2, 4)
        else:
            merged.append(segment)
    return merged


def _profit_components(request: IndependentStorageDayAheadBidRequest, power: list[float]) -> dict[str, float]:
    interval_hours = request.time_step_min / 60.0
    revenue = cost = degradation = variable_fee = risk = required_spread = 0.0
    for index, value in enumerate(power):
        if value > 0:
            revenue += value * request.discharge_price_signal[index] * interval_hours
            degradation += value * request.degradation_cost_yuan_per_mwh * interval_hours
            risk += value * request.risk_margin_yuan_per_mwh * interval_hours
            required_spread += value * request.required_profit_spread_yuan_per_mwh * interval_hours
        elif value < 0:
            cost += abs(value) * request.charge_price_signal[index] * interval_hours
        variable_fee += abs(value) * request.variable_fee_yuan_per_mwh * interval_hours
    profit = revenue - cost - degradation - variable_fee - risk
    return {
        "expected_revenue_yuan": round(revenue, 4),
        "expected_charge_cost_yuan": round(cost, 4),
        "expected_degradation_cost_yuan": round(degradation, 4),
        "expected_variable_fee_yuan": round(variable_fee, 4),
        "expected_risk_cost_yuan": round(risk, 4),
        "expected_required_profit_spread_yuan": round(required_spread, 4),
        "expected_profit_yuan": round(profit, 4),
        "expected_profit_after_required_spread_yuan": round(profit - required_spread, 4),
    }


def _validate_output(
    request: IndependentStorageDayAheadBidRequest,
    power: list[float],
    soc: list[float],
    charge_segments: list[StorageBidSegment],
    discharge_segments: list[StorageBidSegment],
    solver_status: str,
) -> list[str]:
    errors: list[str] = []
    if solver_status not in {"Optimal", "pulp_unavailable"}:
        errors.append(f"MILP solver status: {solver_status}; fallback strategy used")
    if len(power) != POINTS_PER_DAY:
        errors.append("derived_feasible_power_mw must have length 96")
    if len(soc) != POINTS_PER_DAY + 1:
        errors.append("derived_soc must have length 97")
    if any(value < request.soc_min - 1e-6 or value > request.soc_max + 1e-6 for value in soc):
        errors.append("derived_soc out of bounds")
    if request.soc_terminal_target is not None and abs(soc[-1] - request.soc_terminal_target) > 1e-4:
        errors.append("derived_soc does not satisfy soc_terminal_target")
    if not charge_segments:
        errors.append("charge_segments is empty")
    if not discharge_segments:
        errors.append("discharge_segments is empty")
    return errors


def _export_packet(
    request: IndependentStorageDayAheadBidRequest,
    power: list[float],
    soc: list[float],
    charge_segments: list[StorageBidSegment],
    discharge_segments: list[StorageBidSegment],
    profit_components: dict[str, float],
    solver_status: str,
) -> dict[str, Any]:
    return {
        "strategy": "milp_optimization",
        "market_date": request.market_date.isoformat(),
        "station_id": request.station_id,
        "node_id": request.node_id,
        "daily_params": {
            "time_step_min": request.time_step_min,
            "soc_initial": request.soc_initial,
            "soc_terminal_target": request.soc_terminal_target,
            "price_floor": request.price_floor,
            "price_cap": request.price_cap,
            "trading_strategy": request.trading_strategy,
            "solver": "pulp_cbc",
            "solver_status": solver_status,
            **profit_components,
        },
        "derived_feasible_power_mw": power,
        "derived_soc": soc,
        "charge_segments": [segment.model_dump() for segment in charge_segments],
        "discharge_segments": [segment.model_dump() for segment in discharge_segments],
    }


def _bounded_price(price: float, request: IndependentStorageDayAheadBidRequest) -> float:
    return round(max(request.price_floor, min(request.price_cap, price)), 4)


def _quantile(values: list[float], q: float) -> float:
    ordered = sorted(values)
    position = (len(ordered) - 1) * q
    lower = int(position)
    upper = min(lower + 1, len(ordered) - 1)
    return ordered[lower] + (ordered[upper] - ordered[lower]) * (position - lower)


def _round_power(value: float) -> float:
    return 0.0 if abs(value) < 1e-9 else round(value, 4)
