import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, LayoutDashboard, User, FileText, Chrome, Shield, 
  Home, Zap, Key, ExternalLink, Sparkles, LogOut, FileCode, Check 
} from 'lucide-react';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  onNavigate, 
  user, 
  onQuickDemoLogin, 
  onLogout,
  onGenerateToken
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allItems = [
    // Navigation
    { id: 'nav-dash', category: 'Navigation', title: 'Go to Dashboard', subtitle: 'Overview, readiness score, and quick metrics', icon: LayoutDashboard, action: () => onNavigate('dashboard') },
    { id: 'nav-profile', category: 'Navigation', title: 'Edit Master Candidate Profile', subtitle: 'Personal data, education, skills, and experience', icon: User, action: () => onNavigate('profile') },
    { id: 'nav-resume', category: 'Navigation', title: 'Open Resume Studio', subtitle: 'Upload PDF resumes and auto-parse text with PyMuPDF', icon: FileText, action: () => onNavigate('resume') },
    { id: 'nav-ext', category: 'Navigation', title: 'Chrome Extension & Token', subtitle: 'Configure Manifest V3 companion and generate sync token', icon: Chrome, action: () => onNavigate('extension') },
    { id: 'nav-settings', category: 'Navigation', title: 'Application Settings', subtitle: 'API endpoints, token revocation, and export', icon: Shield, action: () => onNavigate('settings') },
    { id: 'nav-landing', category: 'Navigation', title: 'Product Overview & Tour', subtitle: 'View landing page and live autofill simulator', icon: Home, action: () => onNavigate('landing') },

    // Quick Actions
    { id: 'act-demo', category: 'Quick Actions', title: 'Instant Demo Profile (Alex Morgan)', subtitle: 'Pre-seed Stanford CS candidate credentials without signup', icon: Zap, action: () => onQuickDemoLogin?.() },
    { id: 'act-token', category: 'Quick Actions', title: 'Generate Extension Token', subtitle: 'Create a 90-day high-entropy token for the browser extension', icon: Key, action: () => onGenerateToken ? onGenerateToken() : onNavigate('extension') },

    // ATS Test Fixtures
    { id: 'fix-1', category: 'ATS Test Suites', title: 'Test Form 1: Standard Application', subtitle: 'Simulates Workday / Greenhouse candidate form layout', icon: FileCode, action: () => window.open('/test-fixtures/application-forms/form1_standard.html', '_blank') },
    { id: 'fix-2', category: 'ATS Test Suites', title: 'Test Form 2: Split Name & Address', subtitle: 'Separated First/Middle/Last and multi-line address', icon: FileCode, action: () => window.open('/test-fixtures/application-forms/form2_split_name.html', '_blank') },
    { id: 'fix-3', category: 'ATS Test Suites', title: 'Test Form 3: Dropdowns & Questionnaire', subtitle: 'Taleo/Lever style select menus and radio groups', icon: FileCode, action: () => window.open('/test-fixtures/application-forms/form3_dropdown_heavy.html', '_blank') },
    { id: 'fix-6', category: 'ATS Test Suites', title: 'Test Form 6: Multi-Record Repeated Sections', subtitle: 'Tests "+ Add Another Experience" auto-expansion', icon: FileCode, action: () => window.open('/test-fixtures/application-forms/form6_repeated_sections.html', '_blank') },
    { id: 'fix-7', category: 'ATS Test Suites', title: 'Test Form 7: Enterprise Screening', subtitle: 'IBM portal with custom questions and prompt detection', icon: FileCode, action: () => window.open('/test-fixtures/application-forms/form7_enterprise_screening.html', '_blank') },

    // Session
    ...(user ? [{ id: 'act-logout', category: 'Account', title: 'Sign Out', subtitle: `Currently signed in as ${user.email}`, icon: LogOut, action: () => onLogout?.() }] : [])
  ];

  const filteredItems = allItems.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || 
           item.subtitle.toLowerCase().includes(q) || 
           item.category.toLowerCase().includes(q);
  });

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-palette-backdrop" onClick={onClose}>
      <div 
        className="cmd-palette-modal" 
        onClick={e => e.stopPropagation()} 
        onKeyDown={handleKeyDown}
      >
        <div className="cmd-search-header">
          <Search size={18} color="#818cf8" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-search-input"
            placeholder="Type a command or search sections (e.g. 'resume', 'form 7', 'demo')..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <span className="cmd-esc-badge">ESC</span>
        </div>

        <div className="cmd-results-list">
          {filteredItems.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              No commands matching "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  className={`cmd-item ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="cmd-item-left">
                    <div className="cmd-item-icon">
                      <Icon size={15} />
                    </div>
                    <div>
                      <div className="cmd-item-title">{item.title}</div>
                      <div className="cmd-item-subtitle">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className="cmd-shortcut">{item.category}</span>
                </button>
              );
            })
          )}
        </div>

        <div className="cmd-footer">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span>Navigation: <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 5px', borderRadius: '4px' }}>↑</kbd> <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 5px', borderRadius: '4px' }}>↓</kbd></span>
            <span>Select: <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 5px', borderRadius: '4px' }}>↵ Enter</kbd></span>
          </div>
          <span>ApplyOnce Command Hub</span>
        </div>
      </div>
    </div>
  );
}
