from fastapi.testclient import TestClient

from app.main import app


def test_menu_tree_contains_13_modules() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/menus/tree")

    assert response.status_code == 200
    assert len(response.json()) == 13


def test_flat_menus_contains_88_page_menus() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/menus/flat")
    menus = response.json()

    assert response.status_code == 200
    assert len([menu for menu in menus if menu["type"] == "menu"]) == 88
    assert "/trading/spot-bid" in {menu["path"] for menu in menus}
    assert "settlement:review" in {menu["permission"] for menu in menus}


def test_button_permissions_contains_key_actions() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/menus/button-permissions")
    permissions = {item["code"] for item in response.json()}

    assert response.status_code == 200
    assert "trading:spot-bid:submit" in permissions
    assert "settlement:review:approve" in permissions
    assert "system-admin:menus:create" in permissions
