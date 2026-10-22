import React, { useState, useEffect } from 'react';
import { 
   User, Mail, Phone, MapPin, Globe, Linkedin, Github, 
   GraduationCap, Briefcase, Code, FolderGit2, Plus, Trash2, 
   Save, CheckCircle, AlertCircle, Sparkles, Clock, Award, 
   Languages, Compass, MessageSquare, Edit3, X, Calendar, DollarSign, Building
} from 'lucide-react';
import SkillAutocomplete from '../components/SkillAutocomplete';

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
  onAddCertification,
  onDeleteCertification,
  onAddLanguage,
  onDeleteLanguage,
  onUpdatePreferences,
  onAddSavedAnswer,
  onDeleteSavedAnswer,
  addToast
}) {
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    middle_name: profile?.middle_name || '',
    last_name: profile?.last_name || '',
    preferred_name: profile?.preferred_name || '',
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    country_code: profile?.country_code || '+1',
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    country: profile?.country || '',
    postal_code: profile?.postal_code || '',
    linkedin: profile?.linkedin || '',
    github: profile?.github || '',
    portfolio: profile?.portfolio || '',
    notice_period: profile?.notice_period || '30',
    work_authorization: profile?.work_authorization || 'Yes',
    visa_status: profile?.visa_status || 'Authorized to Work',
    willingness_to_relocate: profile?.willingness_to_relocate || 'Yes',
    preferred_location: profile?.preferred_location || '',
    preferred_work_mode: profile?.preferred_work_mode || 'Hybrid',
    experience_years: profile?.experience_years || '0',
    bio: profile?.bio || ''
  });

  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personal'); // tab navigation

  // Modals state
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduForm, setEduForm] = useState({
    qualification: 'Bachelors Degree',
    degree: 'B.Tech',
    major: 'Computer Science and Engineering',
    branch: 'Software Engineering',
    institution: '',
    college_name: '',
    start_year: '',
    graduation_year: '',
    expected_graduation_date: '',
    cgpa: '',
    percentage: '',
    grading_scale: '10.0',
    backlogs: '0',
    coursework: '',
    achievements: ''
  });

  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState({
    company: '',
    title: '',
    location: '',
    work_mode: 'Hybrid',
    employment_type: 'Full-time',
    start_date: '',
    end_date: '',
    is_current: false,
    responsibilities: '',
    technologies: '',
    notice_period: '30 days',
    description: ''
  });

  const [showProjModal, setShowProjModal] = useState(false);
  const [projForm, setProjForm] = useState({
    title: '',
    role: '',
    technologies: '',
    url: '',
    github_url: '',
    start_date: '',
    end_date: '',
    is_team_project: false,
    description: '',
    responsibilities: ''
  });

  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState({
    name: '',
    issuing_organization: '',
    issue_date: '',
    expiration_date: '',
    credential_id: '',
    verification_url: '',
    description: ''
  });

  const [showLangModal, setShowLangModal] = useState(false);
  const [langForm, setLangForm] = useState({
    name: '',
    proficiency: 'Fluent',
    can_read: 'Yes',
    can_write: 'Yes',
    can_speak: 'Yes'
  });

  const [prefForm, setPrefForm] = useState({
    desired_job_titles: profile?.preference?.desired_job_titles || '',
    preferred_locations: profile?.preference?.preferred_locations || '',
    work_modes: profile?.preference?.work_modes || 'Remote, Hybrid',
    employment_types: profile?.preference?.employment_types || 'Full-time',
    expected_salary: profile?.preference?.expected_salary || '',
    earliest_joining_date: profile?.preference?.earliest_joining_date || '30 days',
    notice_period: profile?.preference?.notice_period || '30 days',
    relocation_preference: profile?.preference?.relocation_preference || 'Yes',
    target_industries: profile?.preference?.target_industries || ''
  });

  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerForm, setAnswerForm] = useState({
    question_key: '',
    question_text: '',
    answer: '',
    company: '',
    input_type: 'text'
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        middle_name: profile.middle_name || '',
        last_name: profile.last_name || '',
        preferred_name: profile.preferred_name || '',
        full_name: profile.full_name || '',
        email: profile.email || '',
        country_code: profile.country_code || '+1',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        postal_code: profile.postal_code || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        portfolio: profile.portfolio || '',
        notice_period: profile.notice_period || '30',
        work_authorization: profile.work_authorization || 'Yes',
        visa_status: profile.visa_status || 'Authorized to Work',
        willingness_to_relocate: profile.willingness_to_relocate || 'Yes',
        preferred_location: profile.preferred_location || '',
        preferred_work_mode: profile.preferred_work_mode || 'Hybrid',
        experience_years: profile.experience_years || '0',
        bio: profile.bio || ''
      });

      if (profile.preference) {
        setPrefForm({
          desired_job_titles: profile.preference.desired_job_titles || '',
          preferred_locations: profile.preference.preferred_locations || '',
          work_modes: profile.preference.work_modes || 'Remote, Hybrid',
          employment_types: profile.preference.employment_types || 'Full-time',
          expected_salary: profile.preference.expected_salary || '',
          earliest_joining_date: profile.preference.earliest_joining_date || '',
          notice_period: profile.preference.notice_period || '',
          relocation_preference: profile.preference.relocation_preference || 'Yes',
          target_industries: profile.preference.target_industries || ''
        });
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile(formData);
      addToast('Candidate master profile saved successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      await onUpdatePreferences(prefForm);
    } catch (err) {
      // toast handled in App.jsx
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'education', label: 'Education History', icon: GraduationCap, count: profile?.educations?.length },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, count: profile?.experiences?.length },
    { id: 'skills', label: 'Skills & Tech', icon: Code, count: profile?.skills?.length },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: profile?.projects?.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: profile?.certifications?.length },
    { id: 'languages', label: 'Languages', icon: Languages, count: profile?.languages?.length },
    { id: 'preferences', label: 'Job Preferences', icon: Compass },
    { id: 'answers', label: 'Screening Answers', icon: MessageSquare, count: profile?.saved_answers?.length }
  ];

  return (
    <div>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
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
            Enter your career details once. ApplyOnce securely autofills IBM, Capgemini, TCS, Infosys, and startup portals.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="btn btn-primary"
          style={{ padding: '10px 22px' }}
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '24px',
        borderBottom: '1px solid #1e293b'
      }}>
        {sections.map(s => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#4f46e5' : '#1e293b',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={15} />
              <span>{s.label}</span>
              {s.count !== undefined && (
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#0f172a',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontSize: '11px'
                }}>
                  {s.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION CONTENT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* 1. PERSONAL INFORMATION */}
        {activeSection === 'personal' && (
          <div className="glass-card">
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>Personal Information</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>Identity, contact details, residence, and visa eligibility.</p>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input type="text" name="first_name" className="form-input" value={formData.first_name} onChange={handleChange} placeholder="Alex" />
              </div>
              <div className="form-group">
                <label className="form-label">Middle Name</label>
                <input type="text" name="middle_name" className="form-input" value={formData.middle_name} onChange={handleChange} placeholder="James" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input type="text" name="last_name" className="form-input" value={formData.last_name} onChange={handleChange} placeholder="Morgan" />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Preferred Name / Alias</label>
                <input type="text" name="preferred_name" className="form-input" value={formData.preferred_name} onChange={handleChange} placeholder="Alex" />
              </div>
              <div className="form-group">
                <label className="form-label">Full Name (Auto-formatted)</label>
                <input type="text" name="full_name" className="form-input" value={formData.full_name} onChange={handleChange} placeholder="Alex James Morgan" />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" name="date_of_birth" className="form-input" value={formData.date_of_birth} onChange={handleChange} />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="alex.morgan@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Country Calling Code</label>
                <input type="text" name="country_code" className="form-input" value={formData.country_code} onChange={handleChange} placeholder="+1 or +91" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone / Mobile Number *</label>
                <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} placeholder="555-019-2834" />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input type="text" name="address" className="form-input" value={formData.address} onChange={handleChange} placeholder="742 Evergreen Terrace" />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} placeholder="San Francisco" />
              </div>
              <div className="form-group">
                <label className="form-label">State / Province</label>
                <input type="text" name="state" className="form-input" value={formData.state} onChange={handleChange} placeholder="California" />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Postal / ZIP Code</label>
                <input type="text" name="postal_code" className="form-input" value={formData.postal_code} onChange={handleChange} placeholder="94107" />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input type="text" name="country" className="form-input" value={formData.country} onChange={handleChange} placeholder="United States" />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Work Mode</label>
                <select name="preferred_work_mode" className="form-select" value={formData.preferred_work_mode} onChange={handleChange}>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Work Authorization Status</label>
                <select name="work_authorization" className="form-select" value={formData.work_authorization} onChange={handleChange}>
                  <option value="Yes">Legally Authorized (Citizen / PR / Permitted)</option>
                  <option value="No">Not Authorized without Sponsorship</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Visa / Sponsorship Status</label>
                <input type="text" name="visa_status" className="form-input" value={formData.visa_status} onChange={handleChange} placeholder="e.g. Citizen, Green Card, OPT, H-1B" />
              </div>
              <div className="form-group">
                <label className="form-label">Willingness to Relocate</label>
                <select name="willingness_to_relocate" className="form-select" value={formData.willingness_to_relocate} onChange={handleChange}>
                  <option value="Yes">Yes, willing to relocate</option>
                  <option value="No">No, preferring local / remote</option>
                </select>
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <input type="url" name="linkedin" className="form-input" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub Profile URL</label>
                <input type="url" name="github" className="form-input" value={formData.github} onChange={handleChange} placeholder="https://github.com/username" />
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio / Personal Website</label>
                <input type="url" name="portfolio" className="form-input" value={formData.portfolio} onChange={handleChange} placeholder="https://portfolio.dev" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Bio / Summary</label>
              <textarea name="bio" rows={3} className="form-textarea" value={formData.bio} onChange={handleChange} placeholder="Brief summary of your professional background and strengths..." />
            </div>

            <button onClick={handleSaveProfile} className="btn btn-primary" style={{ marginTop: '12px' }}>
              <Save size={16} /> Save Personal Information
            </button>
          </div>
        )}

        {/* 2. EDUCATION HISTORY */}
        {activeSection === 'education' && (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Education History</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Supports B.Tech, B.E., B.Sc., B.Com., M.Tech, MCA, Diplomas, and Schooling.</p>
              </div>
              <button onClick={() => setShowEduModal(true)} className="btn btn-secondary">
                <Plus size={15} /> Add Education Record
              </button>
            </div>

            {profile?.educations?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                No education records added yet. Click "+ Add Education Record" above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {profile?.educations?.map(edu => (
                  <div key={edu.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                          {edu.degree || edu.qualification} {edu.major ? `in ${edu.major}` : ''}
                        </h3>
                        <span style={{ fontSize: '12px', background: '#312e81', color: '#c7d2fe', padding: '2px 8px', borderRadius: '4px' }}>
                          {edu.qualification}
                        </span>
                      </div>
                      <p style={{ color: '#818cf8', fontSize: '14px', margin: '4px 0 6px 0', fontWeight: 500 }}>
                        {edu.institution} {edu.college_name ? `• ${edu.college_name}` : ''}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#94a3b8' }}>
                        {edu.graduation_year && <span>Graduated: {edu.graduation_year}</span>}
                        {edu.cgpa && <span>CGPA: <strong>{edu.cgpa}</strong> / {edu.grading_scale || '10.0'}</span>}
                        {edu.percentage && <span>Percentage: <strong>{edu.percentage}%</strong></span>}
                        {edu.branch && <span>Branch: {edu.branch}</span>}
                        {edu.backlogs && edu.backlogs !== '0' && <span style={{ color: '#ef4444' }}>Backlogs: {edu.backlogs}</span>}
                      </div>
                      {edu.coursework && (
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                          Coursework: {edu.coursework}
                        </p>
                      )}
                    </div>
                    <button onClick={() => onDeleteEducation(edu.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. WORK EXPERIENCE */}
        {activeSection === 'experience' && (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Work Experience</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Full-time, internships, and contracts. Freshers can leave empty without errors.</p>
              </div>
              <button onClick={() => setShowExpModal(true)} className="btn btn-secondary">
                <Plus size={15} /> Add Experience Record
              </button>
            </div>

            {profile?.experiences?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                No experience records added. (Freshers can safely proceed without experience records!)
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {profile?.experiences?.map(exp => (
                  <div key={exp.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                          {exp.title}
                        </h3>
                        {exp.is_current && (
                          <span style={{ fontSize: '11px', background: '#065f46', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                            Current Role
                          </span>
                        )}
                      </div>
                      <p style={{ color: '#818cf8', fontSize: '14px', margin: '4px 0 6px 0', fontWeight: 500 }}>
                        {exp.company} {exp.location ? `• ${exp.location}` : ''} ({exp.work_mode || 'Hybrid'})
                      </p>
                      <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
                        <span>{exp.start_date || 'Start'} — {exp.is_current ? 'Present' : (exp.end_date || 'End')}</span>
                        {exp.employment_type && <span> • {exp.employment_type}</span>}
                        {exp.notice_period && <span> • Notice: {exp.notice_period}</span>}
                      </div>
                      {exp.technologies && (
                        <p style={{ fontSize: '12px', color: '#38bdf8', margin: '4px 0' }}>
                          Tech: {exp.technologies}
                        </p>
                      )}
                      {exp.responsibilities && (
                        <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '6px 0 0 0', lineHeight: 1.5 }}>
                          {exp.responsibilities}
                        </p>
                      )}
                    </div>
                    <button onClick={() => onDeleteExperience(exp.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. SKILLS & TECHNOLOGIES */}
        {activeSection === 'skills' && (
          <div className="glass-card">
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>Skills & Technologies Autocomplete</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
              Fast autocomplete ranking programming languages, frameworks, cloud, databases, and tools.
            </p>

            <SkillAutocomplete
              selectedSkills={profile?.skills || []}
              onAddSkill={onAddSkill}
              onRemoveSkill={(skill) => onDeleteSkill(skill.id)}
            />
          </div>
        )}

        {/* 5. PROJECTS */}
        {activeSection === 'projects' && (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Technical Projects</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Showcase applications, systems, and open-source contributions.</p>
              </div>
              <button onClick={() => setShowProjModal(true)} className="btn btn-secondary">
                <Plus size={15} /> Add Project
              </button>
            </div>

            {profile?.projects?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                No projects added yet. Click "+ Add Project" above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {profile?.projects?.map(proj => (
                  <div key={proj.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                        {proj.title} {proj.role ? `(${proj.role})` : ''}
                      </h3>
                      {proj.technologies && (
                        <p style={{ color: '#38bdf8', fontSize: '13px', margin: '4px 0' }}>
                          Tech: {proj.technologies}
                        </p>
                      )}
                      {proj.description && (
                        <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '6px 0', lineHeight: 1.5 }}>
                          {proj.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', marginTop: '6px' }}>
                        {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'none' }}>Live Demo &rarr;</a>}
                        {proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'none' }}>GitHub &rarr;</a>}
                      </div>
                    </div>
                    <button onClick={() => onDeleteProject(proj.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. CERTIFICATIONS */}
        {activeSection === 'certifications' && (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Certifications & Credentials</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>AWS, Google Cloud, Microsoft, CKA, Cisco, and industry certificates.</p>
              </div>
              <button onClick={() => setShowCertModal(true)} className="btn btn-secondary">
                <Plus size={15} /> Add Certification
              </button>
            </div>

            {profile?.certifications?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                No certifications added yet. Click "+ Add Certification" above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {profile?.certifications?.map(cert => (
                  <div key={cert.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                        {cert.name}
                      </h3>
                      <p style={{ color: '#818cf8', fontSize: '14px', margin: '4px 0' }}>
                        {cert.issuing_organization} {cert.issue_date ? `• Issued ${cert.issue_date}` : ''}
                      </p>
                      {cert.credential_id && <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0' }}>ID: {cert.credential_id}</p>}
                      {cert.verification_url && (
                        <a href={cert.verification_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#38bdf8', textDecoration: 'none' }}>
                          Verify Credential &rarr;
                        </a>
                      )}
                    </div>
                    <button onClick={() => onDeleteCertification(cert.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. LANGUAGES */}
        {activeSection === 'languages' && (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Languages</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Reading, writing, and speaking proficiencies.</p>
              </div>
              <button onClick={() => setShowLangModal(true)} className="btn btn-secondary">
                <Plus size={15} /> Add Language
              </button>
            </div>

            {profile?.languages?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                No languages added yet. Click "+ Add Language" above.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
                {profile?.languages?.map(lang => (
                  <div key={lang.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#ffffff', fontSize: '15px' }}>{lang.name}</h4>
                      <span style={{ fontSize: '12px', color: '#818cf8', background: '#1e1b4b', padding: '2px 6px', borderRadius: '4px' }}>
                        {lang.proficiency}
                      </span>
                    </div>
                    <button onClick={() => onDeleteLanguage(lang.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 8. JOB PREFERENCES */}
        {activeSection === 'preferences' && (
          <form onSubmit={handleSavePreferences} className="glass-card">
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>Job Preferences & Target Criteria</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>Target roles, locations, compensation expectations, and notice periods.</p>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Desired Job Titles</label>
                <input type="text" className="form-input" value={prefForm.desired_job_titles} onChange={e => setPrefForm(p => ({ ...p, desired_job_titles: e.target.value }))} placeholder="e.g. Full Stack Engineer, Cloud Architect" />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Locations</label>
                <input type="text" className="form-input" value={prefForm.preferred_locations} onChange={e => setPrefForm(p => ({ ...p, preferred_locations: e.target.value }))} placeholder="e.g. San Francisco, New York, Remote" />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Preferred Work Modes</label>
                <input type="text" className="form-input" value={prefForm.work_modes} onChange={e => setPrefForm(p => ({ ...p, work_modes: e.target.value }))} placeholder="Remote, Hybrid, Onsite" />
              </div>
              <div className="form-group">
                <label className="form-label">Expected Salary / CTC</label>
                <input type="text" className="form-input" value={prefForm.expected_salary} onChange={e => setPrefForm(p => ({ ...p, expected_salary: e.target.value }))} placeholder="e.g. $135,000 / yr or INR 20 LPA" />
              </div>
              <div className="form-group">
                <label className="form-label">Notice Period</label>
                <input type="text" className="form-input" value={prefForm.notice_period} onChange={e => setPrefForm(p => ({ ...p, notice_period: e.target.value }))} placeholder="e.g. Immediate, 15 days, 30 days" />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Target Industries</label>
                <input type="text" className="form-input" value={prefForm.target_industries} onChange={e => setPrefForm(p => ({ ...p, target_industries: e.target.value }))} placeholder="e.g. Cloud SaaS, AI, FinTech" />
              </div>
              <div className="form-group">
                <label className="form-label">Earliest Joining Date</label>
                <input type="text" className="form-input" value={prefForm.earliest_joining_date} onChange={e => setPrefForm(p => ({ ...p, earliest_joining_date: e.target.value }))} placeholder="e.g. Immediate or 2024-06-01" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
              <Save size={16} /> Save Job Preferences
            </button>
          </form>
        )}

        {/* 9. SCREENING QUESTIONS & SAVED ANSWERS LIBRARY */}
        {activeSection === 'answers' && (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>Screening Questions & Saved Answer Library</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Universal screening answers and company-specific overrides (IBM, Capgemini, TCS, etc.).</p>
              </div>
              <button onClick={() => setShowAnswerModal(true)} className="btn btn-secondary">
                <Plus size={15} /> Add Saved Answer
              </button>
            </div>

            {profile?.saved_answers?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                No saved answers in library yet. Add your standard answers to speed up screening questions!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {profile?.saved_answers?.map(ans => (
                  <div key={ans.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, marginRight: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', background: ans.company ? '#312e81' : '#065f46', color: ans.company ? '#c7d2fe' : '#34d399', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {ans.company ? `Company: ${ans.company}` : 'Universal Library'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Key: {ans.question_key}</span>
                      </div>
                      <h4 style={{ margin: '0 0 6px 0', color: '#ffffff', fontSize: '14px' }}>{ans.question_text}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(15,23,42,0.6)', padding: '8px 12px', borderRadius: '6px' }}>
                        {ans.answer}
                      </p>
                    </div>
                    <button onClick={() => onDeleteSavedAnswer(ans.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── MODALS ── */}

      {/* Education Modal */}
      {showEduModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-card" style={{ maxWidth: '550px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Add Education Credential</h3>
              <button onClick={() => setShowEduModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await onAddEducation(eduForm);
              setShowEduModal(false);
            }}>
              <div className="form-group">
                <label className="form-label">Degree / Program *</label>
                <input type="text" className="form-input" required value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))} placeholder="e.g. B.Tech, B.E., B.Sc., MCA, M.Tech" />
              </div>
              <div className="form-group">
                <label className="form-label">Qualification Level</label>
                <select className="form-select" value={eduForm.qualification} onChange={e => setEduForm(f => ({ ...f, qualification: e.target.value }))}>
                  <option value="Bachelors Degree">Bachelors Degree</option>
                  <option value="Masters Degree">Masters Degree</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                  <option value="Intermediate / 12th">Intermediate / 12th</option>
                  <option value="High School / 10th">High School / 10th</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">University / Board *</label>
                <input type="text" className="form-input" required value={eduForm.institution} onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))} placeholder="e.g. Stanford University / Anna University" />
              </div>
              <div className="form-group">
                <label className="form-label">College Name (if applicable)</label>
                <input type="text" className="form-input" value={eduForm.college_name} onChange={e => setEduForm(f => ({ ...f, college_name: e.target.value }))} placeholder="e.g. College of Engineering, Guindy" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Major / Field of Study</label>
                  <input type="text" className="form-input" value={eduForm.major} onChange={e => setEduForm(f => ({ ...f, major: e.target.value }))} placeholder="Computer Science" />
                </div>
                <div className="form-group">
                  <label className="form-label">Branch / Specialization</label>
                  <input type="text" className="form-input" value={eduForm.branch} onChange={e => setEduForm(f => ({ ...f, branch: e.target.value }))} placeholder="Information Technology" />
                </div>
              </div>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input type="text" className="form-input" value={eduForm.graduation_year} onChange={e => setEduForm(f => ({ ...f, graduation_year: e.target.value }))} placeholder="2024" />
                </div>
                <div className="form-group">
                  <label className="form-label">CGPA</label>
                  <input type="text" className="form-input" value={eduForm.cgpa} onChange={e => setEduForm(f => ({ ...f, cgpa: e.target.value }))} placeholder="8.9 or 3.8" />
                </div>
                <div className="form-group">
                  <label className="form-label">Percentage</label>
                  <input type="text" className="form-input" value={eduForm.percentage} onChange={e => setEduForm(f => ({ ...f, percentage: e.target.value }))} placeholder="92%" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Relevant Coursework</label>
                <input type="text" className="form-input" value={eduForm.coursework} onChange={e => setEduForm(f => ({ ...f, coursework: e.target.value }))} placeholder="Data Structures, DBMS, Cloud Computing" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowEduModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Education</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {showExpModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-card" style={{ maxWidth: '550px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Add Work Experience</h3>
              <button onClick={() => setShowExpModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await onAddExperience(expForm);
              setShowExpModal(false);
            }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Company / Employer *</label>
                  <input type="text" className="form-input" required value={expForm.company} onChange={e => setExpForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. Starlight Cloud Inc." />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input type="text" className="form-input" required value={expForm.title} onChange={e => setExpForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior Full Stack Engineer" />
                </div>
              </div>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Employment Type</label>
                  <select className="form-select" value={expForm.employment_type} onChange={e => setExpForm(f => ({ ...f, employment_type: e.target.value }))}>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Work Mode</label>
                  <select className="form-select" value={expForm.work_mode} onChange={e => setExpForm(f => ({ ...f, work_mode: e.target.value }))}>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Notice Period</label>
                  <input type="text" className="form-input" value={expForm.notice_period} onChange={e => setExpForm(f => ({ ...f, notice_period: e.target.value }))} placeholder="30 days" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="text" className="form-input" value={expForm.start_date} onChange={e => setExpForm(f => ({ ...f, start_date: e.target.value }))} placeholder="e.g. Jan 2023 or 2023-01" />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="text" className="form-input" disabled={expForm.is_current} value={expForm.is_current ? 'Present' : expForm.end_date} onChange={e => setExpForm(f => ({ ...f, end_date: e.target.value }))} placeholder="e.g. Present" />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '13px', marginBottom: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={expForm.is_current} onChange={e => setExpForm(f => ({ ...f, is_current: e.target.checked }))} />
                <span>I currently work here</span>
              </label>
              <div className="form-group">
                <label className="form-label">Technologies Used</label>
                <input type="text" className="form-input" value={expForm.technologies} onChange={e => setExpForm(f => ({ ...f, technologies: e.target.value }))} placeholder="React, Python, FastAPI, Docker, AWS" />
              </div>
              <div className="form-group">
                <label className="form-label">Responsibilities & Achievements</label>
                <textarea rows={3} className="form-textarea" value={expForm.responsibilities} onChange={e => setExpForm(f => ({ ...f, responsibilities: e.target.value }))} placeholder="Built and shipped core APIs and UI modules..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowExpModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Experience</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Modal */}
      {showProjModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-card" style={{ maxWidth: '550px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Add Project</h3>
              <button onClick={() => setShowProjModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await onAddProject(projForm);
              setShowProjModal(false);
            }}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input type="text" className="form-input" required value={projForm.title} onChange={e => setProjForm(f => ({ ...f, title: e.target.value }))} placeholder="ApplyOnce Autofill Engine" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Your Role</label>
                  <input type="text" className="form-input" value={projForm.role} onChange={e => setProjForm(f => ({ ...f, role: e.target.value }))} placeholder="Lead Engineer" />
                </div>
                <div className="form-group">
                  <label className="form-label">Technologies</label>
                  <input type="text" className="form-input" value={projForm.technologies} onChange={e => setProjForm(f => ({ ...f, technologies: e.target.value }))} placeholder="React, Python, Vite" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Live URL</label>
                  <input type="url" className="form-input" value={projForm.url} onChange={e => setProjForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input type="url" className="form-input" value={projForm.github_url} onChange={e => setProjForm(f => ({ ...f, github_url: e.target.value }))} placeholder="https://github.com/..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Short Description</label>
                <textarea rows={3} className="form-textarea" value={projForm.description} onChange={e => setProjForm(f => ({ ...f, description: e.target.value }))} placeholder="Highlights, architecture, and impact..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowProjModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certifications Modal */}
      {showCertModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Add Certification</h3>
              <button onClick={() => setShowCertModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await onAddCertification(certForm);
              setShowCertModal(false);
            }}>
              <div className="form-group">
                <label className="form-label">Certification Name *</label>
                <input type="text" className="form-input" required value={certForm.name} onChange={e => setCertForm(f => ({ ...f, name: e.target.value }))} placeholder="AWS Certified Solutions Architect" />
              </div>
              <div className="form-group">
                <label className="form-label">Issuing Organization</label>
                <input type="text" className="form-input" value={certForm.issuing_organization} onChange={e => setCertForm(f => ({ ...f, issuing_organization: e.target.value }))} placeholder="Amazon Web Services" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input type="text" className="form-input" value={certForm.issue_date} onChange={e => setCertForm(f => ({ ...f, issue_date: e.target.value }))} placeholder="2023-08" />
                </div>
                <div className="form-group">
                  <label className="form-label">Credential ID</label>
                  <input type="text" className="form-input" value={certForm.credential_id} onChange={e => setCertForm(f => ({ ...f, credential_id: e.target.value }))} placeholder="AWS-12345" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Verification URL</label>
                <input type="url" className="form-input" value={certForm.verification_url} onChange={e => setCertForm(f => ({ ...f, verification_url: e.target.value }))} placeholder="https://aws.amazon.com/verify/..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowCertModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Certification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Languages Modal */}
      {showLangModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Add Language</h3>
              <button onClick={() => setShowLangModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await onAddLanguage(langForm);
              setShowLangModal(false);
            }}>
              <div className="form-group">
                <label className="form-label">Language Name *</label>
                <input type="text" className="form-input" required value={langForm.name} onChange={e => setLangForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. English, Spanish, Hindi" />
              </div>
              <div className="form-group">
                <label className="form-label">Proficiency Level</label>
                <select className="form-select" value={langForm.proficiency} onChange={e => setLangForm(f => ({ ...f, proficiency: e.target.value }))}>
                  <option value="Native / Bilingual">Native / Bilingual</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional Working">Professional Working</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowLangModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Language</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Saved Answer Modal */}
      {showAnswerModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-card" style={{ maxWidth: '550px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Add Saved Screening Answer</h3>
              <button onClick={() => setShowAnswerModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await onAddSavedAnswer(answerForm);
              setShowAnswerModal(false);
            }}>
              <div className="form-group">
                <label className="form-label">Question Text / Label *</label>
                <input type="text" className="form-input" required value={answerForm.question_text} onChange={e => setAnswerForm(f => ({ ...f, question_text: e.target.value, question_key: f.question_key || e.target.value.toLowerCase().replace(/\s+/g, '_').slice(0, 30) }))} placeholder="e.g. Why do you want to work at this company?" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Internal Key</label>
                  <input type="text" className="form-input" value={answerForm.question_key} onChange={e => setAnswerForm(f => ({ ...f, question_key: e.target.value }))} placeholder="why_work_here" />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Specific (Optional)</label>
                  <input type="text" className="form-input" value={answerForm.company} onChange={e => setAnswerForm(f => ({ ...f, company: e.target.value }))} placeholder="Leave blank for Universal or e.g. IBM" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Reusable Answer *</label>
                <textarea rows={3} className="form-textarea" required value={answerForm.answer} onChange={e => setAnswerForm(f => ({ ...f, answer: e.target.value }))} placeholder="Enter your confirmed answer..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowAnswerModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save to Library</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
