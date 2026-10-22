// Sonix Auth Module - JWT Stateless Authentication
const AUTH_TOKEN_KEY = 'sonix_auth_token';
const USER_DATA_KEY = 'sonix_user_data';

export const auth = {
  getToken() { return localStorage.getItem(AUTH_TOKEN_KEY); },
  
  setToken(token) { localStorage.setItem(AUTH_TOKEN_KEY, token); },
  
  getUserData() {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  setUserData(user) { localStorage.setItem(USER_DATA_KEY, JSON.stringify(user)); },
  
  clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }
};

export async function login(identifier, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (data.success && data.token) {
      auth.setToken(data.token);
      auth.setUserData(data.user);
    }
    return data;
  } catch (e) { return { success: false, error: e.message }; }
}

export async function register(userData) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (data.success && data.token) {
      auth.setToken(data.token);
      auth.setUserData(data.user);
    }
    return data;
  } catch (e) { return { success: false, error: e.message }; }
}

export async function logout() {
  try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
  auth.clearSession();
  window.location.hash = '#/login';
}

export async function getSession() {
  const token = auth.getToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) { auth.clearSession(); return null; }
    const user = await res.json();
    auth.setUserData(user);
    return user;
  } catch (e) { return null; }
}

export function isAuthenticated() { return !!auth.getToken(); }

export function isAdmin() {
  const user = auth.getUserData();
  return user?.role === 'ADMIN';
}
