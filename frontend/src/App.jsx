import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import CommandPalette from './components/CommandPalette';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ResumeStudioPage from './pages/ResumeStudioPage';
import ExtensionPage from './pages/ExtensionPage';
import SettingsPage from './pages/SettingsPage';
import { api } from './services/api';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Toast notification helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Initial user and profile loading
  const loadUserAndProfile = useCallback(async () => {
    if (!api.auth.hasToken()) {
      setLoading(false);
      return;
    }

    try {
      const userData = await api.auth.getMe();
      setUser(userData);

      try {
        const profileData = await api.profile.get();
        setProfile(profileData);
      } catch (profileErr) {
        console.warn('Profile not found or error loading:', profileErr.message);
      }
    } catch (err) {
      console.warn('Session expired or invalid:', err.message);
      api.auth.logout();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserAndProfile();
  }, [loadUserAndProfile]);

  // When user signs in, route them to dashboard
  useEffect(() => {
    if (user && activeTab === 'landing') {
      setActiveTab('dashboard');
    }
  }, [user]);

  const handleLogin = async (email, password) => {
    await api.auth.login(email, password);
    await loadUserAndProfile();
    setActiveTab('dashboard');
    addToast('Signed in successfully! Welcome to ApplyOnce.', 'success');
  };

  const handleRegister = async (email, password, fullName) => {
    await api.auth.register(email, password, fullName);
    await api.auth.login(email, password);
    await loadUserAndProfile();
    setActiveTab('profile');
    addToast('Account created! Please complete your candidate profile.', 'success');
  };

  const handleQuickDemoLogin = async () => {
    try {
      await api.auth.login('alex.morgan@example.com', 'Password123!');
      await loadUserAndProfile();
      setActiveTab('dashboard');
      addToast('Logged in as Alex Morgan with pre-seeded Stanford credentials!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to authenticate demo user.', 'error');
    }
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setUser(null);
    setProfile(null);
    setActiveTab('landing');
    addToast('Signed out successfully.', 'info');
  };

  // Profile management handlers
  const handleUpdateProfile = async (formData) => {
    try {
      const updated = await api.profile.update(formData);
      setProfile(updated);
      addToast('Profile updated and synchronized successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile.', 'error');
      throw err;
    }
  };

  const handleAddEducation = async (eduData) => {
    try {
      const newEdu = await api.profile.addEducation(eduData);
      setProfile(prev => ({
        ...prev,
        educations: [...(prev?.educations || []), newEdu]
      }));
      addToast('Education credential added!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add education.', 'error');
      throw err;
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      await api.profile.deleteEducation(id);
      setProfile(prev => ({
        ...prev,
        educations: (prev?.educations || []).filter(e => e.id !== id)
      }));
      addToast('Education record removed.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete education.', 'error');
    }
  };

  const handleAddExperience = async (expData) => {
    try {
      const newExp = await api.profile.addExperience(expData);
      setProfile(prev => ({
        ...prev,
        experiences: [...(prev?.experiences || []), newExp]
      }));
      addToast('Work experience record added!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add experience.', 'error');
      throw err;
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await api.profile.deleteExperience(id);
      setProfile(prev => ({
        ...prev,
        experiences: (prev?.experiences || []).filter(e => e.id !== id)
      }));
      addToast('Experience record removed.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete experience.', 'error');
    }
  };

  const handleAddSkill = async (skillData) => {
    try {
      const newSkill = await api.profile.addSkill(skillData);
      setProfile(prev => ({
        ...prev,
        skills: [...(prev?.skills || []), newSkill]
      }));
      addToast('Skill added!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add skill.', 'error');
      throw err;
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.profile.deleteSkill(id);
      setProfile(prev => ({
        ...prev,
        skills: (prev?.skills || []).filter(s => s.id !== id)
      }));
      addToast('Skill removed.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete skill.', 'error');
    }
  };

  const handleAddProject = async (projData) => {
    try {
      const newProj = await api.profile.addProject(projData);
      setProfile(prev => ({
        ...prev,
        projects: [...(prev?.projects || []), newProj]
      }));
      addToast('Project added!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add project.', 'error');
      throw err;
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.profile.deleteProject(id);
      setProfile(prev => ({
        ...prev,
        projects: (prev?.projects || []).filter(p => p.id !== id)
      }));
      addToast('Project removed.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete project.', 'error');
    }
  };

  const handleAddCertification = async (certData) => {
    try {
      const newCert = await api.profile.addCertification(certData);
      setProfile(prev => ({
        ...prev,
        certifications: [...(prev?.certifications || []), newCert]
      }));
      addToast('Certification credential added!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add certification.', 'error');
      throw err;
    }
  };

  const handleDeleteCertification = async (id) => {
    try {
      await api.profile.deleteCertification(id);
      setProfile(prev => ({
        ...prev,
        certifications: (prev?.certifications || []).filter(c => c.id !== id)
      }));
      addToast('Certification record removed.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete certification.', 'error');
    }
  };

  const handleAddLanguage = async (langData) => {
    try {
      const newLang = await api.profile.addLanguage(langData);
      setProfile(prev => ({
        ...prev,
        languages: [...(prev?.languages || []), newLang]
      }));
      addToast('Language proficiency added!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add language.', 'error');
      throw err;
    }
  };

  const handleDeleteLanguage = async (id) => {
    try {
      await api.profile.deleteLanguage(id);
      setProfile(prev => ({
        ...prev,
        languages: (prev?.languages || []).filter(l => l.id !== id)
      }));
      addToast('Language record removed.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete language.', 'error');
    }
  };

  const handleUpdatePreferences = async (prefData) => {
    try {
      const updated = await api.profile.updatePreferences(prefData);
      setProfile(prev => ({ ...prev, preference: updated }));
      addToast('Job preferences updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update preferences.', 'error');
      throw err;
    }
  };

  const handleAddSavedAnswer = async (ansData) => {
    try {
      const newAns = await api.profile.addSavedAnswer(ansData);
      setProfile(prev => {
        const existing = (prev?.saved_answers || []).filter(a => a.id !== newAns.id);
        return {
          ...prev,
          saved_answers: [...existing, newAns]
        };
      });
      addToast('Answer saved to screening library!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save answer.', 'error');
      throw err;
    }
  };

  const handleDeleteSavedAnswer = async (id) => {
    try {
      await api.profile.deleteSavedAnswer(id);
      setProfile(prev => ({
        ...prev,
        saved_answers: (prev?.saved_answers || []).filter(a => a.id !== id)
      }));
      addToast('Saved answer removed.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete answer.', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="brand-logo-mark" style={{ width: '56px', height: '56px', fontSize: '26px', margin: '0 auto 16px auto' }}>
            <span>⚡</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>ApplyOnce</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Loading universal career autofill...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* ── Fixed Floating Navbar ── */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={(mode = 'login') => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onQuickDemoLogin={handleQuickDemoLogin}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* ── Main View Router ── */}
      <main className="main-content">
        {activeTab === 'landing' && (
          <LandingPage
            user={user}
            onOpenAuth={(mode) => {
              setAuthMode(mode);
              setAuthModalOpen(true);
            }}
            onQuickDemoLogin={handleQuickDemoLogin}
            onGoToDashboard={() => setActiveTab('dashboard')}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            profile={profile}
            user={user}
            onNavigate={(tab) => setActiveTab(tab)}
            onQuickDemoLogin={handleQuickDemoLogin}
            addToast={addToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onAddEducation={handleAddEducation}
            onDeleteEducation={handleDeleteEducation}
            onAddExperience={handleAddExperience}
            onDeleteExperience={handleDeleteExperience}
            onAddSkill={handleAddSkill}
            onDeleteSkill={handleDeleteSkill}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onAddCertification={handleAddCertification}
            onDeleteCertification={handleDeleteCertification}
            onAddLanguage={handleAddLanguage}
            onDeleteLanguage={handleDeleteLanguage}
            onUpdatePreferences={handleUpdatePreferences}
            onAddSavedAnswer={handleAddSavedAnswer}
            onDeleteSavedAnswer={handleDeleteSavedAnswer}
            addToast={addToast}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeStudioPage
            addToast={addToast}
            onProfileRefresh={loadUserAndProfile}
          />
        )}

        {activeTab === 'extension' && (
          <ExtensionPage
            user={user}
            addToast={addToast}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            user={user}
            onLogout={handleLogout}
            addToast={addToast}
          />
        )}
      </main>

      {/* ── Global Command Palette (Ctrl+K) ── */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setCommandPaletteOpen(false);
        }}
        user={user}
        onQuickDemoLogin={handleQuickDemoLogin}
        onLogout={handleLogout}
        onGenerateToken={() => {
          setActiveTab('extension');
          setCommandPaletteOpen(false);
        }}
      />

      {/* ── Authentication Modal ── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onQuickDemoLogin={handleQuickDemoLogin}
      />

      {/* ── Floating Toast Notifications Container ── */}
      <div className="toast-container">
        {toasts.map(toast => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          return (
            <div 
              key={toast.id} 
              className={`toast-card ${toast.type}`}
            >
              {isSuccess && <CheckCircle2 size={18} className="toast-icon success" />}
              {isError && <AlertTriangle size={18} className="toast-icon error" />}
              {!isSuccess && !isError && <Info size={18} className="toast-icon info" />}
              <span className="toast-text">{toast.message}</span>
              <button 
                onClick={() => removeToast(toast.id)} 
                className="toast-close-btn"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
