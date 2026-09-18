from fastapi import APIRouter, HTTPException, Query, Body, Response
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.services.championship_service import ChampionshipService

router = APIRouter(prefix="/championship", tags=["Championship & Academic Rigor Suite"])

class PodcastRequest(BaseModel):
    topic: str = Field(..., example="Backpropagation and Gradient Descent")
    language: str = Field("ar", example="ar")
    dialect: bool = Field(True, example=True)

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, example="أهلاً بكم في بودكاست شغوف...")
    speaker: str = Field("host1", example="host1")
    language: str = Field("ar", example="ar")
    dialect: bool = Field(True, example=True)
    speed: float = Field(1.0, example=1.0)
    engine: str = Field("elevenlabs", example="elevenlabs")
    api_key: Optional[str] = Field(None, example="xi-api-key...")

class FeynmanRequest(BaseModel):
    topic: str = Field(..., example="Backpropagation")
    student_explanation: str = Field(..., min_length=5, example="تخيل إن الموديل زي طفل بيتعلم...")
    language: str = Field("ar", example="ar")

@router.post("/podcast/generate")
def generate_podcast(req: PodcastRequest):
    """
    Generate NotebookLM-style two-speaker conversational podcast overview.
    """
    try:
        return ChampionshipService.generate_podcast_dialogue(
            topic=req.topic,
            language=req.language,
            dialect=req.dialect
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/podcast/tts")
async def synthesize_podcast_audio(req: TTSRequest):
    """
    Synthesize high-fidelity audio using unified neural voices:
    - ElevenLabs Multilingual v2 (Global #1 human realism)
    - Azure Studio Neural (Shakir & Salma)
    - Google AI Unified
    """
    try:
        audio_bytes = await ChampionshipService.synthesize_speech(
            text=req.text,
            speaker=req.speaker,
            language=req.language,
            dialect=req.dialect,
            speed=req.speed,
            engine=req.engine,
            api_key=req.api_key
        )
        if not audio_bytes:
            raise HTTPException(status_code=500, detail="Audio synthesis produced empty stream")
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis error: {str(e)}")

@router.get("/rag/benchmark")
def get_rag_benchmark():
    """
    Returns quantitative RAG Triad & Ragas standard scientific benchmark metrics.
    """
    try:
        return ChampionshipService.get_rag_benchmark_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feynman/evaluate")
def evaluate_feynman(req: FeynmanRequest):
    """
    Evaluates student's plain-language explanation of a complex course concept.
    """
    try:
        return ChampionshipService.evaluate_reverse_feynman(
            topic=req.topic,
            student_explanation=req.student_explanation,
            language=req.language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/graph/concepts")
def get_concept_graph(course_id: Optional[str] = Query("default")):
    """
    Returns nodes and edges for 3D/Force-directed Knowledge Graph visualization.
    """
    try:
        return ChampionshipService.get_course_knowledge_graph(course_id=course_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
