from app.schemas.independent_storage_dayahead import (
    POINTS_PER_DAY,
    IndependentStorageDayAheadBidRequest,
    IndependentStorageDayAheadBidResponse,
)
from app.services.independent_storage_expected_spread import (
    SD_2026_EXPECTED_SPREAD_STORAGE,
    MilpOptimizationBidInput,
    build_milp_optimization_bid,
)


class IndependentStorageDayAheadBidService:
    def generate(self, request: IndependentStorageDayAheadBidRequest) -> IndependentStorageDayAheadBidResponse:
        strategy_input = MilpOptimizationBidInput(
            rule_profile=SD_2026_EXPECTED_SPREAD_STORAGE,
            market_date=request.market_date.isoformat(),
            station_id=request.station_id,
            node_id=request.node_id,
            time_step_min=request.time_step_min,
            p_charge_max_mw=[request.p_charge_max_mw] * POINTS_PER_DAY,
            p_discharge_max_mw=[request.p_discharge_max_mw] * POINTS_PER_DAY,
            soc_min=[request.soc_min] * POINTS_PER_DAY,
            soc_max=[request.soc_max] * POINTS_PER_DAY,
            soc_initial=request.soc_initial,
            soc_terminal_target=request.soc_terminal_target,
            eta_charge=request.eta_charge,
            eta_discharge=request.eta_discharge,
            price_floor=request.price_floor,
            price_cap=request.price_cap,
            charge_price_signal=list(request.charge_price_signal),
            discharge_price_signal=list(request.discharge_price_signal),
            degradation_cost_yuan_per_mwh=request.degradation_cost_yuan_per_mwh,
            variable_fee_yuan_per_mwh=request.variable_fee_yuan_per_mwh,
            risk_margin_yuan_per_mwh=request.risk_margin_yuan_per_mwh,
            trading_strategy=request.trading_strategy,
            min_charge_steps=request.min_charge_steps,
            min_discharge_steps=request.min_discharge_steps,
            min_idle_steps=request.min_idle_steps,
            required_profit_spread_yuan_per_mwh=request.required_profit_spread_yuan_per_mwh,
            solver_time_limit_sec=request.solver_time_limit_sec,
            mip_gap=request.mip_gap,
            merge_price_gap_yuan_per_mwh=request.merge_price_gap_yuan_per_mwh,
            storage_capacity_mwh=request.storage_capacity_mwh,
        )
        result = build_milp_optimization_bid(strategy_input)
        return IndependentStorageDayAheadBidResponse(
            station_id=request.station_id,
            node_id=request.node_id,
            market_date=request.market_date,
            strategy=result.submission_packet.get("strategy", "expected_spread_simple"),
            validation_passed=result.validation_passed,
            validation_errors=result.validation_errors,
            submission_packet=result.submission_packet,
            charge_segments=result.submission_packet.get("charge_segments", []),
            discharge_segments=result.submission_packet.get("discharge_segments", []),
            derived_feasible_power_mw=result.derived_feasible_power_mw,
            derived_soc=result.derived_soc,
        )


