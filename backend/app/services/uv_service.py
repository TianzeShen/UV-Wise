from app.schemas.uv import UVResponse, ProtectionGuidance

class UVService:
    @staticmethod
    def get_uv_level_description(uv_index: float) -> tuple[str, str]:
        """
        Returns (color_code, alert_message) based on UV index.
        Color codes follow international standards.
        Alert messages are human-readable as per requirements.
        """
        if uv_index < 3:
            return "#558B2F", "Low risk: Safe to be outside, but keep a hat handy."
        elif uv_index < 6:
            return "#F9A825", "Moderate risk: Sunscreen required. Seek shade during midday."
        elif uv_index < 8:
            return "#EF6C00", "High risk: Skin damage can occur quickly. Protection essential."
        elif uv_index < 11:
            return "#B71C1C", "Very High risk: Avoid being outdoors. Unprotected skin burns in minutes."
        else:
            return "#6A1B9A", "Extreme risk: Dangerous! Stay indoors or take full precautions."

    @staticmethod
    def calculate_protection_guidance(uv_index: float) -> ProtectionGuidance:
        """
        Generates specific guidance for sunscreen, clothing, and action.
        """
        if uv_index < 3:
            return ProtectionGuidance(
                sunscreen_dosage="Not strictly necessary unless outside for hours",
                clothing="Optional hat",
                action="Enjoy the outdoors safely"
            )
        
        # Calculate dosage roughly based on UV intensity (conceptual logic)
        teaspoons = "1 teaspoon" if uv_index < 6 else "2 teaspoons"
        
        clothing_rec = "long sleeves recommended"
        action_rec = "Seek shade 11AM-3PM"

        if uv_index >= 6:
            clothing_rec = "Long sleeves, Sunglasses and hat"
        
        if uv_index >= 11:
            clothing_rec = "UV-Protection clothing, Sunglasses and hat"
            action_rec = "Stay indoors if possible"

        return ProtectionGuidance(
            sunscreen_dosage=f"{teaspoons} for face/neck",
            clothing=clothing_rec,
            action=action_rec
        )

    @staticmethod
    async def get_uv_forecast(lat: float, lon: float) -> UVResponse:
        """
        Mock implementation.
        Currently returns mock data based on simple logic
        """
        # Mock logic: UV roughly higher if lat is closer to 0 (Equator)
        base_uv = 12 - (abs(lat) / 5) 
        current_uv = max(0, round(base_uv, 1)) # Ensure not negative
        
        color, alert = UVService.get_uv_level_description(current_uv)
        guidance = UVService.calculate_protection_guidance(current_uv)
        
        return UVResponse(
            location=f"Lat: {lat}, Lon: {lon}", # Placeholder location name
            uv_index=current_uv,
            color_code=color,
            alert_message=alert,
            protection_guidance=guidance
        )
