from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from datetime import datetime

app = FastAPI(
    title="Prompt Share API",
    description="API for the Prompt Share marketplace",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Prompt Share API",
        "status": "active",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "api_prefix": settings.API_V1_STR
    }

@app.get(f"{settings.API_V1_STR}/health")
async def api_health_check():
    return {
        "status": "API is healthy",
        "timestamp": datetime.now().isoformat(),
        "endpoints": [
            "/auth/login",
            "/auth/register",
            "/categories",
            "/prompts",
            "/orders"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
