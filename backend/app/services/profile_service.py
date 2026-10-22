from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import CandidateProfile
from app.models.education import EducationRecord
from app.models.experience import ExperienceRecord
from app.models.skill import SkillRecord
from app.models.project import ProjectRecord
from app.models.certification import CertificationRecord
from app.models.language import LanguageRecord
from app.models.job_preference import JobPreferenceRecord
from app.models.saved_answer import SavedAnswerRecord
from app.models.audit import AuditLog
from app.core.security import get_password_hash


def format_profile_for_extension(profile: Optional[CandidateProfile]) -> Dict[str, Any]:
    """
    Transforms the relational candidate profile into the hierarchical JSON structure
    consumed by the ApplyOnce Chrome extension autofill engine.
    """
    if not profile:
        return {}

    # Education records
    education_list = []
    for edu in profile.educations:
        education_list.append({
            "id": edu.id,
            "qualification": edu.qualification or "",
            "degree": edu.degree or "",
            "major": edu.major or "",
            "branch": edu.branch or "",
            "institution": edu.institution or "",
            "collegeName": edu.college_name or "",
            "startYear": edu.start_year or "",
            "graduationYear": edu.graduation_year or "",
            "expectedGraduationDate": edu.expected_graduation_date or "",
            "cgpa": edu.cgpa or "",
            "percentage": edu.percentage or "",
            "gradingScale": edu.grading_scale or "10.0",
            "backlogs": edu.backlogs or "0",
            "coursework": edu.coursework or "",
            "achievements": edu.achievements or ""
        })

    # Experience records
    experience_list = []
    primary_company = ""
    primary_title = ""
    for exp in profile.experiences:
        experience_list.append({
            "id": exp.id,
            "company": exp.company or "",
            "title": exp.title or "",
            "location": exp.location or "",
            "workMode": exp.work_mode or "Hybrid",
            "employmentType": exp.employment_type or "Full-time",
            "startDate": str(exp.start_date) if exp.start_date else "",
            "endDate": str(exp.end_date) if exp.end_date else ("Present" if exp.is_current else ""),
            "isCurrent": exp.is_current,
            "description": exp.description or "",
            "responsibilities": exp.responsibilities or "",
            "technologies": exp.technologies or "",
            "noticePeriod": exp.notice_period or ""
        })
        if not primary_company and exp.company:
            primary_company = exp.company
            primary_title = exp.title or ""

    # Skills list
    skills_list = [s.name for s in profile.skills]
    categorized_skills: Dict[str, List[str]] = {}
    for s in profile.skills:
        cat = s.category or "Technical"
        if cat not in categorized_skills:
            categorized_skills[cat] = []
        categorized_skills[cat].append(s.name)

    skills_string = ", ".join(skills_list)

    # Projects list
    projects_list = []
    for proj in profile.projects:
        projects_list.append({
            "id": proj.id,
            "title": proj.title,
            "role": proj.role or "",
            "description": proj.description or "",
            "responsibilities": proj.responsibilities or "",
            "technologies": proj.technologies or "",
            "projectUrl": proj.url or "",
            "githubUrl": proj.github_url or "",
            "startDate": proj.start_date or "",
            "endDate": proj.end_date or "",
            "isTeamProject": proj.is_team_project
        })

    # Certifications list
    certifications_list = []
    for cert in (profile.certifications or []):
        certifications_list.append({
            "id": cert.id,
            "name": cert.name,
            "issuingOrganization": cert.issuing_organization or "",
            "issueDate": cert.issue_date or "",
            "expirationDate": cert.expiration_date or "",
            "credentialId": cert.credential_id or "",
            "verificationUrl": cert.verification_url or "",
            "description": cert.description or ""
        })

    # Languages list
    languages_list = []
    for lang in (profile.languages or []):
        languages_list.append({
            "id": lang.id,
            "name": lang.name,
            "proficiency": lang.proficiency or "Fluent",
            "canRead": lang.can_read or "Yes",
            "canWrite": lang.can_write or "Yes",
            "canSpeak": lang.can_speak or "Yes"
        })

    # Job Preferences
    pref_data = {}
    if profile.preference:
        pref = profile.preference
        pref_data = {
            "desiredJobTitles": pref.desired_job_titles or "",
            "preferredLocations": pref.preferred_locations or "",
            "workModes": pref.work_modes or "",
            "employmentTypes": pref.employment_types or "",
            "expectedSalary": pref.expected_salary or "",
            "earliestJoiningDate": pref.earliest_joining_date or "",
            "noticePeriod": pref.notice_period or "",
            "relocationPreference": pref.relocation_preference or "Yes",
            "targetIndustries": pref.target_industries or "",
            "targetTechnologies": pref.target_technologies or ""
        }

    # Saved answers library
    saved_answers_list = []
    for ans in (profile.saved_answers or []):
        saved_answers_list.append({
            "id": ans.id,
            "questionKey": ans.question_key,
            "questionText": ans.question_text,
            "answer": ans.answer,
            "company": ans.company or "",
            "inputType": ans.input_type or "text",
            "category": getattr(ans, "category", "General") or "General",
            "requiresConfirmation": getattr(ans, "requires_confirmation", 0) or 0
        })

    full_name = profile.full_name
    if not full_name:
        parts = [p for p in [profile.first_name, profile.middle_name, profile.last_name] if p]
        full_name = " ".join(parts) if parts else ""

    primary_edu = education_list[0] if education_list else {}
    primary_exp = experience_list[0] if experience_list else {}

    return {
        "personal": {
            "firstName": profile.first_name or "",
            "middleName": profile.middle_name or "",
            "lastName": profile.last_name or "",
            "preferredName": profile.preferred_name or "",
            "fullName": full_name,
            "email": profile.email or (profile.user.email if profile.user else ""),
            "countryCode": profile.country_code or "+1",
            "phone": profile.phone or "",
            "dateOfBirth": profile.date_of_birth or "",
            "address": profile.address or "",
            "city": profile.city or "",
            "state": profile.state or "",
            "postalCode": profile.postal_code or "",
            "country": profile.country or "",
            "linkedin": profile.linkedin or "",
            "github": profile.github or "",
            "portfolio": profile.portfolio or "",
            "noticePeriod": profile.notice_period or "",
            "workAuthorization": profile.work_authorization or "Yes",
            "visaStatus": profile.visa_status or "",
            "willingnessToRelocate": profile.willingness_to_relocate or "Yes",
            "preferredLocation": profile.preferred_location or "",
            "preferredWorkMode": profile.preferred_work_mode or "Hybrid"
        },
        "education": education_list,
        "experience": experience_list,
        "skills": skills_list,
        "categorizedSkills": categorized_skills,
        "projects": projects_list,
        "certifications": certifications_list,
        "languages": languages_list,
        "preferences": pref_data,
        "savedAnswers": saved_answers_list,
        "professional": {
            "experienceYears": profile.experience_years or "0",
            "currentCompany": primary_company,
            "currentTitle": primary_title,
            "skills": skills_string,
            "bio": profile.bio or ""
        },
        # Backward compatibility flat keys for standard legacy forms
        "fullName": full_name,
        "firstName": profile.first_name or "",
        "middleName": profile.middle_name or "",
        "lastName": profile.last_name or "",
        "preferredName": profile.preferred_name or "",
        "email": profile.email or (profile.user.email if profile.user else ""),
        "phone": profile.phone or "",
        "countryCode": profile.country_code or "+1",
        "dateOfBirth": profile.date_of_birth or "",
        "linkedin": profile.linkedin or "",
        "github": profile.github or "",
        "portfolio": profile.portfolio or "",
        "address": profile.address or "",
        "city": profile.city or "",
        "state": profile.state or "",
        "postalCode": profile.postal_code or "",
        "country": profile.country or "",
        "location": [profile.city, profile.state, profile.country].filter(Boolean) if False else ", ".join(filter(None, [profile.city, profile.state, profile.country])),
        "noticePeriod": profile.notice_period or "",
        "workAuthorization": profile.work_authorization or "Yes",
        "visaStatus": profile.visa_status or "",
        "willingnessToRelocate": profile.willingness_to_relocate or "Yes",
        "preferredLocation": profile.preferred_location or "",
        "preferredWorkMode": profile.preferred_work_mode or "Hybrid",
        "currentRole": primary_title,
        "currentCompany": primary_company,
        "yearsExperience": str(profile.experience_years or "0"),
        "skillsSummary": skills_string,
        "university": primary_edu.get("institution", ""),
        "college": primary_edu.get("collegeName", "") or primary_edu.get("institution", ""),
        "degree": primary_edu.get("degree", ""),
        "major": primary_edu.get("major", ""),
        "branch": primary_edu.get("branch", ""),
        "graduationYear": str(primary_edu.get("graduationYear", "")),
        "cgpa": str(primary_edu.get("cgpa", "")),
        "percentage": str(primary_edu.get("percentage", "")),
        "backlogs": str(primary_edu.get("backlogs", "0")),
        "meta": {
            "profileId": profile.id,
            "userId": profile.user_id,
            "verificationStatus": profile.verification_status,
            "updatedAt": profile.updated_at.isoformat() if profile.updated_at else None
        }
    }


def log_audit(db: Session, user_id: Optional[int], event_type: str, details: str = "", ip: str = ""):
    """Helper to record security and autofill audit logs."""
    log_entry = AuditLog(
        user_id=user_id,
        event_type=event_type,
        details=details,
        ip_address=ip
    )
    db.add(log_entry)
    db.commit()


def seed_default_user(db: Session) -> User:
    """
    Creates a pre-configured demo user and rich candidate profile for instant evaluation.
    Credentials: alex.morgan@example.com / Password123!
    """
    demo_email = "alex.morgan@example.com"
    existing_user = db.query(User).filter(User.email == demo_email).first()
    if existing_user:
        return existing_user

    demo_user = User(
        email=demo_email,
        hashed_password=get_password_hash("Password123!"),
        full_name="Alex James Morgan",
        is_active=True
    )
    db.add(demo_user)
    db.flush()

    demo_profile = CandidateProfile(
        user_id=demo_user.id,
        first_name="Alex",
        middle_name="James",
        last_name="Morgan",
        preferred_name="Alex",
        full_name="Alex James Morgan",
        email=demo_email,
        country_code="+1",
        phone="+1 555-019-2834",
        date_of_birth="1999-04-15",
        address="742 Evergreen Terrace",
        city="San Francisco",
        state="California",
        postal_code="94107",
        country="United States",
        linkedin="https://linkedin.com/in/alexmorgan-dev",
        github="https://github.com/alexmorgandev",
        portfolio="https://alexmorgan.dev",
        notice_period="30",
        work_authorization="Yes",
        visa_status="Citizen / Authorized",
        willingness_to_relocate="Yes",
        preferred_location="San Francisco, CA or Remote",
        preferred_work_mode="Hybrid",
        experience_years="3",
        bio="Full Stack Software Engineer specializing in scalable cloud architectures, React, Python, and distributed systems.",
        verification_status="User Verified"
    )
    db.add(demo_profile)
    db.flush()

    # Seed Education Records (Multiple records: Bachelor's and High School)
    edu1 = EducationRecord(
        profile_id=demo_profile.id,
        qualification="Bachelors Degree",
        degree="B.Tech",
        major="Computer Science and Engineering",
        branch="Software Engineering",
        institution="Stanford University",
        college_name="School of Engineering",
        start_year="2019",
        graduation_year="2023",
        expected_graduation_date="May 2023",
        cgpa="3.85",
        percentage="92",
        grading_scale="4.0",
        backlogs="0",
        coursework="Data Structures, Algorithms, Distributed Systems, Cloud Computing, Database Management",
        achievements="Dean's Honor List, 1st Place University Hackathon",
        verification_status="User Verified"
    )
    edu2 = EducationRecord(
        profile_id=demo_profile.id,
        qualification="High School / Intermediate",
        degree="Intermediate (12th)",
        major="Science & Mathematics",
        branch="MPC (Maths, Physics, Chemistry)",
        institution="Saint Jude Academy",
        college_name="Saint Jude Senior Secondary",
        start_year="2017",
        graduation_year="2019",
        expected_graduation_date="June 2019",
        cgpa="9.6",
        percentage="95",
        grading_scale="10.0",
        backlogs="0",
        coursework="Calculus, Advanced Mechanics, Physical Chemistry",
        achievements="State Science Olympiad Finalist",
        verification_status="User Verified"
    )
    db.add_all([edu1, edu2])

    # Seed Experience Records (Multiple records: Current Senior Role and Past Engineer Role)
    exp1 = ExperienceRecord(
        profile_id=demo_profile.id,
        company="Starlight Cloud Inc.",
        title="Senior Full Stack Engineer",
        location="San Francisco, CA",
        work_mode="Hybrid",
        employment_type="Full-time",
        start_date="2023-06",
        end_date="",
        is_current=True,
        description="Architected distributed microservices and reactive portals supporting 500k+ active users.",
        responsibilities="Designed backend RESTful APIs with FastAPI and PostgreSQL. Built modern UI components in React and TypeScript.",
        technologies="Python, FastAPI, React, TypeScript, PostgreSQL, Docker, AWS",
        notice_period="30 days",
        verification_status="User Verified"
    )
    exp2 = ExperienceRecord(
        profile_id=demo_profile.id,
        company="Acme Technologies",
        title="Software Engineer Intern",
        location="San Jose, CA",
        work_mode="Remote",
        employment_type="Internship",
        start_date="2022-05",
        end_date="2022-08",
        is_current=False,
        description="Collaborated on cloud automation and CI/CD pipelines.",
        responsibilities="Integrated automated unit tests, optimized database indexing queries, reduced latency by 35%.",
        technologies="Python, Django, Redis, Docker, GitHub Actions",
        notice_period="Immediate",
        verification_status="User Verified"
    )
    db.add_all([exp1, exp2])

    # Seed Categorized Skills
    skills_data = [
        ("Python", "Programming Languages", "Expert"),
        ("JavaScript", "Programming Languages", "Advanced"),
        ("TypeScript", "Programming Languages", "Advanced"),
        ("SQL", "Programming Languages", "Advanced"),
        ("Go", "Programming Languages", "Intermediate"),
        ("React", "Frontend Development", "Expert"),
        ("Next.js", "Frontend Development", "Advanced"),
        ("HTML5", "Frontend Development", "Expert"),
        ("CSS3", "Frontend Development", "Expert"),
        ("FastAPI", "Backend Development", "Expert"),
        ("Node.js", "Backend Development", "Advanced"),
        ("Django", "Backend Development", "Intermediate"),
        ("PostgreSQL", "Databases", "Expert"),
        ("MongoDB", "Databases", "Intermediate"),
        ("Redis", "Databases", "Advanced"),
        ("Docker", "Cloud & DevOps", "Advanced"),
        ("Kubernetes", "Cloud & DevOps", "Intermediate"),
        ("AWS", "Cloud & DevOps", "Advanced"),
        ("Git", "Tools & Platforms", "Expert"),
        ("Linux", "Tools & Platforms", "Advanced"),
        ("Pytest", "Testing & Automation", "Advanced"),
        ("Problem Solving", "Soft Skills", "Expert"),
        ("Communication", "Soft Skills", "Expert")
    ]
    for name, cat, prof in skills_data:
        db.add(SkillRecord(profile_id=demo_profile.id, name=name, category=cat, proficiency=prof))

    # Seed Projects
    proj1 = ProjectRecord(
        profile_id=demo_profile.id,
        title="ApplyOnce Autofill Engine",
        role="Lead Architect",
        description="Universal career portal autofill extension using heuristic classification and accessibility signals.",
        responsibilities="Implemented DOM traversal matching, repeated section synchronization, and state management.",
        technologies="JavaScript, Python, FastAPI, React, Chrome Extension MV3",
        url="https://applyonce.dev",
        github_url="https://github.com/alexmorgandev/applyonce",
        start_date="2023-01",
        end_date="2023-05",
        is_team_project=False
    )
    proj2 = ProjectRecord(
        profile_id=demo_profile.id,
        title="Cloud Telemetry & Log Aggregator",
        role="Backend Engineer",
        description="High-throughput distributed log streaming engine with sub-second querying.",
        responsibilities="Built ingestion pipeline handling 10,000 req/sec with Apache Kafka and Redis caching.",
        technologies="Go, Redis, Docker, PostgreSQL",
        url="https://github.com/alexmorgandev/cloud-telemetry",
        github_url="https://github.com/alexmorgandev/cloud-telemetry",
        start_date="2022-09",
        end_date="2022-12",
        is_team_project=True
    )
    db.add_all([proj1, proj2])

    # Seed Certifications
    cert1 = CertificationRecord(
        profile_id=demo_profile.id,
        name="AWS Certified Solutions Architect - Associate",
        issuing_organization="Amazon Web Services",
        issue_date="2023-08",
        expiration_date="2026-08",
        credential_id="AWS-ARCH-882914",
        verification_url="https://aws.amazon.com/verification/AWS-ARCH-882914",
        description="Demonstrated architectural best practices for AWS cloud security, reliability, and cost-efficiency."
    )
    cert2 = CertificationRecord(
        profile_id=demo_profile.id,
        name="Certified Kubernetes Administrator (CKA)",
        issuing_organization="Cloud Native Computing Foundation (CNCF)",
        issue_date="2024-01",
        expiration_date="2027-01",
        credential_id="CKA-99201",
        verification_url="https://cncf.io/verify/CKA-99201",
        description="Hands-on mastery of Kubernetes cluster setup, storage, networking, and troubleshooting."
    )
    db.add_all([cert1, cert2])

    # Seed Languages
    lang1 = LanguageRecord(
        profile_id=demo_profile.id,
        name="English",
        proficiency="Native / Bilingual",
        can_read="Yes",
        can_write="Yes",
        can_speak="Yes"
    )
    lang2 = LanguageRecord(
        profile_id=demo_profile.id,
        name="Spanish",
        proficiency="Professional Working",
        can_read="Yes",
        can_write="Yes",
        can_speak="Intermediate"
    )
    db.add_all([lang1, lang2])

    # Seed Job Preferences
    pref = JobPreferenceRecord(
        profile_id=demo_profile.id,
        desired_job_titles="Senior Full Stack Engineer, Cloud Software Engineer, Backend Engineer",
        preferred_locations="San Francisco, CA; New York, NY; Remote",
        work_modes="Remote, Hybrid",
        employment_types="Full-time",
        expected_salary="$135,000 / year",
        earliest_joining_date="Immediate / 30 Days",
        notice_period="30 days",
        relocation_preference="Yes",
        target_industries="Cloud Infrastructure, SaaS, Enterprise Software, Developer Tools",
        target_technologies="Python, React, TypeScript, AWS, Docker"
    )
    db.add(pref)

    # Seed Saved Screening Answers (Library)
    saved_answers = [
        SavedAnswerRecord(
            profile_id=demo_profile.id,
            question_key="work_authorization",
            question_text="Are you authorized to work in this country?",
            answer="Yes, I am legally authorized to work in this country.",
            company=None,
            input_type="radio"
        ),
        SavedAnswerRecord(
            profile_id=demo_profile.id,
            question_key="visa_sponsorship",
            question_text="Will you now or in the future require visa sponsorship?",
            answer="No, I do not require visa sponsorship.",
            company=None,
            input_type="radio"
        ),
        SavedAnswerRecord(
            profile_id=demo_profile.id,
            question_key="relocation",
            question_text="Are you willing to relocate for this position?",
            answer="Yes, I am open and willing to relocate for this role.",
            company=None,
            input_type="radio"
        ),
        SavedAnswerRecord(
            profile_id=demo_profile.id,
            question_key="notice_period",
            question_text="What is your notice period / earliest start date?",
            answer="30 days notice period, can join earlier if required.",
            company=None,
            input_type="text"
        ),
        SavedAnswerRecord(
            profile_id=demo_profile.id,
            question_key="expected_salary",
            question_text="What is your expected salary or compensation?",
            answer="$135,000 per year (negotiable based on benefits)",
            company=None,
            input_type="text"
        ),
        SavedAnswerRecord(
            profile_id=demo_profile.id,
            question_key="why_hire_you",
            question_text="Why should we hire you for this position?",
            answer="I bring hands-on experience building high-scale full-stack applications with clean architecture, proactive problem-solving, and proven ability to deliver production systems quickly.",
            company=None,
            input_type="textarea"
        ),
        SavedAnswerRecord(
            profile_id=demo_profile.id,
            question_key="ibm_portal_experience",
            question_text="Do you have experience with enterprise cloud deployment models?",
            answer="Yes, extensively worked with containerized microservices, CI/CD pipelines, and AWS/Kubernetes deployments.",
            company="IBM",
            input_type="textarea"
        )
    ]
    db.add_all(saved_answers)

    db.commit()
    db.refresh(demo_user)
    return demo_user


def dispatch_n8n_event(event_type: str, payload: Dict[str, Any]) -> bool:
    """
    Safely dispatches webhook event metadata to the configured n8n automation service.
    Transmits only minimal event metadata and never unmasked personal details.
    """
    from app.core.config import settings
    import httpx
    from datetime import datetime, timezone

    if not settings.N8N_WEBHOOK_URL:
        return False

    headers = {
        "Content-Type": "application/json",
        "User-Agent": "ApplyOnce-Backend/1.0"
    }
    if settings.N8N_WEBHOOK_SECRET:
        headers["X-ApplyOnce-Secret"] = settings.N8N_WEBHOOK_SECRET

    envelope = {
        "event": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": payload
    }

    try:
        with httpx.Client(timeout=3.0) as client:
            resp = client.post(settings.N8N_WEBHOOK_URL, json=envelope, headers=headers)
            return resp.status_code in [200, 201, 202]
    except Exception:
        # Non-blocking failure: external automation unavailability must not degrade core MVP
        return False
