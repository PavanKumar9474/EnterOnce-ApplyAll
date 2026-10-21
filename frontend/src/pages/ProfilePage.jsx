import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Globe, Linkedin, Github, 
  GraduationCap, Briefcase, Code, FolderGit2, Plus, Trash2, 
  Save, CheckCircle, AlertCircle, Sparkles, Clock, Check
} from 'lucide-react';

export default function ProfilePage({ 
  profile, 
  onUpdateProfile, 
  onAddEducation, 
  onDeleteEducation,
  onAddExperience, 
  onDeleteExperience,
  onAddSkill, 
  onDeleteSkill,
  onAddProject, 
  onDeleteProject,
  addToast
}) {
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    middle_name: profile?.middle_name || '',
    last_name: profile?.last_name || '',
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    country: profile?.country || '',
    postal_code: profile?.postal_code || '',
    linkedin: profile?.linkedin || '',
    github: profile?.github || '',
    portfolio: profile?.portfolio || '',
    notice_period: profile?.notice_period || '',
    work_authorization: profile?.work_authorization || 'Yes',
    willingness_to_relocate: profile?.willingness_to_relocate || 'Yes',
    preferred_location: profile?.preferred_location || '',
    experience_years: profile?.experience_years || '0',
    bio: profile?.bio || ''
  });

  const [saving, setSaving] = useState(false);

  // Modals state
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduForm, setEduForm] = useState({
    qualification: 'Bachelors Degree',
    degree: '',
    major: '',
    institution: '',
    graduation_year: '',
    cgpa: '',
    percentage: ''
  });

  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState({
    company: '',
    title: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: true,
    description: ''
  });

  const [showProjModal, setShowProjModal] = useState(false);
  const [projForm, setProjForm] = useState({
    title: '',
    technologies: '',
    url: '',
    github_url: '',
    description: ''
  });

  const [newSkill, setNewSkill] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile(formData);
      addToast('Candidate profile saved successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateEdu = async (e) => {
    e.preventDefault();
    try {
      await onAddEducation(eduForm);
      setShowEduModal(false);
      setEduForm({
        qualification: 'Bachelors Degree',
        degree: '',
        major: '',
        institution: '',
        graduation_year: '',
        cgpa: '',
        percentage: ''
      });
      addToast('Education record added.', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add education.', 'error');
    }
  };

  const handleCreateExp = async (e) => {
    e.preventDefault();
    try {
      await onAddExperience(expForm);
      setShowExpModal(false);
      setExpForm({
        company: '',
        title: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: true,
        description: ''
      });
      addToast('Experience record added.', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add experience.', 'error');
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      await onAddSkill({ name: newSkill.trim(), category: 'Technical' });
      setNewSkill('');
      addToast('Skill added.', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add skill.', 'error');
    }
  };

  const handleCreateProj = async (e) => {
    e.preventDefault();
    try {
      await onAddProject(projForm);
      setShowProjModal(false);
      setProjForm({
        title: '',
        technologies: '',
        url: '',
        github_url: '',
        description: ''
      });
      addToast('Project added.', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add project.', 'error');
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
              {formData.full_name || 'Candidate Master Profile'}
            </h1>
            <span className={`badge ${profile?.verification_status === 'User Verified' ? 'badge-verified' : 'badge-review'}`}>
              <CheckCircle size={13} />
              <span>{profile?.verification_status || 'User Verified'}</span>
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            This information is synced securely with the ApplyOnce Chrome extension to autofill career portals.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="btn btn-primary"
          style={{ padding: '10px 22px' }}
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* SECTION 1: Personal Information */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8'
            }}>
              <User size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Personal Information</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Basic contact details and identification.</p>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input 
                type="text" 
                name="first_name" 
                className="form-input" 
                value={formData.first_name} 
                onChange={handleChange} 
                placeholder="Alex"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Middle Name (Optional)</label>
              <input 
                type="text" 
                name="middle_name" 
                className="form-input" 
                value={formData.middle_name} 
                onChange={handleChange} 
                placeholder="James"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input 
                type="text" 
                name="last_name" 
                className="form-input" 
                value={formData.last_name} 
                onChange={handleChange} 
                placeholder="Morgan"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Legal Name</label>
              <input 
                type="text" 
                name="full_name" 
                className="form-input" 
                value={formData.full_name} 
                onChange={handleChange} 
                placeholder="Alex James Morgan"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                name="email" 
                className="form-input" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="alex.morgan@example.com"
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                className="form-input" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+1 555-019-2834"
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input 
                type="text" 
                name="city" 
                className="form-input" 
                value={formData.city} 
                onChange={handleChange} 
                placeholder="San Francisco"
              />
            </div>
            <div className="form-group">
              <label className="form-label">State / Province</label>
              <input 
                type="text" 
                name="state" 
                className="form-input" 
                value={formData.state} 
                onChange={handleChange} 
                placeholder="California"
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Country</label>
              <input 
                type="text" 
                name="country" 
                className="form-input" 
                value={formData.country} 
                onChange={handleChange} 
                placeholder="United States"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Postal / ZIP Code</label>
              <input 
                type="text" 
                name="postal_code" 
                className="form-input" 
                value={formData.postal_code} 
                onChange={handleChange} 
                placeholder="94107"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input 
                type="text" 
                name="address" 
                className="form-input" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder="742 Evergreen Terrace"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Online Profiles & URLs */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22d3ee'
            }}>
              <Globe size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Online Links & Socials</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Portfolio, GitHub, and professional profiles.</p>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input 
                type="url" 
                name="linkedin" 
                className="form-input" 
                value={formData.linkedin} 
                onChange={handleChange} 
                placeholder="https://linkedin.com/in/alexmorgan"
              />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input 
                type="url" 
                name="github" 
                className="form-input" 
                value={formData.github} 
                onChange={handleChange} 
                placeholder="https://github.com/alexmorgan"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Portfolio URL</label>
              <input 
                type="url" 
                name="portfolio" 
                className="form-input" 
                value={formData.portfolio} 
                onChange={handleChange} 
                placeholder="https://alexmorgan.dev"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Education Records */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}>
                <GraduationCap size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Education History</h2>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Degrees, institutions, GPA, and graduation dates.</p>
              </div>
            </div>

            <button onClick={() => setShowEduModal(true)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
              <Plus size={15} />
              <span>Add Education</span>
            </button>
          </div>

          {profile?.educations && profile.educations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profile.educations.map(edu => (
                <div key={edu.id} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>
                      {edu.degree || 'Degree'} {edu.major ? `in ${edu.major}` : ''}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                      {edu.institution || 'University'} &bull; Graduated {edu.graduation_year || 'N/A'}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12px', color: '#cbd5e1' }}>
                      {edu.cgpa && <span>GPA: <strong>{edu.cgpa}</strong></span>}
                      {edu.percentage && <span>Percentage: <strong>{edu.percentage}%</strong></span>}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteEducation(edu.id)}
                    className="btn btn-danger"
                    style={{ padding: '6px 10px' }}
                    title="Delete record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0', fontSize: '14px' }}>
              No education records added yet. Click &quot;Add Education&quot; above.
            </div>
          )}
        </div>

        {/* SECTION 4: Professional Experience */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24'
              }}>
                <Briefcase size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Work Experience</h2>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Roles, companies, and tenure (freshers can leave empty).</p>
              </div>
            </div>

            <button onClick={() => setShowExpModal(true)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
              <Plus size={15} />
              <span>Add Experience</span>
            </button>
          </div>

          {profile?.experiences && profile.experiences.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profile.experiences.map(exp => (
                <div key={exp.id} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>
                      {exp.title} &bull; <span style={{ color: '#818cf8' }}>{exp.company}</span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                      {exp.start_date || 'Start'} &ndash; {exp.is_current ? 'Present' : (exp.end_date || 'End')} {exp.location ? `(${exp.location})` : ''}
                    </div>
                    {exp.description && (
                      <p style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '6px' }}>{exp.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteExperience(exp.id)}
                    className="btn btn-danger"
                    style={{ padding: '6px 10px' }}
                    title="Delete record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0', fontSize: '14px' }}>
              No experience records added.
            </div>
          )}
        </div>

        {/* SECTION 5: Skills */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc'
            }}>
              <Code size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Technical & Core Skills</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Skills autofilled into application skill tags or textareas.</p>
            </div>
          </div>

          <form onSubmit={handleCreateSkill} style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
            <input
              type="text"
              className="form-input"
              style={{ maxWidth: '320px' }}
              placeholder="e.g. React, Python, Docker"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              <Plus size={15} />
              <span>Add Skill</span>
            </button>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile?.skills && profile.skills.map(s => (
              <span key={s.id} style={{
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#c7d2fe',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{s.name}</span>
                <button
                  type="button"
                  onClick={() => onDeleteSkill(s.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 6: Projects */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(236, 72, 153, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f472b6'
              }}>
                <FolderGit2 size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Featured Projects</h2>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Portfolio projects and technical repositories.</p>
              </div>
            </div>

            <button onClick={() => setShowProjModal(true)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
              <Plus size={15} />
              <span>Add Project</span>
            </button>
          </div>

          {profile?.projects && profile.projects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profile.projects.map(proj => (
                <div key={proj.id} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>{proj.title}</div>
                    {proj.technologies && (
                      <div style={{ color: '#818cf8', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>
                        Stack: {proj.technologies}
                      </div>
                    )}
                    {proj.description && (
                      <p style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '6px' }}>{proj.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="btn btn-danger"
                    style={{ padding: '6px 10px' }}
                    title="Delete record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0', fontSize: '14px' }}>
              No projects added yet.
            </div>
          )}
        </div>

        {/* SECTION 7: Preferences & Eligibility */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4ade80'
            }}>
              <Clock size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Career Preferences & Work Authorization</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Autofilled into questionnaire and dropdown fields.</p>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Notice Period (Days)</label>
              <input 
                type="text" 
                name="notice_period" 
                className="form-input" 
                value={formData.notice_period} 
                onChange={handleChange} 
                placeholder="30"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Legally Authorized to Work?</label>
              <select 
                name="work_authorization" 
                className="form-select" 
                value={formData.work_authorization} 
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Willingness to Relocate?</label>
              <select 
                name="willingness_to_relocate" 
                className="form-select" 
                value={formData.willingness_to_relocate} 
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Remote Only">Remote Only</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Preferred Location</label>
              <input 
                type="text" 
                name="preferred_location" 
                className="form-input" 
                value={formData.preferred_location} 
                onChange={handleChange} 
                placeholder="San Francisco, CA or Remote"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Years of Experience</label>
              <input 
                type="text" 
                name="experience_years" 
                className="form-input" 
                value={formData.experience_years} 
                onChange={handleChange} 
                placeholder="2"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Summary / Bio</label>
            <textarea 
              name="bio" 
              className="form-textarea" 
              value={formData.bio} 
              onChange={handleChange} 
              placeholder="Full stack software engineer passionate about modern cloud architectures..."
            />
          </div>
        </div>
      </div>

      {/* MODAL: Add Education */}
      {showEduModal && (
        <div className="modal-overlay" onClick={() => setShowEduModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Add Education Record</h3>
            <form onSubmit={handleCreateEdu}>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <select 
                  className="form-select"
                  value={eduForm.qualification}
                  onChange={e => setEduForm({ ...eduForm, qualification: e.target.value })}
                >
                  <option value="Bachelors Degree">Bachelors Degree</option>
                  <option value="Masters Degree">Masters Degree</option>
                  <option value="Doctorate (Ph.D.)">Doctorate (Ph.D.)</option>
                  <option value="High School">High School</option>
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Degree</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Bachelor of Science"
                    value={eduForm.degree}
                    onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Major / Specialization</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Computer Science"
                    value={eduForm.major}
                    onChange={e => setEduForm({ ...eduForm, major: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">College / University</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Stanford University"
                  value={eduForm.institution}
                  onChange={e => setEduForm({ ...eduForm, institution: e.target.value })}
                />
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="2024"
                    value={eduForm.graduation_year}
                    onChange={e => setEduForm({ ...eduForm, graduation_year: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CGPA / GPA</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="3.85"
                    value={eduForm.cgpa}
                    onChange={e => setEduForm({ ...eduForm, cgpa: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Percentage (%)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="92"
                    value={eduForm.percentage}
                    onChange={e => setEduForm({ ...eduForm, percentage: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Education</button>
                <button type="button" onClick={() => setShowEduModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Experience */}
      {showExpModal && (
        <div className="modal-overlay" onClick={() => setShowExpModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Add Work Experience</h3>
            <form onSubmit={handleCreateExp}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Company / Employer</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Acme Technologies"
                    value={expForm.company}
                    onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Full Stack Engineer"
                    value={expForm.title}
                    onChange={e => setExpForm({ ...expForm, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="2023-01"
                    value={expForm.start_date}
                    onChange={e => setExpForm({ ...expForm, start_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="text"
                    disabled={expForm.is_current}
                    className="form-input"
                    placeholder={expForm.is_current ? 'Present' : '2024-05'}
                    value={expForm.end_date}
                    onChange={e => setExpForm({ ...expForm, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={expForm.is_current}
                    onChange={e => setExpForm({ ...expForm, is_current: e.target.checked })}
                  />
                  <span>I currently work here</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Responsibilities</label>
                <textarea
                  className="form-textarea"
                  placeholder="Developed cloud backend APIs and user interfaces..."
                  value={expForm.description}
                  onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Experience</button>
                <button type="button" onClick={() => setShowExpModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Project */}
      {showProjModal && (
        <div className="modal-overlay" onClick={() => setShowProjModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Add Featured Project</h3>
            <form onSubmit={handleCreateProj}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="ApplyOnce Autofill Engine"
                  value={projForm.title}
                  onChange={e => setProjForm({ ...projForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technologies Used</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="React, Python, FastAPI, Docker"
                  value={projForm.technologies}
                  onChange={e => setProjForm({ ...projForm, technologies: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Live Project URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://myproject.dev"
                    value={projForm.url}
                    onChange={e => setProjForm({ ...projForm, url: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub Repository URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://github.com/myuser/myproject"
                    value={projForm.github_url}
                    onChange={e => setProjForm({ ...projForm, github_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Project Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Key features, architecture, and impact..."
                  value={projForm.description}
                  onChange={e => setProjForm({ ...projForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Project</button>
                <button type="button" onClick={() => setShowProjModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
