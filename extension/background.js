// ApplyOnce — Background Service Worker (Manifest V3)
// Syncs candidate profile from the local FastAPI backend using a stored session token.

const API_BASE = "http://127.0.0.1:8001/api/v1";

// Fallback placeholder — shown until user links their account
const EMPTY_PROFILE = {
  fullName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  location: "",
  currentRole: "",
  yearsExperience: "",
  workAuthorization: ""
};

// On install: seed empty profile and prompt user to connect
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("[ApplyOnce] Extension installed:", details.reason);
  const existing = await chrome.storage.local.get(["applyonce_profile"]);
  if (!existing.applyonce_profile) {
    await chrome.storage.local.set({ applyonce_profile: EMPTY_PROFILE });
  }
});

// Fetch live profile from backend using stored JWT token
async function syncProfileFromBackend() {
  const stored = await chrome.storage.local.get(["applyonce_token"]);
  const token = stored.applyonce_token;
  if (!token) {
    console.log("[ApplyOnce] No token stored. Open dashboard to connect your account.");
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/extension/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (res.status === 401 || res.status === 403) {
      // Token expired — clear it so user reconnects
      await chrome.storage.local.remove(["applyonce_token"]);
      console.warn("[ApplyOnce] Token expired. Please reconnect from the dashboard.");
      return null;
    }

    if (!res.ok) {
      console.error("[ApplyOnce] Backend error:", res.status);
      return null;
    }

    const data = await res.json();

    // Flatten nested backend profile into flat autofill-ready format
    const profile = {
      fullName:          data.full_name || `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      firstName:         data.first_name || "",
      lastName:          data.last_name || "",
      email:             data.email || "",
      phone:             data.phone || "",
      linkedin:          data.linkedin || "",
      github:            data.github || "",
      portfolio:         data.portfolio || "",
      location:          [data.city, data.state, data.country].filter(Boolean).join(", "),
      currentRole:       (data.experiences && data.experiences[0]?.title) || "",
      yearsExperience:   data.experience_years || "",
      workAuthorization: data.work_authorization || ""
    };

    await chrome.storage.local.set({ applyonce_profile: profile });
    console.log("[ApplyOnce] Profile synced from backend.", profile);
    return profile;
  } catch (err) {
    console.error("[ApplyOnce] Failed to reach backend:", err.message);
    return null;
  }
}

// Message hub: popup and content script communicate through here
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_PROFILE") {
    chrome.storage.local.get(["applyonce_profile"]).then((res) => {
      sendResponse({ success: true, profile: res.applyonce_profile || EMPTY_PROFILE });
    });
    return true;
  }

  if (request.action === "SAVE_PROFILE") {
    chrome.storage.local.set({ applyonce_profile: request.profile }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === "SAVE_TOKEN") {
    // Called by popup.js when user pastes their session token
    chrome.storage.local.set({ applyonce_token: request.token }).then(async () => {
      const profile = await syncProfileFromBackend();
      sendResponse({ success: !!profile, profile });
    });
    return true;
  }

  if (request.action === "SYNC_PROFILE") {
    syncProfileFromBackend().then((profile) => {
      sendResponse({ success: !!profile, profile });
    });
    return true;
  }

  if (request.action === "DISCONNECT") {
    chrome.storage.local.remove(["applyonce_token", "applyonce_profile"]).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});
