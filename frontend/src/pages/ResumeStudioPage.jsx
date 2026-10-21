import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, 
  Trash2, Sparkles, Check, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';

export default function ResumeStudioPage({ addToast, onProfileRefresh }) {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [loadingList, setLoadingList] = useState(true);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      addToast('Only PDF resumes are supported.', 'error');
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
      addToast('Resume uploaded and text extracted with PyMuPDF!', 'success');
      loadResumes();
    } catch (err) {
      addToast(err.message || 'Failed to process resume.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmApply = async () => {
    if (!extractionResult) return;
    try {
      await api.resumes.confirm(extractionResult.resume_id, extractionResult.parsed_profile);
      addToast('Extracted resume data merged into candidate profile!', 'success');
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

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
          Resume Processing Studio
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
          Upload your PDF resume to extract text using PyMuPDF and automatically populate your candidate profile.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Upload Dropzone */}
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(99, 102, 241, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#818cf8'
          }}>
            <Upload size={32} />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
            Upload PDF Candidate Resume
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '420px', margin: '8px auto 20px auto' }}>
            Supports standard PDF resumes up to 10MB. Text is parsed into candidate name, contact info, education, skills, and projects.
          </p>

          <label className="btn btn-primary" style={{ display: 'inline-flex', cursor: 'pointer' }}>
            <FileText size={16} />
            <span>{uploading ? 'Extracting with PyMuPDF...' : 'Select PDF Resume'}</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              disabled={uploading}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Extraction Result Banner & Review */}
        {extractionResult && (
          <div className="glass-card" style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-verified">PyMuPDF Text Parsed</span>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                    Confidence: <strong>{Math.round(extractionResult.confidence_score * 100)}%</strong>
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                  Extracted Candidate Information
                </h3>
              </div>

              <button onClick={handleConfirmApply} className="btn btn-success">
                <Check size={16} />
                <span>Apply to Master Profile</span>
              </button>
            </div>

            <div className="grid-2" style={{ gap: '20px' }}>
              {/* Parsed Fields */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '16px', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#818cf8', marginBottom: '12px' }}>
                  Detected Structured Fields
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Name:</span>{' '}
                    <strong style={{ color: '#fff' }}>{extractionResult.parsed_profile?.personal?.fullName || 'Not detected'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Email:</span>{' '}
                    <strong style={{ color: '#fff' }}>{extractionResult.parsed_profile?.personal?.email || 'Not detected'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Phone:</span>{' '}
                    <strong style={{ color: '#fff' }}>{extractionResult.parsed_profile?.personal?.phone || 'Not detected'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Education:</span>{' '}
                    <strong style={{ color: '#fff' }}>
                      {extractionResult.parsed_profile?.education?.[0]?.degree || 'Not detected'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Skills ({extractionResult.parsed_profile?.skills?.length || 0}):</span>{' '}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {extractionResult.parsed_profile?.skills?.map((s, idx) => (
                        <span key={idx} style={{
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#c7d2fe',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Preview */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '16px', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#818cf8', marginBottom: '12px' }}>
                  Raw Extracted Text (PyMuPDF)
                </h4>
                <pre style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#94a3b8',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {extractionResult.extracted_text_preview}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Resumes History */}
        <div className="glass-card">
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
            Resume Archive
          </h3>

          {resumes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {resumes.map(r => (
                <div key={r.id} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={20} color="#818cf8" />
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>{r.filename}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                        {(r.file_size / 1024).toFixed(1)} KB &bull; Uploaded on {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteResume(r.id)}
                    className="btn btn-danger"
                    style={{ padding: '6px 10px' }}
                    title="Delete resume"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0', fontSize: '14px' }}>
              {loadingList ? 'Loading archive...' : 'No resumes uploaded yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
