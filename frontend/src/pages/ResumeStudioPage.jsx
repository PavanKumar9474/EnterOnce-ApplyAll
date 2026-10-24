import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, 
  Trash2, Sparkles, Check, RefreshCw, FileCode, CheckCircle2,
  Download, Eye, ArrowUpRight, Cpu, Layers
} from 'lucide-react';
import { api } from '../services/api';

export default function ResumeStudioPage({ addToast, onProfileRefresh }) {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await api.resumes.list();
      setResumes(data);
    } catch (err) {
      console.warn('Failed to load resumes list:', err);
    } finally {
      setLoadingList(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;

    const fn = file.name.toLowerCase();
    if (!fn.endsWith('.pdf') && !fn.endsWith('.docx') && !fn.endsWith('.doc')) {
      addToast('Only PDF and DOCX resumes are supported.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('File exceeds 10MB limit.', 'error');
      return;
    }

    setUploading(true);
    setExtractionResult(null);

    try {
      const result = await api.resumes.upload(file);
      setExtractionResult(result);
      addToast('Resume uploaded and extracted using PyMuPDF successfully!', 'success');
      loadResumes();
    } catch (err) {
      addToast(err.message || 'Failed to process resume.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleSampleResume = () => {
    // Simulated instant sample parsing result
    setExtractionResult({
      resume_id: 'sample-resume-demo',
      file_name: 'Alex_Morgan_Stanford_Resume_2024.pdf',
      parsed_profile: {
        first_name: 'Alex',
        last_name: 'Morgan',
        full_name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+1 (415) 890-2341',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Stanford University',
        graduation_year: '2023',
        cgpa: '3.92',
        skills: ['React', 'TypeScript', 'Node.js', 'FastAPI', 'Python', 'Docker', 'PostgreSQL', 'TailwindCSS', 'AWS', 'PyTorch'],
        experience: [
          { company: 'Stripe', role: 'Full Stack Engineer', duration: '2023 - Present', highlights: 'Engineered high-throughput payments orchestration and micro-frontends in React and TypeScript.' },
          { company: 'Meta', role: 'Software Engineering Intern', duration: 'Summer 2022', highlights: 'Optimized real-time graph query execution by 28% utilizing C++ and Python.' }
        ]
      },
      raw_text: `ALEX MORGAN\nSan Francisco, CA • alex.morgan@example.com • +1 (415) 890-2341 • linkedin.com/in/alexmorgan-dev\n\nEDUCATION\nStanford University — B.S. in Computer Science (GPA: 3.92/4.0), Graduated 2023\nCoursework: Distributed Systems, Compilers, Machine Learning, Operating Systems\n\nEXPERIENCE\nStripe — Full Stack Engineer (2023 - Present)\n• Built mission-critical merchant onboarding flows serving 10M+ daily events\n• Optimized database indexing reducing latency by 45%\n\nMeta — Software Engineering Intern (Summer 2022)\n• Built internal diagnostic tooling reducing onboarding time by 30%\n\nTECHNICAL SKILLS\nLanguages: Python, TypeScript, JavaScript, SQL, C++\nFrameworks: React, FastAPI, Node.js, Express, TailwindCSS\nTools: Docker, Kubernetes, AWS, Git, Redis`
    });
    addToast('Sample Stanford CS resume parsed and loaded into studio!', 'success');
  };

  const handleConfirmApply = async () => {
    if (!extractionResult) return;
    try {
      if (extractionResult.resume_id === 'sample-resume-demo') {
        addToast('Sample resume data merged into candidate profile!', 'success');
      } else {
        await api.resumes.confirm(extractionResult.resume_id, extractionResult.parsed_profile);
        addToast('Extracted resume data merged into candidate profile!', 'success');
      }
      setExtractionResult(null);
      if (onProfileRefresh) onProfileRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to apply extracted data.', 'error');
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      await api.resumes.delete(id);
      setResumes(prev => prev.filter(r => r.id !== id));
      addToast('Resume deleted.', 'success');
    } catch (err) {
      addToast('Failed to delete resume.', 'error');
    }
  };

  const p = extractionResult?.parsed_profile;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#a5b4fc', marginBottom: '8px' }}>
          <Cpu size={14} />
          <span>Local PyMuPDF Engine &bull; Zero External AI API Latency</span>
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
          Resume Processing Studio
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '6px' }}>
          Upload your PDF resume to extract clean structured data using PyMuPDF and automatically populate your candidate profile.
        </p>
      </div>

      {/* ── Drag & Drop Upload Zone ── */}
      <div 
        className="glass-card" 
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{ 
          textAlign: 'center', 
          padding: '48px 24px',
          border: isDragOver ? '2px dashed #6366f1' : '2px dashed rgba(255, 255, 255, 0.15)',
          background: isDragOver ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#818cf8',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)'
        }}>
          {uploading ? <RefreshCw size={28} className="spin-slow" /> : <Upload size={28} />}
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
          {uploading ? 'Parsing PDF via PyMuPDF...' : 'Drag and drop your resume file here'}
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '13.5px', maxWidth: '440px', margin: '0 auto 20px' }}>
          Supports PDF and DOCX files up to 10MB. Parsing occurs securely on your local FastAPI service.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label className="btn-primary" style={{ cursor: 'pointer', padding: '12px 22px', fontSize: '14px' }}>
            <FileText size={16} />
            <span>Select PDF from Computer</span>
            <input 
              type="file" 
              accept=".pdf,.docx,.doc" 
              onChange={handleFileUpload} 
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleSampleResume}
            style={{ padding: '12px 20px', fontSize: '14px' }}
          >
            <Sparkles size={16} color="#f59e0b" />
            <span>⚡ Load Sample Stanford Resume</span>
          </button>
        </div>
      </div>

      {/* ── Extracted Result Inspection Panel ── */}
      {extractionResult && (
        <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(16, 185, 129, 0.35)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                <CheckCircle2 size={16} />
                <span>Text Extracted & Structured Successfully</span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                {extractionResult.file_name}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setExtractionResult(null)}
                style={{ padding: '10px 16px', fontSize: '13px' }}
              >
                Dismiss
              </button>
              <button 
                className="btn-primary" 
                onClick={handleConfirmApply}
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '10px 20px', fontSize: '13.5px' }}
              >
                <Check size={16} />
                <span>Merge into Candidate Profile</span>
              </button>
            </div>
          </div>

          {/* Sub-tab view for extracted data */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', marginBottom: '20px' }}>
            <button 
              className={`tab-pill ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
              style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === 'summary' ? 'rgba(99, 102, 241, 0.2)' : 'transparent', color: activeTab === 'summary' ? '#a5b4fc' : '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              Structured Entities
            </button>
            <button 
              className={`tab-pill ${activeTab === 'raw' ? 'active' : ''}`}
              onClick={() => setActiveTab('raw')}
              style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === 'raw' ? 'rgba(99, 102, 241, 0.2)' : 'transparent', color: activeTab === 'raw' ? '#a5b4fc' : '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              Raw PyMuPDF Text
            </button>
          </div>

          {activeTab === 'summary' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Contact Details</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginTop: '6px' }}>{p?.full_name || p?.first_name || 'N/A'}</div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>{p?.email || 'N/A'}</div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>{p?.phone || 'N/A'}</div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Academic Credentials</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginTop: '6px' }}>{p?.institution || 'N/A'}</div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '2px' }}>{p?.degree || 'N/A'}</div>
                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>GPA: {p?.cgpa || 'N/A'} &bull; Grad Year: {p?.graduation_year || 'N/A'}</div>
              </div>

              <div style={{ gridColumn: 'span 2', background: 'rgba(0, 0, 0, 0.25)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Extracted Technical Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {p?.skills && p.skills.length > 0 ? (
                    p.skills.map((s, idx) => (
                      <span key={idx} style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#c7d2fe', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '13px' }}>No explicit skills detected</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <pre style={{
              background: '#080c14',
              padding: '18px',
              borderRadius: '10px',
              fontSize: '12px',
              color: '#94a3b8',
              maxHeight: '300px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {extractionResult.raw_text}
            </pre>
          )}
        </div>
      )}

      {/* ── Uploaded Resumes Vault ── */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
          Uploaded Resumes Vault
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '13.5px', marginBottom: '20px' }}>
          Resumes stored in your local SQLite database for profile syncing.
        </p>

        {loadingList ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed rgba(255, 255, 255, 0.08)' }}>
            <FileText size={36} color="#475569" style={{ margin: '0 auto 10px' }} />
            <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>No resumes uploaded yet</div>
            <div style={{ color: '#64748b', fontSize: '12.5px', marginTop: '4px' }}>
              Upload your PDF above or click &ldquo;Load Sample Stanford Resume&rdquo; to test parsing.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {resumes.map(r => (
              <div 
                key={r.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{r.filename}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      {(r.file_size ? `${(r.file_size / 1024).toFixed(1)} KB` : 'PDF Document')} &bull; Uploaded {new Date(r.uploaded_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleDeleteResume(r.id)}
                    style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
