from fastapi import APIRouter, HTTPException
from app.services.protection_service import ProtectionService
from app.schemas.protection import PersonalizedAdviceRequest, PersonalizedAdviceResponse

router = APIRouter()

@router.post("/personalized-advice", response_model=PersonalizedAdviceResponse)
async def get_personalized_advice(request: PersonalizedAdviceRequest):
    """
    Get personalized sun protection advice based on skin type and current UV.
    """
    try:
        return ProtectionService.get_personalized_advice(
            skin_type=request.skin_type,
            current_uv=request.current_uv
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
