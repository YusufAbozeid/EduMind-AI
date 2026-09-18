from pydantic import BaseModel, Field
from typing import Optional

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User prompt or question text")
    modality: Optional[str] = Field("visual", description="Active VARK learning modality")
    feynman_level: Optional[str] = Field("academic", description="Feynman depth level: intuitive, academic, deep")
    username: Optional[str] = Field("Yusuf AbouZeid", description="Student profile username")
    egyptian_dialect: Optional[bool] = Field(True, description="Flag for Egyptian dialect prompt adaptation")
    language: Optional[str] = Field("ar", description="Language code: ar or en")
    topic: Optional[str] = Field("Session 1: Text Preprocessing & Attention", description="Active curriculum topic")

class ChatResponse(BaseModel):
    sender: str = "bot"
    text: str
    feynman_level: str
    modality: str
    language: str
    status: str = "success"

class AgentDiagnosisRequest(BaseModel):
    username: Optional[str] = Field("يوسف أبوزيد", description="Student name")
    topic: Optional[str] = Field(None, description="Active topic title")
    weak_concept: Optional[str] = Field(None, description="Target weakness concept if already known")
    language: Optional[str] = Field("ar", description="Language ar/en")

class AgentDiagnosisResponse(BaseModel):
    status: str = "success"
    concept_name: str
    mastery_score: int
    proactive_message: str
    steps: list[dict]
