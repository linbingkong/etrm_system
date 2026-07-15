from fastapi import APIRouter

from app.api.v1.endpoints import auth, health, menus, settlement_review, strategies, system_admin, trading

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(menus.router, prefix="/menus", tags=["menus"])
api_router.include_router(trading.router, prefix="/trading", tags=["trading"])
api_router.include_router(strategies.router, prefix="/strategies", tags=["strategies"])
api_router.include_router(settlement_review.router, prefix="/settlement-review", tags=["settlement-review"])
api_router.include_router(system_admin.router, prefix="/system", tags=["system"])
