import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from main import app
from models import Location

client = TestClient(app)

@pytest.fixture(scope="module")
def test_client():
    """Fixture to provide a reusable test client."""
    return TestClient(app)

def test_accessibility_endpoint_rejects_get(test_client):
    """Ensure /accessibility only accepts POST requests."""
    response = test_client.get("/accessibility/")
    assert response.status_code == 405  # Method Not Allowed

def test_accessibility_endpoint_post(test_client):
    """Test a valid accessibility request with a properly mocked Overpass API response."""
    mock_locations = [
        Location(
            id=1,
            name="Accessible Station",
            latitude=47.6062,
            longitude=-122.3321,
            accessibility="yes"
        )
    ]

    with patch("accessibility.fetch_accessible_locations", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.return_value = mock_locations

        payload = {
            "lat_min": 47.495,
            "lon_min": -122.435,
            "lat_max": 47.734,
            "lon_max": -122.235
        }
        response = test_client.post("/accessibility", json=payload)

        assert response.status_code == 200
        assert response.headers["content-type"].startswith("application/json")
        assert response.json() == {"locations": [
            {
                "id": 1,
                "name": "Accessible Station",
                "latitude": 47.6062,
                "longitude": -122.3321,
                "accessibility": "yes"
            }
        ]}
