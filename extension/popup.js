// ApplyOnce - Extension Popup Controller

document.addEventListener("DOMContentLoaded", async () => {
  const profileName    = document.getElementById("profile-name");
  const profileEmail   = document.getElementById("profile-email");
  const profileRole    = document.getElementById("profile-role");
  const avatarInitial  = document.getElementById("avatar-initial");
  const autofillBtn    = document.getElementById("autofill-btn");
  const btnText        = document.getElementById("btn-text");
  const previewBtn     = document.getElementById("preview-btn");
  const previewBtnText = document.getElementById("preview-btn-text");
  const statusMsg      = document.getElementById("status-msg");
  const openDashboardBtn = document.getElementById("open-dashboard-btn");
  const syncBtn        = document.getElementById("sync-btn");
  const tokenSection   = document.getElementById("token-section");
  const tokenInput     = document.getElementById("token-input");
  const connectBtn     = document.getElementById("connect-btn");
  const disconnectBtn  = document.getElementById("disconnect-btn");

  // --- Load saved profile and token ---
  const stored = await chrome.storage.local.get(["applyonce_profile", "applyonce_token"]);
  const profile = stored.applyonce_profile;
  const hasToken = !!stored.applyonce_token;

  updateProfileUI(profile, hasToken);

  // --- Connect (paste token) ---
  if (connectBtn) {
    connectBtn.addEventListener("click", async () => {
      const rawToken = (tokenInput ? tokenInput.value : "").trim();
      if (!rawToken) {
        if (statusMsg) statusMsg.textContent = "Please paste your extension token first.";
        return;
      }

      connectBtn.disabled = true;
      if (statusMsg) statusMsg.textContent = "Connecting...";

      chrome.runtime.sendMessage({ action: "SAVE_TOKEN", token: rawToken }, (res) => {
        connectBtn.disabled = false;
        if (res && res.success && res.profile) {
          updateProfileUI(res.profile, true);
          if (tokenInput) tokenInput.value = "";
          if (statusMsg) statusMsg.textContent = "Connected! Profile synced successfully.";
        } else {
          if (statusMsg) statusMsg.textContent = "Connection failed. Check that the backend is running and your token is valid.";
        }
      });
    });
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
          if (statusMsg) statusMsg.textContent = "Could not connect to current tab.";
          resetButton();
          return;
        }

        if (tab.url && (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("chrome-extension://"))) {
          if (statusMsg) statusMsg.textContent = "Extensions cannot run on internal browser pages.";
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
              if (statusMsg) statusMsg.textContent = "Please refresh the page and try again.";
              resetButton();
            });
          } else {
            handleResponse(response);
          }
        });
      } catch (err) {
        console.error("[ApplyOnce]", err);
        if (statusMsg) statusMsg.textContent = "An unexpected error occurred.";
        resetButton();
      }
    });
  }

  // --- Preview & Review button ---
  if (previewBtn) {
    previewBtn.addEventListener("click", async () => {
      previewBtn.disabled = true;
      if (previewBtnText) previewBtnText.textContent = "Scanning Page...";
      if (statusMsg) statusMsg.textContent = "Opening in-page review drawer...";

      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
          if (statusMsg) statusMsg.textContent = "Could not connect to current tab.";
          resetButtons();
          return;
        }

        if (tab.url && (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("chrome-extension://"))) {
          if (statusMsg) statusMsg.textContent = "Extensions cannot run on internal browser pages.";
          resetButtons();
          return;
        }

        chrome.tabs.sendMessage(tab.id, { action: "PREVIEW_AUTOFILL" }, (res) => {
          if (chrome.runtime.lastError) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["content.js"]
            }).then(() => {
              chrome.tabs.sendMessage(tab.id, { action: "PREVIEW_AUTOFILL" }, (retryRes) => {
                handlePreviewResponse(retryRes);
              });
            }).catch(() => {
              if (statusMsg) statusMsg.textContent = "Please refresh the page and try again.";
              resetButtons();
            });
          } else {
            handlePreviewResponse(res);
          }
        });
      } catch (err) {
        if (statusMsg) statusMsg.textContent = "Error launching preview.";
        resetButtons();
      }
    });
  }

  function handlePreviewResponse(res) {
    if (res && res.success) {
      if (statusMsg) statusMsg.textContent = `Review drawer open: ${res.high || 0} high, ${res.medium || 0} medium, ${res.review || 0} review.`;
      if (previewBtnText) previewBtnText.textContent = "Review Drawer Open";
    } else {
      if (statusMsg) statusMsg.textContent = "No reviewable inputs detected on this page.";
    }
    setTimeout(resetButtons, 3000);
  }

  function resetButtons() {
    if (autofillBtn) autofillBtn.disabled = false;
    if (btnText) btnText.textContent = "Autofill Current Page";
    if (previewBtn) previewBtn.disabled = false;
    if (previewBtnText) previewBtnText.textContent = "Preview & Review Matches";
  }

  // --- Sync button ---
  if (syncBtn) {
    syncBtn.addEventListener("click", async () => {
      syncBtn.disabled = true;
      if (statusMsg) statusMsg.textContent = "Syncing profile from backend...";
      chrome.runtime.sendMessage({ action: "SYNC_PROFILE" }, (res) => {
        if (res && res.success && res.profile) {
          updateProfileUI(res.profile, true);
          if (statusMsg) statusMsg.textContent = "Profile synced successfully!";
        } else {
          if (statusMsg) statusMsg.textContent = "Sync failed. Is the backend running at port 8000?";
        }
        syncBtn.disabled = false;
      });
    });
  }

  // --- Disconnect button ---
  if (disconnectBtn) {
    disconnectBtn.addEventListener("click", () => {
      disconnectBtn.disabled = true;
      chrome.runtime.sendMessage({ action: "DISCONNECT" }, () => {
        updateProfileUI(null, false);
        if (statusMsg) statusMsg.textContent = "Disconnected. Paste a new token to reconnect.";
        disconnectBtn.disabled = false;
      });
    });
  }

  function updateProfileUI(prof, isConnected) {
    if (prof && (prof.fullName || prof.email)) {
      if (profileName)   profileName.textContent  = prof.fullName || "Connected User";
      if (profileEmail)  profileEmail.textContent  = prof.email || "";
      if (profileRole)   profileRole.textContent   = prof.currentRole || "Candidate";
      if (avatarInitial) avatarInitial.textContent = (prof.fullName || prof.email || "?").charAt(0).toUpperCase();
      if (statusMsg)     statusMsg.textContent     = isConnected ? "Connected to backend" : "Using local profile";
    } else {
      if (profileName)  profileName.textContent  = "Not connected";
      if (profileEmail) profileEmail.textContent = "Paste token below to connect";
      if (profileRole)  profileRole.textContent  = "Candidate";
      if (avatarInitial) avatarInitial.textContent = "?";
      if (statusMsg)    statusMsg.textContent     = "Enter your extension token to sync your profile.";
    }

    // Toggle token section and disconnect button
    if (tokenSection) tokenSection.style.display = isConnected ? "none" : "block";
    if (disconnectBtn) disconnectBtn.style.display = isConnected ? "inline-flex" : "none";
    if (syncBtn) syncBtn.style.display = isConnected ? "inline-flex" : "none";
  }

  function handleResponse(res) {
    if (res && res.success) {
      const count = res.count || 0;
      const preserved = res.preserved || 0;
      const unanswered = res.unanswered || 0;
      if (count > 0 || preserved > 0 || unanswered > 0) {
        if (btnText) btnText.textContent = "Autofill Executed!";
        let summary = `Autofilled ${count} field${count === 1 ? "" : "s"}`;
        if (preserved > 0) summary += ` (${preserved} preserved)`;
        if (unanswered > 0) summary += ` • ${unanswered} answer needed`;
        if (statusMsg) statusMsg.textContent = summary;
      } else {
        if (btnText)   btnText.textContent   = "No Fields Found";
        if (statusMsg) statusMsg.textContent = "No supported input fields detected on this page.";
      }
    } else {
      if (statusMsg) statusMsg.textContent = "Autofill trigger sent.";
    }
    setTimeout(resetButton, 3500);
  }

  function resetButton() {
    if (autofillBtn) autofillBtn.disabled = false;
    if (btnText)     btnText.textContent  = "Autofill Current Page";
  }

  // --- Open dashboard (correct port 5173) ---
  if (openDashboardBtn) {
    openDashboardBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: "http://localhost:5173/" });
    });
  }
});
