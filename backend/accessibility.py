from fastapi import APIRouter, HTTPException
from models import AccessibilityQuery, AccessibilityResponse
from overpass_service import fetch_accessible_locations

router = APIRouter()

@router.post("/accessibility", response_model=AccessibilityResponse)
async def get_accessibility(query: AccessibilityQuery):
    try:
        data = await fetch_accessible_locations(query)
        return AccessibilityResponse(locations=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
