import os
import sqlite3
import json
from datetime import datetime
from typing import Any, Dict, List, Optional

# Base path for database: unify with edumind_activity.sqlite3 at project root
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DB_PATH = os.path.join(BASE_DIR, "edumind_activity.sqlite3")

def now_iso() -> str:
    return datetime.utcnow().isoformat(timespec="seconds")

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_moodle_tables():
    """
    Initializes database tables for Moodle integration with strict user isolation.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. MoodleConnection
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS moodle_connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        moodle_url TEXT NOT NULL,
        token TEXT NOT NULL,
        moodle_user_id INTEGER,
        moodle_username TEXT,
        moodle_fullname TEXT,
        site_name TEXT,
        moodle_version TEXT,
        connection_status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id)
    )
    """)

    # 2. MoodleCourse
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS moodle_courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        moodle_course_id INTEGER NOT NULL,
        course_name TEXT NOT NULL,
        course_code TEXT,
        summary TEXT,
        activation_status TEXT DEFAULT 'not_activated', -- 'not_activated', 'activating', 'activated'
        sync_status TEXT DEFAULT 'idle', -- 'idle', 'syncing', 'synced', 'error'
        pdf_count INTEGER DEFAULT 0,
        synced_pdf_count INTEGER DEFAULT 0,
        total_pages INTEGER DEFAULT 0,
        total_chunks INTEGER DEFAULT 0,
        last_synced_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id, moodle_course_id)
    )
    """)

    # 3. MoodleFile
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS moodle_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        course_id INTEGER NOT NULL,
        moodle_file_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        section_name TEXT DEFAULT 'General',
        file_url TEXT NOT NULL,
        local_path TEXT NOT NULL,
        sha256 TEXT,
        file_size INTEGER DEFAULT 0,
        page_count INTEGER DEFAULT 0,
        chunk_count INTEGER DEFAULT 0,
        processing_status TEXT DEFAULT 'pending', -- 'pending', 'downloaded', 'processed', 'failed'
        error_message TEXT,
        last_modified TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id, course_id, moodle_file_id)
    )
    """)

    # 4. MoodleSyncJob
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS moodle_sync_jobs (
        job_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        course_id INTEGER,
        status TEXT NOT NULL, -- 'pending', 'running', 'completed', 'warning', 'failed'
        total_files INTEGER DEFAULT 0,
        downloaded_files INTEGER DEFAULT 0,
        processed_files INTEGER DEFAULT 0,
        failed_files INTEGER DEFAULT 0,
        progress INTEGER DEFAULT 0, -- 0 to 100
        current_file TEXT,
        error_message TEXT,
        details_json TEXT, -- JSON array of file statuses
        started_at TEXT NOT NULL,
        completed_at TEXT
    )
    """)

    conn.commit()
    conn.close()

# Auto-initialize on module load
init_moodle_tables()


# --- Database Operations with Strict User Isolation ---

def save_moodle_connection(
    user_id: str,
    moodle_url: str,
    token: str,
    moodle_user_id: int,
    moodle_username: str,
    moodle_fullname: str,
    site_name: str,
    moodle_version: str
) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = now_iso()

    cursor.execute("""
    INSERT INTO moodle_connections 
        (user_id, moodle_url, token, moodle_user_id, moodle_username, moodle_fullname, site_name, moodle_version, connection_status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
        moodle_url = excluded.moodle_url,
        token = excluded.token,
        moodle_user_id = excluded.moodle_user_id,
        moodle_username = excluded.moodle_username,
        moodle_fullname = excluded.moodle_fullname,
        site_name = excluded.site_name,
        moodle_version = excluded.moodle_version,
        connection_status = 'active',
        updated_at = excluded.updated_at
    """, (user_id, moodle_url, token, moodle_user_id, moodle_username, moodle_fullname, site_name, moodle_version, now, now))

    conn.commit()
    conn.close()
    return get_moodle_connection(user_id)

def get_moodle_connection(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM moodle_connections WHERE user_id = ? AND connection_status = 'active'", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def disconnect_moodle(user_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE moodle_connections SET connection_status = 'disconnected', updated_at = ? WHERE user_id = ?", (now_iso(), user_id))
    conn.commit()
    conn.close()
    return True

def upsert_moodle_courses(user_id: str, courses: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = now_iso()

    for c in courses:
        moodle_id = c.get("id") or c.get("moodle_course_id")
        name = c.get("fullname") or c.get("course_name") or "Unnamed Course"
        code = c.get("shortname") or c.get("course_code") or ""
        summary = c.get("summary") or ""

        cursor.execute("""
        INSERT INTO moodle_courses 
            (user_id, moodle_course_id, course_name, course_code, summary, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, moodle_course_id) DO UPDATE SET
            course_name = excluded.course_name,
            course_code = excluded.course_code,
            summary = excluded.summary,
            updated_at = excluded.updated_at
        """, (user_id, moodle_id, name, code, summary, now, now))

    conn.commit()
    conn.close()
    return get_user_courses(user_id)

def get_user_courses(user_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM moodle_courses WHERE user_id = ? ORDER BY id ASC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_user_course(user_id: str, course_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM moodle_courses WHERE user_id = ? AND moodle_course_id = ?", (user_id, course_id))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def update_course_status(
    user_id: str, 
    course_id: int, 
    activation_status: Optional[str] = None, 
    sync_status: Optional[str] = None,
    pdf_count: Optional[int] = None,
    synced_pdf_count: Optional[int] = None,
    total_pages: Optional[int] = None,
    total_chunks: Optional[int] = None
):
    conn = get_db_connection()
    cursor = conn.cursor()
    updates = ["updated_at = ?"]
    params = [now_iso()]

    if activation_status is not None:
        updates.append("activation_status = ?")
        params.append(activation_status)
    if sync_status is not None:
        updates.append("sync_status = ?")
        params.append(sync_status)
        if sync_status == "synced":
            updates.append("last_synced_at = ?")
            params.append(now_iso())
    if pdf_count is not None:
        updates.append("pdf_count = ?")
        params.append(pdf_count)
    if synced_pdf_count is not None:
        updates.append("synced_pdf_count = ?")
        params.append(synced_pdf_count)
    if total_pages is not None:
        updates.append("total_pages = ?")
        params.append(total_pages)
    if total_chunks is not None:
        updates.append("total_chunks = ?")
        params.append(total_chunks)

    params.extend([user_id, course_id])
    query = f"UPDATE moodle_courses SET {', '.join(updates)} WHERE user_id = ? AND moodle_course_id = ?"
    cursor.execute(query, tuple(params))
    conn.commit()
    conn.close()

def upsert_moodle_file(
    user_id: str,
    course_id: int,
    moodle_file_id: str,
    filename: str,
    section_name: str,
    file_url: str,
    local_path: str,
    sha256: Optional[str] = None,
    file_size: int = 0,
    page_count: int = 0,
    chunk_count: int = 0,
    processing_status: str = "pending",
    error_message: Optional[str] = None,
    last_modified: Optional[str] = None
) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = now_iso()

    cursor.execute("""
    INSERT INTO moodle_files 
        (user_id, course_id, moodle_file_id, filename, section_name, file_url, local_path, 
         sha256, file_size, page_count, chunk_count, processing_status, error_message, last_modified, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, course_id, moodle_file_id) DO UPDATE SET
        filename = excluded.filename,
        section_name = excluded.section_name,
        file_url = excluded.file_url,
        local_path = excluded.local_path,
        sha256 = coalesce(excluded.sha256, moodle_files.sha256),
        file_size = excluded.file_size,
        page_count = excluded.page_count,
        chunk_count = excluded.chunk_count,
        processing_status = excluded.processing_status,
        error_message = excluded.error_message,
        last_modified = coalesce(excluded.last_modified, moodle_files.last_modified),
        updated_at = excluded.updated_at
    """, (user_id, course_id, moodle_file_id, filename, section_name, file_url, local_path,
          sha256, file_size, page_count, chunk_count, processing_status, error_message, last_modified, now, now))

    conn.commit()
    conn.close()
    return get_moodle_file(user_id, course_id, moodle_file_id)

def get_moodle_file(user_id: str, course_id: int, moodle_file_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM moodle_files WHERE user_id = ? AND course_id = ? AND moodle_file_id = ?", (user_id, course_id, moodle_file_id))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_course_files(user_id: str, course_id: int) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM moodle_files WHERE user_id = ? AND course_id = ? ORDER BY section_name, filename", (user_id, course_id))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# --- Sync Job Operations ---

def create_sync_job(job_id: str, user_id: str, course_id: Optional[int], total_files: int = 0) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = now_iso()

    cursor.execute("""
    INSERT INTO moodle_sync_jobs 
        (job_id, user_id, course_id, status, total_files, downloaded_files, processed_files, failed_files, progress, started_at)
    VALUES (?, ?, ?, 'running', ?, 0, 0, 0, 0, ?)
    """, (job_id, user_id, course_id, total_files, now))

    conn.commit()
    conn.close()
    return get_sync_job(job_id)

def update_sync_job(
    job_id: str,
    status: Optional[str] = None,
    progress: Optional[int] = None,
    downloaded_files: Optional[int] = None,
    processed_files: Optional[int] = None,
    failed_files: Optional[int] = None,
    total_files: Optional[int] = None,
    current_file: Optional[str] = None,
    error_message: Optional[str] = None,
    details_json: Optional[str] = None
):
    conn = get_db_connection()
    cursor = conn.cursor()
    updates = []
    params = []

    if status is not None:
        updates.append("status = ?")
        params.append(status)
        if status in ("completed", "warning", "failed"):
            updates.append("completed_at = ?")
            params.append(now_iso())
    if progress is not None:
        updates.append("progress = ?")
        params.append(progress)
    if downloaded_files is not None:
        updates.append("downloaded_files = ?")
        params.append(downloaded_files)
    if processed_files is not None:
        updates.append("processed_files = ?")
        params.append(processed_files)
    if failed_files is not None:
        updates.append("failed_files = ?")
        params.append(failed_files)
    if total_files is not None:
        updates.append("total_files = ?")
        params.append(total_files)
    if current_file is not None:
        updates.append("current_file = ?")
        params.append(current_file)
    if error_message is not None:
        updates.append("error_message = ?")
        params.append(error_message)
    if details_json is not None:
        updates.append("details_json = ?")
        params.append(details_json)

    if updates:
        params.append(job_id)
        cursor.execute(f"UPDATE moodle_sync_jobs SET {', '.join(updates)} WHERE job_id = ?", tuple(params))
        conn.commit()

    conn.close()

def get_sync_job(job_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM moodle_sync_jobs WHERE job_id = ?", (job_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    if d.get("details_json"):
        try:
            d["details"] = json.loads(d["details_json"])
        except Exception:
            d["details"] = []
    else:
        d["details"] = []
    return d
