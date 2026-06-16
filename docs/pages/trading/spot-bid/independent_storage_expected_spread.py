from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional


SLOTS_PER_DAY = 96
SOC_TOLERANCE = 1e-6
MIN_EFFECTIVE_SEGMENT_PRICE_GAP_YUAN_PER_MWH = 20.0
TRADING_STRATEGY_PROFILES = {
    "conservative": {
        "power_weights": [0.90, 0.10],
        "charge_quantiles": [0.80, 0.35],
        "discharge_quantiles": [0.20, 0.70],
    },
    "balanced": {
        "power_weights": [0.80, 0.20],
        "charge_quantiles": [0.65, 0.15],
        "discharge_quantiles": [0.35, 0.85],
    },
    "aggressive": {
        "power_weights": [0.60, 0.25, 0.15],
        "charge_quantiles": [0.50, 0.25, 0.05],
        "discharge_quantiles": [0.50, 0.80, 0.95],
    },
}


@dataclass
class RuleProfile:
    """山东独立储能报量报价规则参数。"""

    name: str
    effective_date: str
    subject_type: str
    bid_mode: str
    time_step_min: int
    max_segments_per_side: int
    min_segment_mw: float
    charge_negative: bool
    requires_soc_initial: bool
    allows_soc_terminal_target: bool
    requires_price_limits: bool
    supports_only_afs: bool


SD_2026_EXPECTED_SPREAD_STORAGE = RuleProfile(
    name="sd_2026_expected_spread_storage",
    effective_date="2026-04",
    subject_type="independent_storage",
    bid_mode="price_quantity",
    time_step_min=15,
    max_segments_per_side=3,
    min_segment_mw=2.0,
    charge_negative=True,
    requires_soc_initial=True,
    allows_soc_terminal_target=True,
    requires_price_limits=True,
    supports_only_afs=False,
)


@dataclass
class ExpectedSpreadBidInput:
    rule_profile: RuleProfile
    market_date: str
    station_id: str
    node_id: str
    time_step_min: int
    p_charge_max_mw: List[float]
    p_discharge_max_mw: List[float]
    soc_min: List[float]
    soc_max: List[float]
    soc_initial: float
    soc_terminal_target: Optional[float]
    eta_charge: float
    eta_discharge: float
    price_floor: float
    price_cap: float
    expected_spread_yuan_per_mwh: float
    charge_price_signal: List[float]
    discharge_price_signal: List[float]
    merge_price_gap_yuan_per_mwh: float = 0.0
    storage_capacity_mwh: Optional[float] = None


@dataclass
class ExpectedSpreadBidOutput:
    submission_packet: Dict[str, Any]
    validation_passed: bool
    validation_errors: List[str]
    derived_feasible_power_mw: List[float]
    derived_soc: List[float]


@dataclass
class MilpOptimizationBidInput:
    rule_profile: RuleProfile
    market_date: str
    station_id: str
    node_id: str
    time_step_min: int
    p_charge_max_mw: List[float]
    p_discharge_max_mw: List[float]
    soc_min: List[float]
    soc_max: List[float]
    soc_initial: float
    soc_terminal_target: Optional[float]
    eta_charge: float
    eta_discharge: float
    price_floor: float
    price_cap: float
    charge_price_signal: List[float]
    discharge_price_signal: List[float]
    degradation_cost_yuan_per_mwh: float
    variable_fee_yuan_per_mwh: float
    risk_margin_yuan_per_mwh: float
    min_charge_steps: int
    min_discharge_steps: int
    min_idle_steps: int
    required_profit_spread_yuan_per_mwh: float = 0.0
    trading_strategy: str = "balanced"
    solver_time_limit_sec: float = 60.0
    mip_gap: float = 0.0
    merge_price_gap_yuan_per_mwh: float = 0.0
    storage_capacity_mwh: Optional[float] = None


@dataclass
class MilpOptimizationBidOutput:
    submission_packet: Dict[str, Any]
    validation_passed: bool
    validation_errors: List[str]
    derived_feasible_power_mw: List[float]
    derived_soc: List[float]


def build_expected_spread_bid(input_data: ExpectedSpreadBidInput) -> ExpectedSpreadBidOutput:
    """按用户期望价差生成山东储能报量报价申报包。"""

    static_errors = _validate_static_inputs(input_data)
    if static_errors:
        packet = _export_packet(input_data, [], [], [])
        return ExpectedSpreadBidOutput(packet, False, static_errors, [], [])

    power = _build_expected_spread_schedule(input_data)
    soc = _simulate_soc(input_data, power)
    charge_segments = _make_daily_charge_segments(input_data, power)
    discharge_segments = _make_daily_discharge_segments(input_data, power)
    charge_segments, discharge_segments = _enforce_bid_segment_spread_guard(
        input_data, charge_segments, discharge_segments
    )
    packet = _export_packet(input_data, charge_segments, discharge_segments, soc)
    validation_errors = _validate_output(input_data, packet, power, soc)

    return ExpectedSpreadBidOutput(
        submission_packet=packet,
        validation_passed=not validation_errors,
        validation_errors=validation_errors,
        derived_feasible_power_mw=power,
        derived_soc=soc,
    )


def build_milp_optimization_bid(
    input_data: MilpOptimizationBidInput,
) -> MilpOptimizationBidOutput:
    """用 MILP 生成山东储能日前报量报价申报包。"""

    static_errors = _validate_milp_static_inputs(input_data)
    if static_errors:
        soc = _flat_soc_curve(input_data)
        packet = _export_packet(
            input_data,
            [],
            [],
            soc,
            strategy_name="milp_optimization",
            daily_params_extra=_milp_daily_params(input_data, "not_solved", {}),
        )
        return MilpOptimizationBidOutput(packet, False, static_errors, [0.0] * 96, soc)

    solution = _solve_milp_schedule(input_data)
    if solution["status"] != "Optimal":
        soc = _flat_soc_curve(input_data)
        errors = [f"MILP solver status: {solution['status']}"]
        packet = _export_packet(
            input_data,
            [],
            [],
            soc,
            strategy_name="milp_optimization",
            daily_params_extra=_milp_daily_params(input_data, solution["status"], {}),
        )
        return MilpOptimizationBidOutput(packet, False, errors, [0.0] * 96, soc)

    power = solution["power"]
    soc = solution["soc"]
    charge_segments = _make_daily_charge_segments(input_data, power)
    discharge_segments = _make_daily_discharge_segments(input_data, power)
    charge_segments, discharge_segments = _enforce_bid_segment_spread_guard(
        input_data, charge_segments, discharge_segments
    )
    packet = _export_packet(
        input_data,
        charge_segments,
        discharge_segments,
        soc,
        strategy_name="milp_optimization",
        daily_params_extra=_milp_daily_params(
            input_data, solution["status"], solution["profit_components"]
        ),
    )
    validation_errors = _validate_output(input_data, packet, power, soc)

    return MilpOptimizationBidOutput(
        submission_packet=packet,
        validation_passed=not validation_errors,
        validation_errors=validation_errors,
        derived_feasible_power_mw=power,
        derived_soc=soc,
    )


def _build_expected_spread_schedule(input_data: ExpectedSpreadBidInput) -> List[float]:
    """先按简单价差筛选低买高卖组合，再按时间顺序回放 SOC。"""

    max_simple_spread = max(input_data.discharge_price_signal) - min(
        input_data.charge_price_signal
    )
    if max_simple_spread < input_data.expected_spread_yuan_per_mwh:
        return [0.0] * SLOTS_PER_DAY

    charge_order = sorted(
        range(SLOTS_PER_DAY), key=lambda index: input_data.charge_price_signal[index]
    )
    discharge_order = sorted(
        range(SLOTS_PER_DAY),
        key=lambda index: input_data.discharge_price_signal[index],
        reverse=True,
    )

    selected_charge_slots = set()
    selected_discharge_slots = set()
    for charge_slot in charge_order:
        discharge_slot = _find_best_later_discharge_slot(
            charge_slot,
            discharge_order,
            selected_discharge_slots,
        )
        if discharge_slot is None:
            continue
        spread = (
            input_data.discharge_price_signal[discharge_slot]
            - input_data.charge_price_signal[charge_slot]
        )
        if spread < input_data.expected_spread_yuan_per_mwh:
            continue
        selected_charge_slots.add(charge_slot)
        selected_discharge_slots.add(discharge_slot)

    if not selected_charge_slots and not selected_discharge_slots:
        return [0.0] * SLOTS_PER_DAY

    power = _replay_power_with_soc_limits(
        input_data, selected_charge_slots, selected_discharge_slots
    )
    return _enforce_terminal_target(input_data, power)


def _solve_milp_schedule(input_data: MilpOptimizationBidInput) -> Dict[str, Any]:
    try:
        import pulp
    except ImportError:
        return {"status": "pulp_unavailable"}

    interval_hours = input_data.time_step_min / 60.0
    capacity = _storage_capacity_mwh(input_data)
    model = pulp.LpProblem("storage_day_ahead_milp", pulp.LpMaximize)

    charge = [
        pulp.LpVariable(f"charge_mw_{index}", lowBound=0.0)
        for index in range(SLOTS_PER_DAY)
    ]
    discharge = [
        pulp.LpVariable(f"discharge_mw_{index}", lowBound=0.0)
        for index in range(SLOTS_PER_DAY)
    ]
    soc = [
        pulp.LpVariable(f"soc_{index}", lowBound=0.0, upBound=1.0)
        for index in range(SLOTS_PER_DAY + 1)
    ]
    is_charge = [
        pulp.LpVariable(f"is_charge_{index}", cat="Binary")
        for index in range(SLOTS_PER_DAY)
    ]
    is_discharge = [
        pulp.LpVariable(f"is_discharge_{index}", cat="Binary")
        for index in range(SLOTS_PER_DAY)
    ]
    is_idle = [
        pulp.LpVariable(f"is_idle_{index}", cat="Binary")
        for index in range(SLOTS_PER_DAY)
    ]

    model += soc[0] == input_data.soc_initial
    if input_data.soc_terminal_target is not None:
        model += soc[SLOTS_PER_DAY] == input_data.soc_terminal_target

    for index in range(SLOTS_PER_DAY):
        model += (
            is_charge[index] + is_discharge[index] + is_idle[index] == 1
        )
        model += charge[index] <= input_data.p_charge_max_mw[index] * is_charge[index]
        model += (
            discharge[index]
            <= input_data.p_discharge_max_mw[index] * is_discharge[index]
        )
        model += (
            soc[index + 1]
            == soc[index]
            + charge[index] * interval_hours * input_data.eta_charge / capacity
            - discharge[index]
            * interval_hours
            / (capacity * input_data.eta_discharge)
        )
        model += soc[index + 1] >= input_data.soc_min[index]
        model += soc[index + 1] <= input_data.soc_max[index]

    _add_minimum_duration_constraints(
        model, is_charge, input_data.min_charge_steps, "charge"
    )
    _add_minimum_duration_constraints(
        model, is_discharge, input_data.min_discharge_steps, "discharge"
    )
    _add_minimum_duration_constraints(model, is_idle, input_data.min_idle_steps, "idle")

    revenue = [
        discharge[index] * input_data.discharge_price_signal[index] * interval_hours
        for index in range(SLOTS_PER_DAY)
    ]
    charge_cost = [
        charge[index] * input_data.charge_price_signal[index] * interval_hours
        for index in range(SLOTS_PER_DAY)
    ]
    degradation_cost = [
        discharge[index]
        * input_data.degradation_cost_yuan_per_mwh
        * interval_hours
        for index in range(SLOTS_PER_DAY)
    ]
    variable_fee = [
        (charge[index] + discharge[index])
        * input_data.variable_fee_yuan_per_mwh
        * interval_hours
        for index in range(SLOTS_PER_DAY)
    ]
    risk_cost = [
        discharge[index] * input_data.risk_margin_yuan_per_mwh * interval_hours
        for index in range(SLOTS_PER_DAY)
    ]
    required_profit_spread_cost = [
        discharge[index]
        * input_data.required_profit_spread_yuan_per_mwh
        * interval_hours
        for index in range(SLOTS_PER_DAY)
    ]
    model += (
        pulp.lpSum(revenue)
        - pulp.lpSum(charge_cost)
        - pulp.lpSum(degradation_cost)
        - pulp.lpSum(variable_fee)
        - pulp.lpSum(risk_cost)
        - pulp.lpSum(required_profit_spread_cost)
    )

    solver = pulp.PULP_CBC_CMD(
        msg=False,
        timeLimit=float(input_data.solver_time_limit_sec),
        gapRel=float(input_data.mip_gap),
    )
    model.solve(solver)
    status = pulp.LpStatus.get(model.status, str(model.status))
    if status != "Optimal":
        return {"status": status}

    charge_values = [_round_power(pulp.value(variable) or 0.0) for variable in charge]
    discharge_values = [
        _round_power(pulp.value(variable) or 0.0) for variable in discharge
    ]
    power = [
        _round_power(discharge_values[index] - charge_values[index])
        for index in range(SLOTS_PER_DAY)
    ]
    soc_values = [round((pulp.value(variable) or 0.0), 10) for variable in soc]
    profit_components = _calculate_milp_profit_components(
        input_data, charge_values, discharge_values
    )
    return {
        "status": status,
        "power": power,
        "soc": soc_values,
        "profit_components": profit_components,
    }


def _add_minimum_duration_constraints(
    model: Any, state: List[Any], minimum_steps: int, name: str
) -> None:
    if minimum_steps <= 1:
        return

    previous = 0
    for index in range(SLOTS_PER_DAY):
        start = model.variablesDict().get(f"start_{name}_{index}")
        if start is None:
            import pulp

            start = pulp.LpVariable(f"start_{name}_{index}", cat="Binary")
        model += start >= state[index] - previous
        model += start <= state[index]
        if index + minimum_steps <= SLOTS_PER_DAY:
            model += (
                sum(state[slot] for slot in range(index, index + minimum_steps))
                >= minimum_steps * start
            )
        else:
            model += start == 0
        previous = state[index]


def _calculate_milp_profit_components(
    input_data: MilpOptimizationBidInput,
    charge_mw: List[float],
    discharge_mw: List[float],
) -> Dict[str, float]:
    interval_hours = input_data.time_step_min / 60.0
    expected_revenue = sum(
        discharge_mw[index] * input_data.discharge_price_signal[index] * interval_hours
        for index in range(SLOTS_PER_DAY)
    )
    expected_charge_cost = sum(
        charge_mw[index] * input_data.charge_price_signal[index] * interval_hours
        for index in range(SLOTS_PER_DAY)
    )
    expected_degradation_cost = sum(
        discharge_mw[index]
        * input_data.degradation_cost_yuan_per_mwh
        * interval_hours
        for index in range(SLOTS_PER_DAY)
    )
    expected_variable_fee = sum(
        (charge_mw[index] + discharge_mw[index])
        * input_data.variable_fee_yuan_per_mwh
        * interval_hours
        for index in range(SLOTS_PER_DAY)
    )
    expected_risk_cost = sum(
        discharge_mw[index] * input_data.risk_margin_yuan_per_mwh * interval_hours
        for index in range(SLOTS_PER_DAY)
    )
    expected_required_profit_spread = sum(
        discharge_mw[index]
        * input_data.required_profit_spread_yuan_per_mwh
        * interval_hours
        for index in range(SLOTS_PER_DAY)
    )
    expected_profit = (
        expected_revenue
        - expected_charge_cost
        - expected_degradation_cost
        - expected_variable_fee
        - expected_risk_cost
    )
    expected_profit_after_required_spread = (
        expected_profit - expected_required_profit_spread
    )
    return {
        "expected_revenue_yuan": round(expected_revenue, 4),
        "expected_charge_cost_yuan": round(expected_charge_cost, 4),
        "expected_degradation_cost_yuan": round(expected_degradation_cost, 4),
        "expected_variable_fee_yuan": round(expected_variable_fee, 4),
        "expected_risk_cost_yuan": round(expected_risk_cost, 4),
        "expected_required_profit_spread_yuan": round(
            expected_required_profit_spread, 4
        ),
        "expected_profit_yuan": round(expected_profit, 4),
        "expected_profit_after_required_spread_yuan": round(
            expected_profit_after_required_spread, 4
        ),
    }


def _find_best_later_discharge_slot(
    charge_slot: int,
    discharge_order: List[int],
    selected_discharge_slots: set,
) -> Optional[int]:
    """从价格降序列表里找充电之后的最高价可用放电时段。"""

    for discharge_slot in discharge_order:
        if discharge_slot in selected_discharge_slots:
            continue
        if discharge_slot <= charge_slot:
            continue
        return discharge_slot
    return None


def _replay_power_with_soc_limits(
    input_data: ExpectedSpreadBidInput,
    selected_charge_slots: set,
    selected_discharge_slots: set,
) -> List[float]:
    """按 96 点顺序生成功率，确保每一步都不突破 SOC 上下限。"""

    interval_hours = input_data.time_step_min / 60.0
    capacity = _storage_capacity_mwh(input_data)
    soc = input_data.soc_initial
    power = [0.0] * SLOTS_PER_DAY

    for index in range(SLOTS_PER_DAY):
        if index in selected_charge_slots and index not in selected_discharge_slots:
            room_mwh = max(0.0, (input_data.soc_max[index] - soc) * capacity)
            charge_limit = room_mwh / (interval_hours * input_data.eta_charge)
            power[index] = -_round_power(
                min(input_data.p_charge_max_mw[index], charge_limit)
            )
        elif index in selected_discharge_slots:
            available_mwh = max(0.0, (soc - input_data.soc_min[index]) * capacity)
            discharge_limit = (
                available_mwh * input_data.eta_discharge / interval_hours
            )
            power[index] = _round_power(
                min(input_data.p_discharge_max_mw[index], discharge_limit)
            )

        soc = _advance_soc(input_data, soc, power[index])
        soc = min(max(soc, input_data.soc_min[index]), input_data.soc_max[index])

    return power


def _enforce_terminal_target(
    input_data: ExpectedSpreadBidInput, power_curve: List[float]
) -> List[float]:
    """把日末 SOC 目标作为硬约束；无法闭环时不输出单边充放策略。"""

    target = input_data.soc_terminal_target
    if target is None:
        return power_curve

    soc = _simulate_soc(input_data, power_curve)
    if abs(soc[-1] - target) <= SOC_TOLERANCE:
        return power_curve

    # 当目标 SOC 等于初始 SOC 时，任何不能回到目标的计划都没有交割闭环。
    # 此时宁可不申报充放电，也不生成只充电或只放电的风险策略。
    if abs(input_data.soc_initial - target) <= SOC_TOLERANCE:
        return [0.0] * SLOTS_PER_DAY

    return power_curve


def _simulate_soc(input_data: ExpectedSpreadBidInput, power_curve: List[float]) -> List[float]:
    soc = input_data.soc_initial
    result = [round(soc, 10)]
    for power in power_curve:
        soc = _advance_soc(input_data, soc, power)
        result.append(round(soc, 10))
    return result


def _make_daily_charge_segments(
    input_data: ExpectedSpreadBidInput, power_curve: List[float]
) -> List[Dict[str, float]]:
    samples = [
        (abs(float(power)), float(input_data.charge_price_signal[index]))
        for index, power in enumerate(power_curve)
        if float(power) < 0.0
    ]
    return _make_daily_segments("charge", samples, input_data)


def _make_daily_discharge_segments(
    input_data: ExpectedSpreadBidInput, power_curve: List[float]
) -> List[Dict[str, float]]:
    samples = [
        (float(power), float(input_data.discharge_price_signal[index]))
        for index, power in enumerate(power_curve)
        if float(power) > 0.0
    ]
    return _make_daily_segments("discharge", samples, input_data)


def _make_daily_segments(
    side: str,
    samples: List[tuple],
    input_data: ExpectedSpreadBidInput,
) -> List[Dict[str, float]]:
    if not samples:
        return []

    max_power = max(power for power, _price in samples)
    if max_power < input_data.rule_profile.min_segment_mw:
        return []

    profile = _trading_strategy_profile(input_data)
    weights = _effective_power_weights(
        profile["power_weights"],
        max_power,
        input_data.rule_profile.min_segment_mw,
        input_data.rule_profile.max_segments_per_side,
    )
    quantiles = profile[
        "charge_quantiles" if side == "charge" else "discharge_quantiles"
    ][: len(weights)]
    prices = _candidate_bid_prices(side, samples, input_data)

    segments = []
    cumulative = 0.0
    positive_intervals = []
    for weight, quantile in zip(weights, quantiles):
        next_cumulative = cumulative + max_power * weight
        positive_intervals.append(
            (
                cumulative,
                min(next_cumulative, max_power),
                _bounded_price(_quantile(prices, quantile), input_data),
            )
        )
        cumulative = next_cumulative

    if side == "charge":
        for start_positive, end_positive, price in reversed(positive_intervals):
            segments.append(
                {
                    "p_start": round(-end_positive, 4),
                    "p_end": round(-start_positive, 4),
                    "price": price,
                }
            )
    else:
        for start_positive, end_positive, price in positive_intervals:
            segments.append(
                {
                    "p_start": round(start_positive, 4),
                    "p_end": round(end_positive, 4),
                    "price": price,
                }
            )
    return _merge_adjacent_segments_by_price(side, segments, input_data)


def _trading_strategy_profile(input_data: ExpectedSpreadBidInput) -> Dict[str, List[float]]:
    strategy = getattr(input_data, "trading_strategy", "balanced")
    return TRADING_STRATEGY_PROFILES.get(strategy, TRADING_STRATEGY_PROFILES["balanced"])


def _effective_power_weights(
    weights: List[float],
    max_power: float,
    min_segment_mw: float,
    max_segment_count: int,
) -> List[float]:
    limited_weights = list(weights[:max_segment_count])
    if len(limited_weights) < len(weights):
        limited_weights[-1] += sum(weights[max_segment_count:])

    effective: List[float] = []
    for weight in limited_weights:
        if effective and max_power * weight < min_segment_mw:
            effective[-1] += weight
        else:
            effective.append(weight)

    if len(effective) > 1 and max_power * effective[0] < min_segment_mw:
        effective[1] += effective[0]
        effective = effective[1:]

    total = sum(effective)
    if total <= 0.0:
        return [1.0]
    return [weight / total for weight in effective]


def _candidate_bid_prices(
    side: str,
    samples: List[tuple],
    input_data: ExpectedSpreadBidInput,
) -> List[float]:
    required_spread = _required_bid_spread(input_data)
    if side == "charge":
        threshold = max(float(price) for price in input_data.discharge_price_signal) - required_spread
        candidates = [
            float(price)
            for price in input_data.charge_price_signal
            if float(price) <= threshold
        ]
    else:
        threshold = min(float(price) for price in input_data.charge_price_signal) + required_spread
        candidates = [
            float(price)
            for price in input_data.discharge_price_signal
            if float(price) >= threshold
        ]

    if candidates:
        return candidates
    return [float(price) for _power, price in samples]


def _required_bid_spread(input_data: ExpectedSpreadBidInput) -> float:
    if hasattr(input_data, "required_profit_spread_yuan_per_mwh"):
        return float(getattr(input_data, "required_profit_spread_yuan_per_mwh"))
    return float(getattr(input_data, "expected_spread_yuan_per_mwh", 0.0))


def _enforce_bid_segment_spread_guard(
    input_data: ExpectedSpreadBidInput,
    charge_segments: List[Dict[str, float]],
    discharge_segments: List[Dict[str, float]],
) -> tuple[List[Dict[str, float]], List[Dict[str, float]]]:
    required_spread = _required_bid_spread(input_data)
    if required_spread <= 0.0 or not charge_segments or not discharge_segments:
        return charge_segments, discharge_segments

    charge_by_execution_priority = [dict(segment) for segment in reversed(charge_segments)]
    discharge_by_execution_priority = [dict(segment) for segment in discharge_segments]

    for index, charge_segment in enumerate(charge_by_execution_priority):
        discharge_segment = discharge_by_execution_priority[
            min(index, len(discharge_by_execution_priority) - 1)
        ]
        max_charge_price = float(discharge_segment["price"]) - required_spread
        charge_segment["price"] = _bounded_price(
            min(float(charge_segment["price"]), max_charge_price),
            input_data,
        )

    for index in range(1, len(charge_by_execution_priority)):
        previous_price = float(charge_by_execution_priority[index - 1]["price"])
        current_price = float(charge_by_execution_priority[index]["price"])
        if current_price > previous_price:
            charge_by_execution_priority[index]["price"] = previous_price

    return list(reversed(charge_by_execution_priority)), discharge_by_execution_priority


def _validate_static_inputs(input_data: ExpectedSpreadBidInput) -> List[str]:
    errors = []
    if input_data.rule_profile.bid_mode != "price_quantity":
        errors.append("rule_profile must use price_quantity bid_mode")
    if input_data.rule_profile.subject_type != "independent_storage":
        errors.append("rule_profile subject_type must be independent_storage")
    if input_data.time_step_min != input_data.rule_profile.time_step_min:
        errors.append("time_step_min must match rule_profile")
    for name in (
        "p_charge_max_mw",
        "p_discharge_max_mw",
        "soc_min",
        "soc_max",
        "charge_price_signal",
        "discharge_price_signal",
    ):
        if len(getattr(input_data, name)) != SLOTS_PER_DAY:
            errors.append(f"{name} must have length 96")
    if input_data.price_floor > input_data.price_cap:
        errors.append("price_floor cannot exceed price_cap")
    if (
        hasattr(input_data, "expected_spread_yuan_per_mwh")
        and input_data.expected_spread_yuan_per_mwh < 0.0
    ):
        errors.append("expected_spread_yuan_per_mwh cannot be negative")
    if input_data.merge_price_gap_yuan_per_mwh < 0.0:
        errors.append("merge_price_gap_yuan_per_mwh cannot be negative")
    if (
        hasattr(input_data, "trading_strategy")
        and input_data.trading_strategy not in TRADING_STRATEGY_PROFILES
    ):
        errors.append("trading_strategy must be conservative, balanced, or aggressive")
    if not (0.0 <= input_data.soc_initial <= 1.0):
        errors.append("soc_initial must be between 0 and 1")
    if input_data.eta_charge <= 0.0 or input_data.eta_discharge <= 0.0:
        errors.append("charge and discharge efficiencies must be positive")
    return errors


def _validate_milp_static_inputs(input_data: MilpOptimizationBidInput) -> List[str]:
    errors = _validate_static_inputs(input_data)
    try:
        import pulp  # noqa: F401
    except ImportError:
        errors.append("pulp is required for MILP optimization")

    for name in (
        "degradation_cost_yuan_per_mwh",
        "variable_fee_yuan_per_mwh",
        "risk_margin_yuan_per_mwh",
        "required_profit_spread_yuan_per_mwh",
    ):
        if getattr(input_data, name) < 0.0:
            errors.append(f"{name} cannot be negative")

    for name in ("min_charge_steps", "min_discharge_steps", "min_idle_steps"):
        value = getattr(input_data, name)
        if not isinstance(value, int) or value <= 0:
            errors.append(f"{name} must be a positive integer")

    if input_data.solver_time_limit_sec <= 0.0:
        errors.append("solver_time_limit_sec must be positive")
    if not (0.0 <= input_data.mip_gap <= 1.0):
        errors.append("mip_gap must be between 0 and 1")
    if _storage_capacity_mwh(input_data) <= 0.0:
        errors.append("storage capacity must be positive")
    return errors


def _merge_adjacent_segments_by_price(
    side: str,
    segments: List[Dict[str, float]],
    input_data: ExpectedSpreadBidInput,
) -> List[Dict[str, float]]:
    """合并相邻报价差过小的连续段，减少没有经济含义的细分。"""

    threshold = MIN_EFFECTIVE_SEGMENT_PRICE_GAP_YUAN_PER_MWH
    if threshold <= 0.0 or len(segments) <= 1:
        return segments

    merged: List[Dict[str, float]] = []
    current = dict(segments[0])
    current_prices = [float(current["price"])]

    for segment in segments[1:]:
        next_price = float(segment["price"])
        current_reference_price = current_prices[-1]
        if abs(next_price - current_reference_price) < threshold:
            current["p_end"] = segment["p_end"]
            current_prices.append(next_price)
            if side == "charge":
                current["price"] = round(max(current_prices), 4)
            else:
                current["price"] = round(min(current_prices), 4)
        else:
            merged.append(current)
            current = dict(segment)
            current_prices = [float(current["price"])]

    merged.append(current)
    return merged


def _validate_output(
    input_data: ExpectedSpreadBidInput,
    packet: Dict[str, Any],
    power: List[float],
    soc: List[float],
) -> List[str]:
    errors = _validate_static_inputs(input_data)
    if errors:
        return errors
    if len(power) != SLOTS_PER_DAY:
        errors.append("derived_feasible_power_mw must have length 96")
    if len(soc) != SLOTS_PER_DAY + 1:
        errors.append("derived_soc must have length 97")

    for index in range(SLOTS_PER_DAY):
        if not (
            input_data.soc_min[index] - SOC_TOLERANCE
            <= soc[index + 1]
            <= input_data.soc_max[index] + SOC_TOLERANCE
        ):
            errors.append(f"soc out of bounds at slot {index}")

    if input_data.soc_terminal_target is not None and len(soc) == SLOTS_PER_DAY + 1:
        terminal_gap = abs(soc[-1] - input_data.soc_terminal_target)
        if terminal_gap > SOC_TOLERANCE:
            errors.append("derived_soc does not satisfy soc_terminal_target")

    errors.extend(_validate_segments("charge", packet["charge_segments"], input_data))
    errors.extend(_validate_segments("discharge", packet["discharge_segments"], input_data))
    return errors


def _validate_segments(
    side: str, segments: List[Dict[str, float]], input_data: ExpectedSpreadBidInput
) -> List[str]:
    errors = []
    if len(segments) > input_data.rule_profile.max_segments_per_side:
        errors.append(f"{side} segment count exceeds rule_profile max")
    previous_end = None
    previous_price = None
    for segment in segments:
        start = float(segment["p_start"])
        end = float(segment["p_end"])
        price = float(segment["price"])
        if end - start < input_data.rule_profile.min_segment_mw - 1e-9:
            errors.append(f"{side} segment length is below rule_profile min_segment_mw")
        if previous_end is not None and abs(start - previous_end) > 1e-9:
            errors.append(f"{side} segments are not continuous")
        if previous_price is not None and price < previous_price - 1e-9:
            errors.append(f"{side} prices must be non-decreasing")
        if price < input_data.price_floor - 1e-9:
            errors.append(f"{side} price below price_floor")
        if price > input_data.price_cap + 1e-9:
            errors.append(f"{side} price above price_cap")
        if side == "charge" and not (start < end <= 0.0):
            errors.append("charge segments must use negative power interval")
        if side == "discharge" and not (0.0 <= start < end):
            errors.append("discharge segments must use positive power interval")
        previous_end = end
        previous_price = price
    return errors


def _export_packet(
    input_data: ExpectedSpreadBidInput,
    charge_segments: List[Dict[str, float]],
    discharge_segments: List[Dict[str, float]],
    soc: List[float],
    strategy_name: str = "expected_spread_simple",
    daily_params_extra: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    daily_params = {
        "time_step_min": input_data.time_step_min,
        "soc_initial": input_data.soc_initial,
        "soc_terminal_target": input_data.soc_terminal_target,
        "eta_charge": input_data.eta_charge,
        "eta_discharge": input_data.eta_discharge,
        "price_floor": input_data.price_floor,
        "price_cap": input_data.price_cap,
        "merge_price_gap_yuan_per_mwh": input_data.merge_price_gap_yuan_per_mwh,
        "effective_segment_merge_gap_yuan_per_mwh": (
            MIN_EFFECTIVE_SEGMENT_PRICE_GAP_YUAN_PER_MWH
        ),
        "trading_strategy": getattr(input_data, "trading_strategy", "balanced"),
    }
    if hasattr(input_data, "expected_spread_yuan_per_mwh"):
        daily_params.update(
            {
                "expected_spread_yuan_per_mwh": input_data.expected_spread_yuan_per_mwh,
                "spread_definition": (
                    "discharge_price_signal[t_sell] - charge_price_signal[t_buy]"
                ),
            }
        )
    if daily_params_extra:
        daily_params.update(daily_params_extra)

    return {
        "strategy": strategy_name,
        "rule_profile": input_data.rule_profile.name,
        "market_date": input_data.market_date,
        "station_id": input_data.station_id,
        "node_id": input_data.node_id,
        "daily_params": daily_params,
        "derived_soc": list(soc),
        "charge_segments": charge_segments,
        "discharge_segments": discharge_segments,
    }


def _advance_soc(input_data: ExpectedSpreadBidInput, soc: float, power: float) -> float:
    interval_hours = input_data.time_step_min / 60.0
    capacity = _storage_capacity_mwh(input_data)
    if power < 0.0:
        return soc + abs(power) * interval_hours * input_data.eta_charge / capacity
    if power > 0.0:
        return soc - power * interval_hours / (capacity * input_data.eta_discharge)
    return soc


def _storage_capacity_mwh(input_data: ExpectedSpreadBidInput) -> float:
    if input_data.storage_capacity_mwh is not None:
        return float(input_data.storage_capacity_mwh)
    return max([0.0] + [float(value) for value in input_data.p_discharge_max_mw]) * 2.0


def _flat_soc_curve(input_data: MilpOptimizationBidInput) -> List[float]:
    return [round(float(input_data.soc_initial), 10)] * (SLOTS_PER_DAY + 1)


def _milp_daily_params(
    input_data: MilpOptimizationBidInput,
    solver_status: str,
    profit_components: Dict[str, float],
) -> Dict[str, Any]:
    params: Dict[str, Any] = {
        "degradation_cost_yuan_per_mwh": input_data.degradation_cost_yuan_per_mwh,
        "variable_fee_yuan_per_mwh": input_data.variable_fee_yuan_per_mwh,
        "risk_margin_yuan_per_mwh": input_data.risk_margin_yuan_per_mwh,
        "required_profit_spread_yuan_per_mwh": (
            input_data.required_profit_spread_yuan_per_mwh
        ),
        "min_charge_steps": input_data.min_charge_steps,
        "min_discharge_steps": input_data.min_discharge_steps,
        "min_idle_steps": input_data.min_idle_steps,
        "solver": "pulp_cbc",
        "solver_status": solver_status,
        "solver_time_limit_sec": input_data.solver_time_limit_sec,
        "mip_gap": input_data.mip_gap,
        "objective_definition": (
            "discharge_revenue - charge_cost - degradation_cost "
            "- variable_fee - risk_margin - required_profit_spread"
        ),
    }
    params.update(profit_components)
    return params


def _bounded_price(price: float, input_data: ExpectedSpreadBidInput) -> float:
    return round(max(input_data.price_floor, min(input_data.price_cap, float(price))), 4)


def _quantile(values: List[float], q: float) -> float:
    ordered = sorted(float(value) for value in values)
    position = (len(ordered) - 1) * q
    lower_index = int(position)
    upper_index = min(lower_index + 1, len(ordered) - 1)
    weight = position - lower_index
    return ordered[lower_index] + (ordered[upper_index] - ordered[lower_index]) * weight


def _round_power(value: float) -> float:
    if abs(value) < 1e-9:
        return 0.0
    return round(value, 4)
