import os
import sys
import tempfile
import pytest
from fastapi.testclient import TestClient

# Ensure backend directory is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from server import app
from app.db import moodle_db
from app.services.moodle_service import MoodleService, MoodleSecurityException
from app.services.moodle_rag_service import MoodleRagService

client = TestClient(app)

def test_url_validation_and_ssrf():
    # Valid URLs
    assert MoodleService.validate_url("https://moodle.university.edu") == "https://moodle.university.edu"
    assert MoodleService.validate_url("moodle.university.edu/my/") == "https://moodle.university.edu/my"

    # Cloud metadata SSRF blocking
    with pytest.raises(MoodleSecurityException):
        MoodleService.validate_url("http://169.254.169.254/latest/meta-data/")

    with pytest.raises(MoodleSecurityException):
        MoodleService.validate_url("http://metadata.google.internal")


def test_filename_sanitization():
    unsafe_name = "../../etc/passwd..//lecture_01?.pdf"
    safe_name = MoodleService.sanitize_filename(unsafe_name)
    assert ".." not in safe_name
    assert "/" not in safe_name
    assert "\\" not in safe_name
    assert safe_name.endswith(".pdf")


def test_pdf_extraction_from_contents():
    # Simulate Moodle course contents structure
    mock_contents = [
        {
            "name": "Week 1: Introduction",
            "modules": [
                {
                    "name": "Lecture 1 Slides",
                    "modname": "resource",
                    "contents": [
                        {
                            "filename": "Lecture 01 - AI Intro.pdf",
                            "fileurl": "https://moodle.demo.edu/files/lec01.pdf",
                            "mimetype": "application/pdf",
                            "filesize": 1048576,
                            "timemodified": "1720000000"
                        }
                    ]
                },
                {
                    "name": "Readings Folder",
                    "modname": "folder",
                    "contents": [
                        {
                            "filename": "Syllabus.pdf",
                            "fileurl": "https://moodle.demo.edu/files/syllabus.pdf",
                            "mimetype": "application/pdf",
                            "filesize": 524288,
                            "timemodified": "1720000010"
                        },
                        {
                            "filename": "readme.txt",
                            "fileurl": "https://moodle.demo.edu/files/readme.txt",
                            "mimetype": "text/plain",
                            "filesize": 1024
                        }
                    ]
                }
            ]
        },
        {
            "name": "Week 2: Neural Networks",
            "modules": [
                {
                    "name": "Lecture 2",
                    "modname": "resource",
                    "contents": [
                        {
                            "filename": "Lecture 02 - Backprop.PDF",
                            "fileurl": "https://moodle.demo.edu/files/lec02.pdf",
                            "mimetype": "application/octet-stream",
                            "filesize": 2097152,
                            "timemodified": "1720000020"
                        }
                    ]
                }
            ]
        }
    ]

    pdfs = MoodleService.extract_all_pdfs_from_contents(mock_contents)
    assert len(pdfs) == 3  # lec01, syllabus, lec02 (readme.txt skipped)
    assert pdfs[0]["filename"] == "Lecture 01 - AI Intro.pdf"
    assert pdfs[0]["section_name"] == "Week 1: Introduction"
    assert pdfs[2]["filename"] == "Lecture 02 - Backprop.PDF"
    assert pdfs[2]["section_name"] == "Week 2: Neural Networks"


def test_user_isolation_in_database():
    user_a = "user_alice@shaghoof.ai"
    user_b = "user_bob@shaghoof.ai"

    # Save connection for User A
    moodle_db.save_moodle_connection(
        user_id=user_a,
        moodle_url="https://moodle.alice.edu",
        token="token_alice_123",
        moodle_user_id=101,
        moodle_username="alice",
        moodle_fullname="Alice Smith",
        site_name="Alice University",
        moodle_version="4.3"
    )

    # Save courses for User A
    moodle_db.upsert_moodle_courses(user_a, [
        {"id": 10, "fullname": "Machine Learning (Alice)", "shortname": "ML-ALICE"}
    ])

    # Save courses for User B
    moodle_db.upsert_moodle_courses(user_b, [
        {"id": 20, "fullname": "Robotics (Bob)", "shortname": "ROB-BOB"}
    ])

    # Query User A courses
    courses_a = moodle_db.get_user_courses(user_a)
    assert any(c["course_name"] == "Machine Learning (Alice)" for c in courses_a)
    assert not any(c["course_name"] == "Robotics (Bob)" for c in courses_a)

    # Query User B courses
    courses_b = moodle_db.get_user_courses(user_b)
    assert any(c["course_name"] == "Robotics (Bob)" for c in courses_b)
    assert not any(c["course_name"] == "Machine Learning (Alice)" for c in courses_b)


def test_chunking_and_metadata_preservation():
    mock_pages = [
        (1, "Artificial Intelligence is the simulation of human intelligence by machines. It includes reasoning and self-correction."),
        (2, "Backpropagation calculates the gradient of the error function with respect to the neural network weights.")
    ]
    meta_base = {
        "user_id": "test_user",
        "course_id": 401,
        "course_name": "Machine Learning",
        "section_name": "Week 2",
        "moodle_file_id": "file_99",
        "filename": "Neural_Nets.pdf"
    }

    chunks = MoodleRagService.chunk_document(mock_pages, meta_base, chunk_size=200, chunk_overlap=20)
    assert len(chunks) >= 2
    assert chunks[0]["metadata"]["page_number"] == 1
    assert chunks[0]["metadata"]["course_name"] == "Machine Learning"
    assert chunks[1]["metadata"]["page_number"] == 2


def test_moodle_rag_query_with_citations():
    user_id = "test_eval_user"
    mock_pages = [
        (14, "Backpropagation uses the chain rule to compute partial derivatives of the loss function with respect to weights."),
        (18, "Gradient descent updates weights iteratively in the opposite direction of the gradient vector.")
    ]
    meta_base = {
        "user_id": user_id,
        "course_id": 501,
        "course_name": "Deep Learning Fundamentals",
        "section_name": "Optimization",
        "moodle_file_id": "dl_lec_4",
        "filename": "Lecture_04_Optimization.pdf"
    }

    chunks = MoodleRagService.chunk_document(mock_pages, meta_base)
    MoodleRagService.index_chunks_into_user_store(user_id, chunks)

    # Query the knowledge base
    result = MoodleRagService.query_user_knowledge_base(
        user_id=user_id,
        query="Explain backpropagation and loss derivatives",
        course_id=501,
        language="ar"
    )

    assert result["chunks_found"] > 0
    assert len(result["citations"]) > 0
    first_cit = result["citations"][0]
    assert first_cit["course_name"] == "Deep Learning Fundamentals"
    assert first_cit["filename"] == "Lecture_04_Optimization.pdf"
    assert first_cit["page_number"] in (14, 18)


def test_fastapi_endpoints():
    user_header = {"x-user-id": "api_test_student"}

    # 1. Check status
    res = client.get("/api/v1/moodle/status", headers=user_header)
    assert res.status_code == 200

    # 2. Get courses
    res = client.get("/api/v1/moodle/courses", headers=user_header)
    assert res.status_code == 200
    assert isinstance(res.json(), list)

    # 3. Add a test course to db and test activate
    moodle_db.upsert_moodle_courses("api_test_student", [
        {"id": 999, "fullname": "Test Course 101", "shortname": "TC101"}
    ])

    res = client.post("/api/v1/moodle/courses/999/activate", headers=user_header)
    assert res.status_code == 200
    data = res.json()
    assert "job_id" in data
    assert data["status"] == "started"

    # 4. Check sync job status
    job_id = data["job_id"]
    res = client.get(f"/api/v1/moodle/sync/jobs/{job_id}")
    assert res.status_code == 200
    job_data = res.json()
    assert job_data["job_id"] == job_id
