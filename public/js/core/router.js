// Sonix Hash Router
class Router {
  constructor() {
    this.routes = new Map();
    this.notFoundHandler = null;
    this.beforeHooks = [];
    this.afterHooks = [];
    this.currentRoute = null;
  }
  
  addRoute(route) {
    this.routes.set(route.path, route);
    return this;
  }
  
  setNotFound(handler) { this.notFoundHandler = handler; }
  
  beforeEach(fn) { this.beforeHooks.push(fn); return this; }
  afterEach(fn) { this.afterHooks.push(fn); return this; }
  
  matchRoute(path) {
    for (const [routePath, route] of this.routes) {
      const regex = this.pathToRegex(routePath);
      const match = path.match(regex);
      if (match) { return { route, params: this.extractParams(routePath, match) }; }
    }
    return null;
  }
  
  pathToRegex(path) {
    return new RegExp('^' + path.replace(/:([^/]+)/g, '(?<$1>[^/]+)') + '$');
  }
  
  extractParams(template, match) {
    const names = [...template.matchAll(/:([^/]+)/g)].map(m => m[1]);
    const params = {};
    names.forEach((name, i) => { params[name] = match[i + 1]; });
    return params;
  }
  
  async navigate(path) {
    // Run before hooks
    for (const hook of this.beforeHooks) {
      const result = hook(path);
      if (result === false) return;
    }
    
    const matched = this.matchRoute(path);
    let html = '';
    
    if (matched) {
      this.currentRoute = matched;
      html = await matched.route.component(matched.params);
    } else if (this.notFoundHandler) {
      html = await this.notFoundHandler();
    }
    
    // Run after hooks
    for (const hook of this.afterHooks) { hook(matched?.route); }
    
    return html;
  }
  
  start() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }
  
  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    this.navigate(hash);
  }
  
  getCurrentRoute() { return this.currentRoute; }
}

function navigateTo(path) { window.location.hash = '#' + path; }
function getCurrentRoute() { return window.location.hash.slice(1) || '/'; }
function isActiveRoute(path) { return getCurrentRoute() === path; }

export const router = new Router();
export { navigateTo, getCurrentRoute, isActiveRoute };
export default router;
