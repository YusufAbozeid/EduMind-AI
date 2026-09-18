from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class MoodleConnectRequest(BaseModel):
    moodle_url: str = Field(..., description="The base URL of the Moodle instance, e.g., https://moodle.university.edu")
    token: str = Field(..., description="Official Moodle Web Service REST Token")
    user_id: Optional[str] = Field(default="user_default", description="Application User ID for strict isolation")

class MoodleCourseSchema(BaseModel):
    id: Optional[int] = None
    moodle_course_id: int
    course_name: str
    course_code: Optional[str] = ""
    summary: Optional[str] = ""
    activation_status: str = "not_activated"  # not_activated, activating, activated
    sync_status: str = "idle"  # idle, syncing, synced, error
    pdf_count: int = 0
    synced_pdf_count: int = 0
    total_pages: int = 0
    total_chunks: int = 0
    last_synced_at: Optional[str] = None

class MoodleConnectionResponse(BaseModel):
    status: str
    moodle_url: str
    site_name: str
    moodle_user_id: int
    moodle_username: str
    moodle_fullname: str
    moodle_version: Optional[str] = ""
    courses_count: int
    courses: List[MoodleCourseSchema] = []

class MoodleStatusResponse(BaseModel):
    is_connected: bool
    connection: Optional[Dict[str, Any]] = None
    enrolled_courses_count: int = 0
    activated_courses_count: int = 0

class MoodleFileSchema(BaseModel):
    id: Optional[int] = None
    moodle_file_id: str
    filename: str
    section_name: str = "General"
    file_url: str
    file_size: int = 0
    page_count: int = 0
    chunk_count: int = 0
    processing_status: str = "pending"
    error_message: Optional[str] = None
    created_at: Optional[str] = None

class ActivateCourseResponse(BaseModel):
    job_id: str
    course_id: int
    status: str
    message: str

class SyncJobResponse(BaseModel):
    job_id: str
    course_id: Optional[int] = None
    status: str
    total_files: int = 0
    downloaded_files: int = 0
    processed_files: int = 0
    failed_files: int = 0
    progress: int = 0
    current_file: Optional[str] = None
    error_message: Optional[str] = None
    details: List[Dict[str, Any]] = []
    started_at: Optional[str] = None
    completed_at: Optional[str] = None

class MoodleRagCitation(BaseModel):
    course_name: str
    filename: str
    section_name: Optional[str] = ""
    page_number: int
    source_chunk_preview: Optional[str] = None

class MoodleRagQueryRequest(BaseModel):
    query: str
    course_id: Optional[int] = None  # None means search all courses
    user_id: Optional[str] = "user_default"
    language: Optional[str] = "ar"

class MoodleRagQueryResponse(BaseModel):
    answer: str
    citations: List[MoodleRagCitation] = []
    course_filtered: Optional[str] = "all"
    status: str = "success"
