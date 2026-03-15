from app.schemas.protection import PersonalizedAdviceRequest, PersonalizedAdviceResponse

class ProtectionService:
    @staticmethod
    def get_personalized_advice(skin_type: int, current_uv: float) -> PersonalizedAdviceResponse:
        """
        Logic for generating advice based on skin type + UV.
        """
        # Risk levels based on skin type
        risk_map = {
            1: "Burns easily, never tans",
            2: "Burns easily, tans minimally",
            3: "Sometimes burns, gradually tans",
            4: "Burns minimally, always tans well",
            5: "Rarely burns, tans profusely",
            6: "Never burns, deeply pigmented"
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

        # Sunscreen and Clothing Logic
        sunscreen = ""
        clothing = ""

        if current_uv < 3:
            if skin_type <= 2:
                sunscreen = "0.5 teaspoon if outdoors for more than 1 hour."
                clothing = "Sunglasses recommended."
            else:
                sunscreen = "Not strictly necessary."
                clothing = "No special protection needed."
        
        elif 3 <= current_uv < 6:
            if skin_type <= 2:
                sunscreen = "1 teaspoon for face and neck."
                clothing = "Hat and sunglasses."
            elif skin_type <= 4:
                sunscreen = "0.5 teaspoon for face and neck."
                clothing = "Hat and sunglasses."
            else:
                sunscreen = "0.5 teaspoon for face and neck if outdoors for more than 1 hour."
                clothing = "Optional hat and sunglasses."
        
        elif 6 <= current_uv < 11:
            if skin_type <= 2:
                sunscreen = "2 teaspoons cover all exposed skin."
                clothing = "Long sleeves, hat, and sunglasses."
            elif skin_type <= 4:
                sunscreen = "1 teaspoon cover all exposed skin."
                clothing = "Long sleeves, hat, and sunglasses."
            else:
                sunscreen = "1 teaspoon cover all exposed skin."
                clothing = "Hat and sunglasses."
        
        else:  # current_uv >= 11
            sunscreen = "2 teaspoons cover all exposed skin and frequent reapplication."
            clothing = "UV-protection clothing, hat, and sunglasses."

        return PersonalizedAdviceResponse(
            skin_type_desc=base_desc,
            risk_assessment=f"{risk_level} risk of sunburn today.",
            personalized_tips=tips,
            sunscreen_dosage=sunscreen,
            clothing=clothing
        )
