from app.schemas.awareness import StatisticsResponse, EducationResponse, ChartData

class AwarenessService:
    @staticmethod
    def get_statistics() -> StatisticsResponse:
        """
        Returns mock chart data for skin cancer trends and UV trends.
        """
        # Mock Data: Cancer cases over years
        cancer_data = ChartData(
            labels=["2015", "2017", "2019", "2021", "2023"],
            data=[12500, 13800, 15200, 16000, 17500]
        )
        
        # Mock Data: Monthly UV trends (simulated for Australia)
        uv_data = ChartData(
            labels=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            data=[12.5, 11.2, 9.5, 6.0, 3.5, 2.0, 2.2, 3.8, 5.5, 8.0, 10.5, 13.0]
        )
        
        return StatisticsResponse(
            cancer_statistics=cancer_data,
            uv_trends=uv_data
        )

    @staticmethod
    def get_random_myth_fact() -> EducationResponse:
        """
        Returns a random myth/fact (currently hardcoded to return one).
        """
        # In future, this could pick from a list or DB
        return EducationResponse(
            myth="You can't get sunburnt on a cloudy day.",
            fact="Up to 80% of UV radiation can pass through light clouds, causing skin damage even without direct sun."
        )
