from app.schemas.protection import PersonalizedAdviceRequest, PersonalizedAdviceResponse

class ProtectionService:
    @staticmethod
    def get_personalized_advice(skin_type: int, current_uv: float) -> PersonalizedAdviceResponse:
        """
        Logic for generating advice based on skin type + UV.
        """
        # Risk levels based on skin type (Fitzpatrick 1 = most sensitive, 6 = most resilient)
        risk_map = {
            1: "Very High - Burns easily, never tans",
            2: "High - Burns easily, tans minimally",
            3: "Moderate - Sometimes burns, gradually tans",
            4: "Low - Burns minimally, always tans well",
            5: "Very Low - Rarely burns, tans profusely",
            6: "Minimal - Never burns, deeply pigmented"
        }
        
        base_desc = risk_map.get(skin_type, "Unknown skin type")
        
        # Calculate risk based on UV
        risk_level = "Low"
        if current_uv > 3 and skin_type <= 2:
            risk_level = "Critical"
        elif current_uv > 6:
            risk_level = "High"
            
        tips = f"Wear SPF 30+."
        if skin_type <= 2:
            tips += " Reapply every 60 mins."
        else:
            tips += " Reapply every 90 mins."

        return PersonalizedAdviceResponse(
            skin_type_desc=base_desc,
            risk_assessment=f"{risk_level} risk of sunburn today.",
            personalized_tips=tips
        )
