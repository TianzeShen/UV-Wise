### Base URLs
    Local Development: http://localhost:8000
    Production: https://<your-app-name>.render.com (TBA after deployment)

## 1. UV Tracking & Real-time Alerts
    Covers: US 1.1 (UV Alerts), US 3.1 (Sunscreen Dosage), US 3.3 (Clothing Recommendations).
    Endpoint: /api/v1/uv/forecast
    Method: GET
    Description: Retrieves current UV levels based on location and provides human-readable safety instructions.
    Query Parameters:
        lat (float): Latitude
        lon (float): LongitudeSuccess 
    Response (200 OK):
        {
            "location": "Melbourne, VIC",
            "uv_index": 8.5,
            "color_code": "#FF0000",
            "alert_message": "Your skin will start damaging in 12 minutes—find shade now!",
            "protection_guidance": {
                "sunscreen_dosage": "2 teaspoons for face and neck",
                "clothing": "Wide-brimmed hat, UV-rated sunglasses, and long sleeves",
                "action": "Avoid outdoors between 11 AM and 3 PM"
            }
        }
## 2. Personalized Skin Protection
    Covers: US 2.2 (Skin color relationship).
    Endpoint: /api/v1/protection/personalized-advice
    Method: POST
    Description: Provides customized safety advice based on the user's Fitzpatrick skin type.
    Request Body:
        {
            "skin_type": 2, 
            "current_uv": 8.5
        }
    Success Response (200 OK):
        {
            "skin_type_desc": "Fair skin, burns easily",
            "risk_assessment": "High risk of sunburn and long-term DNA damage.",
            "personalized_tips": "Increase sunscreen reapplication frequency to every 90 minutes."
        }

## 3. Awareness & Statistics
    Covers: US 2.1 (UV impacts and myths).
    Endpoint: /api/v1/awareness/statistics
    Method: GET
    Description: Returns historical data and cancer statistics for Chart.js visualizations.
    Success Response (200 OK):
        {
            "cancer_statistics": {
                "labels": ["2015", "2017", "2019", "2021"],
                "data": [12500, 13800, 15200, 16000]
                },
            "heat_trends": {
                "labels": ["Jan", "Feb", "Mar"],
                "avg_temp": [26, 27, 24]
                }
        }

    Endpoint: /api/v1/awareness/education
    Method: GET
    Description: Fetches a random "Myth vs Fact" pair for educational display.
    Success Response (200 OK):
        {
        "myth": "You can't get sunburnt on a cloudy day.",
        "fact": "Up to 80% of UV radiation can pass through light clouds."
        }