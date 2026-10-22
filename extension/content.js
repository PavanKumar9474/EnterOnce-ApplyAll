// ApplyOnce - Adaptive Job Application Assistant Content Script
// Multi-record repeated sections engine, Confidence-based matching,
// React Synthetic event support, In-page Preview Drawer, and Universal Heuristics

(function () {
  console.log("[ApplyOnce] Adaptive Content Script active on:", window.location.hostname);

  // Comprehensive field matching heuristics ranked by specificity
  const FIELD_RULES = [
    // Personal & Identity
    { key: "firstName", section: "personal", pattern: /(first[_\s-]?name|given[_\s-]?name|fname|^forename$)/i },
    { key: "lastName", section: "personal", pattern: /(last[_\s-]?name|family[_\s-]?name|surname|lname)/i },
    { key: "middleName", section: "personal", pattern: /(middle[_\s-]?name|mname)/i },
    { key: "preferredName", section: "personal", pattern: /(preferred[_\s-]?name|nickname|known[_\s-]?as)/i },
    { key: "fullName", section: "personal", pattern: /(full[_\s-]?name|^name$|candidate[_\s-]?name|cand[_\s-]?name|applicant[_\s-]?name)/i },
    { key: "email", section: "personal", pattern: /(email|e-mail|mail[_\s-]?address|^email$)/i },
    { key: "countryCode", section: "personal", pattern: /(country[_\s-]?code|calling[_\s-]?code|dialing[_\s-]?code|phone[_\s-]?code)/i },
    { key: "phone", section: "personal", pattern: /(phone|mobile|telephone|cell|contact[_\s-]?number|tel[_\s-]?no)/i },
    { key: "dateOfBirth", section: "personal", pattern: /(date[_\s-]?of[_\s-]?birth|birth[_\s-]?date|^dob$)/i },

    // Social & Portfolios
    { key: "linkedin", section: "personal", pattern: /(linkedin|linked_in|li[_\s-]?profile)/i },
    { key: "github", section: "personal", pattern: /(github|git[_\s-]?profile|git[_\s-]?repo)/i },
    { key: "portfolio", section: "personal", pattern: /(portfolio|website|personal[_\s-]?site|homepage|web[_\s-]?url)/i },

    // Location & Address
    { key: "address", section: "personal", pattern: /(street[_\s-]?address|^address$|address[_\s-]?line[_\s-]?1|residence[_\s-]?address)/i },
    { key: "city", section: "personal", pattern: /(^city$|current[_\s-]?city|town|residence[_\s-]?city)/i },
    { key: "state", section: "personal", pattern: /(^state$|province|region|state[_\s-]?province)/i },
    { key: "postalCode", section: "personal", pattern: /(postal[_\s-]?code|zip[_\s-]?code|pincode|pin[_\s-]?code)/i },
    { key: "country", section: "personal", pattern: /(^country$|nation|residence[_\s-]?country|nationality)/i },
    { key: "location", section: "personal", pattern: /(location|city|residence)/i },

    // Work Eligibility & Preferences
    { key: "workAuthorization", section: "preference", pattern: /(work[_\s-]?authorization|legally[_\s-]?authorized|authorized[_\s-]?to[_\s-]?work|legal[_\s-]?right[_\s-]?to[_\s-]?work)/i },
    { key: "visaSponsorship", section: "preference", pattern: /(sponsorship|require[_\s-]?visa|need[_\s-]?sponsorship|immigration[_\s-]?status|visa[_\s-]?status)/i },
    { key: "willingnessToRelocate", section: "preference", pattern: /(willing[_\s-]?to[_\s-]?relocate|willingness[_\s-]?to[_\s-]?relocate|relocation[_\s-]?preference|open[_\s-]?to[_\s-]?relocate)/i },
    { key: "preferredLocation", section: "preference", pattern: /(preferred[_\s-]?location|desired[_\s-]?location|work[_\s-]?location)/i },
    { key: "preferredWorkMode", section: "preference", pattern: /(work[_\s-]?mode|remote[_\s-]?preference|hybrid[_\s-]?onsite|workplace[_\s-]?type)/i },
    { key: "noticePeriod", section: "preference", pattern: /(notice[_\s-]?period|notice[_\s-]?days|earliest[_\s-]?start[_\s-]?date|when[_\s-]?can[_\s-]?you[_\s-]?join|availability)/i },
    { key: "expectedSalary", section: "preference", pattern: /(expected[_\s-]?salary|desired[_\s-]?salary|expected[_\s-]?ctc|compensation[_\s-]?expectation|expected[_\s-]?compensation|salary[_\s-]?expectation)/i },

    // Education Specific Heuristics (Multi-record capable)
    { key: "university", section: "education", pattern: /(university|institution|school[_\s-]?name|uni[_\s-]?name|board[_\s-]?name|alma[_\s-]?mater)/i },
    { key: "college", section: "education", pattern: /(college|college[_\s-]?name|campus)/i },
    { key: "degree", section: "education", pattern: /(highest[_\s-]?degree|^degree$|qualification|level[_\s-]?of[_\s-]?education|education[_\s-]?level|course[_\s-]?name|program[_\s-]?of[_\s-]?study)/i },
    { key: "major", section: "education", pattern: /(major|field[_\s-]?of[_\s-]?study|specialization|discipline|stream)/i },
    { key: "branch", section: "education", pattern: /(branch|engineering[_\s-]?branch|department)/i },
    { key: "startYear", section: "education", pattern: /(edu[_\s-]?start|start[_\s-]?year|joining[_\s-]?year|year[_\s-]?of[_\s-]?joining|education[_\s-]?start)/i },
    { key: "graduationYear", section: "education", pattern: /(graduation[_\s-]?year|passing[_\s-]?year|year[_\s-]?of[_\s-]?passing|passing[_\s-]?yr|end[_\s-]?year|completion[_\s-]?year|grad[_\s-]?year)/i },
    { key: "expectedGraduationDate", section: "education", pattern: /(expected[_\s-]?graduation|expected[_\s-]?passing)/i },
    { key: "cgpa", section: "education", pattern: /(cgpa|c\.g\.p\.a|cumulative[_\s-]?gpa|^gpa[_\s-]?score|^gpa$)/i },
    { key: "percentage", section: "education", pattern: /(percentage|percent[_\s-]?score|aggregate[_\s-]?%|marks[_\s-]?percentage)/i },
    { key: "gradingScale", section: "education", pattern: /(grading[_\s-]?scale|gpa[_\s-]?scale|out[_\s-]?of)/i },
    { key: "backlogs", section: "education", pattern: /(backlog|standing[_\s-]?arrears|active[_\s-]?backlogs|number[_\s-]?of[_\s-]?backlogs)/i },
    { key: "coursework", section: "education", pattern: /(coursework|relevant[_\s-]?courses|subjects)/i },
    { key: "academicAchievements", section: "education", pattern: /(academic[_\s-]?achievements|honors|awards)/i },

    // Work Experience Specific Heuristics (Multi-record capable)
    { key: "yearsExperience", section: "experience", pattern: /(years[_\s-]?of[_\s-]?experience|total[_\s-]?experience|experience[_\s-]?years|work[_\s-]?experience[_\s-]?years)/i },
    { key: "currentRole", section: "experience", pattern: /(current[_\s-]?role|current[_\s-]?title|position[_\s-]?title|job[_\s-]?title|^designation$|^title$)/i },
    { key: "currentCompany", section: "experience", pattern: /(current[_\s-]?company|present[_\s-]?employer|employer|company[_\s-]?name|organization|^company$)/i },
    { key: "jobLocation", section: "experience", pattern: /(job[_\s-]?location|office[_\s-]?location|work[_\s-]?location|employment[_\s-]?location)/i },
    { key: "jobStartDate", section: "experience", pattern: /(job[_\s-]?start|employment[_\s-]?start|date[_\s-]?from|start[_\s-]?date)/i },
    { key: "jobEndDate", section: "experience", pattern: /(job[_\s-]?end|employment[_\s-]?end|date[_\s-]?to|end[_\s-]?date)/i },
    { key: "jobResponsibilities", section: "experience", pattern: /(responsibilities|job[_\s-]?duties|role[_\s-]?description|key[_\s-]?contributions|duties)/i },
    { key: "jobTechnologies", section: "experience", pattern: /(technologies[_\s-]?used|tools[_\s-]?used|tech[_\s-]?stack[_\s-]?used)/i },

    // Skills & Bio
    { key: "skills", section: "skills", pattern: /(skills|key[_\s-]?skills|technologies|tech[_\s-]?stack|core[_\s-]?competencies)/i },
    { key: "bio", section: "personal", pattern: /(cover[_\s-]?letter|bio|summary|about[_\s-]?yourself|profile[_\s-]?summary|brief[_\s-]?overview)/i },

    // Common Screening Questions
    { key: "whyWorkHere", section: "screening", pattern: /(why[_\s-]?do[_\s-]?you[_\s-]?want[_\s-]?to[_\s-]?work|interest[_\s-]?in[_\s-]?company|why[_\s-]?join[_\s-]?us)/i },
    { key: "whyHireYou", section: "screening", pattern: /(why[_\s-]?should[_\s-]?we[_\s-]?hire[_\s-]?you|what[_\s-]?makes[_\s-]?you[_\s-]?a[_\s-]?good[_\s-]?fit|value[_\s-]?you[_\s-]?bring)/i },
    { key: "relevantExperienceDesc", section: "screening", pattern: /(describe[_\s-]?your[_\s-]?relevant[_\s-]?experience|briefly[_\s-]?describe[_\s-]?experience)/i }
  ];

  // Dispatches events so modern reactive UI frameworks (React, Vue, Angular) detect user input
  function setNativeValue(element, value) {
    if (!element || value === undefined || value === null) return false;
    const prevValue = element.value;

    // React 16+ SyntheticEvent valueTracker synchronization
    if (element._valueTracker) {
      element._valueTracker.setValue(prevValue || "");
    }

    const valueSetter = Object.getOwnPropertyDescriptor(element, "value")?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new Event("blur", { bubbles: true }));

    highlightElement(element);
    return element.value === String(value);
  }

  function highlightElement(element) {
    if (!element) return;
    const prevTransition = element.style.transition;
    const prevBorder = element.style.borderColor;
    const prevBoxShadow = element.style.boxShadow;

    element.style.transition = "border-color 0.4s ease, box-shadow 0.4s ease";
    element.style.borderColor = "#10b981";
    element.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.35)";

    setTimeout(() => {
      element.style.transition = prevTransition;
      element.style.borderColor = prevBorder;
      element.style.boxShadow = prevBoxShadow;
    }, 2500);
  }

  // Matches dropdown option by exact, normalized abbreviation, or fuzzy substring match
  function setSelectValue(selectElement, targetValue) {
    if (!selectElement || targetValue === undefined || targetValue === null) return false;
    const targetLower = String(targetValue).toLowerCase().trim();
    let matchedIndex = -1;

    // Normalization aliases
    const aliases = {
      "bachelor of science": ["b.s.", "bs", "b.sc", "bsc", "bachelor"],
      "bachelor of technology": ["b.tech", "btech", "bachelor"],
      "master of science": ["m.s.", "ms", "m.sc", "msc", "master"],
      "computer science": ["cs", "cse", "computer sci", "computer engineering"],
      "hybrid": ["hybrid", "flexible", "hybrid / remote"],
      "remote": ["remote", "work from home", "wfh"],
      "yes": ["yes", "authorized", "eligible", "true", "1"],
      "no": ["no", "require sponsorship", "need sponsorship", "false", "0"]
    };

    // 1. Exact match on option value or text
    for (let i = 0; i < selectElement.options.length; i++) {
      const opt = selectElement.options[i];
      const text = opt.text.toLowerCase().trim();
      const val = opt.value.toLowerCase().trim();
      if (!val && !text) continue;
      if (val === targetLower || text === targetLower) {
        matchedIndex = i;
        break;
      }
    }

    // 2. Alias mapping match
    if (matchedIndex === -1) {
      for (const [canonical, syns] of Object.entries(aliases)) {
        if (targetLower.includes(canonical) || syns.some(s => targetLower === s || targetLower.includes(s))) {
          for (let i = 0; i < selectElement.options.length; i++) {
            const opt = selectElement.options[i];
            const text = opt.text.toLowerCase().trim();
            const val = opt.value.toLowerCase().trim();
            if (val === canonical || text === canonical || syns.some(s => text === s || val === s || text.includes(s))) {
              matchedIndex = i;
              break;
            }
          }
        }
        if (matchedIndex !== -1) break;
      }
    }

    // 3. Substring match
    if (matchedIndex === -1) {
      for (let i = 0; i < selectElement.options.length; i++) {
        const opt = selectElement.options[i];
        const text = opt.text.toLowerCase().trim();
        const val = opt.value.toLowerCase().trim();
        if (!val && !text) continue;
        if (text.includes(targetLower) || targetLower.includes(text) || (val && targetLower.includes(val))) {
          matchedIndex = i;
          break;
        }
      }
    }

    if (matchedIndex !== -1) {
      if (selectElement._valueTracker) {
        selectElement._valueTracker.setValue("");
      }
      selectElement.selectedIndex = matchedIndex;
      selectElement.dispatchEvent(new Event("change", { bubbles: true }));
      selectElement.dispatchEvent(new Event("input", { bubbles: true }));
      highlightElement(selectElement);
      return true;
    }
    return false;
  }

  // Detect record index for multi-record sections (e.g. education #1 vs #2, work experience #1 vs #2)
  function determineRecordIndex(input, sectionType) {
    const nameOrId = `${input.name || ""} ${input.id || ""}`;

    // A. Explicit numbered suffix/prefix in name or ID (e.g. university_1, degree_2, company_1, title_2)
    // Matches: university_1, grad_year_2, schools[1].name, exp_0
    const explicitNum = nameOrId.match(/(?:education|edu|degree|school|university|experience|exp|job|company)[^\d]*(\d+)/i) ||
                        nameOrId.match(/[_\-\[\.](\d+)[\]_\-\.]?$/i);
    if (explicitNum) {
      const num = parseInt(explicitNum[1], 10);
      // If 1-based index (e.g. 1, 2) convert to 0-based; if already 0-based keep 0
      return num > 0 ? num - 1 : 0;
    }

    // B. Check enclosing section containers
    const selector = sectionType === "education"
      ? ".education-section, .education-item, [data-section='education'], .edu-record, [data-record='education']"
      : ".experience-section, .experience-item, [data-section='experience'], .exp-record, [data-record='experience']";

    const container = input.closest(selector);
    if (container) {
      const allContainers = Array.from(document.querySelectorAll(selector));
      const idx = allContainers.indexOf(container);
      if (idx !== -1) return idx;
    }

    // C. Enclosing cards or fieldsets with text indicator (e.g. "Education Record #2")
    const card = input.closest(".record-card, fieldset, .card, .form-section, div[class*='record'], div[class*='section']");
    if (card) {
      const headerText = (card.querySelector(".record-header, legend, h3, h4, h5, .title")?.innerText || card.innerText.slice(0, 100)).toLowerCase();
      const numMatch = headerText.match(/(?:education|experience|record|degree|job)[^\d]*#?\s*(\d+)/i);
      if (numMatch) {
        const num = parseInt(numMatch[1], 10);
        return num > 0 ? num - 1 : 0;
      }
    }

    return 0;
  }

  // Calculate confidence score for field mapping
  function calculateConfidence(input, matchedKey, rule, fullContext, labelText) {
    if (!matchedKey || !rule) {
      return { confidence: 0, level: "low", reason: "Unrecognized field mapping" };
    }

    const autocomplete = (input.getAttribute("autocomplete") || "").toLowerCase();
    const id = (input.id || "").toLowerCase();
    const name = (input.name || "").toLowerCase();
    const cleanLabel = (labelText || "").toLowerCase();

    // 1. High Confidence: HTML standard autocomplete or exact key match
    if (autocomplete && autocomplete.includes(matchedKey.toLowerCase())) {
      return { confidence: 0.98, level: "high", reason: `Exact autocomplete attribute: "${autocomplete}"` };
    }
    if (name === matchedKey.toLowerCase() || id === matchedKey.toLowerCase()) {
      return { confidence: 0.95, level: "high", reason: `Exact field identifier match: "${matchedKey}"` };
    }
    if (cleanLabel === matchedKey.toLowerCase() || rule.pattern.test(cleanLabel)) {
      return { confidence: 0.90, level: "high", reason: `Strong semantic label match: "${labelText}"` };
    }
    if (rule.pattern.test(name) || rule.pattern.test(id)) {
      return { confidence: 0.88, level: "high", reason: `Strong name/id match: "${name || id}"` };
    }

    // 2. Medium Confidence: Contextual or placeholder match
    const placeholder = (input.placeholder || "").toLowerCase();
    const ariaLabel = (input.getAttribute("aria-label") || "").toLowerCase();
    if (rule.pattern.test(placeholder) || rule.pattern.test(ariaLabel)) {
      return { confidence: 0.75, level: "medium", reason: `Placeholder or accessibility text match` };
    }
    if (rule.pattern.test(fullContext)) {
      return { confidence: 0.68, level: "medium", reason: `Surrounding form group context match` };
    }

    // 3. Low Confidence
    return { confidence: 0.45, level: "low", reason: `Weak heuristic match requiring review` };
  }

  // Detect matching key and confidence for an input element
  function identifyInput(input) {
    const type = (input.type || "").toLowerCase();
    if (["password", "submit", "button", "hidden", "file"].includes(type)) {
      return null;
    }

    const identifiers = [
      input.id,
      input.name,
      input.getAttribute("autocomplete"),
      input.placeholder,
      input.getAttribute("aria-label"),
      input.getAttribute("data-state"),
      input.getAttribute("data-qa")
    ].filter(Boolean).join(" ");

    // Check adjacent, wrapping, or referenced label
    let labelText = "";
    if (input.labels && input.labels.length > 0) {
      labelText = Array.from(input.labels).map(l => l.innerText).join(" ");
    } else {
      const parentLabel = input.closest("label");
      if (parentLabel) {
        labelText = parentLabel.innerText;
      } else {
        const parentGroup = input.closest(".form-group, .form-row, .field, .form-item, div");
        if (parentGroup) {
          const lbl = parentGroup.querySelector("label, .label, legend");
          if (lbl) labelText = lbl.innerText;
        }
      }
    }

    const fullContext = `${identifiers} ${labelText}`;

    for (const rule of FIELD_RULES) {
      if (rule.pattern.test(fullContext)) {
        const conf = calculateConfidence(input, rule.key, rule, fullContext, labelText);
        return {
          key: rule.key,
          section: rule.section,
          rule: rule,
          labelText: labelText.trim() || input.name || input.id,
          confidence: conf.confidence,
          confidenceLevel: conf.level,
          confidenceReason: conf.reason
        };
      }
    }

    return {
      key: null,
      section: "other",
      rule: null,
      labelText: labelText.trim() || input.name || input.id,
      confidence: 0,
      confidenceLevel: "low",
      confidenceReason: "No pattern matched"
    };
  }

  // Find saved answers matching a question
  function findSavedAnswer(savedAnswers, labelText, companyName) {
    if (!Array.isArray(savedAnswers) || savedAnswers.length === 0 || !labelText) return null;
    const cleanLabel = labelText.toLowerCase().replace(/[*:]/g, "").trim();

    // 1. Company specific match
    if (companyName) {
      const compMatch = savedAnswers.find(a =>
        a.company &&
        a.company.toLowerCase() === companyName.toLowerCase() &&
        (cleanLabel.includes(a.questionText.toLowerCase()) || a.questionText.toLowerCase().includes(cleanLabel))
      );
      if (compMatch) return { answer: compMatch.answer, source: `Saved Answers (${companyName})`, confidence: 0.95 };
    }

    // 2. Universal match
    const univMatch = savedAnswers.find(a =>
      (!a.company || a.company === "") &&
      (cleanLabel.includes(a.questionText.toLowerCase()) || a.questionText.toLowerCase().includes(cleanLabel))
    );
    if (univMatch) return { answer: univMatch.answer, source: "Saved Answers (Universal)", confidence: 0.90 };

    return null;
  }

  // Detect current company name from page title or meta tags
  function detectCompanyName() {
    const title = document.title || "";
    const metaCompany = document.querySelector('meta[property="og:site_name"]')?.content || "";
    const bodyText = document.body ? document.body.innerText.slice(0, 600) : "";
    const candidate = [metaCompany, title, bodyText].join(" ").toLowerCase();

    if (candidate.includes("ibm")) return "IBM";
    if (candidate.includes("capgemini")) return "Capgemini";
    if (candidate.includes("hcltech") || candidate.includes("hcl")) return "HCLTech";
    if (candidate.includes("infosys")) return "Infosys";
    if (candidate.includes("tcs") || candidate.includes("tata consultancy")) return "TCS";
    if (candidate.includes("accenture")) return "Accenture";
    if (candidate.includes("wipro")) return "Wipro";
    if (candidate.includes("cognizant")) return "Cognizant";
    if (candidate.includes("google")) return "Google";
    if (candidate.includes("microsoft")) return "Microsoft";
    if (candidate.includes("amazon")) return "Amazon";
    return "";
  }

  // Dynamic multi-record sections generator (e.g. "+ Add Another Education" / "+ Add Another Experience")
  async function handleRepeatedSections(profile) {
    const educations = profile.education || [];
    const experiences = profile.experience || [];

    // 1. Education repeated sections
    const addEduButtons = Array.from(document.querySelectorAll("button, a, input[type='button']")).filter(el => {
      const txt = (el.innerText || el.value || "").toLowerCase().trim();
      return /(add[_\s-]?another[_\s-]?education|add[_\s-]?education|add[_\s-]?degree|\+[_\s-]?education|\+[_\s-]?another[_\s-]?edu)/i.test(txt);
    });

    if (addEduButtons.length > 0 && educations.length > 1) {
      const btn = addEduButtons[0];
      let eduContainers = document.querySelectorAll(".education-section, .education-item, [data-section='education'], .edu-record, [id*='edu_inst_']");
      let count = eduContainers.length;
      let attempts = 0;
      while (count < educations.length && attempts < 4) {
        btn.click();
        attempts++;
        await new Promise(r => setTimeout(r, 200));
        eduContainers = document.querySelectorAll(".education-section, .education-item, [data-section='education'], .edu-record, [id*='edu_inst_']");
        count = eduContainers.length;
      }
    }

    // 2. Work Experience repeated sections
    const addExpButtons = Array.from(document.querySelectorAll("button, a, input[type='button']")).filter(el => {
      const txt = (el.innerText || el.value || "").toLowerCase().trim();
      return /(add[_\s-]?another[_\s-]?experience|add[_\s-]?experience|add[_\s-]?work[_\s-]?experience|add[_\s-]?role|\+[_\s-]?experience|\+[_\s-]?work)/i.test(txt);
    });

    if (addExpButtons.length > 0 && experiences.length > 1) {
      const btn = addExpButtons[0];
      let expContainers = document.querySelectorAll(".experience-section, .experience-item, [data-section='experience'], .exp-record, [id*='exp_company_']");
      let count = expContainers.length;
      let attempts = 0;
      while (count < experiences.length && attempts < 4) {
        btn.click();
        attempts++;
        await new Promise(r => setTimeout(r, 200));
        expContainers = document.querySelectorAll(".experience-section, .experience-item, [data-section='experience'], .exp-record, [id*='exp_company_']");
        count = expContainers.length;
      }
    }
  }

  // Get field value from candidate profile with multi-record resolution
  function getProfileValue(matchedKey, profile, recordIndex = 0) {
    if (!matchedKey) return null;

    const eduList = profile.education || [];
    const edu = eduList[recordIndex] || eduList[0] || {};

    const expList = profile.experience || [];
    const exp = expList[recordIndex] || expList[0] || {};

    const p = profile.personal || profile;

    let source = "Profile: Personal";
    if (["university", "college", "degree", "major", "branch", "startYear", "graduationYear", "expectedGraduationDate", "cgpa", "percentage", "gradingScale", "backlogs", "coursework", "academicAchievements"].includes(matchedKey)) {
      source = `Profile: Education #${recordIndex + 1}`;
    } else if (["currentRole", "currentCompany", "jobLocation", "jobStartDate", "jobEndDate", "jobResponsibilities", "jobTechnologies", "yearsExperience"].includes(matchedKey)) {
      source = `Profile: Experience #${recordIndex + 1}`;
    }

    let value = null;
    switch (matchedKey) {
      // Personal
      case "firstName": value = p.firstName || profile.firstName || ""; break;
      case "lastName": value = p.lastName || profile.lastName || ""; break;
      case "middleName": value = p.middleName || profile.middleName || ""; break;
      case "preferredName": value = p.preferredName || p.firstName || profile.firstName || ""; break;
      case "fullName": value = p.fullName || profile.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim(); break;
      case "email": value = p.email || profile.email || ""; break;
      case "phone": value = p.phone || profile.phone || ""; break;
      case "countryCode": value = p.countryCode || profile.countryCode || "+1"; break;
      case "dateOfBirth": value = p.dateOfBirth || profile.dateOfBirth || ""; break;
      case "address": value = p.address || profile.address || ""; break;
      case "city": value = p.city || profile.city || ""; break;
      case "state": value = p.state || profile.state || ""; break;
      case "postalCode": value = p.postalCode || profile.postalCode || ""; break;
      case "country": value = p.country || profile.country || ""; break;
      case "location": value = p.location || profile.location || [p.city, p.state, p.country].filter(Boolean).join(", "); break;
      case "linkedin": value = p.linkedin || profile.linkedin || ""; break;
      case "github": value = p.github || profile.github || ""; break;
      case "portfolio": value = p.portfolio || profile.portfolio || ""; break;

      // Work Auth & Preferences
      case "workAuthorization": value = p.workAuthorization || profile.workAuthorization || "Yes"; break;
      case "visaSponsorship": value = p.visaStatus?.toLowerCase().includes("need") ? "Yes" : "No"; break;
      case "willingnessToRelocate": value = p.willingnessToRelocate || profile.willingnessToRelocate || "Yes"; break;
      case "preferredLocation": value = p.preferredLocation || profile.preferredLocation || ""; break;
      case "preferredWorkMode": value = p.preferredWorkMode || profile.preferredWorkMode || "Hybrid"; break;
      case "noticePeriod": value = p.noticePeriod || profile.noticePeriod || exp.noticePeriod || "30 days"; break;
      case "expectedSalary": value = profile.preferences?.expectedSalary || ""; break;

      // Education
      case "university": value = edu.institution || edu.collegeName || profile.university || ""; break;
      case "college": value = edu.collegeName || edu.institution || profile.college || ""; break;
      case "degree": value = edu.degree || edu.qualification || profile.degree || ""; break;
      case "major": value = edu.major || edu.branch || profile.major || ""; break;
      case "branch": value = edu.branch || edu.major || profile.branch || ""; break;
      case "startYear": value = String(edu.startYear || ""); break;
      case "graduationYear": value = String(edu.graduationYear || profile.graduationYear || ""); break;
      case "expectedGraduationDate": value = String(edu.expectedGraduationDate || ""); break;
      case "cgpa": value = String(edu.cgpa || profile.cgpa || ""); break;
      case "percentage": value = String(edu.percentage || profile.percentage || ""); break;
      case "gradingScale": value = String(edu.gradingScale || "10.0"); break;
      case "backlogs": value = String(edu.backlogs || "0"); break;
      case "coursework": value = edu.coursework || ""; break;
      case "academicAchievements": value = edu.achievements || ""; break;

      // Work Experience
      case "yearsExperience": value = String(profile.professional?.experienceYears || profile.yearsExperience || "0"); break;
      case "currentRole": value = exp.title || profile.professional?.currentTitle || profile.currentRole || ""; break;
      case "currentCompany": value = exp.company || profile.professional?.currentCompany || profile.currentCompany || ""; break;
      case "jobLocation": value = exp.location || ""; break;
      case "jobStartDate": value = exp.startDate || ""; break;
      case "jobEndDate": value = exp.endDate || (exp.isCurrent ? "Present" : ""); break;
      case "jobResponsibilities": value = exp.responsibilities || exp.description || ""; break;
      case "jobTechnologies": value = exp.technologies || ""; break;

      // Skills & Bio
      case "skills": value = Array.isArray(profile.skills) ? profile.skills.join(", ") : (profile.skills || ""); break;
      case "bio": value = profile.professional?.bio || profile.bio || ""; break;

      default: return null;
    }

    return value !== null ? { value: String(value), source } : null;
  }

  // Scan and generate an inspection report before filling
  async function inspectPageFields(profile) {
    await handleRepeatedSections(profile);

    const companyName = detectCompanyName();
    const savedAnswers = profile.savedAnswers || [];
    const inputs = Array.from(document.querySelectorAll("input, textarea, select"));
    const reportItems = [];

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const tag = input.tagName.toLowerCase();
      const type = (input.type || "").toLowerCase();

      if (["password", "submit", "button", "hidden", "file"].includes(type)) continue;

      const info = identifyInput(input);
      const isEducation = info.section === "education" || ["university", "college", "degree", "major", "branch", "graduationYear", "cgpa", "percentage"].includes(info.key);
      const isExperience = info.section === "experience" || ["currentRole", "currentCompany", "jobLocation", "jobStartDate", "jobEndDate", "jobResponsibilities"].includes(info.key);

      const sectionType = isEducation ? "education" : (isExperience ? "experience" : "general");
      const recordIndex = determineRecordIndex(input, sectionType);

      // Check current DOM value
      const hasValue = Boolean(
        (tag === "select" && input.selectedIndex > 0 && input.options[input.selectedIndex].value !== "") ||
        (type === "radio" && input.checked) ||
        (type !== "radio" && tag !== "select" && input.value && input.value.trim().length > 0)
      );

      let proposed = null;
      let source = "None";
      let confidence = info.confidence || 0;
      let confidenceLevel = info.confidenceLevel || "low";
      let confidenceReason = info.confidenceReason || "";

      if (info.key) {
        const profRes = getProfileValue(info.key, profile, recordIndex);
        if (profRes) {
          proposed = profRes.value;
          source = profRes.source;
        }
      }

      if (!proposed && info.labelText) {
        const savedRes = findSavedAnswer(savedAnswers, info.labelText, companyName);
        if (savedRes) {
          proposed = savedRes.answer;
          source = savedRes.source;
          confidence = savedRes.confidence;
          confidenceLevel = "high";
          confidenceReason = "Verified match from Saved Answer library";
        }
      }

      reportItems.push({
        element: input,
        tag,
        type,
        id: input.id || "",
        name: input.name || "",
        labelText: info.labelText,
        key: info.key,
        section: sectionType,
        recordIndex,
        hasExistingValue: hasValue,
        proposedValue: proposed,
        source,
        confidence,
        confidenceLevel,
        confidenceReason,
        selected: !hasValue && proposed !== null && confidenceLevel !== "low"
      });
    }

    return {
      companyName,
      totalDetected: reportItems.length,
      items: reportItems,
      highCount: reportItems.filter(r => r.confidenceLevel === "high" && !r.hasExistingValue && r.proposedValue).length,
      mediumCount: reportItems.filter(r => r.confidenceLevel === "medium" && !r.hasExistingValue && r.proposedValue).length,
      reviewCount: reportItems.filter(r => (r.confidenceLevel === "low" || !r.proposedValue) && !r.hasExistingValue).length,
      preservedCount: reportItems.filter(r => r.hasExistingValue).length
    };
  }

  // Interactive In-Page Preview Drawer
  function showAutofillPreviewDrawer(previewData, onConfirm, onCancel) {
    const existingDrawer = document.getElementById("applyonce-preview-drawer");
    if (existingDrawer) existingDrawer.remove();

    const drawer = document.createElement("div");
    drawer.id = "applyonce-preview-drawer";
    drawer.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 440px;
      max-width: 95vw;
      height: 100vh;
      background: #0f172a;
      color: #f8fafc;
      box-shadow: -8px 0 30px rgba(0,0,0,0.7), 0 0 15px rgba(99,102,241,0.25);
      z-index: 10000000;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border-left: 1px solid rgba(99, 102, 241, 0.4);
    `;

    const { highCount, mediumCount, reviewCount, preservedCount, items } = previewData;

    drawer.innerHTML = `
      <!-- Header -->
      <div style="padding: 20px; border-bottom: 1px solid #1e293b; background: #1e293b;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">⚡</span>
            <h2 style="margin: 0; font-size: 17px; font-weight: 700; color: #ffffff;">Autofill Preview & Review</h2>
          </div>
          <button id="ao-drawer-close" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">&times;</button>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; font-size: 11px; font-weight: 600;">
          <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 3px 8px; border-radius: 6px;">
            ● ${highCount} High Confidence
          </span>
          <span style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; padding: 3px 8px; border-radius: 6px;">
            ▲ ${mediumCount} Medium
          </span>
          <span style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc; padding: 3px 8px; border-radius: 6px;">
            🛡️ ${preservedCount} Preserved
          </span>
        </div>
      </div>

      <!-- Field List -->
      <div id="ao-drawer-items" style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        ${items.map((item, idx) => {
          const isPreserved = item.hasExistingValue;
          const badgeColor = item.confidenceLevel === "high" ? "#10b981" : (item.confidenceLevel === "medium" ? "#f59e0b" : "#ef4444");
          const isSelected = item.selected;

          return `
            <div style="background: #1e293b; border: 1px solid ${isPreserved ? '#334155' : (item.confidenceLevel === 'high' ? 'rgba(16,185,129,0.3)' : '#475569')}; border-radius: 8px; padding: 12px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #e2e8f0; cursor: pointer; max-width: 75%;">
                  <input type="checkbox" class="ao-field-toggle" data-idx="${idx}" ${isSelected ? 'checked' : ''} ${isPreserved ? 'disabled' : ''}>
                  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.labelText || item.key || 'Form Field'}</span>
                </label>
                <span style="font-size: 10px; font-weight: 700; color: ${badgeColor}; background: ${badgeColor}22; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                  ${isPreserved ? 'PRESERVED' : item.confidenceLevel}
                </span>
              </div>

              ${isPreserved ? `
                <div style="font-size: 11px; color: #94a3b8; font-style: italic;">User content already entered (will not overwrite)</div>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <input 
                    type="text" 
                    class="ao-preview-input" 
                    data-idx="${idx}" 
                    value="${item.proposedValue || ''}" 
                    placeholder="No matching value"
                    style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 6px 8px; color: #f8fafc; font-size: 12px;"
                  >
                  <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                    <span>Source: ${item.source}</span>
                    <span>${item.confidence ? Math.round(item.confidence * 100) + '%' : ''}</span>
                  </div>
                </div>
              `}
            </div>
          `;
        }).join('')}
      </div>

      <!-- Footer Actions -->
      <div style="padding: 16px 20px; border-top: 1px solid #1e293b; background: #1e293b; display: flex; justify-content: space-between; align-items: center;">
        <button id="ao-drawer-cancel" style="background: #334155; color: #cbd5e1; border: none; padding: 10px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
          Cancel
        </button>
        <button id="ao-drawer-apply" style="background: #4f46e5; color: #ffffff; border: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
          Autofill Selected Fields
        </button>
      </div>
    `;

    document.body.appendChild(drawer);

    const close = () => drawer.remove();

    drawer.querySelector("#ao-drawer-close").onclick = () => { close(); if (onCancel) onCancel(); };
    drawer.querySelector("#ao-drawer-cancel").onclick = () => { close(); if (onCancel) onCancel(); };

    drawer.querySelectorAll(".ao-field-toggle").forEach(chk => {
      chk.addEventListener("change", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        items[idx].selected = e.target.checked;
      });
    });

    drawer.querySelectorAll(".ao-preview-input").forEach(inp => {
      inp.addEventListener("input", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        items[idx].proposedValue = e.target.value;
      });
    });

    drawer.querySelector("#ao-drawer-apply").onclick = () => {
      close();
      if (onConfirm) onConfirm(items);
    };
  }

  // Interactive Smart "Answer Needed" Modal for unmapped required questions
  function promptAnswerNeeded(inputElement, labelText, companyName, onConfirmed, onSkipped) {
    const existingModal = document.getElementById("applyonce-answer-needed-modal");
    if (existingModal) existingModal.remove();

    const tag = inputElement.tagName.toLowerCase();
    const type = (inputElement.type || "").toLowerCase();

    const backdrop = document.createElement("div");
    backdrop.id = "applyonce-answer-needed-modal";
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      z-index: 10000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const card = document.createElement("div");
    card.style.cssText = `
      background: #1e293b;
      border: 1px solid rgba(99, 102, 241, 0.4);
      border-radius: 14px;
      padding: 24px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(99,102,241,0.25);
      color: #f8fafc;
    `;

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="background:rgba(239, 68, 68, 0.2); color:#f87171; padding:3px 8px; border-radius:6px; font-size:12px; font-weight:700;">
            Answer Needed
          </span>
          ${companyName ? `<span style="background:rgba(99, 102, 241, 0.2); color:#a5b4fc; padding:3px 8px; border-radius:6px; font-size:12px; font-weight:600;">${companyName}</span>` : ''}
        </div>
        <button id="ao-btn-close" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer;">&times;</button>
      </div>

      <h3 style="margin:0 0 8px 0; font-size:16px; color:#ffffff; line-height:1.4;">
        ${labelText || 'Please provide an answer for this field:'}
      </h3>
      <p style="margin:0 0 16px 0; font-size:13px; color:#94a3b8;">
        This application question has no saved answer. Confirm your truthful response below to fill and reuse for future applications.
      </p>

      <div id="ao-input-container" style="margin-bottom:16px;"></div>

      <div style="background:#0f172a; padding:12px; border-radius:8px; margin-bottom:16px; border:1px solid #334155;">
        <label style="font-size:12px; font-weight:600; color:#94a3b8; display:block; margin-bottom:8px;">Saving Options:</label>
        <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:#e2e8f0; margin-bottom:6px; cursor:pointer;">
          <input type="radio" name="ao_save_scope" value="universal" checked>
          <span>Save to reusable question library</span>
        </label>
        ${companyName ? `
        <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:#e2e8f0; margin-bottom:6px; cursor:pointer;">
          <input type="radio" name="ao_save_scope" value="company">
          <span>Save as <strong>${companyName}</strong> specific answer</span>
        </label>` : ''}
        <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:#e2e8f0; cursor:pointer;">
          <input type="radio" name="ao_save_scope" value="once">
          <span>Use for this application only (do not save)</span>
        </label>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px;">
        <button id="ao-btn-skip" style="background:#334155; color:#cbd5e1; border:none; padding:8px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          Skip Field
        </button>
        <button id="ao-btn-confirm" style="background:#4f46e5; color:#ffffff; border:none; padding:8px 18px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          Confirm & Fill
        </button>
      </div>
    `;

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    const inputContainer = card.querySelector("#ao-input-container");
    let getAnswerValue = () => "";

    if (tag === "select") {
      const select = document.createElement("select");
      select.style.cssText = "width:100%; padding:10px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:6px; font-size:14px;";
      Array.from(inputElement.options).forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.text = opt.text;
        select.appendChild(option);
      });
      inputContainer.appendChild(select);
      getAnswerValue = () => select.options[select.selectedIndex]?.text || select.value;
    } else if (tag === "textarea") {
      const textarea = document.createElement("textarea");
      textarea.rows = 3;
      textarea.style.cssText = "width:100%; box-sizing:border-box; padding:10px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:6px; font-size:14px;";
      textarea.placeholder = "Type your response here...";
      inputContainer.appendChild(textarea);
      textarea.focus();
      getAnswerValue = () => textarea.value.trim();
    } else {
      const input = document.createElement("input");
      input.type = type === "number" ? "number" : (type === "date" ? "date" : "text");
      input.style.cssText = "width:100%; box-sizing:border-box; padding:10px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:6px; font-size:14px;";
      input.placeholder = "Type your answer...";
      inputContainer.appendChild(input);
      input.focus();
      getAnswerValue = () => input.value.trim();
    }

    const close = () => backdrop.remove();

    card.querySelector("#ao-btn-close").onclick = () => { close(); onSkipped(); };
    card.querySelector("#ao-btn-skip").onclick = () => { close(); onSkipped(); };

    card.querySelector("#ao-btn-confirm").onclick = () => {
      const val = getAnswerValue();
      if (!val) {
        alert("Please provide an answer or click Skip.");
        return;
      }
      const scope = card.querySelector("input[name='ao_save_scope']:checked")?.value || "once";
      close();
      onConfirmed(val, scope);
    };
  }

  // Execute fill on approved items list
  async function executeApprovedFill(items, companyName) {
    let filledCount = 0;
    let preservedCount = 0;
    let skippedCount = 0;
    let unansweredFields = [];

    for (const item of items) {
      const input = item.element;
      const tag = item.tag;
      const type = item.type;

      if (item.hasExistingValue) {
        preservedCount++;
        continue;
      }

      if (!item.selected || !item.proposedValue) {
        if (input.required && item.labelText) {
          unansweredFields.push({ input, labelText: item.labelText });
        } else {
          skippedCount++;
        }
        continue;
      }

      // Fill radio
      if (type === "radio") {
        const val = String(item.proposedValue).toLowerCase();
        const radioVal = (input.value || "").toLowerCase();
        const radioLabel = (input.parentElement?.innerText || "").toLowerCase();

        const isYes = (val.includes("yes") || val.includes("authorized")) &&
                      (radioVal === "yes" || radioVal === "1" || radioVal === "true" || radioLabel.includes("yes"));
        const isNo = (val.includes("no") || val.includes("not")) &&
                     (radioVal === "no" || radioVal === "0" || radioVal === "false" || radioLabel.includes("no"));

        if (isYes || isNo) {
          input.checked = true;
          input.dispatchEvent(new Event("change", { bubbles: true }));
          highlightElement(input.parentElement || input);
          filledCount++;
        }
        continue;
      }

      // Fill select
      if (tag === "select") {
        const success = setSelectValue(input, item.proposedValue);
        if (success) filledCount++;
        else skippedCount++;
        continue;
      }

      // Fill text/textarea
      const success = setNativeValue(input, item.proposedValue);
      if (success) filledCount++;
      else skippedCount++;
    }

    showFeedbackBanner(filledCount, preservedCount, unansweredFields.length);

    // Sequential prompt for unanswered required fields
    if (unansweredFields.length > 0) {
      let currentIdx = 0;
      function promptNext() {
        if (currentIdx >= unansweredFields.length) {
          showFeedbackBanner(filledCount, preservedCount, 0);
          return;
        }
        const fieldItem = unansweredFields[currentIdx];
        currentIdx++;

        fieldItem.input.scrollIntoView({ behavior: "smooth", block: "center" });

        promptAnswerNeeded(
          fieldItem.input,
          fieldItem.labelText,
          companyName,
          (confirmedAnswer, saveScope) => {
            if (fieldItem.input.tagName.toLowerCase() === "select") {
              setSelectValue(fieldItem.input, confirmedAnswer);
            } else {
              setNativeValue(fieldItem.input, confirmedAnswer);
            }
            filledCount++;

            if (saveScope === "universal" || saveScope === "company") {
              chrome.runtime.sendMessage({
                action: "SAVE_ANSWER",
                answerData: {
                  question_key: fieldItem.input.name || fieldItem.input.id || "custom_question",
                  question_text: fieldItem.labelText,
                  answer: confirmedAnswer,
                  company: saveScope === "company" ? companyName : null,
                  input_type: fieldItem.input.tagName.toLowerCase() === "select" ? "select" : "text"
                }
              });
            }
            promptNext();
          },
          () => {
            skippedCount++;
            promptNext();
          }
        );
      }
      setTimeout(promptNext, 600);
    }

    return { filledCount, preservedCount, skippedCount, unansweredCount: unansweredFields.length };
  }

  // Floating feedback banner on the target page
  function showFeedbackBanner(filled, preserved, unanswered) {
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
      gap: 12px;
    `;

    const icon = filled > 0 ? "⚡" : (preserved > 0 ? "🛡️" : "ℹ️");
    let msg = "";
    if (filled > 0) {
      msg = `ApplyOnce: Verified & Autofilled ${filled} field${filled > 1 ? 's' : ''}!`;
      if (preserved > 0) msg += ` (${preserved} preserved)`;
      if (unanswered > 0) msg += ` • ${unanswered} need answers`;
    } else if (preserved > 0) {
      msg = `ApplyOnce: Preserved ${preserved} already-filled field${preserved > 1 ? 's' : ''}.`;
    } else {
      msg = "ApplyOnce: No compatible empty fields detected on this page.";
    }

    banner.innerHTML = `<span style="font-size: 20px;">${icon}</span><div>${msg}</div>`;
    document.body.appendChild(banner);

    setTimeout(() => {
      banner.style.opacity = "0";
      banner.style.transform = "translateY(10px)";
      banner.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      setTimeout(() => banner.remove(), 400);
    }, 4500);
  }

  // Runtime message listener
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 1. Direct Quick Autofill
    if (request.action === "TRIGGER_AUTOFILL") {
      chrome.storage.local.get(["applyonce_profile"], async (res) => {
        const profile = res.applyonce_profile || {};
        const inspection = await inspectPageFields(profile);

        // Fill high and medium confidence items by default
        const result = await executeApprovedFill(inspection.items, inspection.companyName);

        try {
          chrome.runtime.sendMessage({
            action: "REPORT_AUTOFILL",
            url: window.location.href,
            filledCount: result.filledCount,
            skippedCount: result.skippedCount,
            preservedCount: result.preservedCount,
            timestamp: new Date().toISOString()
          });
        } catch (e) {
          console.debug("[ApplyOnce] Telemetry report suppressed:", e);
        }

        sendResponse({
          success: true,
          count: result.filledCount,
          preserved: result.preservedCount,
          unanswered: result.unansweredCount
        });
      });
      return true;
    }

    // 2. Interactive Preview & Review Drawer
    if (request.action === "PREVIEW_AUTOFILL") {
      chrome.storage.local.get(["applyonce_profile"], async (res) => {
        const profile = res.applyonce_profile || {};
        const inspection = await inspectPageFields(profile);

        showAutofillPreviewDrawer(
          inspection,
          async (approvedItems) => {
            const result = await executeApprovedFill(approvedItems, inspection.companyName);
            try {
              chrome.runtime.sendMessage({
                action: "REPORT_AUTOFILL",
                url: window.location.href,
                filledCount: result.filledCount,
                skippedCount: result.skippedCount,
                preservedCount: result.preservedCount,
                timestamp: new Date().toISOString()
              });
            } catch (e) {}
          },
          () => {}
        );

        sendResponse({
          success: true,
          total: inspection.totalDetected,
          high: inspection.highCount,
          medium: inspection.mediumCount,
          review: inspection.reviewCount,
          preserved: inspection.preservedCount
        });
      });
      return true;
    }
  });
})();
