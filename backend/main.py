from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from accessibility import router

app = FastAPI(title="Transit Accessibility Assistant API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Transit Accessibility Assistant API"}
