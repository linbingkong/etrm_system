from fastapi import APIRouter

from app.schemas.independent_storage_dayahead import (
    IndependentStorageDayAheadBidRequest,
    IndependentStorageDayAheadBidResponse,
)
from app.services.independent_storage_dayahead import IndependentStorageDayAheadBidService

router = APIRouter()
service = IndependentStorageDayAheadBidService()


@router.post("/spot-bid/storage-strategy", response_model=IndependentStorageDayAheadBidResponse)
async def generate_storage_strategy(
    request: IndependentStorageDayAheadBidRequest,
) -> IndependentStorageDayAheadBidResponse:
    return service.generate(request)
