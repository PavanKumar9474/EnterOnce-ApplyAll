import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const API_BASE = 'http://127.0.0.1:8000'

// ─── Auth Context ────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

function useAuth() { return useContext(AuthContext) }

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('ao_token') || '')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!sessionStorage.getItem('ao_token'))

  const fetchMe = useCallback(async (tok) => {
    try {
      const r = await fetch(`${API_BASE}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${tok}` }
      })
      if (r.ok) setUser(await r.json())
      else logout()
    } catch { logout() }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { if (token) fetchMe(token) }, [token, fetchMe])

  function login(tok) {
    sessionStorage.setItem('ao_token', tok)
    setToken(tok)
  }

  function logout() {
    sessionStorage.removeItem('ao_token')
    setToken('')
    setUser(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── API helper ──────────────────────────────────────────────────────────────
async function api(method, path, body, token, isFormData = false) {
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const r = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined)
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.detail || `HTTP ${r.status}`)
  return data
}

// ─── Shared UI ───────────────────────────────────────────────────────────────
function Alert({ type, msg }) {
  if (!msg) return null
  const styles = {
    error: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)', color: '#fca5a5', icon: '✕' },
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', color: '#6ee7b7', icon: '✓' },
    info: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)', color: '#a5b4fc', icon: 'ℹ' }
  }
  const s = styles[type] || styles.info
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '10px 14px', color: s.color, display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, marginBottom: 12 }}>
      <span style={{ fontWeight: 700, flexShrink: 0 }}>{s.icon}</span>
      <span>{msg}</span>
    </div>
  )
}

function Spinner({ small }) {
  return <span style={{ display: 'inline-block', width: small ? 14 : 18, height: small ? 14 : 18, border: `2px solid rgba(255,255,255,0.2)`, borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
}

function Input({ label, id, type = 'text', value, onChange, placeholder, required, disabled }) {
  return (
    <div className="field-group">
      <label htmlFor={id} className="field-label">{label}{required && <span style={{ color: '#f87171' }}> *</span>}</label>
      <input id={id} type={type} className="field-input" value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} />
    </div>
  )
}

function PrimaryBtn({ children, loading: l, disabled, onClick, type = 'button', style = {} }) {
  return (
    <button type={type} className="btn-primary" disabled={l || disabled} onClick={onClick} style={style}>
      {l ? <Spinner small /> : children}
    </button>
  )
}

function SecondaryBtn({ children, onClick, style = {} }) {
  return <button type="button" className="btn-secondary" onClick={onClick} style={style}>{children}</button>
}

// ─── Auth Page ────────────────────────────────────────────────────────────────
function AuthPage() {
  const { login } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        await api('POST', '/api/v1/auth/register', { email: form.email, password: form.password, full_name: form.full_name })
      }
      const tok = await api('POST', '/api/v1/auth/login', { email: form.email, password: form.password })
      login(tok.access_token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon-lg">⚡</div>
          <h1 className="auth-title">ApplyOnce</h1>
          <p className="auth-sub">Universal Career Website Autofill</p>
        </div>

        <div className="tab-row">
          <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError('') }}>Sign In</button>
          <button className={`tab-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError('') }}>Create Account</button>
        </div>

        <form onSubmit={submit} className="auth-form" id="auth-form">
          <Alert type="error" msg={error} />
          {mode === 'register' && (
            <Input label="Full Name" id="full-name" value={form.full_name} onChange={set('full_name')} placeholder="Jane Doe" required />
          )}
          <Input label="Email" id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
          <Input label="Password" id="password" type="password" value={form.password} onChange={set('password')} placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'} required />
          <PrimaryBtn type="submit" loading={loading} style={{ width: '100%', marginTop: 8 }}>
            {mode === 'register' ? 'Create Account' : 'Sign In'}
          </PrimaryBtn>
        </form>

        <p className="demo-hint">
          Demo account: <code>alex.morgan@example.com</code> / <code>Password123!</code>
        </p>
      </div>
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────
function AppShell() {
  const { user, logout } = useAuth()
  const [page, setPage] = useState('dashboard')

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">ApplyOnce</span>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'profile', icon: '👤', label: 'My Profile' },
            { id: 'education', icon: '🎓', label: 'Education' },
            { id: 'experience', icon: '💼', label: 'Experience' },
            { id: 'skills', icon: '⚡', label: 'Skills' },
            { id: 'projects', icon: '🛠', label: 'Projects' },
            { id: 'resume', icon: '📄', label: 'Resume' },
            { id: 'extension', icon: '🧩', label: 'Extension' },
          ].map(item => (
            <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="user-avatar">{(user?.full_name || user?.email || 'U')[0].toUpperCase()}</span>
            <div className="user-info">
              <span className="user-name">{user?.full_name || 'User'}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button className="logout-btn" id="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </aside>

      <main className="main-content">
        {page === 'dashboard' && <Dashboard setPage={setPage} />}
        {page === 'profile' && <ProfilePage />}
        {page === 'education' && <EducationPage />}
        {page === 'experience' && <ExperiencePage />}
        {page === 'skills' && <SkillsPage />}
        {page === 'projects' && <ProjectsPage />}
        {page === 'resume' && <ResumePage />}
        {page === 'extension' && <ExtensionPage />}
      </main>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ setPage }) {
  const { token, user } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    api('GET', '/api/v1/profile', null, token)
      .then(setProfile)
      .catch(() => {})
  }, [token])

  const checks = [
    { label: 'Personal Info', done: !!(profile?.first_name && profile?.phone), page: 'profile' },
    { label: 'Education', done: (profile?.educations?.length || 0) > 0, page: 'education' },
    { label: 'Experience', done: (profile?.experiences?.length || 0) > 0, page: 'experience' },
    { label: 'Skills', done: (profile?.skills?.length || 0) > 0, page: 'skills' },
    { label: 'Resume Uploaded', done: (profile?.resumes?.length || 0) > 0, page: 'resume' },
  ]
  const completePct = Math.round((checks.filter(c => c.done).length / checks.length) * 100)

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! 👋</h2>
        <p className="page-sub">Your profile powers the Chrome extension autofill engine.</p>
      </div>

      <div className="progress-card">
        <div className="progress-header">
          <span>Profile Completeness</span>
          <span className="progress-pct">{completePct}%</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${completePct}%` }} />
        </div>
        <div className="checklist">
          {checks.map(c => (
            <button key={c.label} className={`checklist-item ${c.done ? 'done' : ''}`} onClick={() => setPage(c.page)}>
              <span className="check-icon">{c.done ? '✓' : '○'}</span>
              <span>{c.label}</span>
              {!c.done && <span className="check-arrow">→</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-val">{profile?.educations?.length || 0}</div>
          <div className="stat-label">Education Records</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-val">{profile?.experiences?.length || 0}</div>
          <div className="stat-label">Experience Records</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-val">{profile?.skills?.length || 0}</div>
          <div className="stat-label">Skills Listed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛠</div>
          <div className="stat-val">{profile?.projects?.length || 0}</div>
          <div className="stat-label">Projects Listed</div>
        </div>
      </div>
    </div>
  )
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage() {
  const { token } = useAuth()
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', address: '', city: '', state: '', country: '',
    postal_code: '', linkedin: '', github: '', portfolio: '', notice_period: '',
    work_authorization: '', experience_years: '', bio: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  useEffect(() => {
    api('GET', '/api/v1/profile', null, token)
      .then(d => setForm(f => ({ ...f, ...Object.fromEntries(Object.keys(f).map(k => [k, d[k] || ''])) })))
      .catch(() => setMsg({ type: 'error', text: 'Could not load profile.' }))
      .finally(() => setLoading(false))
  }, [token])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setMsg({ type: '', text: '' })
    try {
      await api('PUT', '/api/v1/profile', form, token)
      setMsg({ type: 'success', text: 'Profile saved successfully.' })
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page"><Spinner /></div>

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Personal Information</h2>
        <p className="page-sub">This information is used to autofill job application forms.</p>
      </div>
      <Alert type={msg.type} msg={msg.text} />
      <form onSubmit={save} id="profile-form">
        <div className="section-card">
          <h3 className="section-title">Basic Details</h3>
          <div className="form-grid-2">
            <Input label="First Name" id="p-first" value={form.first_name} onChange={set('first_name')} placeholder="Jane" />
            <Input label="Last Name" id="p-last" value={form.last_name} onChange={set('last_name')} placeholder="Doe" />
            <Input label="Phone" id="p-phone" value={form.phone} onChange={set('phone')} placeholder="+1 555-000-1234" />
            <Input label="Years of Experience" id="p-exp" value={form.experience_years} onChange={set('experience_years')} placeholder="3" />
          </div>
        </div>
        <div className="section-card">
          <h3 className="section-title">Location</h3>
          <div className="form-grid-2">
            <Input label="Address" id="p-address" value={form.address} onChange={set('address')} placeholder="123 Main St" />
            <Input label="City" id="p-city" value={form.city} onChange={set('city')} placeholder="San Francisco" />
            <Input label="State / Province" id="p-state" value={form.state} onChange={set('state')} placeholder="California" />
            <Input label="Country" id="p-country" value={form.country} onChange={set('country')} placeholder="United States" />
            <Input label="Postal Code" id="p-postal" value={form.postal_code} onChange={set('postal_code')} placeholder="94107" />
          </div>
        </div>
        <div className="section-card">
          <h3 className="section-title">Online Presence</h3>
          <div className="form-grid-2">
            <Input label="LinkedIn URL" id="p-linkedin" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/..." />
            <Input label="GitHub URL" id="p-github" value={form.github} onChange={set('github')} placeholder="https://github.com/..." />
            <Input label="Portfolio / Website" id="p-portfolio" value={form.portfolio} onChange={set('portfolio')} placeholder="https://yoursite.com" />
          </div>
        </div>
        <div className="section-card">
          <h3 className="section-title">Work Preferences</h3>
          <div className="form-grid-2">
            <Input label="Notice Period (days)" id="p-notice" value={form.notice_period} onChange={set('notice_period')} placeholder="30" />
            <Input label="Work Authorization" id="p-workauth" value={form.work_authorization} onChange={set('work_authorization')} placeholder="Authorized to work in US" />
          </div>
          <div className="field-group" style={{ marginTop: 12 }}>
            <label htmlFor="p-bio" className="field-label">Bio / Summary</label>
            <textarea id="p-bio" className="field-input" rows={4} value={form.bio} onChange={set('bio')} placeholder="Brief professional summary..." style={{ resize: 'vertical' }} />
          </div>
        </div>
        <PrimaryBtn type="submit" loading={saving} style={{ marginTop: 8 }}>Save Profile</PrimaryBtn>
      </form>
    </div>
  )
}

// ─── Education Page ───────────────────────────────────────────────────────────
function EducationPage() {
  const { token } = useAuth()
  const [records, setRecords] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const empty = { qualification: '', degree: '', major: '', institution: '', graduation_year: '', cgpa: '' }
  const [form, setForm] = useState(empty)

  async function load() {
    try {
      const d = await api('GET', '/api/v1/profile', null, token)
      setRecords(d.educations || [])
    } catch {}
  }
  useEffect(() => { load() }, [token])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (!form.degree || !form.institution) { setMsg({ type: 'error', text: 'Degree and Institution are required.' }); return }
    setSaving(true); setMsg({ type: '', text: '' })
    try {
      await api('POST', '/api/v1/profile/education', form, token)
      setForm(empty); setShowForm(false)
      setMsg({ type: 'success', text: 'Education record added.' })
      load()
    } catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setSaving(false) }
  }

  async function del(id) {
    setDeleting(id)
    try { await api('DELETE', `/api/v1/profile/education/${id}`, null, token); load() }
    catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setDeleting(null) }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Education</h2>
          <p className="page-sub">Add your academic qualifications.</p>
        </div>
        <PrimaryBtn onClick={() => setShowForm(s => !s)}>{showForm ? 'Cancel' : '+ Add Education'}</PrimaryBtn>
      </div>
      <Alert type={msg.type} msg={msg.text} />

      {showForm && (
        <form onSubmit={submit} className="section-card" id="education-form">
          <h3 className="section-title">New Education Record</h3>
          <div className="form-grid-2">
            <Input label="Qualification" id="e-qual" value={form.qualification} onChange={set('qualification')} placeholder="Bachelors Degree" />
            <Input label="Degree" id="e-degree" value={form.degree} onChange={set('degree')} placeholder="B.Sc Computer Science" required />
            <Input label="Major / Field" id="e-major" value={form.major} onChange={set('major')} placeholder="Computer Science" />
            <Input label="Institution" id="e-institution" value={form.institution} onChange={set('institution')} placeholder="University Name" required />
            <Input label="Graduation Year" id="e-year" value={form.graduation_year} onChange={set('graduation_year')} placeholder="2023" />
            <Input label="CGPA / GPA" id="e-cgpa" value={form.cgpa} onChange={set('cgpa')} placeholder="3.9 / 4.0" />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <PrimaryBtn type="submit" loading={saving}>Save Record</PrimaryBtn>
            <SecondaryBtn onClick={() => { setShowForm(false); setForm(empty) }}>Cancel</SecondaryBtn>
          </div>
        </form>
      )}

      {records.length === 0 && !showForm && <div className="empty-state">No education records yet. Click "+ Add Education" to begin.</div>}
      {records.map(r => (
        <div key={r.id} className="record-card">
          <div className="record-main">
            <div className="record-icon">🎓</div>
            <div>
              <div className="record-title">{r.degree} {r.major ? `— ${r.major}` : ''}</div>
              <div className="record-sub">{r.institution} {r.graduation_year ? `· ${r.graduation_year}` : ''}</div>
              {r.cgpa && <div className="record-meta">GPA: {r.cgpa}</div>}
            </div>
          </div>
          <button className="delete-btn" disabled={deleting === r.id} onClick={() => del(r.id)}>
            {deleting === r.id ? <Spinner small /> : '✕'}
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Experience Page ──────────────────────────────────────────────────────────
function ExperiencePage() {
  const { token } = useAuth()
  const [records, setRecords] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const empty = { company: '', title: '', location: '', start_date: '', end_date: '', is_current: false, description: '' }
  const [form, setForm] = useState(empty)

  async function load() {
    try { const d = await api('GET', '/api/v1/profile', null, token); setRecords(d.experiences || []) }
    catch {}
  }
  useEffect(() => { load() }, [token])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (!form.company || !form.title) { setMsg({ type: 'error', text: 'Company and Title are required.' }); return }
    setSaving(true); setMsg({ type: '', text: '' })
    try {
      await api('POST', '/api/v1/profile/experience', { ...form, is_current: form.is_current === true || form.is_current === 'true' }, token)
      setForm(empty); setShowForm(false)
      setMsg({ type: 'success', text: 'Experience record added.' })
      load()
    } catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setSaving(false) }
  }

  async function del(id) {
    setDeleting(id)
    try { await api('DELETE', `/api/v1/profile/experience/${id}`, null, token); load() }
    catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setDeleting(null) }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Work Experience</h2>
          <p className="page-sub">Add your employment history.</p>
        </div>
        <PrimaryBtn onClick={() => setShowForm(s => !s)}>{showForm ? 'Cancel' : '+ Add Experience'}</PrimaryBtn>
      </div>
      <Alert type={msg.type} msg={msg.text} />

      {showForm && (
        <form onSubmit={submit} className="section-card" id="experience-form">
          <h3 className="section-title">New Experience Record</h3>
          <div className="form-grid-2">
            <Input label="Company" id="ex-company" value={form.company} onChange={set('company')} placeholder="Acme Corp" required />
            <Input label="Job Title" id="ex-title" value={form.title} onChange={set('title')} placeholder="Software Engineer" required />
            <Input label="Location" id="ex-location" value={form.location} onChange={set('location')} placeholder="San Francisco, CA" />
            <div className="field-group">
              <label className="field-label">Currently Working Here</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 8 }}>
                <input type="checkbox" checked={form.is_current} onChange={e => setForm(f => ({ ...f, is_current: e.target.checked }))} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Yes, this is my current job</span>
              </label>
            </div>
            <Input label="Start Date" id="ex-start" type="date" value={form.start_date} onChange={set('start_date')} />
            {!form.is_current && <Input label="End Date" id="ex-end" type="date" value={form.end_date} onChange={set('end_date')} />}
          </div>
          <div className="field-group" style={{ marginTop: 12 }}>
            <label htmlFor="ex-desc" className="field-label">Description</label>
            <textarea id="ex-desc" className="field-input" rows={3} value={form.description} onChange={set('description')} placeholder="Describe your responsibilities..." style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <PrimaryBtn type="submit" loading={saving}>Save Record</PrimaryBtn>
            <SecondaryBtn onClick={() => { setShowForm(false); setForm(empty) }}>Cancel</SecondaryBtn>
          </div>
        </form>
      )}

      {records.length === 0 && !showForm && <div className="empty-state">No experience records yet.</div>}
      {records.map(r => (
        <div key={r.id} className="record-card">
          <div className="record-main">
            <div className="record-icon">💼</div>
            <div>
              <div className="record-title">{r.title}</div>
              <div className="record-sub">{r.company} {r.location ? `· ${r.location}` : ''}</div>
              <div className="record-meta">{r.start_date || ''} {r.is_current ? '— Present' : (r.end_date ? `— ${r.end_date}` : '')}</div>
            </div>
          </div>
          <button className="delete-btn" disabled={deleting === r.id} onClick={() => del(r.id)}>
            {deleting === r.id ? <Spinner small /> : '✕'}
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Skills Page ──────────────────────────────────────────────────────────────
function SkillsPage() {
  const { token } = useAuth()
  const [skills, setSkills] = useState([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Technical')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [msg, setMsg] = useState({ type: '', text: '' })

  async function load() {
    try { const d = await api('GET', '/api/v1/profile', null, token); setSkills(d.skills || []) }
    catch {}
  }
  useEffect(() => { load() }, [token])

  async function add(e) {
    e.preventDefault()
    if (!name.trim()) { setMsg({ type: 'error', text: 'Skill name is required.' }); return }
    setSaving(true); setMsg({ type: '', text: '' })
    try {
      await api('POST', '/api/v1/profile/skills', { name: name.trim(), category }, token)
      setName(''); load()
    } catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setSaving(false) }
  }

  async function del(id) {
    setDeleting(id)
    try { await api('DELETE', `/api/v1/profile/skills/${id}`, null, token); load() }
    catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setDeleting(null) }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Skills</h2>
        <p className="page-sub">These appear as comma-separated skills on autofilled forms.</p>
      </div>
      <Alert type={msg.type} msg={msg.text} />
      <form onSubmit={add} className="section-card" id="skills-form">
        <div className="form-grid-3">
          <Input label="Skill Name" id="s-name" value={name} onChange={e => setName(e.target.value)} placeholder="Python, React, AWS..." required />
          <div className="field-group">
            <label htmlFor="s-cat" className="field-label">Category</label>
            <select id="s-cat" className="field-input" value={category} onChange={e => setCategory(e.target.value)}>
              <option>Technical</option>
              <option>Soft Skills</option>
              <option>Languages</option>
              <option>Tools</option>
              <option>Other</option>
            </select>
          </div>
          <div className="field-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <PrimaryBtn type="submit" loading={saving} style={{ width: '100%' }}>Add Skill</PrimaryBtn>
          </div>
        </div>
      </form>

      <div className="skills-cloud">
        {skills.map(s => (
          <div key={s.id} className="skill-chip">
            <span>{s.name}</span>
            <span className="skill-cat">{s.category}</span>
            <button className="skill-del" disabled={deleting === s.id} onClick={() => del(s.id)}>
              {deleting === s.id ? <Spinner small /> : '×'}
            </button>
          </div>
        ))}
        {skills.length === 0 && <div className="empty-state">No skills added yet.</div>}
      </div>
    </div>
  )
}

// ─── Projects Page ────────────────────────────────────────────────────────────
function ProjectsPage() {
  const { token } = useAuth()
  const [records, setRecords] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const empty = { title: '', description: '', technologies: '', url: '', github_url: '' }
  const [form, setForm] = useState(empty)

  async function load() {
    try { const d = await api('GET', '/api/v1/profile', null, token); setRecords(d.projects || []) }
    catch {}
  }
  useEffect(() => { load() }, [token])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (!form.title) { setMsg({ type: 'error', text: 'Project title is required.' }); return }
    setSaving(true); setMsg({ type: '', text: '' })
    try {
      await api('POST', '/api/v1/profile/projects', form, token)
      setForm(empty); setShowForm(false)
      setMsg({ type: 'success', text: 'Project added.' })
      load()
    } catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setSaving(false) }
  }

  async function del(id) {
    setDeleting(id)
    try { await api('DELETE', `/api/v1/profile/projects/${id}`, null, token); load() }
    catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setDeleting(null) }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Projects</h2>
          <p className="page-sub">Showcase your personal and professional projects.</p>
        </div>
        <PrimaryBtn onClick={() => setShowForm(s => !s)}>{showForm ? 'Cancel' : '+ Add Project'}</PrimaryBtn>
      </div>
      <Alert type={msg.type} msg={msg.text} />

      {showForm && (
        <form onSubmit={submit} className="section-card" id="projects-form">
          <h3 className="section-title">New Project</h3>
          <div className="form-grid-2">
            <Input label="Project Title" id="pr-title" value={form.title} onChange={set('title')} placeholder="My Awesome Project" required />
            <Input label="Technologies" id="pr-tech" value={form.technologies} onChange={set('technologies')} placeholder="React, Node.js, PostgreSQL" />
            <Input label="Live URL" id="pr-url" value={form.url} onChange={set('url')} placeholder="https://myproject.com" />
            <Input label="GitHub URL" id="pr-github" value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/..." />
          </div>
          <div className="field-group" style={{ marginTop: 12 }}>
            <label htmlFor="pr-desc" className="field-label">Description</label>
            <textarea id="pr-desc" className="field-input" rows={3} value={form.description} onChange={set('description')} placeholder="What does this project do?" style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <PrimaryBtn type="submit" loading={saving}>Save Project</PrimaryBtn>
            <SecondaryBtn onClick={() => { setShowForm(false); setForm(empty) }}>Cancel</SecondaryBtn>
          </div>
        </form>
      )}

      {records.length === 0 && !showForm && <div className="empty-state">No projects yet.</div>}
      {records.map(r => (
        <div key={r.id} className="record-card">
          <div className="record-main">
            <div className="record-icon">🛠</div>
            <div>
              <div className="record-title">{r.title}</div>
              {r.technologies && <div className="record-meta">{r.technologies}</div>}
              {r.description && <div className="record-sub" style={{ marginTop: 2 }}>{r.description.slice(0, 120)}{r.description.length > 120 ? '...' : ''}</div>}
            </div>
          </div>
          <button className="delete-btn" disabled={deleting === r.id} onClick={() => del(r.id)}>
            {deleting === r.id ? <Spinner small /> : '✕'}
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Resume Page ──────────────────────────────────────────────────────────────
function ResumePage() {
  const { token } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [applying, setApplying] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [dragOver, setDragOver] = useState(false)

  async function upload(file) {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf')) { setMsg({ type: 'error', text: 'Only PDF files are supported.' }); return }
    if (file.size > 10 * 1024 * 1024) { setMsg({ type: 'error', text: 'File must be under 10 MB.' }); return }
    setUploading(true); setMsg({ type: '', text: '' }); setResult(null)
    const fd = new FormData(); fd.append('file', file)
    try {
      const r = await api('POST', '/api/v1/resumes', fd, token, true)
      setResult(r); setMsg({ type: 'success', text: `Resume parsed! ${r.detected_fields.length} fields detected. Review and apply below.` })
    } catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setUploading(false) }
  }

  async function applyExtracted() {
    if (!result) return
    setApplying(true)
    try {
      await api('POST', `/api/v1/resumes/${result.resume_id}/confirm`, result.parsed_profile, token)
      setMsg({ type: 'success', text: 'Profile updated from resume! Review your profile sections.' })
      setResult(null)
    } catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setApplying(false) }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Resume Upload & Parsing</h2>
        <p className="page-sub">Upload your PDF resume to pre-fill your profile. You must review and confirm before anything is saved.</p>
      </div>
      <Alert type={msg.type} msg={msg.text} />

      <div
        className={`drop-zone ${dragOver ? 'dragover' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files[0]) }}
      >
        {uploading ? <><Spinner /><p style={{ marginTop: 12 }}>Parsing resume…</p></> : (
          <>
            <div style={{ fontSize: 36 }}>📄</div>
            <p style={{ margin: '10px 0 4px', fontWeight: 600 }}>Drop your PDF resume here</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>or click to browse (max 10 MB)</p>
            <label className="upload-label" id="resume-upload-label">
              <input id="resume-file" type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => upload(e.target.files[0])} />
              Browse File
            </label>
          </>
        )}
      </div>

      {result && (
        <div className="section-card" style={{ marginTop: 20 }}>
          <h3 className="section-title">Extraction Preview</h3>
          <Alert type="info" msg={`Confidence score: ${Math.round(result.confidence_score * 100)}% | Detected: ${result.detected_fields.join(', ')}`} />
          <div className="field-group">
            <label className="field-label">Extracted Text Preview</label>
            <pre className="preview-text">{result.extracted_text_preview}</pre>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <PrimaryBtn loading={applying} onClick={applyExtracted}>Apply to My Profile</PrimaryBtn>
            <SecondaryBtn onClick={() => setResult(null)}>Discard</SecondaryBtn>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>⚠ Existing profile data will not be overwritten. Only empty fields will be filled.</p>
        </div>
      )}
    </div>
  )
}

// ─── Extension Page ───────────────────────────────────────────────────────────
function ExtensionPage() {
  const { token } = useAuth()
  const [extToken, setExtToken] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  async function generate() {
    setGenerating(true); setMsg({ type: '', text: '' }); setExtToken('')
    try {
      const r = await api('POST', '/api/v1/extension/session', { device_name: 'Chrome Extension' }, token)
      setExtToken(r.token)
      setMsg({ type: 'success', text: `Extension token generated! It expires on ${new Date(r.expires_at).toLocaleDateString()}.` })
    } catch (err) { setMsg({ type: 'error', text: err.message }) }
    finally { setGenerating(false) }
  }

  function copy() {
    navigator.clipboard.writeText(extToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Chrome Extension</h2>
        <p className="page-sub">Connect the ApplyOnce Chrome extension to your profile.</p>
      </div>

      <div className="section-card">
        <h3 className="section-title">How to Load the Extension</h3>
        <ol className="instructions">
          <li>Open <code>chrome://extensions</code> in Chrome.</li>
          <li>Enable <strong>Developer mode</strong> (top right toggle).</li>
          <li>Click <strong>Load unpacked</strong> and select the <code>extension/</code> folder.</li>
          <li>Pin ApplyOnce from the extensions toolbar (puzzle icon).</li>
        </ol>
      </div>

      <div className="section-card">
        <h3 className="section-title">Generate Extension Token</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
          Generate a secure token, then paste it into the extension popup. The extension uses this token to securely load your candidate profile — never your main login password.
        </p>
        <Alert type={msg.type} msg={msg.text} />
        {extToken && (
          <div className="token-box">
            <code className="token-text" id="ext-token-value">{extToken}</code>
            <button className="copy-btn" id="copy-token-btn" onClick={copy}>{copied ? '✓ Copied!' : 'Copy'}</button>
          </div>
        )}
        <PrimaryBtn onClick={generate} loading={generating} id="generate-token-btn">
          {extToken ? '↺ Regenerate Token' : '⚡ Generate Extension Token'}
        </PrimaryBtn>
      </div>

      <div className="section-card">
        <h3 className="section-title">How to Use Autofill</h3>
        <ol className="instructions">
          <li>Make sure the backend is running at <code>http://127.0.0.1:8000</code>.</li>
          <li>Generate a token above and paste it into the extension popup.</li>
          <li>Navigate to any supported job application form.</li>
          <li>Click the <strong>ApplyOnce</strong> icon and press <strong>Autofill Current Page</strong>.</li>
          <li>Review the filled fields — then submit the form yourself.</li>
        </ol>
        <Alert type="info" msg="The extension never submits applications automatically. You always review and submit manually." />
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { token, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <Spinner />
      </div>
    )
  }
  return token ? <AppShell /> : <AuthPage />
}
