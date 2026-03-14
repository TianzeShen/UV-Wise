from fastapi import APIRouter, HTTPException
from app.services.awareness_service import AwarenessService
from app.schemas.awareness import StatisticsResponse, EducationResponse

router = APIRouter()

@router.get("/statistics", response_model=StatisticsResponse)
async def get_statistics():
    """
    Get historical skin cancer statistics and UV trends for charts.
    """
    try:
        return AwarenessService.get_statistics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/education", response_model=EducationResponse)
async def get_education_myth_fact():
    """
    Get a random Myth vs Fact for educational purposes.
    """
    try:
        return AwarenessService.get_random_myth_fact()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
