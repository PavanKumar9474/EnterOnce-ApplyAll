import React, { useState, useEffect } from 'react';
import { 
  Chrome, Key, Copy, Check, ExternalLink, ShieldCheck, 
  Sparkles, Layers, PlayCircle, RefreshCw, AlertCircle, FileCode
} from 'lucide-react';
import { api, API_ROOT } from '../services/api';

export default function ExtensionPage({ user, addToast }) {
  const [tokenData, setTokenData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    setBackendStatus('checking');
    try {
      const res = await fetch(`${API_ROOT}/health`);
      if (res.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  const handleGenerateToken = async () => {
    if (!user) {
      addToast('Please sign in or use demo account to generate an extension token.', 'error');
      return;
    }
    setGenerating(true);
    try {
      const data = await api.extension.createSession('Chrome Extension v1.0');
      setTokenData(data);
      addToast('Extension session token generated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate token.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!tokenData?.token) return;
    navigator.clipboard.writeText(tokenData.token);
    setCopied(true);
    addToast('Token copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const testFixtures = [
    {
      id: 'form1',
      title: 'Form 1: Standard Application',
      desc: 'Full Name, Email, Phone, LinkedIn, Education, Experience, Cover Bio',
      filename: 'form1_standard.html'
    },
    {
      id: 'form2',
      title: 'Form 2: Split Name & International',
      desc: 'First Name, Middle Name, Last Name, Country, Postal Code, Relocation & Visa',
      filename: 'form2_split_name.html'
    },
    {
      id: 'form3',
      title: 'Form 3: Dropdown & Select Heavy',
      desc: 'Degree selection, Relocation radio, Experience level, Notice period',
      filename: 'form3_dropdown_heavy.html'
    },
    {
      id: 'form4',
      title: 'Form 4: Alternative Labels & Hints',
      desc: 'Handles synonyms: "Cellular", "Highest Qualification", "Current Employer"',
      filename: 'form4_alternative_labels.html'
    },
    {
      id: 'form5',
      title: 'Form 5: Dynamic SPA Framework',
      desc: 'Simulates React/Vue dynamic form rendering with delayed field injection',
      filename: 'form5_dynamic_framework.html'
    },
    {
      id: 'form6',
      title: 'Form 6: Multi-Record Repeated Sections',
      desc: 'Dynamic "+ Add Another Education" and "+ Add Another Experience" multi-record expansion',
      filename: 'form6_repeated_sections.html'
    },
    {
      id: 'form7',
      title: 'Form 7: Enterprise Screening & Questions',
      desc: 'IBM style portal with visa sponsorship, notice period, and "Answer Needed" workflow',
      filename: 'form7_enterprise_screening.html'
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                background: 'rgba(99, 102, 241, 0.2)',
                padding: '8px',
                borderRadius: '10px',
                color: '#818cf8',
                display: 'flex'
              }}>
                <Chrome size={24} />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                ApplyOnce Chrome Extension
              </h1>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '640px', lineHeight: 1.6 }}>
              Autofill job applications across career portals in seconds with 3-tier confidence scoring, anti-overwrite protection, and an interactive review drawer.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: backendStatus === 'online' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: `1px solid ${backendStatus === 'online' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              borderRadius: '8px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: backendStatus === 'online' ? '#10b981' : '#f43f5e',
                boxShadow: backendStatus === 'online' ? '0 0 8px #10b981' : '0 0 8px #f43f5e'
              }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: backendStatus === 'online' ? '#34d399' : '#fb7185' }}>
                {backendStatus === 'online' ? 'Backend API Connected' : backendStatus === 'checking' ? 'Checking API...' : 'Backend Offline'}
              </span>
            </div>
            <button onClick={checkBackend} className="btn btn-secondary" style={{ padding: '8px 12px' }} title="Refresh API status">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Installation Steps & Session Token */}
      <div className="grid-2">
        {/* Token Management Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Key size={20} color="#818cf8" />
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>
                Extension Sync Token
              </h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
              Generate a secure, 90-day extension token to sync your master candidate profile directly into the Chrome Extension popup.
            </p>

            {tokenData ? (
              <div style={{
                background: 'rgba(10, 14, 23, 0.8)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#818cf8', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>
                  Active Extension Token
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: '#e2e8f0',
                  wordBreak: 'break-all',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}>
                  {tokenData.token}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Valid for 90 days (Device: {tokenData.device_name})
                  </span>
                  <button onClick={handleCopy} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy Token'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '24px',
                textAlign: 'center',
                color: '#94a3b8',
                marginBottom: '20px',
                fontSize: '13px'
              }}>
                No active token generated yet in this session.
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateToken}
            disabled={generating}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            <Sparkles size={16} />
            <span>{generating ? 'Generating Token...' : (tokenData ? 'Generate New Session Token' : 'Generate Extension Token')}</span>
          </button>
        </div>

        {/* Installation Instructions */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Layers size={20} color="#06b6d4" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>
              How to Install Extension (30s)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                step: '1',
                title: 'Open Extensions Management',
                desc: 'Open Google Chrome or Edge and navigate to chrome://extensions'
              },
              {
                step: '2',
                title: 'Enable Developer Mode',
                desc: 'Toggle the "Developer mode" switch in the top-right corner.'
              },
              {
                step: '3',
                title: 'Load Unpacked Extension',
                desc: 'Click "Load unpacked" and select the ApplyOnce/extension directory.'
              },
              {
                step: '4',
                title: 'Pin & Connect Profile',
                desc: 'Click the puzzle icon, pin ApplyOnce, open popup -> Settings, and paste your token or login!'
              }
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                  flexShrink: 0
                }}>
                  {item.step}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '14px' }}>{item.title}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px', lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Fixture Catalog Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PlayCircle size={20} color="#10b981" />
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>
                Interactive Form Test Fixtures
              </h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
              Test the extension autofill engine across 5 diverse enterprise application layouts.
            </p>
          </div>
          <a
            href="http://localhost:5173/test-fixtures/application-forms/index.html"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <span>Open All Fixtures Catalog</span>
            <ExternalLink size={14} />
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {testFixtures.map(fixture => (
            <div key={fixture.id} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.15s ease'
            }}>
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCode size={16} color="#818cf8" />
                  <span>{fixture.title}</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  {fixture.desc}
                </div>
              </div>

              <a
                href={`/test-fixtures/application-forms/${fixture.filename}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <span>Launch Form</span>
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
