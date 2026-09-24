from fastapi import APIRouter, Request
from app.schemas.sign_language import (
    SignTranslationRequest,
    SignTranslationResponse
)
from app.services.sign_language_service import SignLanguageService, ARABIC_ALPHABET_POSES, CORE_ARSL_SIGNS
from app.core.security import limiter
from app.core.config import settings

router = APIRouter(prefix="/sign-language", tags=["Arabic Sign Language Production Engine"])

@router.post("/translate", response_model=SignTranslationResponse)
@limiter.limit(settings.RATE_LIMIT_PER_MINUTE)
def translate_text_to_sign_language(request: Request, req: SignTranslationRequest):
    """
    Translates Arabic text to 3D Sign Language poses with unified ArSL grammar and fingerspelling
    """
    return SignLanguageService.translate_to_sign_sequence(req)

@router.get("/alphabet")
def get_arabic_sign_alphabet():
    """
    Returns the complete 28-letter Arabic Fingerspelling Alphabet poses
    """
    return {
        "status": "success",
        "alphabetCount": len(ARABIC_ALPHABET_POSES),
        "letters": ARABIC_ALPHABET_POSES
    }

@router.get("/dictionary")
def get_arsl_dictionary():
    """
    Returns the core Arabic Sign Language glosses and metadata
    """
    return {
        "status": "success",
        "totalSigns": len(CORE_ARSL_SIGNS),
        "signs": [
            {
                "id": k,
                "arabic": v["arabic"],
                "english": v["english"],
                "keywords": v["keywords"],
                "keyframesCount": len(v["poses"])
            }
            for k, v in CORE_ARSL_SIGNS.items()
        ]
    }
