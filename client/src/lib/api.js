'use client';
import { saveSession, loadSession, clearSession } from './userStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api/v1';

const cacheStore = new Map(); // key -> { ts, ttlMs, data }
const defaultTTL = 30 * 1000;

function makeKey(url, options) {
  const { method = 'GET', headers, body } = options || {};
  const hdr = headers ? JSON.stringify(headers) : '';
  const b = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
  return `${method}:${url}:${hdr}:${b}`;
}

export async function request(path, { method = 'GET', params, body, headers = {}, cache = true, ttlMs = defaultTTL, credentials = 'include' } = {}) {
  // Ensure we correctly join BASE_URL (which may include a path like /api/v1)
  // with the provided request path, even if it starts with '/'.
  let finalUrl;
  const isAbsolute = typeof path === 'string' && /^https?:\/\//i.test(path);
  if (isAbsolute) {
    finalUrl = path;
  } else {
    const base = String(BASE_URL || '').replace(/\/+$/, '');
    const rel = String(path || '').replace(/^\/+/, '');
    finalUrl = `${base}/${rel}`;
  }
  const url = new URL(finalUrl);
  if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null) url.searchParams.set(k, String(v)); });

  const key = makeKey(url.toString(), { method, headers, body });
  if (cache && method === 'GET') {
    const cached = cacheStore.get(key);
    if (cached && (Date.now() - cached.ts) < cached.ttlMs) {
      return cached.data;
    }
  }

  const isJsonBody = body && typeof body === 'object';
  // Attach Authorization from stored session if available
  const session = await loadSession();
  const bearer = session?.token ? { Authorization: headers.Authorization || `Bearer ${session.token}` } : {};

  const init = {
    method,
    headers: {
      'Content-Type': isJsonBody ? 'application/json' : headers['Content-Type'] || 'application/json',
      ...bearer,
      ...headers
    },
    credentials
  };
  if (body) init.body = isJsonBody ? JSON.stringify(body) : body;

  const res = await fetch(url.toString(), init);
  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    try { data = JSON.parse(text); } catch { data = { success: res.ok, message: text }; }
  }

  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    // Clear session on unauthorized/forbidden to enforce fresh login
    if (res.status === 401 || res.status === 403) {
      try { await clearSession(); } catch {}
      err.code = 'AUTH_REQUIRED';
    }
    throw err;
  }

  if (cache && method === 'GET') {
    cacheStore.set(key, { ts: Date.now(), ttlMs, data });
  }
  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
  // Auth helpers
  login: async (email, password) => {
    const res = await request('/auth/login', { method: 'POST', body: { email, password } });
    // Response shape: ApiResponse { data: { user, token } }
    const data = res?.data ?? res;
    const user = data?.user ?? data?.data?.user ?? data?.data ?? null;
    const token = data?.token ?? null;
    await saveSession({ user, token, extra: { source: 'login' } });
    return res;
  },
  googleLogin: async (idToken) => {
    const res = await request('/auth/google', { method: 'POST', body: { idToken } });
    const data = res?.data ?? res;
    const user = data?.user ?? data?.data?.user ?? null;
    const token = data?.token ?? null;
    await saveSession({ user, token, extra: { source: 'googleLogin' } });
    return res;
  },
  me: async () => {
    const res = await request('/auth/me', { method: 'GET' });
    const user = res?.data ?? res;
    // Preserve token in existing session, update user
    const current = await loadSession();
    await saveSession({ user, token: current?.token || null, extra: { source: 'me' } });
    return res;
  },
  logout: async () => {
    // Backend logout route is GET in server; client previously used POST.
    const res = await request('/auth/logout', { method: 'GET' });
    await clearSession();
    return res;
  },
  updateMe: async (payload) => {
    const res = await request('/auth/update-me', { method: 'PATCH', body: payload });
    const user = res?.data ?? res;
    const current = await loadSession();
    await saveSession({ user, token: current?.token || null, extra: { source: 'updateMe' } });
    return res;
  },
  updatePassword: (payload) => request('/auth/update-password', { method: 'PATCH', body: payload }),
  // When password is updated, backend issues a fresh token; persist it
  updatePassword: async (payload) => {
    const res = await request('/auth/update-password', { method: 'PATCH', body: payload });
    const data = res?.data ?? res;
    const user = data?.user ?? data?.data?.user ?? null;
    const token = data?.token ?? null;
    const current = await loadSession();
    await saveSession({ user: user ?? current?.user ?? null, token: token ?? current?.token ?? null, extra: { source: 'updatePassword' } });
    return res;
  },
  // User profile helpers
  addAddress: (payload) => request('/users/address', { method: 'PUT', body: payload }),
  deleteAddress: (addressId) => request(`/users/address/${addressId}`, { method: 'DELETE' }),
  setDefaultAddress: (addressId) => request(`/users/address/${addressId}/default`, { method: 'PUT' }),
  dashboard: () => request('/users/dashboard', { method: 'GET' }),
  updateAvatar: async (file) => {
    const form = new FormData();
    form.append('avatar', file);

    const session = await loadSession();
    const bearer = session?.token ? { Authorization: `Bearer ${session.token}` } : {};

    const base = String(BASE_URL || '').replace(/\/+$/, '');
    const url = `${base}/users/avatar`;
    const res = await fetch(url, {
      method: 'PUT',
      body: form,
      headers: { ...bearer }, // Let browser set multipart boundary
      credentials: 'include'
    });

    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try { data = JSON.parse(text); } catch { data = { success: res.ok, message: text }; }
    }

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        try { await clearSession(); } catch {}
      }
      const err = new Error(data?.message || 'Avatar upload failed');
      err.status = res.status;
      err.data = data;
      throw err;
    }

    const user = data?.data ?? data;
    const current = await loadSession();
    await saveSession({ user, token: current?.token || null, extra: { source: 'updateAvatar' } });
    return data;
  },
  // Donation history
  listDonations: async () => {
    const res = await request('/users/donations', { method: 'GET' });
    return res?.data || res;
  },
  addDonation: async ({ date, hospital, units }) => {
    const payload = { date, hospital, units };
    const res = await request('/users/donations', { method: 'POST', body: payload });
    return res?.data || res;
  },
  // Donor details
  getDonor: async (id, params) => {
    const res = await request(`/donors/${id}`, { method: 'GET', params });
    return res?.data || res;
  },
};

export default api;