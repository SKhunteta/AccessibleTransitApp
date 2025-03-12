import httpx
import logging
from models import AccessibilityQuery, Location
from fastapi import HTTPException

# Set up logging
logger = logging.getLogger(__name__)

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
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(overpass_url, data=overpass_query)
            
            if response.status_code == 429:
                logger.warning("Rate limit exceeded from Overpass API")
                raise HTTPException(
                    status_code=503,
                    detail="Too many requests to accessibility service. Please try again in a few moments."
                )
            
            response.raise_for_status()
            
            try:
                data = response.json()
            except ValueError as e:
                logger.error(f"Failed to parse JSON response: {str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response from accessibility service"
                )

            elements = data.get('elements', [])
            if elements is None:
                logger.error("No 'elements' field in response")
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response format from accessibility service"
                )

            locations = []
            for element in elements:
                try:
                    tags = element.get('tags', {})
                    center = element.get('center', {})
                    
                    # Get coordinates either from direct properties or center
                    lat = element.get('lat') or center.get('lat')
                    lon = element.get('lon') or center.get('lon')
                    
                    if lat is None or lon is None:
                        logger.warning(f"Skipping element {element.get('id')} due to missing coordinates")
                        continue

                    locations.append(Location(
                        id=element['id'],
                        name=tags.get('name', 'Unnamed Location'),
                        latitude=lat,
                        longitude=lon,
                        accessibility=tags.get('wheelchair', 'unknown')
                    ))
                except KeyError as e:
                    # Log the error but continue processing other elements
                    logger.warning(f"Skipping malformed element: {str(e)}")
                    continue

            logger.info(f"Successfully fetched {len(locations)} accessible locations")
            return locations
            
    except httpx.TimeoutException:
        logger.error("Timeout while fetching data from Overpass API")
        raise HTTPException(
            status_code=503,
            detail="Accessibility service timed out. Please try again."
        )
    except httpx.HTTPError as e:
        logger.error(f"HTTP error from Overpass API: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Error fetching accessibility data: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while fetching accessibility data"
        )
