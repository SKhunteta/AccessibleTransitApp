import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture(scope="module")
def client():
    """Fixture to create a test client for FastAPI."""
    return TestClient(app)
