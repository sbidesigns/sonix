// Sonix State Store (Pub/Sub pattern)
class Store {
  constructor() {
    this.state = {
      app: { initialized: false, loading: true, online: navigator.onLine },
      user: null,
      currentView: 'login',
      tracks: [],
      models: [],
      settings: { theme: 'dark', defaultMode: 'simple' },
      generation: { inProgress: false, progress: 0 },
      favorites: []
    };
    this.listeners = new Map();
    this.persistKeys = ['settings', 'favorites'];
    this.loadPersisted();
  }
  
  loadPersisted() {
    this.persistKeys.forEach(key => {
      const saved = localStorage.getItem(`sonix_${key}`);
      if (saved) { try { this.state[key] = JSON.parse(saved); } catch {} }
    });
  }
  
  persist(key) {
    if (this.persistKeys.includes(key)) {
      localStorage.setItem(`sonix_${key}`, JSON.stringify(this.state[key]));
    }
  }
  
  getState() { return this.state; }
  
  setState(updates) {
    Object.keys(updates).forEach(key => {
      this.state[key] = { ...this.state[key], ...updates[key] };
      this.persist(key);
      this.notify(key, this.state[key]);
    });
  }
  
  subscribe(key, callback) {
    if (!this.listeners.has(key)) this.listeners.set(key, new Set());
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key)?.delete(callback);
  }
  
  notify(key, value) {
    this.listeners.get(key)?.forEach(cb => cb(value));
  }
}

export const store = new Store();
export default store;
