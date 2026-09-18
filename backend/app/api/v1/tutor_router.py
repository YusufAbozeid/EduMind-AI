from fastapi import APIRouter, Request
from app.schemas.tutor import ChatRequest, ChatResponse, AgentDiagnosisRequest, AgentDiagnosisResponse
from app.services.tutor_service import TutorService
from app.core.security import limiter
from app.core.config import settings

router = APIRouter(prefix="/chat", tags=["Tutor Chat Engine"])

@router.post("/tutor", response_model=ChatResponse)
@limiter.limit(settings.RATE_LIMIT_PER_MINUTE)
def tutor_chat(request: Request, req: ChatRequest):
    """
    Production-ready Tutor Chat Endpoint with Rate Limiting & Security Headers
    """
    return TutorService.generate_tutor_response(req)

@router.post("/agent/diagnose", response_model=AgentDiagnosisResponse)
@limiter.limit(settings.RATE_LIMIT_PER_MINUTE)
def agent_diagnose(request: Request, req: AgentDiagnosisRequest):
    """
    Autonomous Proactive Study Agent Diagnostic & 3-Step Rescue Plan
    """
    return TutorService.diagnose_and_plan(req)
