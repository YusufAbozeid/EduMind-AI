from pydantic import BaseModel, Field
from typing import Optional

class TwoPassSubmitRequest(BaseModel):
    question_id: int = Field(..., description="Target assessment item ID")
    user_answer: str = Field(..., min_length=1, max_length=3000, description="Student written answer")
    username: Optional[str] = Field("Yusuf AbouZeid", description="Student profile username")

class TwoPassSubmitResponse(BaseModel):
    pass1_score: int
    conceptual_status: str
    concept_feedback: str
    pass2_spelling_box: str
    misconception_bin: str
