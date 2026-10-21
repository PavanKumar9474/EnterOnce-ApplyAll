// ApplyOnce — Extension Popup Controller

document.addEventListener("DOMContentLoaded", async () => {
  const profileName    = document.getElementById("profile-name");
  const profileEmail   = document.getElementById("profile-email");
  const profileRole    = document.getElementById("profile-role");
  const avatarInitial  = document.getElementById("avatar-initial");
  const autofillBtn    = document.getElementById("autofill-btn");
  const btnText        = document.getElementById("btn-text");
  const statusMsg      = document.getElementById("status-msg");
  const openDashboardBtn = document.getElementById("open-dashboard-btn");

  // --- Load saved profile and token ---
  const stored = await chrome.storage.local.get(["applyonce_profile", "applyonce_token"]);
  const profile = stored.applyonce_profile;
  const hasToken = !!stored.applyonce_token;

  if (profile && profile.fullName) {
    if (profileName)   profileName.textContent  = profile.fullName;
    if (profileEmail)  profileEmail.textContent  = profile.email || "";
    if (profileRole)   profileRole.textContent   = profile.currentRole || "Candidate";
    if (avatarInitial) avatarInitial.textContent = profile.fullName.charAt(0).toUpperCase();
    if (statusMsg) statusMsg.textContent = hasToken ? "Connected to backend ✓" : "Using local profile";
  } else {
    if (profileName)  profileName.textContent  = "Not connected";
    if (profileEmail) profileEmail.textContent = "Open dashboard to connect";
    if (statusMsg)    statusMsg.textContent     = "Click 'Open Dashboard' to link your account.";
  }

  // --- Autofill button ---
  if (autofillBtn) {
    autofillBtn.addEventListener("click", async () => {
      autofillBtn.disabled = true;
      if (btnText) btnText.textContent = "Detecting & Filling...";
      if (statusMsg) statusMsg.textContent = "Scanning page for application fields...";

      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
          if (statusMsg) statusMsg.textContent = "⚠️ Could not connect to current tab.";
          resetButton();
          return;
        }

        if (tab.url && (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("chrome-extension://"))) {
          if (statusMsg) statusMsg.textContent = "⚠️ Extensions cannot run on internal browser pages.";
          resetButton();
          return;
        }

        chrome.tabs.sendMessage(tab.id, { action: "TRIGGER_AUTOFILL" }, (response) => {
          if (chrome.runtime.lastError) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["content.js"]
            }).then(() => {
              chrome.tabs.sendMessage(tab.id, { action: "TRIGGER_AUTOFILL" }, (retryRes) => {
                handleResponse(retryRes);
              });
            }).catch(() => {
              if (statusMsg) statusMsg.textContent = "⚠️ Please refresh the page and try again.";
              resetButton();
            });
          } else {
            handleResponse(response);
          }
        });
      } catch (err) {
        console.error("[ApplyOnce]", err);
        if (statusMsg) statusMsg.textContent = "⚠️ An unexpected error occurred.";
        resetButton();
      }
    });
  }

  // --- Sync button (if present) ---
  const syncBtn = document.getElementById("sync-btn");
  if (syncBtn) {
    syncBtn.addEventListener("click", async () => {
      syncBtn.disabled = true;
      if (statusMsg) statusMsg.textContent = "Syncing profile from backend...";
      chrome.runtime.sendMessage({ action: "SYNC_PROFILE" }, (res) => {
        if (res && res.success && res.profile) {
          if (profileName)   profileName.textContent  = res.profile.fullName || "Synced";
          if (profileEmail)  profileEmail.textContent  = res.profile.email || "";
          if (profileRole)   profileRole.textContent   = res.profile.currentRole || "Candidate";
          if (avatarInitial) avatarInitial.textContent = (res.profile.fullName || "?").charAt(0).toUpperCase();
          if (statusMsg)     statusMsg.textContent     = "Profile synced! ✓";
        } else {
          if (statusMsg) statusMsg.textContent = "⚠️ Sync failed. Is the backend running?";
        }
        syncBtn.disabled = false;
      });
    });
  }

  function handleResponse(res) {
    if (res && res.success) {
      const count = res.count || 0;
      if (count > 0) {
        if (btnText)   btnText.textContent   = "✨ Autofill Complete!";
        if (statusMsg) statusMsg.textContent = `Populated ${count} field${count > 1 ? "s" : ""}!`;
      } else {
        if (btnText)   btnText.textContent   = "No Fields Found";
        if (statusMsg) statusMsg.textContent = "No supported input fields detected.";
      }
    } else {
      if (statusMsg) statusMsg.textContent = "Autofill trigger sent.";
    }
    setTimeout(resetButton, 2500);
  }

  function resetButton() {
    if (autofillBtn) autofillBtn.disabled = false;
    if (btnText)     btnText.textContent  = "Autofill Current Page";
  }

  // --- Open dashboard ---
  if (openDashboardBtn) {
    openDashboardBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: "http://localhost:5174/" });
    });
  }
});
