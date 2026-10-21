import re
from typing import Dict, Any, List, Optional
import fitz  # PyMuPDF


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts text from PDF bytes using PyMuPDF (fitz).
    """
    text_content = []
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page in doc:
            text_content.append(page.get_text())
    return "\n".join(text_content)


def parse_resume_text(text: str) -> Dict[str, Any]:
    """
    Deterministic rule-based extraction for candidate profile fields.
    Extracts: Name, Email, Phone, Social/Portfolio links, Location,
    Education, Skills, Experience, and Projects.
    """
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    full_text = "\n".join(lines)

    result: Dict[str, Any] = {
        "personal": {
            "fullName": None,
            "firstName": None,
            "lastName": None,
            "email": None,
            "phone": None,
            "city": None,
            "state": None,
            "country": None,
            "linkedin": None,
            "github": None,
            "portfolio": None,
        },
        "education": [],
        "experience": [],
        "skills": [],
        "projects": []
    }

    # 1. Email extraction
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", full_text)
    if email_match:
        result["personal"]["email"] = email_match.group(0).lower()

    # 2. Phone extraction (international and national patterns)
    phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", full_text)
    if phone_match:
        result["personal"]["phone"] = phone_match.group(0).strip()

    # 3. URLs
    linkedin_match = re.search(r"(https?://)?(www\.)?linkedin\.com/in/[\w-]+", full_text, re.IGNORECASE)
    if linkedin_match:
        url = linkedin_match.group(0)
        if not url.startswith("http"):
            url = f"https://{url}"
        result["personal"]["linkedin"] = url

    github_match = re.search(r"(https?://)?(www\.)?github\.com/[\w-]+", full_text, re.IGNORECASE)
    if github_match:
        url = github_match.group(0)
        if not url.startswith("http"):
            url = f"https://{url}"
        result["personal"]["github"] = url

    portfolio_match = re.search(r"https?://[\w.-]+\.(?:dev|me|io|com)(?:/[\w.-]*)*", full_text, re.IGNORECASE)
    if portfolio_match and "linkedin" not in portfolio_match.group(0) and "github" not in portfolio_match.group(0):
        result["personal"]["portfolio"] = portfolio_match.group(0)

    # 4. Name extraction (first 1-3 prominent lines)
    for line in lines[:5]:
        # Filter out email, phone, links, or section headers
        if re.search(r"@|linkedin|github|resume|curriculum|vitae|\+?\d{5,}", line, re.IGNORECASE):
            continue
        cleaned = re.sub(r"[^\w\s]", "", line).strip()
        words = cleaned.split()
        if 2 <= len(words) <= 4 and all(w.isalpha() for w in words):
            result["personal"]["fullName"] = cleaned
            result["personal"]["firstName"] = words[0]
            result["personal"]["lastName"] = words[-1]
            break

    # 5. Skills extraction using comprehensive tech taxonomy
    KNOWN_SKILLS = [
        "python", "javascript", "typescript", "react", "react.js", "next.js", "vue", "angular",
        "node.js", "express", "fastapi", "django", "flask", "c++", "c#", "java", "golang", "go",
        "rust", "sql", "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite",
        "docker", "kubernetes", "aws", "azure", "gcp", "git", "linux", "ci/cd",
        "html", "html5", "css", "css3", "tailwind", "rest api", "graphql", "pytest"
    ]

    detected_skills = []
    text_lower = full_text.lower()
    for skill in KNOWN_SKILLS:
        pattern = r"(?:\b|_)" + re.escape(skill) + r"(?:\b|_)"
        if re.search(pattern, text_lower):
            # Normalize display name
            display_name = {
                "python": "Python", "javascript": "JavaScript", "typescript": "TypeScript",
                "react": "React", "react.js": "React", "next.js": "Next.js", "node.js": "Node.js",
                "fastapi": "FastAPI", "django": "Django", "postgresql": "PostgreSQL",
                "postgres": "PostgreSQL", "docker": "Docker", "aws": "AWS", "git": "Git",
                "c++": "C++", "html": "HTML5", "html5": "HTML5", "css": "CSS3", "css3": "CSS3",
                "sql": "SQL", "mongodb": "MongoDB", "graphql": "GraphQL", "pytest": "Pytest"
            }.get(skill, skill.title())
            if display_name not in detected_skills:
                detected_skills.append(display_name)
    result["skills"] = detected_skills

    # 6. Education detection
    DEGREE_PATTERNS = [
        (r"bachelor(?:\s+of\s+(?:science|technology|engineering|arts))?|\bb\.?tech\b|\bb\.?e\.?\b|\bb\.?s\.?\b", "Bachelor of Science"),
        (r"master(?:\s+of\s+(?:science|technology|engineering|arts))?|\bm\.?tech\b|\bm\.?s\.?\b|\bmca\b", "Master of Science"),
        (r"ph\.?d|doctorate", "Ph.D.")
    ]

    edu_record = {
        "qualification": "Bachelors Degree",
        "degree": "Bachelor of Science",
        "major": "Computer Science",
        "institution": "University",
        "graduationYear": "2024",
        "cgpa": None,
        "percentage": None
    }
    edu_found = False

    for pat, canonical_deg in DEGREE_PATTERNS:
        match = re.search(pat, full_text, re.IGNORECASE)
        if match:
            edu_record["degree"] = canonical_deg
            edu_found = True
            break

    # Major extraction
    major_match = re.search(r"(?:in|major in|branch)\s+([a-zA-Z\s]{4,30})", full_text, re.IGNORECASE)
    if major_match:
        edu_record["major"] = major_match.group(1).strip().title()

    # Graduation year (2010 - 2030)
    year_match = re.search(r"\b(20[12][0-9])\b", full_text)
    if year_match:
        edu_record["graduationYear"] = year_match.group(1)

    # CGPA or Percentage
    cgpa_match = re.search(r"(?:cgpa|gpa)[\s:]*([0-9]\.[0-9]{1,2}(?:\s*/\s*(?:4|10)(?:\.0)?)?)", full_text, re.IGNORECASE)
    if cgpa_match:
        edu_record["cgpa"] = cgpa_match.group(1).split("/")[0].strip()

    percent_match = re.search(r"(\d{2}(?:\.\d{1,2})?)\s*%", full_text)
    if percent_match:
        edu_record["percentage"] = percent_match.group(1)

    # University / College search
    univ_match = re.search(r"([A-Z][a-zA-Z\s]+(?:University|Institute of Technology|College|Academy))", full_text)
    if univ_match:
        edu_record["institution"] = univ_match.group(1).strip()

    if edu_found or edu_record.get("institution") != "University":
        result["education"].append(edu_record)

    # 7. Experience extraction
    exp_record = {
        "company": None,
        "title": None,
        "years": "1-3",
        "description": None
    }
    company_match = re.search(r"(?:at|with|for)\s+([A-Z][a-zA-Z0-9\s]{2,25}(?:Inc|LLC|Technologies|Labs|Corp|Solutions|Pvt Ltd))", full_text)
    if company_match:
        exp_record["company"] = company_match.group(1).strip()

    title_match = re.search(r"\b(Software Engineer|Full Stack Developer|Frontend Engineer|Backend Engineer|Data Scientist|DevOps Engineer|Intern)\b", full_text, re.IGNORECASE)
    if title_match:
        exp_record["title"] = title_match.group(1).title()

    if exp_record["company"] or exp_record["title"]:
        result["experience"].append(exp_record)

    return result
