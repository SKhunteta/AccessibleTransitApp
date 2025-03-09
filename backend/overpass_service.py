import httpx
from models import AccessibilityQuery, Location
from fastapi import HTTPException

async def fetch_accessible_locations(query: AccessibilityQuery) -> list[Location]:
    overpass_url = "http://overpass-api.de/api/interpreter"

    overpass_query = f"""
    [out:json][timeout:25];
    (
      node["wheelchair"="yes"]({query.lat_min},{query.lon_min},{query.lat_max},{query.lon_max});
      way["wheelchair"="yes"]({query.lat_min},{query.lon_min},{query.lat_max},{query.lon_max});
      relation["wheelchair"="yes"]({query.lat_min},{query.lon_min},{query.lat_max},{query.lon_max});
    );
    out center;
    """

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(overpass_url, data=overpass_query)
            response.raise_for_status()
            data = response.json()
            elements = data.get('elements', [])

            locations = []
            for element in elements:
                try:
                    tags = element.get('tags', {})
                    center = element.get('center', {})
                    
                    # Get coordinates either from direct properties or center
                    lat = element.get('lat') or center.get('lat')
                    lon = element.get('lon') or center.get('lon')
                    
                    if lat is None or lon is None:
                        continue

                    locations.append(Location(
                        id=element['id'],
                        name=tags.get('name', 'Unnamed Location'),
                        latitude=lat,
                        longitude=lon,
                        accessibility=tags.get('wheelchair', 'unknown')
                    ))
                except KeyError as e:
                    # Skip malformed elements
                    continue

            return locations
            
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail=f"Error fetching data from Overpass API: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
