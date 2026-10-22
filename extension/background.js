// ApplyOnce - Background Service Worker (Manifest V3)
// Syncs candidate profile from the local FastAPI backend using a stored session token.

const API_BASE = "http://127.0.0.1:8000/api/v1";

// Fallback placeholder -- shown until user links their account
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
  workAuthorization: "Yes",
  education: [],
  experience: [],
  skills: [],
  categorizedSkills: {},
  projects: [],
  certifications: [],
  languages: [],
  preferences: {},
  savedAnswers: []
};

// On install: seed empty profile and prompt user to connect
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("[ApplyOnce] Extension installed:", details.reason);
  const existing = await chrome.storage.local.get(["applyonce_profile"]);
  if (!existing.applyonce_profile) {
    await chrome.storage.local.set({ applyonce_profile: EMPTY_PROFILE });
  }
});

// Fetch live profile from backend using stored session token
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
      // Token expired -- clear it so user reconnects
      await chrome.storage.local.remove(["applyonce_token"]);
      console.warn("[ApplyOnce] Token expired. Please reconnect from the dashboard.");
      return null;
    }

    if (!res.ok) {
      console.error("[ApplyOnce] Backend error:", res.status);
      return null;
    }

    const data = await res.json();

    const p = data.personal || {};
    const prof = data.professional || {};
    const exp = data.experience || [];
    const edu = data.education || [];
    const skills = data.skills || [];
    const certs = data.certifications || [];
    const langs = data.languages || [];
    const prefs = data.preferences || {};
    const answers = data.savedAnswers || [];

    const primaryEdu = edu.length > 0 ? edu[0] : {};
    const primaryExp = exp.length > 0 ? exp[0] : {};

    // Combine rich hierarchical structures AND flat autofill-ready keys
    const profile = {
      ...data,
      personal: p,
      education: edu,
      experience: exp,
      skills: skills,
      categorizedSkills: data.categorizedSkills || {},
      projects: data.projects || [],
      certifications: certs,
      languages: langs,
      preferences: prefs,
      savedAnswers: answers,

      // Flat compatibility properties for instant standard form matching
      fullName:              p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim(),
      firstName:             p.firstName || "",
      middleName:            p.middleName || "",
      lastName:              p.lastName || "",
      preferredName:         p.preferredName || "",
      email:                 p.email || "",
      phone:                 p.phone || "",
      countryCode:           p.countryCode || "+1",
      dateOfBirth:           p.dateOfBirth || "",
      linkedin:              p.linkedin || "",
      github:                p.github || "",
      portfolio:             p.portfolio || "",
      address:               p.address || "",
      city:                  p.city || "",
      state:                 p.state || "",
      postalCode:            p.postalCode || "",
      country:               p.country || "",
      location:              [p.city, p.state, p.country].filter(Boolean).join(", "),
      noticePeriod:          p.noticePeriod || "",
      workAuthorization:     p.workAuthorization || "yes",
      visaStatus:            p.visaStatus || "",
      willingnessToRelocate: p.willingnessToRelocate || "yes",
      preferredLocation:     p.preferredLocation || "",
      preferredWorkMode:     p.preferredWorkMode || "Hybrid",
      currentRole:           primaryExp.title || prof.currentTitle || "",
      currentCompany:        primaryExp.company || prof.currentCompany || "",
      yearsExperience:       String(prof.experienceYears || ""),
      skills:                Array.isArray(skills) ? skills.join(", ") : (prof.skills || ""),
      skillsArray:           Array.isArray(skills) ? skills : [],
      bio:                   prof.bio || "",
      university:            primaryEdu.institution || "",
      college:               primaryEdu.collegeName || primaryEdu.institution || "",
      degree:                primaryEdu.degree || primaryEdu.qualification || "",
      major:                 primaryEdu.major || "",
      branch:                primaryEdu.branch || "",
      startYear:             String(primaryEdu.startYear || ""),
      graduationYear:        String(primaryEdu.graduationYear || ""),
      expectedGraduationDate: String(primaryEdu.expectedGraduationDate || ""),
      cgpa:                  String(primaryEdu.cgpa || ""),
      percentage:            String(primaryEdu.percentage || ""),
      backlogs:              String(primaryEdu.backlogs || "0"),
      coursework:            primaryEdu.coursework || "",
      achievements:          primaryEdu.achievements || ""
    };

    await chrome.storage.local.set({ applyonce_profile: profile });
    console.log("[ApplyOnce] Full profile synced from backend with", edu.length, "educations,", exp.length, "experiences,", answers.length, "saved answers.");
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

  if (request.action === "SAVE_ANSWER") {
    (async () => {
      try {
        const stored = await chrome.storage.local.get(["applyonce_token", "applyonce_profile"]);
        const token = stored.applyonce_token;
        const answerData = request.answerData || {};

        if (token) {
          // Send to backend API
          const res = await fetch(`${API_BASE}/profile/saved-answers`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              question_key: answerData.question_key || "custom_field",
              question_text: answerData.question_text || "",
              answer: answerData.answer || "",
              company: answerData.company || null,
              input_type: answerData.input_type || "text"
            })
          });

          if (res.ok) {
            const savedItem = await res.json();
            // Update local storage answers
            const profile = stored.applyonce_profile || {};
            const existingAnswers = profile.savedAnswers || [];
            existingAnswers.push({
              id: savedItem.id,
              questionKey: savedItem.question_key,
              questionText: savedItem.question_text,
              answer: savedItem.answer,
              company: savedItem.company || "",
              inputType: savedItem.input_type || "text"
            });
            profile.savedAnswers = existingAnswers;
            await chrome.storage.local.set({ applyonce_profile: profile });
            return sendResponse({ success: true, answer: savedItem });
          }
        }

        // Offline / local fallback save
        const profile = stored.applyonce_profile || {};
        const existingAnswers = profile.savedAnswers || [];
        existingAnswers.push({
          id: Date.now(),
          questionKey: answerData.question_key || "custom_field",
          questionText: answerData.question_text || "",
          answer: answerData.answer || "",
          company: answerData.company || "",
          inputType: answerData.input_type || "text"
        });
        profile.savedAnswers = existingAnswers;
        await chrome.storage.local.set({ applyonce_profile: profile });
        sendResponse({ success: true, localOnly: true });
      } catch (err) {
        console.warn("[ApplyOnce] Failed to save answer:", err.message);
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  if (request.action === "REPORT_AUTOFILL") {
    (async () => {
      try {
        const stored = await chrome.storage.local.get(["applyonce_token"]);
        const token = stored.applyonce_token;
        if (!token) return sendResponse({ success: false, reason: "no_token" });

        const res = await fetch(`${API_BASE}/extension/autofill-report`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: request.url || "",
            filledCount: request.filledCount || 0,
            skippedCount: request.skippedCount || 0,
            preservedCount: request.preservedCount || 0,
            timestamp: request.timestamp || new Date().toISOString()
          })
        });
        sendResponse({ success: res.ok });
      } catch (err) {
        console.warn("[ApplyOnce] Failed to send autofill telemetry:", err.message);
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }
});
