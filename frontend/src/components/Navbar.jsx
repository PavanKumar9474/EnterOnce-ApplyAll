import React, { useState, useEffect } from 'react';
import { 
  User, FileText, Chrome, Shield, ExternalLink, LogIn, LogOut, 
  CheckCircle, Sparkles, LayoutDashboard, Home, Zap
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout, onQuickDemoLogin }) {
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/health')
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

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
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

        {/* Navigation Items */}
        <nav className="navbar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
          <div className="backend-status-pill" title="FastAPI Backend Health">
            <span className={`status-indicator-dot ${backendOnline ? 'online' : 'offline'}`} />
            <span>{backendOnline ? 'API 8000' : 'Offline'}</span>
          </div>

          {user ? (
            <div className="user-profile-menu">
              <div 
                className="user-badge" 
                onClick={() => setActiveTab('profile')}
                title="View Master Profile"
              >
                <div className="user-avatar-circle">
                  {(user.full_name || user.email || 'A')[0].toUpperCase()}
                </div>
                <span className="user-display-name">
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
                title="One-click demo login with pre-seeded Stanford credentials"
              >
                <Zap size={14} />
                <span>Demo Account</span>
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-signin-nav"
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
