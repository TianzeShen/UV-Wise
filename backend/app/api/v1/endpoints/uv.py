from fastapi import APIRouter, Query, HTTPException
from app.services.uv_service import UVService
from app.schemas.uv import UVResponse

router = APIRouter()

@router.get("/forecast", response_model=UVResponse)
async def get_uv_forecast(
    lat: float = Query(..., description="Latitude", ge=-90, le=90),
    lon: float = Query(..., description="Longitude", ge=-180, le=180)
):
    """
    Get current UV level and protection guidance based on location.
    """
    try:
        return await UVService.get_uv_forecast(lat, lon)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
