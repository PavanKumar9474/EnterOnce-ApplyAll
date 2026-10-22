import React from 'react';
import { 
  User, GraduationCap, Briefcase, Code, FileText, Chrome, 
  ShieldCheck, CheckCircle2, ArrowRight, Zap, ExternalLink, 
  Sparkles, Layers, Activity, AlertCircle, RefreshCw, Key
} from 'lucide-react';

export default function DashboardPage({ profile, user, onNavigate, onQuickDemoLogin, addToast }) {
  // Calculate completion percentage
  const checks = [
    { label: 'Personal Information', key: 'personal', done: Boolean(profile?.first_name && profile?.email && profile?.phone), tab: 'profile' },
    { label: 'Education History', key: 'education', done: Boolean(profile?.educations && profile.educations.length > 0), tab: 'profile' },
    { label: 'Work Experience', key: 'experience', done: Boolean(profile?.experiences && profile.experiences.length > 0), tab: 'profile' },
    { label: 'Technical Skills', key: 'skills', done: Boolean(profile?.skills && profile.skills.length > 0), tab: 'profile' },
    { label: 'Resume Uploaded & Parsed', key: 'resume', done: Boolean(profile?.resumes && profile.resumes.length > 0), tab: 'resume' },
    { label: 'Work Authorization & Preferences', key: 'auth', done: Boolean(profile?.work_authorization), tab: 'profile' }
  ];

  const completedCount = checks.filter(c => c.done).length;
  const completionPercentage = Math.round((completedCount / checks.length) * 100);

  const testFixtures = [
    { num: '1', title: 'Standard Application', desc: 'Workday & Greenhouse style layout with legal name, email, phone, and degree.', file: 'form1_standard.html' },
    { num: '2', title: 'Split-Name & Address', desc: 'Separated First/Last name inputs and multi-line address fields.', file: 'form2_split_name.html' },
    { num: '3', title: 'Dropdown & Questionnaire', desc: 'Taleo/Lever style dropdown options, graduation years, and country selects.', file: 'form3_dropdown_heavy.html' },
    { num: '4', title: 'Alternate Labels & CGPA', desc: 'Cumulative GPA vs. Aggregate % Marks with pre-existing user data preservation test.', file: 'form4_alternative_labels.html' },
    { num: '5', title: 'Dynamic Framework', desc: 'Synthetic React/Angular DOM inputs with input and blur event verification.', file: 'form5_dynamic_framework.html' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* ── Welcome Banner ── */}
      <div className="glass-card" style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        padding: '32px'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#a5b4fc', marginBottom: '12px' }}>
              <Sparkles size={14} />
              <span>Universal Autofill Companion Active</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
              Welcome back, {profile?.first_name || user?.full_name?.split(' ')[0] || 'Candidate'}! 👋
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '6px', maxWidth: '580px' }}>
              Your master candidate profile is active and ready to synchronize with the ApplyOnce Chrome extension for sub-second career portal autofill.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              onClick={() => onNavigate('extension')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '14px', borderRadius: '10px' }}
            >
              <Chrome size={18} />
              <span>Extension Token</span>
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => onNavigate('resume')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '14px', borderRadius: '10px' }}
            >
              <FileText size={18} />
              <span>Resume Studio</span>
            </button>
          </div>
        </div>

        {/* Ambient decorative circle */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* ── Key Metrics Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', flexShrink: 0 }}>
            <User size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Candidate Profile</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              {profile?.full_name || 'Active Profile'}
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <CheckCircle2 size={13} />
              <span>Verified & Synchronized</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4', flexShrink: 0 }}>
            <Chrome size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Chrome Extension</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              Manifest V3 Ready
            </div>
            <div style={{ fontSize: '12px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Key size={13} />
              <span>Port 8000 Sync Connected</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Credentials Stored</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              {(profile?.educations?.length || 0)} Edu &bull; {(profile?.skills?.length || 0)} Skills
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              {(profile?.experiences?.length || 0)} Work Positions
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', flexShrink: 0 }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>n8n Webhook Pipeline</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              Telemetry Active
            </div>
            <div style={{ fontSize: '12px', color: '#c084fc', marginTop: '2px' }}>
              Application Tracking Enabled
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile Completeness Progress ── */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Profile Readiness for Autofill</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
              Higher completeness ensures maximum field match coverage on complex applicant tracking systems.
            </p>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: completionPercentage === 100 ? '#10b981' : '#818cf8' }}>
            {completionPercentage}%
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ 
            width: `${completionPercentage}%`, 
            height: '100%', 
            background: completionPercentage === 100 
              ? 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)' 
              : 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '4px',
            transition: 'width 0.4s ease'
          }} />
        </div>

        {/* Checklist */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {checks.map(item => (
            <div 
              key={item.key}
              onClick={() => onNavigate(item.tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '8px',
                background: item.done ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${item.done ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} color={item.done ? '#10b981' : '#64748b'} />
                <span style={{ fontSize: '13px', fontWeight: 500, color: item.done ? '#f8fafc' : '#94a3b8' }}>
                  {item.label}
                </span>
              </div>
              <ArrowRight size={14} color="#64748b" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Test Fixture Launcher ── */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="#06b6d4" />
              <span>Test Fixtures Verification Playground</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
              Test your candidate profile and the Chrome extension against 5 diverse enterprise career layouts.
            </p>
          </div>
          <button 
            className="btn-secondary" 
            onClick={() => onNavigate('extension')}
            style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '8px' }}
          >
            <span>Extension Instructions</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {testFixtures.map(fixture => (
            <div 
              key={fixture.num}
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ 
                    background: 'rgba(99, 102, 241, 0.2)', 
                    color: '#818cf8', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    padding: '2px 8px', 
                    borderRadius: '4px' 
                  }}>
                    Fixture #{fixture.num}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
                    {fixture.title}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  {fixture.desc}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <a 
                  href={`/test-fixtures/application-forms/${fixture.file}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#06b6d4',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  <span>Open Fixture Tab</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
