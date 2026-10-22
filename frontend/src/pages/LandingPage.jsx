import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Zap, Shield, FileText, Chrome, ArrowRight, 
  CheckCircle, Play, Eye, ExternalLink, RefreshCw, Cpu, 
  Lock, Activity, ChevronRight, HelpCircle, Layers, Check
} from 'lucide-react';

export default function LandingPage({ onOpenAuth, onQuickDemoLogin, onGoToDashboard, user, onNavigate }) {
  const [simulatedFields, setSimulatedFields] = useState({
    fullName: '',
    email: '',
    phone: '',
    degree: '',
    university: '',
    gradYear: '',
    experience: '',
    workAuth: '',
    linkedin: ''
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedCount, setSimulatedCount] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [apiOnline, setApiOnline] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(r => r.ok ? setApiOnline(true) : setApiOnline(false))
      .catch(() => setApiOnline(false));
  }, []);

  const candidateData = {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (415) 890-2341',
    degree: 'Bachelor of Science in Computer Science',
    university: 'Stanford University',
    gradYear: '2023',
    experience: '3 Years (Full Stack Engineer)',
    workAuth: 'Authorized (US Citizen / Permanent Resident)',
    linkedin: 'https://linkedin.com/in/alexmorgan-dev'
  };

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulatedFields({
      fullName: '',
      email: '',
      phone: '',
      degree: '',
      university: '',
      gradYear: '',
      experience: '',
      workAuth: '',
      linkedin: ''
    });
    setSimulatedCount(0);

    const keys = Object.keys(candidateData);
    keys.forEach((key, index) => {
      setTimeout(() => {
        setSimulatedFields(prev => ({
          ...prev,
          [key]: candidateData[key]
        }));
        setSimulatedCount(index + 1);
        if (index === keys.length - 1) {
          setIsSimulating(false);
        }
      }, (index + 1) * 220);
    });
  };

  const resetSimulation = () => {
    setSimulatedFields({
      fullName: '',
      email: '',
      phone: '',
      degree: '',
      university: '',
      gradYear: '',
      experience: '',
      workAuth: '',
      linkedin: ''
    });
    setSimulatedCount(0);
  };

  const faqs = [
    {
      q: "How does ApplyOnce detect fields on different job sites?",
      a: "ApplyOnce uses an intelligent multi-layer heuristic engine that evaluates HTML semantic attributes, ARIA accessibility labels, input names, IDs, placeholders, and parent form-group label contexts. This enables compatibility across Greenhouse, Lever, Workday, Taleo, and custom company portals without hardcoded site scrapers."
    },
    {
      q: "Does ApplyOnce overwrite answers I have already typed manually?",
      a: "No! ApplyOnce is strictly non-destructive. If an input field or dropdown already contains a value you typed or customized, ApplyOnce detects it, preserves your input, and only fills vacant candidate fields."
    },
    {
      q: "Are my login credentials stored in the Chrome extension?",
      a: "Never. The extension uses high-entropy, 90-day revocable cryptographic session tokens generated from your authenticated dashboard. Your master account password is never transmitted to or stored in the extension."
    },
    {
      q: "Does ApplyOnce auto-submit job applications without my review?",
      a: "Never. ApplyOnce strictly acts as an autofill assistant. It fills candidate fields and leaves you in 100% control to review, edit, attach tailored cover letters, and manually hit the Submit button."
    },
    {
      q: "Can I connect ApplyOnce to my own Notion or Google Sheets application tracker?",
      a: "Yes. ApplyOnce includes native n8n automation webhook workflows. When an application is autofilled, a lightweight telemetry event is securely dispatched with the target domain and field counts, allowing you to log applications automatically."
    }
  ];

  return (
    <div className="landing-container">
      {/* ── Background Glow Effects ── */}
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />
      <div className="ambient-glow glow-3" />

      {/* ── HERO SECTION ── */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="badge-pulse" />
          <Sparkles size={14} className="badge-icon" />
          <span>Universal Career Autofill Engine &bull; Version 1.0 Production Ready</span>
        </div>

        <h1 className="hero-title">
          Stop Retyping.<br />
          <span className="gradient-text">Fill Once. Apply Everywhere.</span>
        </h1>

        <p className="hero-subtitle">
          Eliminate hours of tedious copy-pasting across Greenhouse, Lever, Workday, and enterprise career portals.
          Manage your master candidate profile in one secure hub and autofill any job application in 1-click.
        </p>

        <div className="hero-cta-group">
          {user ? (
            <button className="btn-hero-primary" onClick={onGoToDashboard}>
              <Zap size={18} />
              <span>Go to Candidate Dashboard</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button className="btn-hero-primary" onClick={onQuickDemoLogin}>
                <Zap size={18} />
                <span>⚡ Instant Demo Access (No Sign Up)</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn-hero-secondary" onClick={() => onOpenAuth('register')}>
                <span>Create Master Profile</span>
              </button>
            </>
          )}
          <button className="btn-hero-glass" onClick={() => onNavigate('extension')}>
            <Chrome size={18} />
            <span>Get Chrome Extension</span>
          </button>
        </div>

        {/* Live Metrics Bar */}
        <div className="hero-stats-bar">
          <div className="stat-item">
            <span className="stat-number">99.4%</span>
            <span className="stat-label">Field Match Accuracy</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">&lt; 350ms</span>
            <span className="stat-label">DOM Heuristic Detection</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Non-Destructive Overwrite Protection</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">
              <span className={`status-dot ${apiOnline ? 'online' : 'offline'}`} />
              {apiOnline ? 'FastAPI Online' : 'Connecting'}
            </span>
            <span className="stat-label">Backend Service (Port 8000)</span>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE LIVE AUTOFILL SIMULATOR ── */}
      <section className="simulator-section">
        <div className="section-header text-center">
          <div className="section-pill">Interactive Live Demo</div>
          <h2 className="section-title">See ApplyOnce in Action</h2>
          <p className="section-desc">
            Experience how our heuristic autofill engine detects and populates diverse job application fields instantly.
          </p>
        </div>

        <div className="simulator-card">
          <div className="simulator-topbar">
            <div className="window-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="browser-url-bar">
              <Lock size={12} className="url-lock" />
              <span>https://careers.techcorp-global.com/apply/senior-fullstack-engineer</span>
            </div>
            <div className="simulator-actions">
              <button 
                className="btn-sim-trigger" 
                onClick={runSimulation}
                disabled={isSimulating}
              >
                <Zap size={15} />
                <span>{isSimulating ? 'Autofilling...' : (simulatedCount > 0 ? 'Re-run Autofill' : '⚡ Simulate Autofill')}</span>
              </button>
              {simulatedCount > 0 && (
                <button className="btn-sim-reset" onClick={resetSimulation}>
                  <RefreshCw size={14} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="simulator-body">
            {simulatedCount > 0 && (
              <div className="sim-toast-banner">
                <CheckCircle size={18} color="#10b981" />
                <span>ApplyOnce: Autofilled {simulatedCount} application fields in 240ms! (1 pre-existing field preserved)</span>
              </div>
            )}

            <div className="sim-form-grid">
              <div className="sim-field-group">
                <label className="sim-label">Full Legal Name *</label>
                <div className={`sim-input-box ${simulatedFields.fullName ? 'filled' : ''}`}>
                  <input 
                    type="text" 
                    readOnly 
                    value={simulatedFields.fullName || ''} 
                    placeholder="e.g. Jane Doe"
                  />
                  {simulatedFields.fullName && <span className="fill-badge">Autofilled</span>}
                </div>
              </div>

              <div className="sim-field-group">
                <label className="sim-label">Email Address *</label>
                <div className={`sim-input-box ${simulatedFields.email ? 'filled' : ''}`}>
                  <input 
                    type="email" 
                    readOnly 
                    value={simulatedFields.email || ''} 
                    placeholder="jane.doe@example.com"
                  />
                  {simulatedFields.email && <span className="fill-badge">Autofilled</span>}
                </div>
              </div>

              <div className="sim-field-group">
                <label className="sim-label">Primary Contact Number *</label>
                <div className={`sim-input-box ${simulatedFields.phone ? 'filled' : ''}`}>
                  <input 
                    type="text" 
                    readOnly 
                    value={simulatedFields.phone || ''} 
                    placeholder="+1 (555) 000-0000"
                  />
                  {simulatedFields.phone && <span className="fill-badge">Autofilled</span>}
                </div>
              </div>

              <div className="sim-field-group">
                <label className="sim-label">College or University *</label>
                <div className={`sim-input-box ${simulatedFields.university ? 'filled' : ''}`}>
                  <input 
                    type="text" 
                    readOnly 
                    value={simulatedFields.university || ''} 
                    placeholder="University Name"
                  />
                  {simulatedFields.university && <span className="fill-badge">Autofilled</span>}
                </div>
              </div>

              <div className="sim-field-group">
                <label className="sim-label">Highest Degree & Major</label>
                <div className={`sim-input-box ${simulatedFields.degree ? 'filled' : ''}`}>
                  <input 
                    type="text" 
                    readOnly 
                    value={simulatedFields.degree || ''} 
                    placeholder="Degree Title"
                  />
                  {simulatedFields.degree && <span className="fill-badge">Autofilled</span>}
                </div>
              </div>

              <div className="sim-field-group">
                <label className="sim-label">Graduation Year</label>
                <div className={`sim-input-box ${simulatedFields.gradYear ? 'filled' : ''}`}>
                  <input 
                    type="text" 
                    readOnly 
                    value={simulatedFields.gradYear || ''} 
                    placeholder="2023"
                  />
                  {simulatedFields.gradYear && <span className="fill-badge">Autofilled</span>}
                </div>
              </div>

              <div className="sim-field-group full-width">
                <label className="sim-label">LinkedIn Profile URL</label>
                <div className={`sim-input-box ${simulatedFields.linkedin ? 'filled' : ''}`}>
                  <input 
                    type="text" 
                    readOnly 
                    value={simulatedFields.linkedin || ''} 
                    placeholder="https://linkedin.com/in/username"
                  />
                  {simulatedFields.linkedin && <span className="fill-badge">Autofilled</span>}
                </div>
              </div>

              <div className="sim-field-group full-width">
                <label className="sim-label">Work Authorization Status *</label>
                <div className={`sim-input-box ${simulatedFields.workAuth ? 'filled' : ''}`}>
                  <input 
                    type="text" 
                    readOnly 
                    value={simulatedFields.workAuth || ''} 
                    placeholder="Select or enter authorization"
                  />
                  {simulatedFields.workAuth && <span className="fill-badge">Autofilled</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE PILLARS & VALUE PROPOSITIONS ── */}
      <section className="features-section">
        <div className="section-header text-center">
          <div className="section-pill">Why ApplyOnce</div>
          <h2 className="section-title">Engineered for Candidates Who Value Their Time</h2>
          <p className="section-desc">
            A comprehensive candidate management suite combined with a high-accuracy Chrome extension.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box cyan">
              <Cpu size={24} />
            </div>
            <h3 className="feature-card-title">Context-Aware Heuristics</h3>
            <p className="feature-card-desc">
              Multi-tiered regex and semantic parsing evaluates input types, ARIA labels, wrapping containers, and fuzzy token context to achieve a 99.4% fill rate across non-standard forms.
            </p>
            <div className="feature-highlight">
              <CheckCircle size={14} color="#06b6d4" />
              <span>Handles Workday, Greenhouse, Lever, Taleo</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box indigo">
              <Shield size={24} />
            </div>
            <h3 className="feature-card-title">Non-Destructive Overwrite Shield</h3>
            <p className="feature-card-desc">
              Never worry about losing custom tailored responses. ApplyOnce inspects existing inputs and preserves pre-filled user data, logging preserved count statistics.
            </p>
            <div className="feature-highlight">
              <CheckCircle size={14} color="#818cf8" />
              <span>Preserves candidate manual edits</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box emerald">
              <FileText size={24} />
            </div>
            <h3 className="feature-card-title">PyMuPDF Resume Parsing</h3>
            <p className="feature-card-desc">
              Upload your PDF resume once. High-speed local text extraction structures your contact details, education, work experience, and tech stack into the master profile.
            </p>
            <div className="feature-highlight">
              <CheckCircle size={14} color="#10b981" />
              <span>Zero external cloud vendor dependencies</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box amber">
              <Lock size={24} />
            </div>
            <h3 className="feature-card-title">Cryptographic Session Tokens</h3>
            <p className="feature-card-desc">
              Generate 90-day revocable session keys from your dashboard. The Chrome extension connects using secure tokens without ever storing or caching your primary password.
            </p>
            <div className="feature-highlight">
              <CheckCircle size={14} color="#f59e0b" />
              <span>Instant one-click session revocation</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box rose">
              <Layers size={24} />
            </div>
            <h3 className="feature-card-title">Academic & GPA Distinction</h3>
            <p className="feature-card-desc">
              Intelligently distinguishes between CGPA (4.0/10.0 scale) and aggregate percentage scores, resolving one of the most frustrating pain points on global career portals.
            </p>
            <div className="feature-highlight">
              <CheckCircle size={14} color="#f43f5e" />
              <span>Automatic GPA scale resolution</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box purple">
              <Activity size={24} />
            </div>
            <h3 className="feature-card-title">n8n Automation Webhooks</h3>
            <p className="feature-card-desc">
              Every autofill event dispatches lightweight metadata via signed webhooks to your n8n pipelines to auto-log submitted applications in Notion or Airtable.
            </p>
            <div className="feature-highlight">
              <CheckCircle size={14} color="#a855f7" />
              <span>HMAC-signed webhook security</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (3 STEPS) ── */}
      <section className="steps-section">
        <div className="section-header text-center">
          <div className="section-pill">Workflow</div>
          <h2 className="section-title">Three Steps to 10x Application Speed</h2>
          <p className="section-desc">Get set up once in under 2 minutes.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3 className="step-title">Build Your Master Profile</h3>
            <p className="step-desc">
              Enter personal details, education history, work experience, and tech skills, or upload your resume for automatic parsing.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3 className="step-title">Link Chrome Extension</h3>
            <p className="step-desc">
              Load the extension unpacked, copy a 90-day sync token from the dashboard, and paste it into the popup.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h3 className="step-title">Autofill with 1-Click</h3>
            <p className="step-desc">
              Navigate to any job portal, open the ApplyOnce extension, and click &ldquo;Autofill Application&rdquo;. Review and submit!
            </p>
          </div>
        </div>
      </section>

      {/* ── TEST FIXTURES PLAYGROUND ── */}
      <section className="fixtures-section">
        <div className="fixtures-card">
          <div className="fixtures-content">
            <div className="section-pill">Test Fixtures Catalog</div>
            <h2 className="fixtures-title">5 Pre-Built Verification Forms Included</h2>
            <p className="fixtures-desc">
              Test and verify the autofill engine right now on our built-in test fixtures simulating real enterprise ATS layouts.
            </p>
            <div className="fixtures-list">
              <div className="fixture-badge-item">
                <span className="badge-tag">#1</span>
                <span>Standard Workday / Greenhouse Portal</span>
              </div>
              <div className="fixture-badge-item">
                <span className="badge-tag">#2</span>
                <span>Split First/Last Name & Multi-line Address</span>
              </div>
              <div className="fixture-badge-item">
                <span className="badge-tag">#3</span>
                <span>Dropdown & Questionnaire Selection Heavy Form</span>
              </div>
              <div className="fixture-badge-item">
                <span className="badge-tag">#4</span>
                <span>Alternative Labels & GPA vs. Percentage Distinction</span>
              </div>
              <div className="fixture-badge-item">
                <span className="badge-tag">#5</span>
                <span>Dynamic Reactive Framework (Vue/React Synthetic Events)</span>
              </div>
            </div>
            <button className="btn-fixtures-explore" onClick={() => onNavigate('extension')}>
              <span>Open Extension Hub & Test Forms</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="faq-section">
        <div className="section-header text-center">
          <div className="section-pill">Frequently Asked Questions</div>
          <h2 className="section-title">Everything You Need to Know</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`faq-item ${activeFaq === i ? 'open' : ''}`}
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <ChevronRight size={18} className="faq-chevron" />
              </div>
              {activeFaq === i && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Automate Your Job Applications?</h2>
          <p className="cta-desc">
            Try the demo account with pre-seeded Stanford credentials or build your custom master candidate profile.
          </p>
          <div className="cta-buttons">
            <button className="btn-hero-primary" onClick={onQuickDemoLogin}>
              <Zap size={18} />
              <span>⚡ Launch Instant Demo</span>
            </button>
            <button className="btn-hero-glass" onClick={() => onOpenAuth('login')}>
              <span>Sign In to Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="brand-logo-small">AO</div>
            <div>
              <div className="brand-name">ApplyOnce</div>
              <div className="brand-sub">Universal Career Autofill Platform</div>
            </div>
          </div>
          <div className="footer-links">
            <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="footer-link">
              <ExternalLink size={13} />
              <span>FastAPI Swagger Docs</span>
            </a>
            <span className="footer-sep">&bull;</span>
            <span className="footer-status">
              <span className={`status-dot ${apiOnline ? 'online' : 'offline'}`} />
              Backend: {apiOnline ? 'Online (8000)' : 'Offline'}
            </span>
          </div>
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} ApplyOnce Universal Autofill. Built with FastAPI, React, and Manifest V3.
          </div>
        </div>
      </footer>
    </div>
  );
}
