from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class BodyPoseFrame(BaseModel):
    headTilt: float = Field(0.0, description="Head tilt in degrees (-15 to 15)")
    headNod: float = Field(0.0, description="Head nod in degrees (-15 to 15)")
    leftUpperArm: float = Field(10.0, description="Left upper arm rotation (0-150)")
    leftForearm: float = Field(-15.0, description="Left forearm flexion (-140 to 0)")
    rightUpperArm: float = Field(10.0, description="Right upper arm rotation (0-150)")
    rightForearm: float = Field(-15.0, description="Right forearm flexion (-140 to 0)")
    leftWrist: float = Field(0.0, description="Left wrist rotation (-90 to 90)")
    rightWrist: float = Field(0.0, description="Right wrist rotation (-90 to 90)")
    torsoTwist: float = Field(0.0, description="Torso twist in degrees (-15 to 15)")
    leftHandShape: str = Field("neutral", description="Handshape: neutral, fist, open_palm, point_index, v_shape, thumbs_up, pinch, flat_o, claw")
    rightHandShape: str = Field("neutral", description="Handshape: neutral, fist, open_palm, point_index, v_shape, thumbs_up, pinch, flat_o, claw")
    facialExpression: str = Field("neutral", description="Facial expression: neutral, questioning, happy, focused, negation, emphasis")

class SignGlossItem(BaseModel):
    gloss: str = Field(..., description="Normalized sign gloss identifier")
    arabicText: str = Field(..., description="Arabic word or phrase represented")
    englishTranslation: str = Field(..., description="English translation")
    isFingerspelled: bool = Field(False, description="Whether this token is fingerspelled letter-by-letter")
    durationMs: int = Field(2000, description="Duration in milliseconds")
    poses: List[BodyPoseFrame] = Field(default_factory=list, description="Sequence of kinematic poses")

class SignTranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="Arabic text to translate into sign language")
    dialect: Optional[str] = Field("standard_arabic", description="Dialect: standard_arabic, egyptian")
    speed: Optional[float] = Field(1.0, ge=0.5, le=2.0, description="Playback speed multiplier")

class SignTranslationResponse(BaseModel):
    originalText: str
    glossSequence: List[str]
    signs: List[SignGlossItem]
    totalDurationMs: int
    metadata: Dict[str, Any] = Field(default_factory=dict)
