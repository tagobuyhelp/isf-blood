'use client';

const SESSION_KEY = 'isf:session:v1';
const DEFAULT_SESSION_TTL_MS = parseInt(process.env.NEXT_PUBLIC_SESSION_TTL_MS || '', 10) || (24 * 60 * 60 * 1000);
const LS_SECRET = process.env.NEXT_PUBLIC_LS_SECRET || 'change-me-dev';

function sanitizeUser(u) {
  if (!u || typeof u !== 'object') return null;
  const clone = { ...u };
  Object.keys(clone).forEach((k) => {
    if (/password|reset|secret|salt/i.test(k)) delete clone[k];
  });
  return clone;
}

function decodeJwtExp(token) {
  try {
    const parts = String(token).split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload && typeof payload.exp === 'number') return payload.exp * 1000;
    return null;
  } catch { return null; }
}

async function deriveAesKey(secret) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'PBKDF2' }, false, ['deriveKey']);
  const salt = enc.encode('isf-blood-salt-v1');
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptJson(obj) {
  try {
    const key = await deriveAesKey(LS_SECRET);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const data = enc.encode(JSON.stringify(obj));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
    const buff = new Uint8Array(iv.byteLength + ct.byteLength);
    buff.set(iv, 0);
    buff.set(new Uint8Array(ct), iv.byteLength);
    // Base64 encode
    const b64 = btoa(String.fromCharCode(...buff));
    return b64;
  } catch {
    // Fallback to plain JSON if crypto fails
    return JSON.stringify({ __plain: true, data: obj });
  }
}

async function decryptJson(b64OrJson) {
  try {
    // Plain fallback
    if (b64OrJson && typeof b64OrJson === 'string' && b64OrJson.startsWith('{')) {
      const parsed = JSON.parse(b64OrJson);
      if (parsed && parsed.__plain) return parsed.data;
    }
    const key = await deriveAesKey(LS_SECRET);
    const binStr = atob(b64OrJson);
    const bytes = Uint8Array.from(binStr, c => c.charCodeAt(0));
    const iv = bytes.slice(0, 12);
    const ct = bytes.slice(12);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    const dec = new TextDecoder().decode(pt);
    return JSON.parse(dec);
  } catch {
    return null;
  }
}

export async function saveSession({ user, token, extra }) {
  const cleanUser = sanitizeUser(user);
  const now = Date.now();
  const tokenExpMs = token ? decodeJwtExp(token) : null;
  const ttl = DEFAULT_SESSION_TTL_MS;
  const exp = Math.min(tokenExpMs || (now + ttl), now + ttl);
  const session = { user: cleanUser, token: token || null, extra: extra || null, ts: now, exp };
  try {
    const enc = await encryptJson(session);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SESSION_KEY, enc);
    }
    return session;
  } catch {
    // Storage error silently ignored per requirement; caller can verify
    return null;
  }
}

export async function loadSession() {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = await decryptJson(raw);
    if (!session || typeof session !== 'object') return null;
    // Validate shape
    if (!('exp' in session) || !('ts' in session)) return null;
    return session;
  } catch {
    return null;
  }
}

export async function isSessionValid() {
  const s = await loadSession();
  if (!s) return false;
  return Date.now() < Number(s.exp || 0);
}

export async function clearSession() {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {}
}

export function maskToken(token) {
  if (!token) return '—';
  const t = String(token);
  if (t.length <= 12) return `${t.slice(0, 4)}•••${t.slice(-4)}`;
  return `${t.slice(0, 6)}••••••${t.slice(-6)}`;
}