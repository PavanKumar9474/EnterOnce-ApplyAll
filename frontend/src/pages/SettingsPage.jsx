import React, { useState } from 'react';
import { 
  Shield, Download, Trash2, Database, Key, Server, 
  CheckCircle, AlertTriangle, RefreshCw, Lock, FileJson
} from 'lucide-react';
import { api, API_BASE } from '../services/api';

export default function SettingsPage({ user, onLogout, addToast }) {
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [apiStatus, setApiStatus] = useState('healthy');

  const handleExportData = async () => {
    setExporting(true);
    try {
      const data = await api.account.exportData();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `applyonce_candidate_data_${user?.id || 'export'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      addToast('Candidate profile data exported successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to export data.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.account.deleteAccount();
      addToast('Account and all associated candidate profile data have been permanently removed.', 'info');
      onLogout();
    } catch (err) {
      addToast(err.message || 'Failed to delete account.', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleClearLocalStorage = () => {
    const keysToRemove = ['ao_auth_token', 'applyonce_cache'];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    addToast('Local client-side cache wiped successfully.', 'info');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={26} color="#818cf8" />
          <span>Settings & Data Privacy</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
          Manage your candidate credentials, data sovereignty, export portability, and session security.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="glass-card">
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} color="#06b6d4" />
          <span>Account & Identity</span>
        </h2>

        <div className="grid-2" style={{ marginBottom: '16px' }}>
          <div>
            <div className="form-label">Full Legal Name</div>
            <div style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 600 }}>
              {user?.full_name || 'Anonymous User'}
            </div>
          </div>
          <div>
            <div className="form-label">Primary Email</div>
            <div style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 600 }}>
              {user?.email || 'N/A'}
            </div>
          </div>
          <div>
            <div className="form-label">Account ID</div>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontFamily: 'monospace' }}>
              {user?.id ? `usr_${user.id}` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="form-label">Backend API Endpoint</div>
            <div style={{ color: '#34d399', fontSize: '13px', fontFamily: 'monospace' }}>
              {API_BASE}
            </div>
          </div>
        </div>
      </div>

      {/* Data Sovereignty & Portability Card */}
      <div className="glass-card">
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} color="#10b981" />
          <span>Data Sovereignty & Portability (GDPR/CCPA)</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
          You own 100% of your career profile data. Download your complete profile, educational history, work experience, projects, uploaded resume records, and audit logs at any time.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportData}
            disabled={exporting}
            className="btn btn-secondary"
            style={{ padding: '10px 18px' }}
          >
            <Download size={16} color="#818cf8" />
            <span>{exporting ? 'Generating JSON...' : 'Export Complete Profile (JSON)'}</span>
          </button>

          <button
            onClick={handleClearLocalStorage}
            className="btn btn-secondary"
            style={{ padding: '10px 18px' }}
          >
            <RefreshCw size={15} />
            <span>Clear Browser Storage Cache</span>
          </button>
        </div>
      </div>

      {/* Privacy Architecture Notice */}
      <div className="glass-card" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#818cf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} />
          <span>ApplyOnce Privacy Guarantees</span>
        </h3>
        <ul style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7, paddingLeft: '20px' }}>
          <li><strong>No Keystroke Logging:</strong> The extension only scans DOM input tags when explicitly requested.</li>
          <li><strong>Anti-Overwrite Protection:</strong> Pre-filled inputs are never modified unless the "Overwrite" option is manually enabled.</li>
          <li><strong>Zero Third-Party Trackers:</strong> No advertising scripts, analytics beacons, or third-party telemetries are loaded.</li>
          <li><strong>Cryptographic Tokens:</strong> Extension sessions use high-entropy secrets and can be revoked at any time.</li>
        </ul>
      </div>

      {/* Danger Zone */}
      <div className="glass-card" style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fb7185', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="#fb7185" />
          <span>Danger Zone</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, marginBottom: '18px' }}>
          Permanently delete your account, candidate profile, uploaded resumes, and history. This action cannot be undone.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="btn btn-danger"
          style={{ padding: '10px 18px' }}
        >
          <Trash2 size={16} />
          <span>Delete Account & Erase All Data</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fb7185', marginBottom: '12px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Confirm Account Deletion</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
              Are you sure you want to delete your ApplyOnce account? All stored profile entries, education, experience, and uploaded resumes will be purged permanently.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="btn btn-danger"
                style={{ flex: 1, padding: '10px' }}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
                style={{ padding: '10px 18px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
