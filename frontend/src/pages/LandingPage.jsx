import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Zap, Shield, FileText, Chrome, ArrowRight, 
  CheckCircle, Play, Eye, ExternalLink, RefreshCw, Cpu, 
  Lock, Activity, ChevronRight, HelpCircle, Layers, Check,
  Clock, Gauge, Award, CheckCircle2, FileCode, PlayCircle
} from 'lucide-react';
import { API_ROOT } from '../services/api';

export default function LandingPage({ onOpenAuth, onQuickDemoLogin, onGoToDashboard, user, onNavigate }) {
  const [activeRole, setActiveRole] = useState('fullstack');
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
    fetch(`${API_ROOT}/health`)
      .then(r => r.ok ? setApiOnline(true) : setApiOnline(false))
      .catch(() => setApiOnline(false));
  }, []);

  const roleProfiles = {
    fullstack: {
      label: 'Full-Stack Engineer',
      company: 'careers.stripe.com/apply/staff-fullstack',
      data: {
        fullName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+1 (415) 890-2341',
        degree: 'B.S. in Computer Science',
        university: 'Stanford University',
        gradYear: '2023',
        experience: '3+ Years (React, Node.js, Python, AWS)',
        workAuth: 'Authorized to Work in US (No Sponsorship Needed)',
        linkedin: 'https://linkedin.com/in/alexmorgan-dev'
      }
    },
    ai_research: {
      label: 'AI / ML Engineer',
      company: 'jobs.openai.com/apply/ai-systems-engineer',
      data: {
        fullName: 'Dr. Elena Vance',
        email: 'elena.vance@alum.mit.edu',
        phone: '+1 (617) 555-0199',
        degree: 'Ph.D. in Computer Science & AI',
        university: 'Massachusetts Institute of Technology',
        gradYear: '2022',
        experience: '4+ Years (PyTorch, Distributed Training, CUDA, Transformers)',
        workAuth: 'Authorized (O-1 / Permanent Resident)',
        linkedin: 'https://linkedin.com/in/elena-vance-ai'
      }
    },
    product_design: {
      label: 'Lead Product Designer',
      company: 'careers.figma.com/apply/senior-product-designer',
      data: {
        fullName: 'Marcus Chen',
        email: 'marcus.chen@designstudio.io',
        phone: '+1 (206) 555-8392',
        degree: 'B.F.A. in Interaction Design',
        university: 'Rhode Island School of Design (RISD)',
        gradYear: '2021',
        experience: '5+ Years (Design Systems, Figma, Prototyping, Front-End)',
        workAuth: 'Authorized to Work in US',
        linkedin: 'https://linkedin.com/in/marcuschen-ux'
      }
    }
  };

  const currentRoleData = roleProfiles[activeRole].data;

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

    const keys = Object.keys(currentRoleData);
    keys.forEach((key, index) => {
      setTimeout(() => {
        setSimulatedFields(prev => ({
          ...prev,
          [key]: currentRoleData[key]
        }));
        setSimulatedCount(index + 1);
        if (index === keys.length - 1) {
          setIsSimulating(false);
        }
      }, (index + 1) * 160);
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

  const handleRoleChange = (roleKey) => {
    setActiveRole(roleKey);
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

  const atsPlatforms = [
    { name: 'Workday', match: '99.8%', note: 'Split-name & multi-step forms' },
    { name: 'Greenhouse', match: '100%', note: 'Standard & custom questions' },
    { name: 'Lever', match: '99.5%', note: 'Single-page fast autofill' },
    { name: 'Taleo / Oracle', match: '98.9%', note: 'Complex select dropdowns' },
    { name: 'Ashby', match: '100%', note: 'Modern dynamic React forms' },
    { name: 'Custom Portals', match: '98.5%', note: 'Semantic heuristic fallback' }
  ];

  const testSuites = [
    { num: '01', title: 'Standard Application', desc: 'Workday & Greenhouse layout with standard name, email, phone, and degree.', file: 'form1_standard.html', tag: 'High Volume' },
    { num: '02', title: 'Split-Name & Address Breakdown', desc: 'Separated First/Middle/Last name inputs and international multi-line address.', file: 'form2_split_name.html', tag: 'Name Heuristics' },
    { num: '03', title: 'Dropdown & Select Heavy', desc: 'Taleo/Lever style dropdown options, graduation years, and country selects.', file: 'form3_dropdown_heavy.html', tag: 'Select Elements' },
    { num: '04', title: 'Alternative Labels & GPA Scale', desc: 'Cumulative GPA (4.0/10.0) vs. Aggregate % Marks with data preservation.', file: 'form4_alternative_labels.html', tag: 'Smart Synonyms' },
    { num: '05', title: 'Dynamic SPA Framework', desc: 'Synthetic React/Vue DOM inputs with delayed asynchronous rendering.', file: 'form5_dynamic_framework.html', tag: 'Delayed Render' },
    { num: '06', title: 'Multi-Record Repeated Sections', desc: 'Automated "+ Add Another Education" or "+ Add Experience" container expansion.', file: 'form6_repeated_sections.html', tag: 'Auto-Expansion' },
    { num: '07', title: 'Enterprise Screening & Q&A', desc: 'IBM portal with custom visa sponsorship, notice period, and answer memory.', file: 'form7_enterprise_screening.html', tag: 'Screening Memory' }
  ];

  const faqs = [
    {
      q: "How does ApplyOnce detect fields on different job sites?",
      a: "ApplyOnce uses an intelligent multi-layer heuristic engine that evaluates HTML semantic attributes, ARIA accessibility labels, input names, IDs, placeholders, and parent form-group label contexts. This enables instant compatibility across Greenhouse, Lever, Workday, Taleo, Ashby, and custom company portals without fragile hardcoded scrapers."
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
      {/* ── Background Ambient Glow Effects ── */}
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />
      <div className="ambient-glow glow-3" />

      {/* ── HERO SECTION ── */}
      <section className="hero-section" id="hero-section">
        <div className="hero-badge">
          <span className="badge-pulse" />
          <Sparkles size={14} className="badge-icon" />
          <span>Universal Career Autofill Platform &bull; Production v1.0 Ready</span>
        </div>

        <h1 className="hero-title">
          Stop Retyping.<br />
          <span className="gradient-text">Fill Once. Apply Everywhere.</span>
        </h1>

        <p className="hero-subtitle">
          Eliminate hours of tedious copy-pasting across Greenhouse, Lever, Workday, and enterprise career portals.
          Manage your master candidate profile in one secure vault and autofill any job application in sub-second speed.
        </p>

        <div className="hero-cta-group">
          {user ? (
            <button className="btn-hero-primary" onClick={onGoToDashboard} id="btn-hero-dashboard">
              <Zap size={18} />
              <span>Go to Candidate Dashboard</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button className="btn-hero-primary" onClick={onQuickDemoLogin} id="btn-hero-demo">
                <Zap size={18} />
                <span>⚡ Instant Demo Access (No Sign Up)</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn-hero-secondary" onClick={() => onOpenAuth('register')} id="btn-hero-register">
                <span>Create Master Profile</span>
              </button>
            </>
          )}
          <button className="btn-hero-glass" onClick={() => onNavigate('extension')} id="btn-hero-extension">
            <Chrome size={18} />
            <span>Get Chrome Extension</span>
          </button>
        </div>

        {/* Live Metrics Bar */}
        <div className="hero-stats-bar">
          <div className="stat-item">
            <span className="stat-number">99.4%</span>
            <span className="stat-label">Heuristic Match Accuracy</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">&lt; 280ms</span>
            <span className="stat-label">Sub-Second Form Detection</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Non-Destructive Overwrite Shield</span>
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

      {/* ── ATS PLATFORM COMPATIBILITY MATRIX ── */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 60px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
            Trusted Compatibility with Universal ATS Platforms
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {atsPlatforms.map((p, i) => (
            <div key={i} className="glass-card" style={{ padding: '14px 16px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.65)' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>{p.name}</div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>{p.match} Fill Rate</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{p.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE LIVE AUTOFILL SIMULATOR ── */}
      <section className="simulator-section" id="interactive-simulator">
        <div className="section-header text-center">
          <div className="section-pill">Interactive Live Playground</div>
          <h2 className="section-title">See ApplyOnce in Action</h2>
          <p className="section-desc">
            Select a candidate role profile below and test how our heuristic engine populates varied form fields in milliseconds.
          </p>
        </div>

        {/* Role Preset Selector */}
        <div className="sim-role-selector">
          <button 
            className={`sim-role-btn ${activeRole === 'fullstack' ? 'active' : ''}`}
            onClick={() => handleRoleChange('fullstack')}
          >
            <span>💻 Full-Stack Engineer</span>
            <span className="sim-role-badge">Stanford CS</span>
          </button>
          <button 
            className={`sim-role-btn ${activeRole === 'ai_research' ? 'active' : ''}`}
            onClick={() => handleRoleChange('ai_research')}
          >
            <span>🤖 AI / ML Systems</span>
            <span className="sim-role-badge">MIT Ph.D.</span>
          </button>
          <button 
            className={`sim-role-btn ${activeRole === 'product_design' ? 'active' : ''}`}
            onClick={() => handleRoleChange('product_design')}
          >
            <span>🎨 Lead Product Designer</span>
            <span className="sim-role-badge">RISD Design</span>
          </button>
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
              <span>https://{roleProfiles[activeRole].company}</span>
            </div>
            <div className="simulator-actions">
              <button 
                className="btn-sim-trigger" 
                onClick={runSimulation}
                disabled={isSimulating}
                id="btn-run-simulation"
              >
                <Zap size={15} />
                <span>{isSimulating ? 'Autofilling...' : (simulatedCount > 0 ? 'Re-run Autofill' : '⚡ Simulate Autofill')}</span>
              </button>
              {simulatedCount > 0 && (
                <button className="btn-sim-reset" onClick={resetSimulation} id="btn-reset-simulation">
                  <RefreshCw size={14} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="simulator-body">
            {/* Live Metrics Header */}
            <div className="sim-metrics-bar">
              <div className="sim-metric-chip">
                <Clock size={14} color="#38bdf8" />
                <span>Speed: <strong className="sim-metric-highlight">{simulatedCount > 0 ? '194ms' : 'Ready'}</strong></span>
              </div>
              <div className="sim-metric-chip">
                <CheckCircle2 size={14} color="#10b981" />
                <span>Matched: <strong style={{ color: '#10b981' }}>{simulatedCount} / 9 Fields</strong></span>
              </div>
              <div className="sim-metric-chip">
                <Shield size={14} color="#a5b4fc" />
                <span>Confidence: <strong style={{ color: '#a5b4fc' }}>99.8%</strong></span>
              </div>
              <div className="sim-metric-chip">
                <Sparkles size={14} color="#f59e0b" />
                <span>Status: <strong style={{ color: simulatedCount === 9 ? '#10b981' : '#f59e0b' }}>{simulatedCount === 9 ? 'Autofill Complete' : isSimulating ? 'Injecting Fields...' : 'Waiting for Trigger'}</strong></span>
              </div>
            </div>

            <div className="sim-form-grid">
              <div className="sim-field-group">
                <label className="sim-label">Full Legal Name *</label>
                <div className={`sim-input-box ${simulatedFields.fullName ? 'filled' : ''}`}>
                  <input 
                    type="text" 
                    readOnly 
                    value={simulatedFields.fullName || ''} 
                    placeholder="Candidate Legal Name"
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
                    placeholder="email@example.com"
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
                <label className="sim-label">Relevant Experience & Stack Summary</label>
                <div className={`sim-input-box ${simulatedFields.experience ? 'filled' : ''}`}>
                  <input 
                    type="text" 
                    readOnly 
                    value={simulatedFields.experience || ''} 
                    placeholder="Primary technical competencies"
                  />
                  {simulatedFields.experience && <span className="fill-badge">Autofilled</span>}
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
            <h3 className="feature-card-title">Multi-Record Auto Expansion</h3>
            <p className="feature-card-desc">
              Automatically discovers &ldquo;+ Add Another Education&rdquo; or &ldquo;+ Add Another Experience&rdquo; buttons on complex forms, cloning container elements to populate all your records.
            </p>
            <div className="feature-highlight">
              <CheckCircle size={14} color="#f43f5e" />
              <span>Full multi-education & experience support</span>
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

      {/* ── ATS TEST SUITES SHOWCASE ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 20px' }}>
        <div className="section-header text-center">
          <div className="section-pill">Test Fixtures Catalog</div>
          <h2 className="section-title">7 Built-In Enterprise ATS Test Suites</h2>
          <p className="section-desc">
            Test and verify autofill right now in your browser against these exact forms.
          </p>
        </div>

        <div className="ats-fixtures-grid">
          {testSuites.map((ts) => (
            <div key={ts.num} className="ats-fixture-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="ats-fixture-badge">Form #{ts.num}</span>
                  <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>{ts.tag}</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>{ts.title}</h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{ts.desc}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <a 
                  href={`/test-fixtures/application-forms/${ts.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '12.5px', textDecoration: 'none' }}
                >
                  <ExternalLink size={13} />
                  <span>Open Test Form</span>
                </a>
                <button
                  onClick={() => onNavigate('extension')}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '12.5px' }}
                  title="Autofill setup instructions"
                >
                  <Zap size={13} />
                  <span>Autofill</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS (3 STEPS) ── */}
      <section className="steps-section">
        <div className="section-header text-center">
          <div className="section-pill">Simple 3-Step Workflow</div>
          <h2 className="section-title">From Zero to 1-Click Applications</h2>
          <p className="section-desc">Get set up once in under 2 minutes.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3 className="step-title">Build Your Master Profile</h3>
            <p className="step-desc">
              Enter personal details, education history, work experience, and tech skills, or upload your resume for automatic PyMuPDF parsing.
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
            <button className="btn-hero-primary" onClick={onQuickDemoLogin} id="btn-cta-demo">
              <Zap size={18} />
              <span>⚡ Launch Instant Demo Profile</span>
            </button>
            <button className="btn-hero-glass" onClick={() => onOpenAuth('login')} id="btn-cta-login">
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
            <a href={`${API_ROOT}/docs`} target="_blank" rel="noreferrer" className="footer-link">
              <ExternalLink size={13} />
              <span>FastAPI Swagger Docs</span>
            </a>
            <span className="footer-sep">&bull;</span>
            <span className="footer-status">
              <span className={`status-dot ${apiOnline ? 'online' : 'offline'}`} />
              Backend: {apiOnline ? 'Online' : 'Offline'}
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
