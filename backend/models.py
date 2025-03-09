from pydantic import BaseModel
from typing import List, Optional

class AccessibilityQuery(BaseModel):
    lat_min: float
    lon_min: float
    lat_max: float
    lon_max: float

class Location(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    accessibility: str

class AccessibilityResponse(BaseModel):
    locations: List[Location]
