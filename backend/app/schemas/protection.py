from pydantic import BaseModel, Field

# Request model: User submits skin type
class PersonalizedAdviceRequest(BaseModel):
    skin_type: int = Field(..., ge=1, le=6, description="Fitzpatrick Skin Type (1-6)")
    current_uv: float = Field(..., ge=0, description="Current UV Index")

# Response model: Returns advice
class PersonalizedAdviceResponse(BaseModel):
    skin_type_desc: str = Field(..., example="Fair skin, burns easily")
    risk_assessment: str = Field(..., example="High risk of sunburn")
    personalized_tips: str = Field(..., example="Reapply sunscreen every 90 minutes")
    sunscreen_dosage: str = Field(..., example="1 teaspoon for face and neck")
    clothing: str = Field(..., example="Hat and sunglasses")
