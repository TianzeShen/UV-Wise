from pydantic import BaseModel, Field
from typing import Optional, List

# Base response model
class ProtectionGuidance(BaseModel):
    sunscreen_dosage: str = Field(..., description="Recommended sunscreen amount (e.g., '2 teaspoons')")
    clothing: str = Field(..., description="Recommended clothing (e.g., 'Wide-brimmed hat')")
    action: str = Field(..., description="Actionable advice (e.g., 'Avoid outdoors')")

class UVResponse(BaseModel):
    location: str = Field(..., example="Melbourne, VIC")
    uv_index: float = Field(..., ge=0, example=8.5)
    color_code: str = Field(..., example="#FF0000", description="Hex color code for UV level")
    alert_message: str = Field(..., example="Your skin will start damaging in 12 minutes—find shade now!", description="Human-readable alert")
    protection_guidance: ProtectionGuidance
