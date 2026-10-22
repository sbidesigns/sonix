/**
 * Sonix AI Music Generator - Main Entry Point
 * Vanilla HTML/JS SPA - No build tools required!
 */

import { login, logout, register, getSession, isAuthenticated, isAdmin } from './core/auth.js';
import { api } from './core/api.js';
import { store } from './core/store.js';
import { router, navigateTo } from './core/router.js';
import { toast } from './ui/toast.js';
import { Icon } from './ui/icons.js';
import { detectWebGPU, AVAILABLE_MODELS } from './features/webgpu.js';
import { Player } from './features/player.js';

import * as DashboardModule from './modules/dashboard.js';
import * as GeneratorModule from './modules/generator.js';
import * as TracksModule from './modules/tracks.js';
import * as SettingsModule from './modules/settings.js';
import * as AdminModule from './modules/admin.js';

// App State
let player = null;
let currentView = null;

// Initialize
async function init() {
  try {
    // Check session
    if (isAuthenticated()) {
      const user = await getSession();
      if (user) store.setState({ user });
    }
    
    // Setup routes
    setupRoutes();
    
    // Start router with hash change handler
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
    
    // Init audio player
    player = new Player();
    await player.init();
    
    // Mark loaded
    document.body.classList.add('loaded');
    document.getElementById('loader').style.display = 'none';
    
    console.log('✅ Sonix AI Ready');
  } catch (e) {
    console.error('Init error:', e);
    document.getElementById('loader').innerHTML = '<p style="color:#ef4444">Failed to load</p>';
  }
}

function setupRoutes() {
  // Routes are handled in handleRoute()
}

async function handleRoute() {
  const path = window.location.hash.slice(1) || '/';
  const app = document.getElementById('app');
  if (!app) return;
  
  // Destroy current view
  const destroyFns = {
    dashboard: DashboardModule.destroyDashboard,
    generate: GeneratorModule.destroyGenerator,
    tracks: TracksModule.destroyTracks,
    settings: SettingsModule.destroySettings,
    admin: AdminModule.destroyAdmin
  };
  if (currentView && destroyFns[currentView]) destroyFns[currentView]();
  
  // Auth check for protected routes
  const authRoutes = ['/dashboard', '/generate', '/tracks', '/settings'];
  const adminRoutes = ['/admin'];
  
  if ((authRoutes.includes(path) || authRoutes.some(r => path.startsWith(r))) && !isAuthenticated()) {
    currentView = 'login';
    app.innerHTML = renderLogin();
    initLoginEvents();
    renderNav('login');
    return;
  }
  
  if (adminRoutes.includes(path) && !isAdmin()) {
    navigateTo('/dashboard');
    return;
  }
  
  // Render view
  switch (path) {
    case '/':
    case '/dashboard':
      currentView = 'dashboard';
      app.innerHTML = DashboardModule.renderDashboard();
      DashboardModule.initDashboard({ onNavigate: navigateTo, api, store, toast });
      break;
      
    case '/login':
      currentView = 'login';
      app.innerHTML = renderLogin();
      initLoginEvents();
      break;
      
    case '/generate':
      currentView = 'generate';
      GeneratorModule.setGeneratorMode?.('simple');
      app.innerHTML = GeneratorModule.renderGenerator();
      GeneratorModule.initGenerator({ api, store, toast, player, models: AVAILABLE_MODELS });
      break;
      
    case '/tracks':
      currentView = 'tracks';
      app.innerHTML = TracksModule.renderTracks();
      TracksModule.initTracks({ api, store, toast, player });
      break;
      
    case '/settings':
      currentView = 'settings';
      app.innerHTML = SettingsModule.renderSettings();
      SettingsModule.initSettings({ api, store, toast });
      break;
      
    case '/admin':
      currentView = 'admin';
      app.innerHTML = AdminModule.renderAdmin();
      AdminModule.initAdmin({ api, store, toast });
      break;
      
    default:
      // Check for /generate/:mode
      const genMatch = path.match(/^\/generate\/(.+)$/);
      if (genMatch) {
        currentView = 'generate';
        GeneratorModule.setGeneratorMode?.(genMatch[1]);
        app.innerHTML = GeneratorModule.renderGenerator();
        GeneratorModule.initGenerator({ api, store, toast, player, models: AVAILABLE_MODELS });
        break;
      }
      app.innerHTML = `<div class="flex items-center justify-center min-h-[60vh]"><div class="text-center"><p class="text-6xl mb-4">🎵</p><h1 class="text-2xl font-bold">404</h1><p class="text-muted">Page not found</p></div></div>`;
      currentView = null;
  }
  
  renderNav(currentView);
}

// Login Page
function renderLogin() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-3xl mb-4">🎵</div>
          <h1 class="text-3xl font-bold">Sonix</h1>
          <p class="text-muted mt-1">AI Music Generator</p>
        </div>
        
        <div class="bg-card border border-border rounded-xl p-6 shadow-lg">
          <form id="login-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary mb-1">Email or Username</label>
              <input type="text" id="login-id" class="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-accent-primary outline-none" placeholder="Enter email or username" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary mb-1">Password</label>
              <input type="password" id="login-pass" class="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-accent-primary outline-none" placeholder="Enter password" required>
            </div>
            <div id="login-error" class="hidden text-sm text-error bg-error/10 p-3 rounded-lg"></div>
            <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg font-medium hover:opacity-90 transition">Sign In</button>
          </form>
          
          <div class="mt-5 pt-5 border-t border-border">
            <p class="text-xs text-muted text-center mb-3">Quick Access</p>
            <div class="grid grid-cols-2 gap-2">
              <button class="demo-btn px-3 py-2 bg-bg-secondary rounded-lg text-left hover:bg-bg-tertiary transition text-sm" data-u="demo" data-p="demo123">
                <span class="font-medium">Demo User</span><br><span class="text-muted text-xs">demo / demo123</span>
              </button>
              <button class="demo-btn px-3 py-2 bg-bg-secondary rounded-lg text-left hover:bg-bg-tertiary transition text-sm" data-u="admin" data-p="SONIXadmin">
                <span class="font-medium">Admin</span><br><span class="text-muted text-xs">admin / SONIXadmin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initLoginEvents() {
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;
    errorEl.classList.add('hidden');
    
    const res = await login(id, pass);
    if (res.success) {
      toast.success('Welcome back!');
      navigateTo('/dashboard');
    } else {
      errorEl.textContent = res.error || 'Login failed';
      errorEl.classList.remove('hidden');
    }
  });
  
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('login-id').value = btn.dataset.u;
      document.getElementById('login-pass').value = btn.dataset.p;
    });
  });
}

// Navigation
function renderNav(view) {
  const nav = document.getElementById('main-nav') || createNavContainer();
  const user = store.getState().user;
  const loggedIn = isAuthenticated();
  
  nav.innerHTML = `
    <nav class="flex items-center gap-1 flex-wrap">
      ${loggedIn ? `
        <a href="#/dashboard" class="nav-link ${view==='dashboard'?'active':''}">🏠 Dashboard</a>
        <a href="#/generate" class="nav-link ${view==='generate'?'active':''}">⚡ Generate</a>
        <a href="#/tracks" class="nav-link ${view==='tracks'?'active':''}">🎵 Tracks</a>
        <a href="#/settings" class="nav-link ${view==='settings'?'active':''}">⚙️ Settings</a>
        ${isAdmin() ? `<a href="#/admin" class="nav-link ${view==='admin'?'active':''}">🛡️ Admin</a>` : ''}
      ` : ''}
    </nav>
    <div class="flex items-center gap-3">
      ${loggedIn ? `
        <button id="user-btn" class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-bg-secondary transition">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white text-xs font-bold">${user?.name?.[0]?.toUpperCase()||'U'}</div>
          <span class="text-sm hidden sm:block">${user?.name||'User'}</span>
        </button>
        <div id="user-menu" class="hidden absolute right-4 top-full mt-2 w-44 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
          <a href="#/settings" class="block px-4 py-2 text-sm hover:bg-bg-secondary">⚙️ Settings</a>
          <hr class="my-1 border-border">
          <button id="logout-btn" class="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10">🚪 Logout</button>
        </div>
      ` : ''}
    </div>
  `;
  
  // Events
  nav.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', e => { e.preventDefault(); navigateTo(a.getAttribute('href').slice(1)); }));
  document.getElementById('user-btn')?.addEventListener('click', e => { e.stopPropagation(); document.getElementById('user-menu')?.classList.toggle('hidden'); });
  document.getElementById('logout-btn')?.addEventListener('click', async () => { await logout(); });
  document.addEventListener('click', () => document.getElementById('user-menu')?.classList.add('hidden'));
}

function createNavContainer() {
  const header = document.createElement('header');
  header.id = 'main-nav';
  header.className = 'sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between';
  document.body.prepend(header);
  return header;
}

// Start
document.addEventListener('DOMContentLoaded', init);
if (document.readyState !== 'loading') init();

window.SonixApp = { store, api, player, navigateTo };
