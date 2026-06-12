from fastapi import APIRouter

from app.schemas.menu import ButtonPermission, MenuItem
from app.services.menu_seed import get_button_permissions, get_flat_menus, get_menu_tree

router = APIRouter()


@router.get("/tree", response_model=list[MenuItem])
async def read_menu_tree() -> list[MenuItem]:
    return get_menu_tree()


@router.get("/flat", response_model=list[MenuItem])
async def read_flat_menus() -> list[MenuItem]:
    return get_flat_menus()


@router.get("/button-permissions", response_model=list[ButtonPermission])
async def read_button_permissions() -> list[ButtonPermission]:
    return get_button_permissions()
