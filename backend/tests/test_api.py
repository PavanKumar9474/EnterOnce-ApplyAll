import io
import fitz
import pytest
from app.services.resume_parser import extract_text_from_pdf, parse_resume_text


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_user_registration_and_login(client):
    # 1. Register
    reg_resp = client.post("/api/v1/auth/register", json={
        "email": "sarah.connor@example.com",
        "password": "SecurePassword123!",
        "full_name": "Sarah Connor"
    })
    assert reg_resp.status_code == 201
    user_data = reg_resp.json()
    assert user_data["email"] == "sarah.connor@example.com"
    assert user_data["full_name"] == "Sarah Connor"

    # Duplicate registration should fail
    dup_resp = client.post("/api/v1/auth/register", json={
        "email": "sarah.connor@example.com",
        "password": "AnotherPassword456!",
        "full_name": "Sarah Duplicate"
    })
    assert dup_resp.status_code == 400

    # 2. Login
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "sarah.connor@example.com",
        "password": "SecurePassword123!"
    })
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    # Invalid login should fail
    bad_login = client.post("/api/v1/auth/login", json={
        "email": "sarah.connor@example.com",
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401


def test_profile_crud_and_children(client):
    # Register & get auth token
    client.post("/api/v1/auth/register", json={
        "email": "developer@example.com",
        "password": "DevPassword123!",
        "full_name": "Jane Developer"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "developer@example.com",
        "password": "DevPassword123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get initial profile
    prof_res = client.get("/api/v1/profile", headers=headers)
    assert prof_res.status_code == 200
    prof = prof_res.json()
    assert prof["email"] == "developer@example.com"

    # 2. Update profile
    update_res = client.put("/api/v1/profile", json={
        "first_name": "Jane",
        "last_name": "Developer",
        "phone": "+1 555-010-9999",
        "city": "Austin",
        "state": "Texas",
        "country": "United States",
        "linkedin": "https://linkedin.com/in/janedev",
        "github": "https://github.com/janedev"
    }, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["phone"] == "+1 555-010-9999"

    # 3. Add Education
    edu_res = client.post("/api/v1/profile/education", json={
        "qualification": "Bachelors Degree",
        "degree": "Bachelor of Science",
        "major": "Computer Science",
        "institution": "University of Texas",
        "graduation_year": "2022",
        "cgpa": "3.9"
    }, headers=headers)
    assert edu_res.status_code == 201
    edu_id = edu_res.json()["id"]

    # 4. Add Skill
    skill_res = client.post("/api/v1/profile/skills", json={
        "name": "FastAPI",
        "category": "Backend"
    }, headers=headers)
    assert skill_res.status_code == 201

    # 5. Add Project
    proj_res = client.post("/api/v1/profile/projects", json={
        "title": "Cloud Dashboard",
        "description": "Full-stack cloud monitoring system",
        "technologies": "React, Python, Docker"
    }, headers=headers)
    assert proj_res.status_code == 201

    # 6. Verify Full Profile has all entities
    full_res = client.get("/api/v1/profile", headers=headers)
    full_data = full_res.json()
    assert len(full_data["educations"]) == 1
    assert len(full_data["skills"]) == 1
    assert len(full_data["projects"]) == 1


def test_extension_endpoints_and_token_flow(client):
    # Register & Login
    client.post("/api/v1/auth/register", json={
        "email": "ext_tester@example.com",
        "password": "Password123!",
        "full_name": "Ext Tester"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "ext_tester@example.com",
        "password": "Password123!"
    })
    jwt_token = login_res.json()["access_token"]
    jwt_headers = {"Authorization": f"Bearer {jwt_token}"}

    # 1. Create Extension Session Token
    sess_res = client.post("/api/v1/extension/session", json={
        "device_name": "Tester Browser Chrome"
    }, headers=jwt_headers)
    assert sess_res.status_code == 200
    ext_token = sess_res.json()["token"]
    assert ext_token.startswith("ao_ext_")

    # 2. Retrieve Profile using Extension Session Token
    ext_headers = {"Authorization": f"Bearer {ext_token}"}
    ext_prof_res = client.get("/api/v1/extension/profile", headers=ext_headers)
    assert ext_prof_res.status_code == 200
    ext_prof = ext_prof_res.json()

    # Verify hierarchical structure expected by extension autofill
    assert "personal" in ext_prof
    assert "education" in ext_prof
    assert "professional" in ext_prof
    assert ext_prof["personal"]["email"] == "ext_tester@example.com"

    # 3. Submit Autofill Report
    rep_res = client.post("/api/v1/extension/autofill-report", json={
        "url": "https://careers.example.com/job/123",
        "filledCount": 12,
        "skippedCount": 1,
        "preservedCount": 2
    }, headers=ext_headers)
    assert rep_res.status_code == 200
    assert rep_res.json()["status"] == "ok"


def test_account_export_and_deletion(client):
    client.post("/api/v1/auth/register", json={
        "email": "delete_me@example.com",
        "password": "DeletePassword123!",
        "full_name": "Delete Me"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "delete_me@example.com",
        "password": "DeletePassword123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Export
    export_res = client.get("/api/v1/account/export", headers=headers)
    assert export_res.status_code == 200
    export_data = export_res.json()
    assert export_data["user"]["email"] == "delete_me@example.com"
    assert "candidate_profile" in export_data

    # Delete Account
    del_res = client.delete("/api/v1/account", headers=headers)
    assert del_res.status_code == 200

    # Verify user can no longer log in
    login_after = client.post("/api/v1/auth/login", json={
        "email": "delete_me@example.com",
        "password": "DeletePassword123!"
    })
    assert login_after.status_code == 401


def test_resume_parser_with_pymupdf():
    # Create a synthetic PDF document in memory using fitz (PyMuPDF)
    doc = fitz.open()
    page = doc.new_page()
    sample_text = """
    Johnathan Doe
    john.doe@example.com | (555) 123-4567 | San Francisco, CA
    https://linkedin.com/in/johnathandoe | https://github.com/johndoe

    EDUCATION
    Bachelor of Science in Computer Science
    University of California, Berkeley
    Graduation: 2023 | GPA: 3.82

    SKILLS
    Python, JavaScript, TypeScript, React, FastAPI, Docker, PostgreSQL, Git

    EXPERIENCE
    Software Engineer at Acme Technologies
    Developed scalable backend microservices and modern React user interfaces.
    """
    page.insert_text((50, 50), sample_text)
    pdf_bytes = doc.write()
    doc.close()

    # Test extraction
    extracted = extract_text_from_pdf(pdf_bytes)
    assert "john.doe@example.com" in extracted

    # Test parser
    parsed = parse_resume_text(extracted)
    assert parsed["personal"]["email"] == "john.doe@example.com"
    assert parsed["personal"]["phone"] == "(555) 123-4567"
    assert "Python" in parsed["skills"]
    assert "FastAPI" in parsed["skills"]
    assert "React" in parsed["skills"]
    assert len(parsed["education"]) >= 1
    assert parsed["education"][0]["degree"] == "Bachelor of Science"
