import React, { useState, useEffect } from 'react';
import { 
  User, FileText, Chrome, Shield, ExternalLink, LogIn, LogOut, 
  CheckCircle, Sparkles, LayoutDashboard, Home, Zap, Search, Menu, X
} from 'lucide-react';
import { API_ROOT } from '../services/api';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenAuth, 
  onLogout, 
  onQuickDemoLogin,
  onOpenCommandPalette 
}) {
  const [backendOnline, setBackendOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_ROOT}/health`)
      .then(res => res.ok ? setBackendOnline(true) : setBackendOnline(false))
      .catch(() => setBackendOnline(false));
  }, []);

  const navItems = user ? [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'resume', label: 'Resume Studio', icon: FileText },
    { id: 'extension', label: 'Extension', icon: Chrome },
    { id: 'landing', label: 'Product Tour', icon: Home },
    { id: 'settings', label: 'Settings', icon: Shield },
  ] : [
    { id: 'landing', label: 'Overview', icon: Home },
    { id: 'extension', label: 'Extension Setup', icon: Chrome }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand */}
        <div 
          onClick={() => handleNavClick(user ? 'dashboard' : 'landing')}
          className="navbar-brand"
        >
          <div className="brand-logo-mark">
            <span>⚡</span>
          </div>
          <div>
            <div className="brand-title">
              ApplyOnce
            </div>
            <div className="brand-subtitle">
              Universal Autofill
            </div>
          </div>
        </div>

        {/* Global Search / Command Palette Trigger */}
        <button 
          className="nav-cmd-trigger hide-mobile" 
          onClick={onOpenCommandPalette}
          title="Open Command Palette (Ctrl+K or Cmd+K)"
        >
          <Search size={14} />
          <span>Quick Find...</span>
          <span className="nav-cmd-kbd">Ctrl K</span>
        </button>

        {/* Desktop Navigation Items */}
        <nav className="navbar-nav hide-mobile">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`navbar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status & Auth Area */}
        <div className="navbar-auth-area">
          <div className="backend-status-pill" title="FastAPI Backend Health (Port 8000)">
            <span className={`status-indicator-dot ${backendOnline ? 'online' : 'offline'}`} />
            <span className="hide-mobile">{backendOnline ? 'API Online' : 'API Offline'}</span>
          </div>

          {user ? (
            <div className="user-profile-menu">
              <div 
                className="user-badge" 
                onClick={() => handleNavClick('profile')}
                title="View Master Candidate Profile"
              >
                <div className="user-avatar-circle">
                  {(user.full_name || user.email || 'A')[0].toUpperCase()}
                </div>
                <span className="user-display-name hide-mobile">
                  {user.full_name || user.email.split('@')[0]}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="btn-signout"
                title="Sign out of ApplyOnce"
              >
                <LogOut size={14} />
                <span className="hide-mobile">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="guest-auth-actions">
              <button
                onClick={onQuickDemoLogin}
                className="btn-demo-quick"
                title="One-click instant login with Stanford CS credentials"
              >
                <Zap size={14} />
                <span>Demo Access</span>
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-signin-nav"
              >
                <LogIn size={14} />
                <span className="hide-mobile">Sign In</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              display: 'none', 
              background: 'transparent', 
              border: 'none', 
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(14, 20, 34, 0.98)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button 
            className="nav-cmd-trigger" 
            onClick={() => { setMobileMenuOpen(false); onOpenCommandPalette(); }}
            style={{ width: '100%', justifyContent: 'space-between', marginBottom: '8px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={14} />
              <span>Search & Commands</span>
            </div>
            <span className="nav-cmd-kbd">Ctrl K</span>
          </button>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`navbar-nav-item ${isActive ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
