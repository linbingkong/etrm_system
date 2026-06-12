from fastapi import APIRouter

from app.api.v1.endpoints import health, menus

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(menus.router, prefix="/menus", tags=["menus"])
