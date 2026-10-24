# ApplyOnce (EnterOnce-ApplyAll)

**ApplyOnce** is a universal career website autofill Chrome extension and applicant management platform designed to streamline and automate job application submissions across multiple platforms (Greenhouse, Lever, Workday, Taleo, Ashby, and custom enterprise portals).

---

## Architecture Overview

```text
EnterOnceApplyAll/
├── frontend/        # React + Vite web application (Dashboard, Profile, Resume Studio, Settings)
├── backend/         # Python FastAPI service with SQLite, JWT, PyMuPDF, and auto-migrations
├── extension/       # Manifest V3 Chrome Extension (Heuristic DOM parser & autofill engine)
├── automation/      # n8n workflows for telemetry and profile sync events
└── test-fixtures/   # 7 comprehensive ATS application form test suites
```

---

## Key Features

- **Fill Once, Apply Everywhere**: Store all personal credentials, education, multiple work experiences, categorized skills, projects, certifications, and language proficiencies in one single profile.
- **Smart DOM Heuristics Engine**: Detects standard inputs, split names (First/Middle/Last), address breakdowns, select dropdowns, radio groups, and dynamic framework-controlled fields.
- **Multi-Record Section Auto-Expansion**: Automatically triggers "+ Add Another Education" or "+ Add Another Experience" on repeated container forms.
- **Screening Library & Smart Memory**: Saves company-specific and general screening questions (e.g. visa sponsorship, notice period, compensation expectations).
- **Resume Studio & Parser**: Extracts text, emails, phone numbers, and profile details directly from uploaded PDF and DOCX files.
- **Privacy & Security First**: Zero raw personally identifiable information (PII) is transmitted outside your local database environment; automation webhooks only receive anonymized operational metrics.

---

## Getting Started

### 1. Prerequisites
- **Node.js** v18+ & npm
- **Python** 3.10+
- **Google Chrome** (for Manifest V3 extension)

---

### 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   - **Windows**:
     ```powershell
     .venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     source .venv/bin/activate
     ```
3. Verify dependencies are installed:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
5. The API documentation is available at:
   - Swagger UI: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/health`

> **Note**: On startup, the backend automatically performs schema migrations and seeds a rich demo profile for frictionless local testing:
> - **Email**: `alex.morgan@example.com`
> - **Password**: `Password123!`

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.
5. Click **"Quick Demo Login"** on the landing page or login modal to instantly load the pre-seeded candidate profile.

---

### 4. Chrome Extension Installation (Manifest V3)

1. Open Google Chrome and go to `chrome://extensions/`.
2. In the top right corner, toggle **Developer mode** to **ON**.
3. Click the **Load unpacked** button.
4. Select the `extension/` folder in this repository:
   ```text
   C:\Users\Admin\Desktop\EnterOnceApplyAll\extension
   ```
5. Click the puzzle icon in Chrome's toolbar and pin **ApplyOnce**.
6. In the ApplyOnce Web App, navigate to the **Extension** tab, click **"Generate Extension Token"**, and paste it into the extension popup.

---

### 5. Running Test Fixtures & Verifying Autofill

We provide 7 specialized test fixtures simulating real ATS layouts:

1. Open `test-fixtures/application-forms/index.html` in your browser (or click on any form card under the **Extension** tab in the web app).
2. Choose any test form:
   - **Form 1**: Standard Application (Greenhouse / Workday style)
   - **Form 2**: Split Name & Address Breakdown
   - **Form 3**: Dropdown & Select-Heavy
   - **Form 4**: Alternative Labels & Synonyms
   - **Form 5**: Dynamic React / Vue Delayed Render
   - **Form 6**: Multi-Record Repeated Sections (+ Add Another...)
   - **Form 7**: Enterprise Screening & "Answer Needed" Prompt
3. Click the **ApplyOnce** extension icon in Chrome and click **"Autofill Current Page"**.

---

### 6. Running Tests & Production Verification

- **Backend Tests (pytest)**:
  ```powershell
  cd backend
  .venv\Scripts\pytest
  ```
- **Frontend Build Validation**:
  ```powershell
  cd frontend
  npm run build
  ```

---

## Deploying to Vercel

The frontend is fully configured for zero-config deployment to [Vercel](https://vercel.com):

### Option A: Deploy from Monorepo Root (Recommended)
1. Push your repository to GitHub.
2. In Vercel, click **"Add New..."** &rarr; **Project** and select this repository.
3. Keep **Root Directory** as `./` (the root [`vercel.json`](file:///c:/Users/Admin/Desktop/EnterOnceApplyAll/vercel.json) will automatically build `frontend` and route client-side traffic).
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: The public HTTPS URL of your deployed FastAPI backend (e.g., `https://your-api.onrender.com`).
5. Click **Deploy**.

### Option B: Deploy with Root Directory set to `frontend`
1. In Vercel, when importing the project, edit the **Root Directory** setting to `frontend`.
2. The included [`frontend/vercel.json`](file:///c:/Users/Admin/Desktop/EnterOnceApplyAll/frontend/vercel.json) will automatically handle Single-Page Application (SPA) routing.
3. Add `VITE_API_URL` under Environment Variables and click **Deploy**.

