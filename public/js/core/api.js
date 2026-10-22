// Sonix API Client
import { auth } from './auth.js';
import { toast } from '../ui/toast.js';

class ApiClient {
  constructor() { this.baseUrl = ''; }
  
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }
  
  async request(url, options = {}) {
    const config = { ...options, headers: { ...this.getHeaders(), ...options.headers } };
    try {
      let response = await fetch(`${this.baseUrl}${url}`, config);
      if (response.status === 401) {
        auth.clearSession();
        window.location.hash = '#/login';
        throw new Error('Session expired');
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${response.status}`);
      }
      return response;
    } catch (e) {
      if (options.silent !== true) toast.error(e.message);
      throw e;
    }
  }
  
  async get(url, opts) { return this.request(url, { ...opts, method: 'GET' }).then(r => r.json()); }
  async post(url, body, opts) { return this.request(url, { ...opts, method: 'POST', body: JSON.stringify(body) }).then(r => r.json()); }
  async put(url, body, opts) { return this.request(url, { ...opts, method: 'PUT', body: JSON.stringify(body) }).then(r => r.json()); }
  async del(url, opts) { return this.request(url, { ...opts, method: 'DELETE' }).then(r => r.json()); }
}

export const api = new ApiClient();
export default api;
