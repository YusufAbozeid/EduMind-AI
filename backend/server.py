from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.security import limiter, SecurityHeadersMiddleware
from app.api.v1 import tutor_router, assessment_router, moodle_router

# Initialize Production FastAPI Application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise API Server supporting Developer B Lesson & Tutor Track",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Attach Rate Limiter State & Error Handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Attach Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Attach CORS Middleware with Scoped Security Origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(tutor_router.router, prefix=settings.API_V1_STR)
app.include_router(assessment_router.router, prefix=settings.API_V1_STR)
app.include_router(moodle_router.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health Check"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health Check"])
def health_check():
    """
    Health check endpoint for Docker container orchestration and LB monitoring
    """
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": "2.0.0",
        "developer_b_track": "Lesson & Tutor Engine Active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
