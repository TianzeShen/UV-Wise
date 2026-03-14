from pydantic import BaseModel, Field
from typing import List

# Chart data structure (Chart.js compatible)
class ChartData(BaseModel):
    labels: List[str]
    data: List[float]

class StatisticsResponse(BaseModel):
    cancer_statistics: ChartData = Field(..., description="Annual skin cancer cases")
    uv_trends: ChartData = Field(..., description="Monthly average uv")

# Myth vs Fact
class EducationResponse(BaseModel):
    myth: str = Field(..., example="You can't get sunburnt on a cloudy day")
    fact: str = Field(..., example="Up to 80% of UV radiation can pass through clouds")
