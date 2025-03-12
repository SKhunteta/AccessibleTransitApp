from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from accessibility import router as accessibility_router
from services.routing_service import RouteRequest, RouteResponse, find_accessible_route
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(title="Transit Accessibility Assistant API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accessibility_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Transit Accessibility Assistant API"}

@app.post("/route", response_model=RouteResponse)
async def get_route(request: RouteRequest):
    """
    Get an accessible route between two points.
    """
    logger.info(f"Route requested from ({request.start_lat}, {request.start_lon}) to ({request.end_lat}, {request.end_lon})")
    return await find_accessible_route(request)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Transit Accessibility Assistant API")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Transit Accessibility Assistant API")
