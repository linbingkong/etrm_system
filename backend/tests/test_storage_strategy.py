from fastapi.testclient import TestClient

from app.main import app


def _valid_payload() -> dict:
    charge_prices = [260.0] * 32 + [90.0] * 32 + [420.0] * 32
    discharge_prices = [300.0] * 32 + [160.0] * 32 + [680.0] * 32
    return {
        "market_date": "2026-06-17",
        "station_id": "storage-001",
        "node_id": "sd-node-001",
        "time_step_min": 15,
        "p_charge_max_mw": 100.0,
        "p_discharge_max_mw": 90.0,
        "storage_capacity_mwh": 200.0,
        "soc_initial": 0.05,
        "soc_min": 0.05,
        "soc_max": 0.98,
        "soc_terminal_target": 0.05,
        "eta_charge": 0.9,
        "eta_discharge": 0.9,
        "price_floor": -80.0,
        "price_cap": 1300.0,
        "charge_price_signal": charge_prices,
        "discharge_price_signal": discharge_prices,
        "degradation_cost_yuan_per_mwh": 5.0,
        "variable_fee_yuan_per_mwh": 1.0,
        "risk_margin_yuan_per_mwh": 2.0,
        "required_profit_spread_yuan_per_mwh": 80.0,
        "trading_strategy": "balanced",
        "min_charge_steps": 1,
        "min_discharge_steps": 1,
        "min_idle_steps": 1,
        "solver_time_limit_sec": 5.0,
        "mip_gap": 0.01,
        "merge_price_gap_yuan_per_mwh": 20.0,
    }


def test_storage_strategy_generates_bid_segments() -> None:
    client = TestClient(app)

    response = client.post("/api/v1/trading/spot-bid/storage-strategy", json=_valid_payload())

    assert response.status_code == 200
    data = response.json()
    assert data["station_id"] == "storage-001"
    assert data["node_id"] == "sd-node-001"
    assert data["strategy"] == "milp_optimization"
    assert data["validation_passed"] is True
    assert len(data["charge_segments"]) > 0
    assert len(data["discharge_segments"]) > 0
    assert len(data["derived_feasible_power_mw"]) == 96
    assert len(data["derived_soc"]) == 97


def test_storage_strategy_requires_96_point_price_signals() -> None:
    client = TestClient(app)
    payload = _valid_payload()
    payload["charge_price_signal"] = [100.0] * 24

    response = client.post("/api/v1/trading/spot-bid/storage-strategy", json=payload)

    assert response.status_code == 422
