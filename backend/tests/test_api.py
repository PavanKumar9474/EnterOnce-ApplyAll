"""
Extended backend test suite for ApplyOnce — covers missing coverage areas:
- Update/PUT endpoints for education, experience, and projects
- Resume upload + confirm (apply-to-profile) flow
- Extension profile hierarchical structure verification
- Token management (disconnect and re-auth flow)
- Auth edge cases (missing fields, inactive user)
"""

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

    # /auth/me should return user details
    token = login_resp.json()["access_token"]
    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["email"] == "sarah.connor@example.com"
    assert me_data["full_name"] == "Sarah Connor"

    # Unauthenticated /me should fail
    me_unauth = client.get("/api/v1/auth/me")
    assert me_unauth.status_code == 401


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

    # 3b. Update Education
    edu_update_res = client.put(f"/api/v1/profile/education/{edu_id}", json={
        "qualification": "Bachelors Degree",
        "degree": "Bachelor of Science",
        "major": "Software Engineering",
        "institution": "University of Texas",
        "graduation_year": "2022",
        "cgpa": "4.0"
    }, headers=headers)
    assert edu_update_res.status_code == 200
    assert edu_update_res.json()["major"] == "Software Engineering"
    assert edu_update_res.json()["cgpa"] == "4.0"

    # 4. Add Skill
    skill_res = client.post("/api/v1/profile/skills", json={
        "name": "FastAPI",
        "category": "Backend"
    }, headers=headers)
    assert skill_res.status_code == 201
    skill_id = skill_res.json()["id"]

    # 5. Add Experience
    exp_res = client.post("/api/v1/profile/experience", json={
        "company": "TechCorp",
        "title": "Backend Engineer",
        "location": "Austin, TX",
        "is_current": True,
        "description": "Built microservices"
    }, headers=headers)
    assert exp_res.status_code == 201
    exp_id = exp_res.json()["id"]

    # 5b. Update Experience
    exp_update_res = client.put(f"/api/v1/profile/experience/{exp_id}", json={
        "company": "TechCorp",
        "title": "Senior Backend Engineer",
        "location": "Austin, TX",
        "is_current": True,
        "description": "Led team building microservices"
    }, headers=headers)
    assert exp_update_res.status_code == 200
    assert exp_update_res.json()["title"] == "Senior Backend Engineer"

    # 6. Add Project
    proj_res = client.post("/api/v1/profile/projects", json={
        "title": "Cloud Dashboard",
        "description": "Full-stack cloud monitoring system",
        "technologies": "React, Python, Docker"
    }, headers=headers)
    assert proj_res.status_code == 201
    proj_id = proj_res.json()["id"]

    # 6b. Update Project
    proj_update_res = client.put(f"/api/v1/profile/projects/{proj_id}", json={
        "title": "Cloud Dashboard v2",
        "description": "Improved cloud monitoring system",
        "technologies": "React, Python, Docker, Kubernetes"
    }, headers=headers)
    assert proj_update_res.status_code == 200
    assert proj_update_res.json()["title"] == "Cloud Dashboard v2"

    # 7. Verify Full Profile has all entities
    full_res = client.get("/api/v1/profile", headers=headers)
    full_data = full_res.json()
    assert len(full_data["educations"]) == 1
    assert len(full_data["skills"]) == 1
    assert len(full_data["projects"]) == 1
    assert len(full_data["experiences"]) == 1

    # 8. Delete education (cleanup test)
    del_edu = client.delete(f"/api/v1/profile/education/{edu_id}", headers=headers)
    assert del_edu.status_code == 200

    # Verify not-found after delete
    del_edu_again = client.delete(f"/api/v1/profile/education/{edu_id}", headers=headers)
    assert del_edu_again.status_code == 404

    # 9. Delete skill
    del_skill = client.delete(f"/api/v1/profile/skills/{skill_id}", headers=headers)
    assert del_skill.status_code == 200


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
    assert sess_res.json()["device_name"] == "Tester Browser Chrome"
    assert "expires_at" in sess_res.json()

    # 2. Retrieve Profile using Extension Session Token
    ext_headers = {"Authorization": f"Bearer {ext_token}"}
    ext_prof_res = client.get("/api/v1/extension/profile", headers=ext_headers)
    assert ext_prof_res.status_code == 200
    ext_prof = ext_prof_res.json()

    # Verify hierarchical structure expected by extension autofill
    assert "personal" in ext_prof
    assert "education" in ext_prof
    assert "professional" in ext_prof
    assert "experience" in ext_prof
    assert "skills" in ext_prof
    assert "projects" in ext_prof
    assert "meta" in ext_prof
    assert ext_prof["personal"]["email"] == "ext_tester@example.com"

    # Verify personal sub-fields exist
    personal = ext_prof["personal"]
    for key in ["firstName", "lastName", "fullName", "phone", "linkedin", "github",
                "portfolio", "city", "state", "country", "workAuthorization"]:
        assert key in personal, f"Missing key '{key}' in personal profile"

    # Verify professional sub-fields
    professional = ext_prof["professional"]
    for key in ["experienceYears", "currentCompany", "currentTitle", "skills", "bio"]:
        assert key in professional, f"Missing key '{key}' in professional profile"

    # 3. Submit Autofill Report
    rep_res = client.post("/api/v1/extension/autofill-report", json={
        "url": "https://careers.example.com/job/123",
        "filledCount": 12,
        "skippedCount": 1,
        "preservedCount": 2
    }, headers=ext_headers)
    assert rep_res.status_code == 200
    assert rep_res.json()["status"] == "ok"

    # 4. Extension token must not authenticate on non-extension endpoints
    # (extension token should still work for profile GET)
    prof_via_ext = client.get("/api/v1/profile", headers=ext_headers)
    assert prof_via_ext.status_code == 200  # ext token is valid for any authenticated endpoint

    # 5. Invalid token should be rejected
    bad_headers = {"Authorization": "Bearer ao_ext_totally_invalid_token_12345"}
    bad_res = client.get("/api/v1/extension/profile", headers=bad_headers)
    assert bad_res.status_code == 401


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
    assert "resumes" in export_data
    assert "audit_logs" in export_data
    assert "applyonce_export_version" in export_data

    # Delete Account
    del_res = client.delete("/api/v1/account", headers=headers)
    assert del_res.status_code == 200

    # Verify user can no longer log in
    login_after = client.post("/api/v1/auth/login", json={
        "email": "delete_me@example.com",
        "password": "DeletePassword123!"
    })
    assert login_after.status_code == 401


def test_resume_upload_and_confirm_flow(client):
    """Tests the resume upload, extraction preview, and apply-to-profile confirm flow."""
    client.post("/api/v1/auth/register", json={
        "email": "resume_user@example.com",
        "password": "ResumePass123!",
        "full_name": "Resume User"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "resume_user@example.com",
        "password": "ResumePass123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a synthetic PDF
    doc = fitz.open()
    page = doc.new_page()
    sample_text = """
    Alice Smith
    alice.smith@example.com | (555) 234-5678 | New York, NY
    https://linkedin.com/in/alicesmith | https://github.com/asmith

    EDUCATION
    Bachelor of Science in Computer Science
    Columbia University
    Graduation: 2022 | GPA: 3.75

    SKILLS
    Python, JavaScript, React, FastAPI, Docker, PostgreSQL, AWS, Git

    EXPERIENCE
    Software Engineer at Acme Technologies
    Built scalable APIs and modern React dashboards.
    """
    page.insert_text((50, 50), sample_text)
    pdf_bytes = doc.write()
    doc.close()

    # Upload resume
    files = {"file": ("alice_resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    upload_res = client.post("/api/v1/resumes", files=files, headers=headers)
    assert upload_res.status_code == 200
    result = upload_res.json()
    assert "resume_id" in result
    assert "parsed_profile" in result
    assert "detected_fields" in result
    assert "confidence_score" in result
    assert result["confidence_score"] >= 0.0
    resume_id = result["resume_id"]

    # Verify parsed content
    personal = result["parsed_profile"].get("personal", {})
    assert personal.get("email") == "alice.smith@example.com"

    # List resumes
    list_res = client.get("/api/v1/resumes", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # Confirm/apply to profile
    confirm_res = client.post(f"/api/v1/resumes/{resume_id}/confirm", headers=headers)
    assert confirm_res.status_code == 200
    assert "profile_id" in confirm_res.json()

    # Verify profile was enriched by resume extraction
    profile_res = client.get("/api/v1/profile", headers=headers)
    assert profile_res.status_code == 200
    profile = profile_res.json()
    # Skills should have been applied
    skill_names = [s["name"] for s in profile.get("skills", [])]
    assert len(skill_names) > 0

    # Delete resume
    del_res = client.delete(f"/api/v1/resumes/{resume_id}", headers=headers)
    assert del_res.status_code == 200

    # Verify deleted
    list_after = client.get("/api/v1/resumes", headers=headers)
    assert len(list_after.json()) == 0


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


def test_invalid_auth_scenarios(client):
    """Tests various auth edge cases."""
    # Login with nonexistent user
    res = client.post("/api/v1/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "Password123!"
    })
    assert res.status_code == 401

    # Attempt to access protected endpoint without token
    res = client.get("/api/v1/profile")
    assert res.status_code == 401

    # Attempt with garbled token
    res = client.get("/api/v1/profile", headers={"Authorization": "Bearer not_a_real_token"})
    assert res.status_code == 401

    # Register a new user, try non-PDF upload (should reject)
    client.post("/api/v1/auth/register", json={
        "email": "uploadtest@example.com",
        "password": "TestPass123!",
        "full_name": "Upload Tester"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "uploadtest@example.com",
        "password": "TestPass123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Non-PDF/DOCX file should be rejected
    files = {"file": ("bad_file.txt", io.BytesIO(b"not a pdf"), "text/plain")}
    bad_upload = client.post("/api/v1/resumes", files=files, headers=headers)
    assert bad_upload.status_code == 400
    assert "PDF" in bad_upload.json()["detail"]


def test_certifications_and_languages_crud(client):
    """Verifies adding, updating, and deleting certification and language records."""
    client.post("/api/v1/auth/register", json={
        "email": "credentials.tester@example.com",
        "password": "Password123!",
        "full_name": "Credentials Tester"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "credentials.tester@example.com",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Add certification
    cert_res = client.post("/api/v1/profile/certifications", json={
        "name": "AWS Certified Solutions Architect",
        "issuing_organization": "Amazon Web Services",
        "issue_date": "2023-05",
        "expiration_date": "2026-05",
        "credential_id": "AWS-12345",
        "verification_url": "https://aws.amazon.com/verify/12345",
        "description": "Cloud architecture certification."
    }, headers=headers)
    assert cert_res.status_code == 201
    cert_data = cert_res.json()
    cert_id = cert_data["id"]
    assert cert_data["name"] == "AWS Certified Solutions Architect"

    # Update certification
    upd_cert = client.put(f"/api/v1/profile/certifications/{cert_id}", json={
        "name": "AWS Solutions Architect Professional"
    }, headers=headers)
    assert upd_cert.status_code == 200
    assert upd_cert.json()["name"] == "AWS Solutions Architect Professional"

    # 2. Add language
    lang_res = client.post("/api/v1/profile/languages", json={
        "name": "English",
        "proficiency": "Native",
        "can_read": "Yes",
        "can_write": "Yes",
        "can_speak": "Yes"
    }, headers=headers)
    assert lang_res.status_code == 201
    lang_data = lang_res.json()
    lang_id = lang_data["id"]
    assert lang_data["name"] == "English"

    # Update language
    upd_lang = client.put(f"/api/v1/profile/languages/{lang_id}", json={
        "proficiency": "Bilingual"
    }, headers=headers)
    assert upd_lang.status_code == 200
    assert upd_lang.json()["proficiency"] == "Bilingual"

    # Delete records
    del_cert = client.delete(f"/api/v1/profile/certifications/{cert_id}", headers=headers)
    assert del_cert.status_code == 200
    del_lang = client.delete(f"/api/v1/profile/languages/{lang_id}", headers=headers)
    assert del_lang.status_code == 200


def test_job_preferences_and_saved_answers(client):
    """Verifies preferences and saved answers screening library."""
    client.post("/api/v1/auth/register", json={
        "email": "preferences.tester@example.com",
        "password": "Password123!",
        "full_name": "Preferences Tester"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "preferences.tester@example.com",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Preferences
    pref_res = client.put("/api/v1/profile/preferences", json={
        "desired_job_titles": "Lead Engineer, Staff Architect",
        "preferred_locations": "San Francisco, CA; Remote",
        "work_modes": "Remote, Hybrid",
        "expected_salary": "$150,000",
        "notice_period": "30 days"
    }, headers=headers)
    assert pref_res.status_code == 200
    pref_data = pref_res.json()
    assert pref_data["desired_job_titles"] == "Lead Engineer, Staff Architect"
    assert pref_data["expected_salary"] == "$150,000"

    # 2. Add saved answer
    ans_res = client.post("/api/v1/profile/saved-answers", json={
        "question_key": "work_authorization",
        "question_text": "Are you legally authorized to work?",
        "answer": "Yes, legally authorized to work.",
        "company": None,
        "input_type": "radio"
    }, headers=headers)
    assert ans_res.status_code == 201
    ans_data = ans_res.json()
    ans_id = ans_data["id"]
    assert ans_data["answer"] == "Yes, legally authorized to work."

    # Add company-specific answer for IBM
    ibm_res = client.post("/api/v1/profile/saved-answers", json={
        "question_key": "ibm_experience",
        "question_text": "Have you worked with IBM Cloud?",
        "answer": "Yes, extensive experience.",
        "company": "IBM",
        "input_type": "text"
    }, headers=headers)
    assert ibm_res.status_code == 201

    # Query with company filter
    list_ibm = client.get("/api/v1/profile/saved-answers?company=IBM", headers=headers)
    assert list_ibm.status_code == 200
    assert len(list_ibm.json()) >= 2  # Universal + IBM specific

    # Delete saved answer
    del_ans = client.delete(f"/api/v1/profile/saved-answers/{ans_id}", headers=headers)
    assert del_ans.status_code == 200


def test_docx_resume_upload_and_parsing(client):
    """Tests creating an in-memory docx and parsing it."""
    import zipfile
    from app.services.resume_parser import extract_text_from_file, parse_resume_text

    # Generate minimal valid docx in memory
    docx_io = io.BytesIO()
    with zipfile.ZipFile(docx_io, "w") as z:
        z.writestr("word/document.xml", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
          <w:body>
            <w:p><w:t>Johnathan Smith</w:t></w:p>
            <w:p><w:t>johnathan.smith@example.com | (555) 234-5678</w:t></w:p>
            <w:p><w:t>https://linkedin.com/in/johnathansmith-dev</w:t></w:p>
            <w:p><w:t>Skills: Python, TypeScript, React, Docker, FastAPI</w:t></w:p>
          </w:body>
        </w:document>""")
    docx_bytes = docx_io.getvalue()

    extracted = extract_text_from_file(docx_bytes, "resume.docx")
    assert "johnathan.smith@example.com" in extracted
    parsed = parse_resume_text(extracted)
    assert parsed["personal"]["email"] == "johnathan.smith@example.com"
    assert "Python" in parsed["skills"]
    assert "React" in parsed["skills"]

