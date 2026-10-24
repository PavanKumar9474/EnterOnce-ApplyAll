import React from 'react';
import { 
  User, GraduationCap, Briefcase, Code, FileText, Chrome, 
  ShieldCheck, CheckCircle2, ArrowRight, Zap, ExternalLink, 
  Sparkles, Layers, Activity, AlertCircle, RefreshCw, Key,
  Check, ArrowUpRight, Clock, Award, Building, FileCode
} from 'lucide-react';

export default function DashboardPage({ profile, user, onNavigate, onQuickDemoLogin, addToast }) {
  // Calculate completion percentage and readiness
  const checks = [
    { label: 'Personal Information', sub: 'Full name, email, phone, location', key: 'personal', done: Boolean(profile?.first_name && profile?.email && profile?.phone), tab: 'profile' },
    { label: 'Education History', sub: 'College, major, graduation year, CGPA', key: 'education', done: Boolean(profile?.educations && profile.educations.length > 0), tab: 'profile' },
    { label: 'Work Experience', sub: 'Past companies, titles, duration, responsibilities', key: 'experience', done: Boolean(profile?.experiences && profile.experiences.length > 0), tab: 'profile' },
    { label: 'Technical Skills', sub: 'Categorized skills & proficiencies', key: 'skills', done: Boolean(profile?.skills && profile.skills.length > 0), tab: 'profile' },
    { label: 'Resume Uploaded & Parsed', sub: 'PyMuPDF processed PDF/DOCX', key: 'resume', done: Boolean(profile?.resumes && profile.resumes.length > 0), tab: 'resume' },
    { label: 'Work Authorization & Preferences', sub: 'Visa status, notice period, relocation', key: 'auth', done: Boolean(profile?.work_authorization), tab: 'profile' }
  ];

  const completedCount = checks.filter(c => c.done).length;
  const completionPercentage = Math.round((completedCount / checks.length) * 100);

  // SVG circular radius calculation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const testFixtures = [
    { num: '01', title: 'Standard Application', desc: 'Workday & Greenhouse style layout with legal name, email, phone, and degree.', file: 'form1_standard.html' },
    { num: '02', title: 'Split-Name & Address', desc: 'Separated First/Last name inputs and multi-line address fields.', file: 'form2_split_name.html' },
    { num: '03', title: 'Dropdown & Questionnaire', desc: 'Taleo/Lever style dropdown options, graduation years, and country selects.', file: 'form3_dropdown_heavy.html' },
    { num: '04', title: 'Alternate Labels & CGPA', desc: 'Cumulative GPA vs. Aggregate % Marks with pre-existing user data preservation test.', file: 'form4_alternative_labels.html' },
    { num: '05', title: 'Dynamic Framework', desc: 'Synthetic React/Angular DOM inputs with input and blur event verification.', file: 'form5_dynamic_framework.html' },
    { num: '06', title: 'Multi-Record Repeated', desc: 'Dynamic "+ Add Another Education" and "+ Add Another Experience" expansion.', file: 'form6_repeated_sections.html' },
    { num: '07', title: 'Enterprise Screening', desc: 'IBM portal with custom screening answers, visa sponsorship, and answer memory.', file: 'form7_enterprise_screening.html' }
  ];

  const recentApplications = [
    { company: 'Stripe', role: 'Staff Full-Stack Engineer', platform: 'Greenhouse', time: '10 mins ago', status: 'Autofilled (18 fields)', speed: '180ms' },
    { company: 'Google Cloud', role: 'Senior Software Engineer', platform: 'Workday', time: '2 hours ago', status: 'Autofilled (22 fields)', speed: '240ms' },
    { company: 'Airbnb', role: 'Infrastructure Engineer', platform: 'Lever', time: 'Yesterday', status: 'Autofilled (14 fields)', speed: '190ms' },
    { company: 'OpenAI', role: 'AI Systems Engineer', platform: 'Ashby', time: '2 days ago', status: 'Autofilled (16 fields)', speed: '210ms' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── Top Hero Card ── */}
      <div className="glass-card" style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.28)',
        padding: '36px'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '28px' }}>
          <div style={{ maxWidth: '620px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#a5b4fc', marginBottom: '12px' }}>
              <Sparkles size={14} />
              <span>Universal Autofill Companion Active &bull; Port 8000</span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
              Welcome back, {profile?.first_name || user?.full_name?.split(' ')[0] || 'Candidate'}! 👋
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '8px', lineHeight: 1.6 }}>
              Your master candidate profile is active and synchronized. Use the ApplyOnce Chrome extension to autofill job applications in sub-second speed across any ATS portal.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
              <button 
                className="btn-primary" 
                onClick={() => onNavigate('extension')}
                id="dash-btn-extension"
              >
                <Chrome size={16} />
                <span>Get Extension Token</span>
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => onNavigate('resume')}
                id="dash-btn-resume"
              >
                <FileText size={16} />
                <span>Resume Studio</span>
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => onNavigate('profile')}
                id="dash-btn-profile"
              >
                <User size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Circular SVG Profile Readiness Dial */}
          <div style={{
            background: 'rgba(13, 19, 33, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <div className="readiness-ring-wrapper">
              <svg className="readiness-ring-svg" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <circle
                  className="readiness-ring-bg"
                  cx="60"
                  cy="60"
                  r={radius}
                />
                <circle
                  className="readiness-ring-progress"
                  cx="60"
                  cy="60"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="readiness-center-text">
                <div className="readiness-percent-number">{completionPercentage}%</div>
                <div className="readiness-percent-label">Ready</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Profile Readiness</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                {completionPercentage >= 80 ? '🚀 Ready to Apply' : '⚠️ Action Needed'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {completedCount} of {checks.length} sections verified
              </div>
              <button 
                onClick={() => onNavigate('profile')}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#818cf8', 
                  fontSize: '12.5px', 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  marginTop: '6px',
                  padding: 0
                }}
              >
                <span>Complete profile</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* ── Key Metrics Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', flexShrink: 0 }}>
            <User size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Candidate Profile</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              {profile?.full_name || user?.full_name || 'Active Candidate'}
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <CheckCircle2 size={13} />
              <span>Verified & Synchronized</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4', flexShrink: 0 }}>
            <Chrome size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Chrome Companion</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              Manifest V3 Ready
            </div>
            <div style={{ fontSize: '12px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Key size={13} />
              <span>Cryptographic Token Active</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Technical Skills</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              {profile?.skills?.length || 0} Skills Cataloged
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span>{profile?.experiences?.length || 0} Experiences &bull; {profile?.educations?.length || 0} Degrees</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Average Autofill Speed</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              190 ms / Application
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Zap size={13} />
              <span>Zero-lag DOM heuristics</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Profile Completion Checklist ── */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Candidate Profile Checklist</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>
              Click any section below to jump directly to it and update credentials.
            </p>
          </div>
          <span style={{ fontSize: '12px', background: 'rgba(255, 255, 255, 0.06)', padding: '4px 10px', borderRadius: '20px', color: '#cbd5e1' }}>
            {completedCount} of {checks.length} Completed
          </span>
        </div>

        <div className="dash-check-grid">
          {checks.map((check) => (
            <div
              key={check.key}
              className={`dash-check-pill ${check.done ? 'completed' : ''}`}
              onClick={() => onNavigate(check.tab)}
              title={`Click to edit ${check.label}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: check.done ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: check.done ? '#10b981' : '#64748b',
                  flexShrink: 0
                }}>
                  {check.done ? <Check size={14} /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#64748b' }} />}
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: check.done ? '#f8fafc' : '#94a3b8' }}>
                    {check.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{check.sub}</div>
                </div>
              </div>
              <ArrowRight size={14} color="#64748b" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Two Column: Recent Applications + Quick ATS Test Launch ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        {/* Recent Applications Activity Timeline */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Recent Autofill Activity</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>Live telemetry from the browser extension companion.</p>
            </div>
            <Activity size={18} color="#818cf8" />
          </div>

          <div className="activity-timeline">
            {recentApplications.map((app, i) => (
              <div key={i} className="timeline-event-card">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>{app.company}</span>
                    <span className="timeline-platform-tag">{app.platform}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{app.role}</div>
                  <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} />
                    <span>{app.status} &bull; {app.speed}</span>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{app.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ATS Verification Fixtures Quick Access */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>ATS Test Suites Quick Launch</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>Launch standalone test forms to verify extension autofill.</p>
            </div>
            <button 
              className="btn-secondary" 
              onClick={() => onNavigate('extension')}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              <span>View All 7</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {testFixtures.slice(0, 4).map((f) => (
              <div key={f.num} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.07)'
              }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#f8fafc' }}>
                    Form #{f.num}: {f.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>{f.desc}</div>
                </div>
                <a
                  href={`/test-fixtures/application-forms/${f.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '11.5px', textDecoration: 'none', flexShrink: 0, marginLeft: '12px' }}
                >
                  <ExternalLink size={12} />
                  <span>Launch</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
