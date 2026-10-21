// ApplyOnce - Content Script (Autofill Heuristics & Injection)

(function () {
  console.log("[ApplyOnce] Content script active on:", window.location.hostname);

  // Field matching heuristics
  const FIELD_RULES = [
    {
      key: "firstName",
      pattern: /(first[_\s-]?name|given[_\s-]?name|fname)/i,
    },
    {
      key: "lastName",
      pattern: /(last[_\s-]?name|family[_\s-]?name|surname|lname)/i,
    },
    {
      key: "fullName",
      pattern: /(full[_\s-]?name|^name$|candidate[_\s-]?name)/i,
    },
    {
      key: "email",
      pattern: /(email|e-mail|mail)/i,
    },
    {
      key: "phone",
      pattern: /(phone|mobile|telephone|cell|contact[_\s-]?number)/i,
    },
    {
      key: "linkedin",
      pattern: /(linkedin|linked_in)/i,
    },
    {
      key: "github",
      pattern: /(github|git)/i,
    },
    {
      key: "portfolio",
      pattern: /(portfolio|website|personal[_\s-]?site|homepage)/i,
    },
    {
      key: "location",
      pattern: /(location|city|address|residence)/i,
    }
  ];

  // Dispatches events so React/Vue/Angular forms register user input
  function setNativeValue(element, value) {
    if (!element) return;
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));

    // Highlight autofilled field with subtle green glow
    const prevTransition = element.style.transition;
    const prevBorder = element.style.borderColor;
    const prevOutline = element.style.outline;

    element.style.transition = 'border-color 0.4s ease, box-shadow 0.4s ease';
    element.style.borderColor = '#10b981';
    element.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.3)';

    setTimeout(() => {
      element.style.transition = prevTransition;
      element.style.borderColor = prevBorder;
      element.style.boxShadow = prevOutline;
    }, 2500);
  }

  // Detect matching key for an input element
  function identifyInput(input) {
    // Avoid password, submit, hidden inputs
    const type = (input.type || "").toLowerCase();
    if (["password", "submit", "button", "hidden", "file", "checkbox", "radio"].includes(type)) {
      return null;
    }

    const identifiers = [
      input.id,
      input.name,
      input.getAttribute("autocomplete"),
      input.placeholder,
      input.getAttribute("aria-label"),
    ].filter(Boolean).join(" ");

    // Check adjacent or parent label
    let labelText = "";
    if (input.labels && input.labels.length > 0) {
      labelText = Array.from(input.labels).map(l => l.innerText).join(" ");
    } else {
      const parentLabel = input.closest("label");
      if (parentLabel) labelText = parentLabel.innerText;
    }

    const fullContext = `${identifiers} ${labelText}`;

    for (const rule of FIELD_RULES) {
      if (rule.pattern.test(fullContext)) {
        return rule.key;
      }
    }

    return null;
  }

  // Main autofill execution
  function autofillPage(profile) {
    const inputs = document.querySelectorAll("input, textarea");
    let filledCount = 0;

    inputs.forEach((input) => {
      const matchedKey = identifyInput(input);
      if (matchedKey && profile[matchedKey]) {
        // If it's fullName and profile doesn't have it, combine firstName + lastName
        let valueToFill = profile[matchedKey];
        if (matchedKey === "fullName" && !valueToFill && profile.firstName) {
          valueToFill = `${profile.firstName} ${profile.lastName || ""}`.trim();
        }
        
        setNativeValue(input, valueToFill);
        filledCount++;
      }
    });

    showFeedbackBanner(filledCount);
    return filledCount;
  }

  // Floating feedback banner on the target page
  function showFeedbackBanner(count) {
    const existing = document.getElementById("applyonce-toast-banner");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = "applyonce-toast-banner";
    banner.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #111827;
      color: #f9fafb;
      padding: 14px 20px;
      border-radius: 12px;
      border: 1px solid rgba(99, 102, 241, 0.4);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.3);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 9999999;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: applyonceSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    const icon = count > 0 ? "⚡" : "ℹ️";
    const msg = count > 0 
      ? `ApplyOnce: Autofilled ${count} application field${count > 1 ? 's' : ''}!`
      : "ApplyOnce: No compatible application fields detected on this page.";

    banner.innerHTML = `
      <span style="font-size: 18px;">${icon}</span>
      <div>${msg}</div>
    `;

    document.body.appendChild(banner);

    setTimeout(() => {
      banner.style.opacity = "0";
      banner.style.transform = "translateY(10px)";
      banner.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      setTimeout(() => banner.remove(), 400);
    }, 3500);
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "TRIGGER_AUTOFILL") {
      chrome.storage.local.get(["applyonce_profile"], (res) => {
        const profile = res.applyonce_profile || {};
        const count = autofillPage(profile);
        sendResponse({ success: true, count: count });
      });
      return true;
    }
  });
})();
