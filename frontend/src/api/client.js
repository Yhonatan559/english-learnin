import { getToken } from '../context/AuthContext';

const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Error');
  return data;
}

export const api = {
  auth: {
    register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  },
  users: {
    profile: () => request('/users/profile'),
    history: () => request('/users/history'),
  },
  lessons: {
    list: (opts) => {
      const params = new URLSearchParams();
      if (opts && typeof opts === 'object') {
        if (opts.level) params.set('level', opts.level);
        if (opts.category) params.set('category', opts.category);
      } else if (opts) params.set('level', opts);
      const q = params.toString();
      return request(q ? `/lessons?${q}` : '/lessons');
    },
    get: (id) => request(`/lessons/${id}`),
    progress: (id) => request(`/lessons/${id}/progress`),
  },
  progress: {
    save: (lessonId, body) => request(`/progress/lesson/${lessonId}`, { method: 'POST', body: JSON.stringify(body) }),
    summary: () => request('/progress/summary'),
  },
  chat: {
    message: (message) => request('/chat/message', { method: 'POST', body: JSON.stringify({ message }) }),
    history: () => request('/chat/history'),
  },
};
