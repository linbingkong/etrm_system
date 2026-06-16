from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator

POINTS_PER_DAY = 96


class StorageBidSegment(BaseModel):
    p_start: float
    p_end: float
    price: float


class IndependentStorageDayAheadBidRequest(BaseModel):
    market_date: date
    station_id: str
    node_id: str
    time_step_min: int = Field(default=15)
    p_charge_max_mw: float = Field(gt=0)
    p_discharge_max_mw: float = Field(gt=0)
    storage_capacity_mwh: float = Field(gt=0)
    soc_initial: float = Field(ge=0, le=1)
    soc_min: float = Field(ge=0, le=1)
    soc_max: float = Field(ge=0, le=1)
    soc_terminal_target: float | None = Field(default=None, ge=0, le=1)
    eta_charge: float = Field(gt=0, le=1)
    eta_discharge: float = Field(gt=0, le=1)
    price_floor: float
    price_cap: float
    charge_price_signal: list[float]
    discharge_price_signal: list[float]
    degradation_cost_yuan_per_mwh: float = Field(ge=0)
    variable_fee_yuan_per_mwh: float = Field(ge=0)
    risk_margin_yuan_per_mwh: float = Field(ge=0)
    required_profit_spread_yuan_per_mwh: float = Field(default=0, ge=0)
    trading_strategy: Literal["conservative", "balanced", "aggressive"] = "balanced"
    min_charge_steps: int = Field(default=1, ge=1)
    min_discharge_steps: int = Field(default=1, ge=1)
    min_idle_steps: int = Field(default=1, ge=1)
    solver_time_limit_sec: float = Field(default=30, gt=0)
    mip_gap: float = Field(default=0.01, ge=0, le=1)
    merge_price_gap_yuan_per_mwh: float = Field(default=20, ge=0)

    @field_validator("charge_price_signal", "discharge_price_signal")
    @classmethod
    def validate_price_signal_length(cls, value: list[float]) -> list[float]:
        if len(value) != POINTS_PER_DAY:
            raise ValueError("price signal must have length 96")
        return value

    @field_validator("soc_max")
    @classmethod
    def validate_soc_bounds(cls, value: float, info: Any) -> float:
        soc_min = info.data.get("soc_min")
        if soc_min is not None and value < soc_min:
            raise ValueError("soc_max cannot be less than soc_min")
        return value

    @field_validator("price_cap")
    @classmethod
    def validate_price_bounds(cls, value: float, info: Any) -> float:
        price_floor = info.data.get("price_floor")
        if price_floor is not None and value < price_floor:
            raise ValueError("price_cap cannot be less than price_floor")
        return value


class IndependentStorageDayAheadBidResponse(BaseModel):
    station_id: str
    node_id: str
    market_date: date
    strategy: str
    validation_passed: bool
    validation_errors: list[str]
    submission_packet: dict[str, Any]
    charge_segments: list[StorageBidSegment]
    discharge_segments: list[StorageBidSegment]
    derived_feasible_power_mw: list[float]
    derived_soc: list[float]
