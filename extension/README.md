# ApplyOnce — Chrome Extension (Manifest V3)

This folder contains the **Manifest V3** Chrome extension for ApplyOnce, enabling 1-click universal autofill across job applications and career portals.

---

## Folder Structure

```text
extension/
├── manifest.json       # Manifest V3 configuration & permissions
├── background.js       # Background service worker & profile store
├── content.js          # Heuristic DOM detector & native form autofiller
├── popup.html          # Extension popup user interface
├── popup.css           # Styling for extension popup
├── popup.js            # Controller for tab messaging & autofill trigger
└── icons/              # Extension icons (16px, 48px, 128px)
```

---

## How to Load the Extension in Google Chrome

1. Open Google Chrome.
2. In the address bar, type `chrome://extensions` and press **Enter**.
3. In the top right corner, toggle **Developer mode** to **ON**.
4. Click the **Load unpacked** button in the top left.
5. Select this `extension` folder:
   ```text
   C:\Users\Admin\Desktop\EnterOnceApplyAll\extension
   ```
6. The **ApplyOnce - Universal Career Autofill** extension will now appear in your extensions list.
7. Click the puzzle icon in Chrome's toolbar and pin **ApplyOnce** to your bar.

---

## How to Test Autofill

1. Open the ApplyOnce local frontend: `http://localhost:5173/`
2. Scroll to the **Job Application Form Preview** section (or visit any job board like Greenhouse or Lever).
3. Click the **ApplyOnce** extension icon in your Chrome toolbar.
4. Click **"Autofill Current Page"**.
5. The extension will automatically detect the input fields and fill them with your saved profile!
