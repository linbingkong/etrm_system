from fastapi import APIRouter

from app.api.v1.endpoints import health, menus, trading

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(menus.router, prefix="/menus", tags=["menus"])
api_router.include_router(trading.router, prefix="/trading", tags=["trading"])
