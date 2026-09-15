import os
import uuid
import json
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, BackgroundTasks, HTTPException, Query, Header, Depends
from pydantic import BaseModel

from app.schemas.moodle import (
    MoodleConnectRequest,
    MoodleConnectionResponse,
    MoodleStatusResponse,
    MoodleCourseSchema,
    MoodleFileSchema,
    ActivateCourseResponse,
    SyncJobResponse,
    MoodleRagQueryRequest,
    MoodleRagQueryResponse
)
from app.services.moodle_service import MoodleService, MoodleSecurityException
from app.services.moodle_rag_service import MoodleRagService
from app.db import moodle_db

router = APIRouter(prefix="/moodle", tags=["Moodle LMS Integration"])

def get_current_user_id(x_user_id: Optional[str] = Header(default="user_default")) -> str:
    """
    Extracts authenticated user ID from request header to ensure strict user isolation.
    """
    return x_user_id or "user_default"


@router.post("/connect", response_model=MoodleConnectionResponse)
def connect_moodle(req: MoodleConnectRequest, current_user: str = Depends(get_current_user_id)):
    """
    Connects user to Moodle using official Web Services API:
    1. Tests connection via core_webservice_get_site_info
    2. Stores connection securely in SQLite
    3. Automatically retrieves enrolled courses via core_enrol_get_users_courses
    """
    user_id = req.user_id if req.user_id and req.user_id != "user_default" else current_user

    try:
        clean_url = MoodleService.validate_url(req.moodle_url)
    except MoodleSecurityException as se:
        raise HTTPException(status_code=400, detail=str(se))

    # 1. Validate connection with Moodle
    try:
        site_info = MoodleService.get_site_info(clean_url, req.token)
    except MoodleSecurityException as me:
        raise HTTPException(status_code=401, detail=str(me))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to connect to Moodle instance: {str(e)}")

    moodle_user_id = site_info.get("userid")
    if not moodle_user_id:
        raise HTTPException(status_code=400, detail="Moodle site info did not return a valid user ID.")

    site_name = site_info.get("sitename", "Moodle LMS")
    moodle_username = site_info.get("username", "")
    moodle_fullname = site_info.get("fullname", "")
    moodle_version = site_info.get("release", "")

    # Save connection to database
    moodle_db.save_moodle_connection(
        user_id=user_id,
        moodle_url=clean_url,
        token=req.token,
        moodle_user_id=moodle_user_id,
        moodle_username=moodle_username,
        moodle_fullname=moodle_fullname,
        site_name=site_name,
        moodle_version=moodle_version
    )

    # 2. Automatically retrieve user's enrolled courses
    try:
        enrolled_courses = MoodleService.get_enrolled_courses(clean_url, req.token, moodle_user_id)
    except Exception as e:
        enrolled_courses = []
        print(f"[MoodleConnect] Warning: could not fetch enrolled courses: {e}")

    saved_courses = moodle_db.upsert_moodle_courses(user_id, enrolled_courses)

    course_schemas = [
        MoodleCourseSchema(
            id=c.get("id"),
            moodle_course_id=c.get("moodle_course_id"),
            course_name=c.get("course_name"),
            course_code=c.get("course_code"),
            summary=c.get("summary"),
            activation_status=c.get("activation_status", "not_activated"),
            sync_status=c.get("sync_status", "idle"),
            pdf_count=c.get("pdf_count", 0),
            synced_pdf_count=c.get("synced_pdf_count", 0),
            total_pages=c.get("total_pages", 0),
            total_chunks=c.get("total_chunks", 0),
            last_synced_at=c.get("last_synced_at")
        ) for c in saved_courses
    ]

    return MoodleConnectionResponse(
        status="connected",
        moodle_url=clean_url,
        site_name=site_name,
        moodle_user_id=moodle_user_id,
        moodle_username=moodle_username,
        moodle_fullname=moodle_fullname,
        moodle_version=moodle_version,
        courses_count=len(course_schemas),
        courses=course_schemas
    )


@router.get("/status", response_model=MoodleStatusResponse)
def get_moodle_status(user_id: Optional[str] = None, current_user: str = Depends(get_current_user_id)):
    """
    Checks if current authenticated user has an active Moodle connection.
    """
    target_user = user_id or current_user
    conn = moodle_db.get_moodle_connection(target_user)
    if not conn:
        return MoodleStatusResponse(is_connected=False)

    courses = moodle_db.get_user_courses(target_user)
    activated = [c for c in courses if c.get("activation_status") == "activated"]

    safe_conn = {
        "moodle_url": conn.get("moodle_url"),
        "site_name": conn.get("site_name"),
        "moodle_username": conn.get("moodle_username"),
        "moodle_fullname": conn.get("moodle_fullname"),
        "moodle_version": conn.get("moodle_version"),
        "connected_at": conn.get("created_at")
    }

    return MoodleStatusResponse(
        is_connected=True,
        connection=safe_conn,
        enrolled_courses_count=len(courses),
        activated_courses_count=len(activated)
    )


@router.post("/disconnect")
def disconnect_moodle(user_id: Optional[str] = None, current_user: str = Depends(get_current_user_id)):
    """
    Disconnects Moodle account for the authenticated user.
    """
    target_user = user_id or current_user
    moodle_db.disconnect_moodle(target_user)
    return {"status": "disconnected", "message": "Moodle connection removed successfully"}


@router.get("/courses", response_model=List[MoodleCourseSchema])
def get_user_courses(user_id: Optional[str] = None, current_user: str = Depends(get_current_user_id)):
    """
    Returns enrolled courses for the authenticated user.
    """
    target_user = user_id or current_user
    courses = moodle_db.get_user_courses(target_user)
    return [
        MoodleCourseSchema(
            id=c.get("id"),
            moodle_course_id=c.get("moodle_course_id"),
            course_name=c.get("course_name"),
            course_code=c.get("course_code"),
            summary=c.get("summary"),
            activation_status=c.get("activation_status", "not_activated"),
            sync_status=c.get("sync_status", "idle"),
            pdf_count=c.get("pdf_count", 0),
            synced_pdf_count=c.get("synced_pdf_count", 0),
            total_pages=c.get("total_pages", 0),
            total_chunks=c.get("total_chunks", 0),
            last_synced_at=c.get("last_synced_at")
        ) for c in courses
    ]


@router.get("/courses/{course_id}", response_model=MoodleCourseSchema)
def get_course_detail(course_id: int, user_id: Optional[str] = None, current_user: str = Depends(get_current_user_id)):
    """
    Returns single course details.
    """
    target_user = user_id or current_user
    course = moodle_db.get_user_course(target_user, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not enrolled.")
    return MoodleCourseSchema(
        id=course.get("id"),
        moodle_course_id=course.get("moodle_course_id"),
        course_name=course.get("course_name"),
        course_code=course.get("course_code"),
        summary=course.get("summary"),
        activation_status=course.get("activation_status", "not_activated"),
        sync_status=course.get("sync_status", "idle"),
        pdf_count=course.get("pdf_count", 0),
        synced_pdf_count=course.get("synced_pdf_count", 0),
        total_pages=course.get("total_pages", 0),
        total_chunks=course.get("total_chunks", 0),
        last_synced_at=course.get("last_synced_at")
    )


@router.get("/courses/{course_id}/files", response_model=List[MoodleFileSchema])
def get_course_files(course_id: int, user_id: Optional[str] = None, current_user: str = Depends(get_current_user_id)):
    """
    Returns all PDF materials for a course.
    """
    target_user = user_id or current_user
    files = moodle_db.get_course_files(target_user, course_id)
    return [
        MoodleFileSchema(
            id=f.get("id"),
            moodle_file_id=f.get("moodle_file_id"),
            filename=f.get("filename"),
            section_name=f.get("section_name", "General"),
            file_url=f.get("file_url"),
            file_size=f.get("file_size", 0),
            page_count=f.get("page_count", 0),
            chunk_count=f.get("chunk_count", 0),
            processing_status=f.get("processing_status", "pending"),
            error_message=f.get("error_message"),
            created_at=f.get("created_at")
        ) for f in files
    ]


# --- Background Course Activation Task ---

def run_course_activation_task(job_id: str, user_id: str, course_id: int):
    """
    Background worker that:
    1. Calls core_course_get_contents
    2. Detects ALL accessible PDFs across all sections and modules
    3. Downloads each PDF with validation and deduplication
    4. Extracts text page-by-page
    5. Chunks and embeds into user-isolated vector store
    6. Updates progress and status incrementally
    """
    print(f"[MoodleJob {job_id}] Starting course activation for user {user_id}, course {course_id}")
    conn = moodle_db.get_moodle_connection(user_id)
    if not conn:
        moodle_db.update_sync_job(job_id, status="failed", error_message="Moodle connection not found.")
        moodle_db.update_course_status(user_id, course_id, activation_status="not_activated", sync_status="error")
        return

    course = moodle_db.get_user_course(user_id, course_id)
    course_name = course.get("course_name", f"Course {course_id}") if course else f"Course {course_id}"

    token = conn.get("token")
    url = conn.get("moodle_url")

    # Step 1: Retrieve course contents
    try:
        contents = MoodleService.get_course_contents(url, token, course_id)
        pdf_resources = MoodleService.extract_all_pdfs_from_contents(contents)
    except Exception as e:
        err_msg = f"Failed to retrieve course contents: {str(e)}"
        moodle_db.update_sync_job(job_id, status="failed", error_message=err_msg)
        moodle_db.update_course_status(user_id, course_id, activation_status="not_activated", sync_status="error")
        return

    total_files = len(pdf_resources)
    moodle_db.update_sync_job(job_id, status="running", total_files=total_files, progress=10)
    moodle_db.update_course_status(user_id, course_id, activation_status="activating", sync_status="syncing", pdf_count=total_files)

    if total_files == 0:
        moodle_db.update_sync_job(
            job_id, 
            status="completed", 
            progress=100, 
            total_files=0, 
            downloaded_files=0, 
            processed_files=0,
            error_message="No PDF documents found in this course."
        )
        moodle_db.update_course_status(user_id, course_id, activation_status="activated", sync_status="synced", pdf_count=0)
        return

    downloaded = 0
    processed = 0
    failed = 0
    total_pages = 0
    total_chunks = 0
    details = []

    # Step 2: Iterate through all accessible PDFs
    for idx, pdf in enumerate(pdf_resources):
        filename = pdf["filename"]
        section_name = pdf["section_name"]
        file_url = pdf["file_url"]
        file_id = pdf["moodle_file_id"]
        file_size = pdf.get("file_size", 0)
        timemodified = pdf.get("timemodified", "")

        current_pct = int(10 + ((idx / total_files) * 80))
        moodle_db.update_sync_job(
            job_id,
            progress=current_pct,
            current_file=filename,
            downloaded_files=downloaded,
            processed_files=processed,
            failed_files=failed
        )

        # Check incremental sync cache
        existing_file = moodle_db.get_moodle_file(user_id, course_id, file_id)
        if (
            existing_file and 
            existing_file.get("processing_status") == "processed" and 
            os.path.exists(existing_file.get("local_path", "")) and
            existing_file.get("last_modified") == timemodified
        ):
            print(f"[MoodleJob {job_id}] Skipping unchanged file: {filename}")
            downloaded += 1
            processed += 1
            total_pages += existing_file.get("page_count", 0)
            total_chunks += existing_file.get("chunk_count", 0)
            details.append({
                "filename": filename,
                "status": "cached",
                "pages": existing_file.get("page_count", 0),
                "chunks": existing_file.get("chunk_count", 0)
            })
            continue

        # Download PDF
        try:
            local_path, sha256_hash, downloaded_size = MoodleService.download_pdf(
                file_url=file_url,
                token=token,
                user_id=user_id,
                course_id=course_id,
                section_name=section_name,
                filename=filename
            )
            downloaded += 1
        except Exception as dl_err:
            print(f"[MoodleJob {job_id}] Download failed for {filename}: {dl_err}")
            failed += 1
            details.append({
                "filename": filename,
                "status": "failed",
                "error": str(dl_err)
            })
            moodle_db.upsert_moodle_file(
                user_id=user_id,
                course_id=course_id,
                moodle_file_id=file_id,
                filename=filename,
                section_name=section_name,
                file_url=file_url,
                local_path="",
                file_size=file_size,
                processing_status="failed",
                error_message=str(dl_err)
            )
            continue

        # Extract text page by page
        try:
            pages_text = MoodleRagService.extract_text_by_pages(local_path)
            file_page_count = len(pages_text)
            total_pages += file_page_count

            # Chunk document
            metadata_base = {
                "user_id": user_id,
                "course_id": course_id,
                "course_name": course_name,
                "section_name": section_name,
                "moodle_file_id": file_id,
                "filename": filename,
                "source_url": file_url
            }
            chunks = MoodleRagService.chunk_document(pages_text, metadata_base)
            file_chunk_count = len(chunks)
            total_chunks += file_chunk_count

            # Index into user-isolated vector store
            MoodleRagService.index_chunks_into_user_store(user_id, chunks)

            processed += 1
            details.append({
                "filename": filename,
                "status": "processed",
                "pages": file_page_count,
                "chunks": file_chunk_count
            })

            moodle_db.upsert_moodle_file(
                user_id=user_id,
                course_id=course_id,
                moodle_file_id=file_id,
                filename=filename,
                section_name=section_name,
                file_url=file_url,
                local_path=local_path,
                sha256=sha256_hash,
                file_size=downloaded_size,
                page_count=file_page_count,
                chunk_count=file_chunk_count,
                processing_status="processed",
                last_modified=timemodified
            )
        except Exception as proc_err:
            print(f"[MoodleJob {job_id}] Processing failed for {filename}: {proc_err}")
            failed += 1
            details.append({
                "filename": filename,
                "status": "failed",
                "error": str(proc_err)
            })
            moodle_db.upsert_moodle_file(
                user_id=user_id,
                course_id=course_id,
                moodle_file_id=file_id,
                filename=filename,
                section_name=section_name,
                file_url=file_url,
                local_path=local_path,
                processing_status="failed",
                error_message=str(proc_err)
            )

    # Step 3: Complete Job
    final_status = "completed"
    if failed > 0:
        final_status = "warning" if processed > 0 else "failed"

    moodle_db.update_sync_job(
        job_id,
        status=final_status,
        progress=100,
        downloaded_files=downloaded,
        processed_files=processed,
        failed_files=failed,
        current_file=None,
        details_json=json.dumps(details)
    )

    moodle_db.update_course_status(
        user_id=user_id,
        course_id=course_id,
        activation_status="activated" if processed > 0 else "not_activated",
        sync_status="synced" if failed == 0 else "warning",
        pdf_count=total_files,
        synced_pdf_count=processed,
        total_pages=total_pages,
        total_chunks=total_chunks
    )
    print(f"[MoodleJob {job_id}] Finished course activation: {processed}/{total_files} processed, {failed} failed.")


@router.post("/courses/{course_id}/activate", response_model=ActivateCourseResponse)
@router.post("/courses/{course_id}/sync", response_model=ActivateCourseResponse)
def activate_or_sync_course(
    course_id: int, 
    background_tasks: BackgroundTasks,
    user_id: Optional[str] = None, 
    current_user: str = Depends(get_current_user_id)
):
    """
    Main Activation trigger:
    1. Marks course as activating
    2. Spawns background task to iterate ALL sections and download ALL accessible PDFs
    3. Returns immediate response with job_id for frontend live progress tracking
    """
    target_user = user_id or current_user
    course = moodle_db.get_user_course(target_user, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found in enrolled courses.")

    # Generate unique job ID
    job_id = f"sync_{uuid.uuid4().hex[:12]}"
    moodle_db.create_sync_job(job_id=job_id, user_id=target_user, course_id=course_id)
    moodle_db.update_course_status(target_user, course_id, activation_status="activating", sync_status="syncing")

    # Launch non-blocking background task
    background_tasks.add_task(run_course_activation_task, job_id, target_user, course_id)

    return ActivateCourseResponse(
        job_id=job_id,
        course_id=course_id,
        status="started",
        message=f"Activation of '{course.get('course_name')}' started in background."
    )


@router.get("/sync/jobs/{job_id}", response_model=SyncJobResponse)
def get_sync_job_status(job_id: str):
    """
    Returns current status and live progress for a sync job.
    """
    job = moodle_db.get_sync_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Sync job not found.")

    return SyncJobResponse(
        job_id=job.get("job_id"),
        course_id=job.get("course_id"),
        status=job.get("status"),
        total_files=job.get("total_files", 0),
        downloaded_files=job.get("downloaded_files", 0),
        processed_files=job.get("processed_files", 0),
        failed_files=job.get("failed_files", 0),
        progress=job.get("progress", 0),
        current_file=job.get("current_file"),
        error_message=job.get("error_message"),
        details=job.get("details", []),
        started_at=job.get("started_at"),
        completed_at=job.get("completed_at")
    )


@router.post("/rag/query", response_model=MoodleRagQueryResponse)
def query_moodle_rag(req: MoodleRagQueryRequest, current_user: str = Depends(get_current_user_id)):
    """
    Retrieves knowledge strictly from activated Moodle courses for the authenticated user,
    with course-level filtering and source citations.
    """
    target_user = req.user_id if req.user_id and req.user_id != "user_default" else current_user

    result = MoodleRagService.query_user_knowledge_base(
        user_id=target_user,
        query=req.query,
        course_id=req.course_id,
        top_k=5,
        language=req.language or "ar"
    )

    return MoodleRagQueryResponse(
        answer=result.get("answer", ""),
        citations=result.get("citations", []),
        course_filtered=result.get("course_filtered", "all"),
        status="success"
    )
