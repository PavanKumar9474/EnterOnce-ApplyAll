# Automation (n8n Workflows)

ApplyOnce integrates with **n8n** for event-driven automation pipelines, application tracking telemetry, and real-time alerts.

---

## Workflows Included

### 1. `workflow_a_profile_sync.json` — Profile Sync Event
- **Endpoint**: `/applyonce-profile-updated`
- **Trigger**: Dispatched automatically by the FastAPI backend when a candidate updates their profile.
- **Payload Schema**:
  ```json
  {
    "event": "PROFILE_UPDATED",
    "timestamp": "2026-10-23T07:30:00Z",
    "data": {
      "user_id": 1,
      "profile_id": 1,
      "verification_status": "complete"
    }
  }
  ```
- **Processing**:
  - Validates `X-ApplyOnce-Secret` against `APPLYONCE_WEBHOOK_SECRET`.
  - Verifies event type is `PROFILE_UPDATED`.
  - Sanitizes payload to ensure **zero unmasked personal data** is retained or forwarded.
  - Returns `200 OK` (`{ "status": "accepted", "event": "PROFILE_UPDATED" }`) or `401 Unauthorized`.

---

### 2. `workflow_b_application_tracking.json` — Application Tracking Telemetry
- **Endpoint**: `/applyonce-application-tracked`
- **Trigger**: Dispatched when the Chrome extension autofills an application form on any career site or test fixture.
- **Payload Schema**:
  ```json
  {
    "event": "APPLICATION_TRACKED",
    "timestamp": "2026-10-23T07:30:00Z",
    "data": {
      "user_id": 1,
      "url": "https://boards.greenhouse.io/example/jobs/12345",
      "filled_count": 14,
      "skipped_count": 0
    }
  }
  ```
- **Processing**:
  - Validates secret header and event name.
  - Validates target URL format.
  - Enforces replay protection: rejects events older than 5 minutes.
  - Records application statistics and responds with `200 OK` (`{ "status": "recorded", "event": "APPLICATION_TRACKED" }`).

---

## How to Import & Run in n8n

1. **Start n8n**:
   ```bash
   npx n8n
   ```
2. **Access n8n Editor**:
   Open `http://localhost:5678` in your browser.
3. **Import Workflows**:
   - In n8n, click **Workflows** &rarr; **Import from File...**
   - Select `workflow_a_profile_sync.json` and `workflow_b_application_tracking.json`.
4. **Set Webhook Secret**:
   - Add environment variable `APPLYONCE_WEBHOOK_SECRET=your-shared-secret` in your n8n environment.
   - In `backend/.env`, set:
     ```env
     N8N_WEBHOOK_URL="http://localhost:5678/webhook/applyonce-profile-updated"
     N8N_WEBHOOK_SECRET="your-shared-secret"
     ```
5. **Activate the Workflows**:
   Toggle the active switch in n8n for each workflow.

---

## Security & Privacy Architecture
- **Header Authentication**: All requests require the secret matching `X-ApplyOnce-Secret`.
- **Zero Raw PII Exposure**: Telemetry only carries operational counts and IDs, keeping user personal information strictly in local database storage.

