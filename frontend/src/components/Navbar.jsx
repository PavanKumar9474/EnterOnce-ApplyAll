import React from 'react';
import { User, FileText, Chrome, Shield, ExternalLink, LogIn, LogOut, CheckCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout, onQuickDemoLogin }) {
  return (
    <header style={{
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '18px',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            AO
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: '#fff' }}>
              ApplyOnce
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Universal Career Autofill
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'profile', label: 'Candidate Profile', icon: User },
            { id: 'resume', label: 'Resume Studio', icon: FileText },
            { id: 'extension', label: 'Extension Setup', icon: Chrome },
            { id: 'settings', label: 'Settings & Privacy', icon: Shield },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isActive ? '#818cf8' : '#94a3b8',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Auth / User Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981'
                }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                  {user.full_name || user.email.split('@')[0]}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                title="Sign out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={onQuickDemoLogin}
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Demo Account
              </button>
              <button
                onClick={onOpenAuth}
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
