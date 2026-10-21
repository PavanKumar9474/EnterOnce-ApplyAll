/**
 * ApplyOnce Web App - Centralized API Service
 */

const API_BASE = 'http://localhost:8000/api/v1';

function getToken() {
  return localStorage.getItem('ao_auth_token');
}

function setToken(token) {
  if (token) {
    localStorage.setItem('ao_auth_token', token);
  } else {
    localStorage.removeItem('ao_auth_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...options.headers
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set Content-Type only if not sending FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    // If unauthorized, clear token and notify
    setToken(null);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  auth: {
    login: async (email, password) => {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setToken(data.access_token);
      return data;
    },
    register: async (email, password, full_name) => {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name })
      });
      return data;
    },
    getMe: () => request('/auth/me'),
    logout: async () => {
      try {
        await request('/auth/logout', { method: 'POST' });
      } finally {
        setToken(null);
      }
    },
    hasToken: () => Boolean(getToken())
  },

  profile: {
    get: () => request('/profile'),
    update: (data) => request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    addEducation: (data) => request('/profile/education', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateEducation: (id, data) => request(`/profile/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deleteEducation: (id) => request(`/profile/education/${id}`, {
      method: 'DELETE'
    }),
    addExperience: (data) => request('/profile/experience', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateExperience: (id, data) => request(`/profile/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deleteExperience: (id) => request(`/profile/experience/${id}`, {
      method: 'DELETE'
    }),
    addSkill: (data) => request('/profile/skills', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    deleteSkill: (id) => request(`/profile/skills/${id}`, {
      method: 'DELETE'
    }),
    addProject: (data) => request('/profile/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateProject: (id, data) => request(`/profile/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deleteProject: (id) => request(`/profile/projects/${id}`, {
      method: 'DELETE'
    })
  },

  resumes: {
    upload: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return request('/resumes', {
        method: 'POST',
        body: formData
      });
    },
    list: () => request('/resumes'),
    confirm: (id, confirmedData = null) => request(`/resumes/${id}/confirm`, {
      method: 'POST',
      body: confirmedData ? JSON.stringify(confirmedData) : undefined
    }),
    delete: (id) => request(`/resumes/${id}`, {
      method: 'DELETE'
    })
  },

  extension: {
    createSession: (deviceName = 'Chrome Extension') => request('/extension/session', {
      method: 'POST',
      body: JSON.stringify({ device_name: deviceName })
    })
  },

  account: {
    exportData: () => request('/account/export'),
    deleteAccount: () => request('/account', {
      method: 'DELETE'
    })
  }
};
