/**
 * Admin Module - Administrative dashboard with sidebar navigation
 * 11 modules: Dashboard, Users, Tracks, Analytics, AI Models, Feature Flags,
 * API Keys, Sessions, Audit Logs, Login History, System Settings
 * @module AdminModule
 */

export const AdminModule = {
  // State management
  _state: {
    activeModule: 'dashboard',
    callbacks: {},
    eventListeners: [],
    isLoading: false,
    data: {}
  },

  // Sidebar modules definition
  modules: [
    { id: 'dashboard', label: 'Dashboard', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>', badge: null },
    { id: 'users', label: 'Users', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', badge: null },
    { id: 'tracks', label: 'Tracks', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>', badge: null },
    { id: 'analytics', label: 'Analytics', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>', badge: null },
    { id: 'models', label: 'AI Models', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>', badge: '3' },
    { id: 'features', label: 'Feature Flags', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>', badge: null },
    { id: 'apikeys', label: 'API Keys', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>', badge: null },
    { id: 'sessions', label: 'Sessions', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>', badge: null },
    { id: 'audit', label: 'Audit Logs', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>', badge: null },
    { id: 'logins', label: 'Login History', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', badge: null },
    { id: 'system', label: 'System Settings', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', badge: null }
  ],

  /**
   * Render the admin dashboard
   * @param {Object} options - Configuration options
   * @returns {string} Complete admin HTML
   */
  renderAdmin(options = {}) {
    this._state.data = options.data || {};
    this._state.activeModule = options.activeModule || 'dashboard';

    return `
      <div class="admin-container" id="admin-root">
        ${this._renderSidebar()}
        <main class="admin-main">
          ${this._renderMainHeader()}
          <div class="admin-content" id="admin-content">
            ${this._renderActiveModule()}
          </div>
        </main>
      </div>
    `;
  },

  /**
   * Render sidebar navigation
   * @private
   */
  _renderSidebar() {
    const { activeModule } = this._state;

    return `
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <div class="admin-logo">
            <span class="logo-icon">⚡</span>
            <span class="logo-text">Sonix Admin</span>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <span class="nav-label">Main</span>
            ${this.modules.slice(0, 5).map(mod => this._renderNavButton(mod)).join('')}
          </div>
          
          <div class="nav-section">
            <span class="nav-label">Management</span>
            ${this.modules.slice(5).map(mod => this._renderNavButton(mod)).join('')}
          </div>
        </nav>

        <div class="sidebar-footer">
          <a href="/" class="back-to-app">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
            Back to App
          </a>
        </div>
      </aside>
    `;
  },

  /**
   * Render single nav button
   * @private
   */
  _renderNavButton(mod) {
    const isActive = this._state.activeModule === mod.id;
    
    return `
      <button 
        class="nav-btn ${isActive ? 'active' : ''}" 
        data-module="${mod.id}"
        title="${mod.label}"
      >
        <span class="nav-icon">${mod.icon}</span>
        <span class="nav-label-text">${mod.label}</span>
        ${mod.badge ? `<span class="nav-badge">${mod.badge}</span>` : ''}
      </button>
    `;
  },

  /**
   * Render main header area
   * @private
   */
  _renderMainHeader() {
    const activeMod = this.modules.find(m => m.id === this._state.activeModule);

    return `
      <header class="admin-header">
        <div class="header-left">
          <button class="sidebar-toggle" id="sidebar-toggle" title="Toggle Sidebar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
          <h1 class="header-title">${activeMod?.label || 'Dashboard'}</h1>
        </div>
        
        <div class="header-right">
          <div class="header-search">
            <input type="text" placeholder="Search admin..." class="admin-search-input" id="admin-search">
          </div>
          <button class="header-btn notification-btn" title="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notification-dot"></span>
          </button>
          <div class="admin-user-menu">
            <button class="user-avatar-btn" id="admin-user-menu-btn">
              <span class="avatar">A</span>
            </button>
          </div>
        </div>
      </header>
    `;
  },

  /**
   * Render active module content
   * @private
   */
  _renderActiveModule() {
    switch (this._state.activeModule) {
      case 'dashboard': return this._renderDashboardModule();
      case 'users': return this._renderUsersModule();
      case 'tracks': return this._renderTracksModule();
      case 'analytics': return this._renderAnalyticsModule();
      case 'models': return this._renderModelsModule();
      case 'features': return this._renderFeaturesModule();
      case 'apikeys': return this._renderApiKeysModule();
      case 'sessions': return this._renderSessionsModule();
      case 'audit': return this._renderAuditModule();
      case 'logins': return this._renderLoginsModule();
      case 'system': return this._renderSystemModule();
      default: return this._renderDashboardModule();
    }
  },

  // ==================== MODULE RENDERERS ====================

  /** @private Dashboard Module */
  _renderDashboardModule() {
    return `
      <div class="admin-module" data-module="dashboard">
        <div class="stats-grid">
          <div class="stat-card stat-primary">
            <div class="stat-icon">👥</div>
            <div class="stat-data">
              <span class="stat-value">12,459</span>
              <span class="stat-label">Total Users</span>
              <span class="stat-change positive">+12.5%</span>
            </div>
          </div>
          <div class="stat-card stat-success">
            <div class="stat-icon">🎵</div>
            <div class="stat-data">
              <span class="stat-value">89,234</span>
              <span class="stat-label">Tracks Generated</span>
              <span class="stat-change positive">+23.1%</span>
            </div>
          </div>
          <div class="stat-card stat-warning">
            <div class="stat-icon">⚡</div>
            <div class="stat-data">
              <span class="stat-value">1.2M</span>
              <span class="stat-label">API Calls Today</span>
              <span class="stat-change negative">-2.3%</span>
            </div>
          </div>
          <div class="stat-card stat-danger">
            <div class="stat-icon">💰</div>
            <div class="stat-data">
              <span class="stat-value">$45,678</span>
              <span class="stat-label">Revenue (MTD)</span>
              <span class="stat-change positive">+8.7%</span>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="card chart-card">
            <h3 class="card-title">Generation Activity (7 Days)</h3>
            <div class="chart-placeholder" id="activity-chart">
              <svg viewBox="0 0 400 150" class="mini-chart">
                <polyline points="0,120 57,90 114,100 171,60 228,70 285,40 342,55 400,30" fill="none" stroke="#8b5cf6" stroke-width="2"/>
                <polyline points="0,130 57,110 114,115 171,85 228,95 285,75 342,85 400,65" fill="none" stroke="#06b6d4" stroke-width="2"/>
              </svg>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-color" style="background:#8b5cf6"></span>Generations</span>
              <span class="legend-item"><span class="legend-color" style="background:#06b6d4"></span>Downloads</span>
            </div>
          </div>

          <div class="card recent-activity">
            <h3 class="card-title">Recent Activity</h3>
            <div class="activity-list">
              ${[
                { user: 'john@example.com', action: 'Generated track', time: '2 min ago', icon: '🎵' },
                { user: 'sarah@music.co', action: 'Upgraded to Pro', time: '5 min ago', icon: '⭐' },
                { user: 'mike@test.io', action: 'Created API key', time: '12 min ago', icon: '🔑' },
                { user: 'lisa@studio.net', action: 'Exported 15 tracks', time: '18 min ago', icon: '📦' },
                { user: 'newuser@mail.com', action: 'Signed up', time: '25 min ago', icon: '✨' }
              ].map(item => `
                <div class="activity-item">
                  <span class="activity-icon">${item.icon}</span>
                  <div class="activity-details">
                    <span class="activity-action">${item.action}</span>
                    <span class="activity-user">${item.user}</span>
                  </div>
                  <span class="activity-time">${item.time}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card system-health">
            <h3 class="card-title">System Health</h3>
            <div class="health-items">
              <div class="health-item">
                <span class="health-label">API Status</span>
                <span class="health-status status-operational">Operational</span>
              </div>
              <div class="health-item">
                <span class="health-label">Database</span>
                <span class="health-status status-operational">Healthy</span>
              </div>
              <div class="health-item">
                <span class="health-label">Storage</span>
                <span class="health-status status-warning">72% Used</span>
              </div>
              <div class="health-item">
                <span class="health-label">Queue Depth</span>
                <span class="health-status status-operational">23 pending</span>
              </div>
              <div class="health-item">
                <span class="health-label">Avg Response Time</span>
                <span class="health-status status-operational">245ms</span>
              </div>
            </div>
          </div>

          <div class="card top-genres">
            <h3 class="card-title">Top Genres</h3>
            <div class="genre-bars">
              ${[
                { genre: 'Electronic', percent: 78, color: '#8b5cf6' },
                { genre: 'Hip-Hop', percent: 65, color: '#f59e0b' },
                { genre: 'Pop', percent: 54, color: '#ec4899' },
                { genre: 'Lo-Fi', percent: 42, color: '#84cc16' },
                { genre: 'Rock', percent: 31, color: '#ef4444' }
              ].map(g => `
                <div class="genre-row">
                  <span class="genre-name">${g.genre}</span>
                  <div class="genre-bar-wrapper">
                    <div class="genre-bar" style="width:${g.percent}%; background:${g.color}"></div>
                  </div>
                  <span class="genre-percent">${g.percent}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /** @private Users Module */
  _renderUsersModule() {
    return `
      <div class="admin-module" data-module="users">
        <div class="module-toolbar">
          <div class="toolbar-filters">
            <input type="text" placeholder="Search users..." class="filter-input" id="users-search">
            <select class="filter-select" id="users-role-filter">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="pro">Pro User</option>
            </select>
            <select class="filter-select" id="users-status-filter">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button class="btn-primary" id="add-user-btn">+ Add User</button>
        </div>

        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th><input type="checkbox" id="users-select-all"></th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Tracks</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this._generateMockUsers().map(user => `
                <tr>
                  <td><input type="checkbox" class="row-cb" data-id="${user.id}"></td>
                  <td>
                    <div class="user-cell">
                      <span class="user-avatar small">${user.name.charAt(0)}</span>
                      <span>${this._escapeHtml(user.name)}</span>
                    </div>
                  </td>
                  <td>${this._escapeHtml(user.email)}</td>
                  <td><span class="badge badge-${user.role}">${user.role}</span></td>
                  <td><span class="status-dot status-${user.status}"></span> ${user.status}</td>
                  <td>${user.tracks}</td>
                  <td>${this._formatDate(user.joined)}</td>
                  <td>${this._formatRelativeTime(user.lastActive)}</td>
                  <td>
                    <div class="action-dropdown">
                      <button class="dropdown-trigger" data-user-id="${user.id}">⋮</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <span class="showing-count">Showing 1-10 of 12,459 users</span>
          <div class="pagination-mini">
            <button disabled>← Prev</button>
            <button class="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>... </button>
            <button>1246</button>
            <button>Next →</button>
          </div>
        </div>
      </div>
    `;
  },

  /** @private Tracks Module */
  _renderTracksModule() {
    return `
      <div class="admin-module" data-module="tracks">
        <div class="module-toolbar">
          <div class="toolbar-filters">
            <input type="text" placeholder="Search tracks..." class="filter-input">
            <select class="filter-select">
              <option value="">All Genres</option>
              <option value="pop">Pop</option>
              <option value="electronic">Electronic</option>
              <option value="hiphop">Hip-Hop</option>
            </select>
            <select class="filter-select">
              <option value="">All Status</option>
              <option value="ready">Ready</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div class="toolbar-actions">
            <button class="btn-secondary">Export CSV</button>
          </div>
        </div>

        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>User</th>
                <th>Genre</th>
                <th>Duration</th>
                <th>Size</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this._generateMockTracks().map(track => `
                <tr>
                  <td class="mono">#${track.id}</td>
                  <td>${this._escapeHtml(track.title)}</td>
                  <td>${this._escapeHtml(track.user)}</td>
                  <td><span class="genre-badge">${track.genre}</span></td>
                  <td>${track.duration}</td>
                  <td>${track.size}</td>
                  <td><span class="status-badge status-${track.status}">${track.status}</span></td>
                  <td>${this._formatDate(track.created)}</td>
                  <td>
                    <button class="btn-icon" title="Download">↓</button>
                    <button class="btn-icon danger" title="Delete">×</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /** @private Analytics Module */
  _renderAnalyticsModule() {
    return `
      <div class="admin-module" data-module="analytics">
        <div class="analytics-header">
          <div class="date-range-picker">
            <button class="range-btn active">7 Days</button>
            <button class="range-btn">30 Days</button>
            <button class="range-btn">90 Days</button>
            <button class="range-btn">Custom</button>
          </div>
        </div>

        <div class="analytics-stats">
          <div class="analytic-stat">
            <span class="as-label">Total Generations</span>
            <span class="as-value">156,789</span>
            <span class="as-trend up">↑ 18.2%</span>
          </div>
          <div class="analytic-stat">
            <span class="as-label">Unique Users</span>
            <span class="as-value">8,432</span>
            <span class="as-trend up">↑ 12.5%</span>
          </div>
          <div class="analytic-stat">
            <span class="as-label">Avg. Generations/User</span>
            <span class="as-value">18.6</span>
            <span class="as-trend down">↓ 2.1%</span>
          </div>
          <div class="analytic-stat">
            <span class="as-label">Success Rate</span>
            <span class="as-value">98.4%</span>
            <span class="as-trend up">↑ 0.3%</span>
          </div>
        </div>

        <div class="charts-grid">
          <div class="chart-card large">
            <h3>Generation Trends</h3>
            <div class="chart-area large-chart-placeholder">
              <svg viewBox="0 0 600 250" class="area-chart">
                <defs>
                  <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0"/>
                  </linearGradient>
                </defs>
                <path d="M0,200 Q50,180 100,160 T200,140 T300,100 T400,80 T500,60 T600,40 L600,250 L0,250 Z" fill="url(#chartGrad)"/>
                <path d="M0,200 Q50,180 100,160 T200,140 T300,100 T400,80 T500,60 T600,40" fill="none" stroke="#8b5cf6" stroke-width="3"/>
              </svg>
            </div>
          </div>
          <div class="chart-card">
            <h3>Genre Distribution</h3>
            <div class="pie-chart-placeholder">
              <svg viewBox="0 0 200 200" class="pie-chart">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#8b5cf6" stroke-width="40" stroke-dasharray="150 352" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="#06b6d4" stroke-width="40" stroke-dasharray="88 352" stroke-dashoffset="-150" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" stroke-width="40" stroke-dasharray="66 352" stroke-dashoffset="-238" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="#ec4899" stroke-width="40" stroke-dasharray="48 352" stroke-dashoffset="-304" transform="rotate(-90 100 100)"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="data-table-wrapper">
          <h3>Top Users by Usage</h3>
          <table class="data-table compact">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Generations</th>
                <th>Downloads</th>
                <th>Storage Used</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              ${this._generateTopUsers().map((u, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${this._escapeHtml(u.user)}</td>
                  <td>${u.generations.toLocaleString()}</td>
                  <td>${u.downloads}</td>
                  <td>${u.storage}</td>
                  <td><span class="badge badge-${u.plan}">${u.plan}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /** @private AI Models Module */
  _renderModelsModule() {
    return `
      <div class="admin-module" data-module="models">
        <div class="module-header-row">
          <h2>AI Model Management</h2>
          <button class="btn-primary" id="add-model-btn">+ Add Model</button>
        </div>

        <div class="models-grid">
          ${[
            { id: 'sonix-v2', name: 'Sonix v2', version: '2.4.1', status: 'active', usage: '78%', size: '2.4 GB', updated: '2024-01-15' },
            { id: 'sonix-pro', name: 'Sonix Pro', version: '1.8.0', status: 'active', usage: '62%', size: '4.8 GB', updated: '2024-01-10' },
            { id: 'sonix-fast', name: 'Sonix Fast', version: '3.1.2', status: 'active', usage: '91%', size: '1.2 GB', updated: '2024-01-18' },
            { id: 'sonix-hd', name: 'Sonix HD', version: '0.9.0-beta', status: 'beta', usage: '12%', size: '8.2 GB', updated: '2024-01-05' }
          ].map(model => `
            <div class="model-card">
              <div class="model-header">
                <div class="model-icon">🤖</div>
                <div class="model-status status-${model.status}">${model.status}</div>
              </div>
              <h3 class="model-name">${model.name}</h3>
              <span class="model-version">v${model.version}</span>
              
              <div class="model-metrics">
                <div class="metric">
                  <span class="metric-label">Usage</span>
                  <div class="metric-bar">
                    <div class="metric-fill" style="width:${model.usage}"></div>
                  </div>
                  <span class="metric-value">${model.usage}</span>
                </div>
                <div class="metric-row">
                  <span><strong>Size:</strong> ${model.size}</span>
                  <span><strong>Updated:</strong> ${model.updated}</span>
                </div>
              </div>

              <div class="model-actions">
                <button class="btn-secondary btn-sm">Configure</button>
                <button class="btn-secondary btn-sm">Logs</button>
                ${model.status === 'beta' ? '<button class="btn-primary btn-sm">Promote</button>' : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /** @private Feature Flags Module */
  _renderFeaturesModule() {
    return `
      <div class="admin-module" data-module="features">
        <div class="module-header-row">
          <h2>Feature Flags</h2>
          <button class="btn-primary" id="add-flag-btn">+ New Flag</button>
        </div>

        <div class="flags-list">
          ${[
            { key: 'studio_mode', name: 'Studio Mode', description: 'Ableton-inspired producer interface', enabled: true, rollout: 100, users: 'all' },
            { key: 'sound_designer', name: 'Sound Designer Mode', description: 'iZotope-style audio engineering', enabled: true, rollout: 100, users: 'all' },
            { key: 'collab_editing', name: 'Collaborative Editing', description: 'Real-time collaboration on tracks', enabled: true, rollout: 25, users: 'beta testers' },
            { key: 'ai_lyrics', name: 'AI Lyrics Generation', description: 'Auto-generate lyrics from prompts', enabled: false, rollout: 0, users: '-' },
            { key: 'midi_export', name: 'MIDI Export', description: 'Export tracks as MIDI files', enabled: true, rollout: 50, users: 'Pro+' },
            { key: 'stem_separation', name: 'Stem Separation', description: 'Separate tracks into individual stems', enabled: false, rollout: 0, users: '-' }
          ].map(flag => `
            <div class="flag-item">
              <div class="flag-main">
                <label class="flag-toggle">
                  <input type="checkbox" ${flag.enabled ? 'checked' : ''} data-flag="${flag.key}">
                  <span class="toggle-slider"></span>
                </label>
                <div class="flag-info">
                  <span class="flag-key">\`${flag.key}\`</span>
                  <h4 class="flag-name">${flag.name}</h4>
                  <p class="flag-desc">${flag.description}</p>
                </div>
              </div>
              <div class="flag-meta">
                <div class="meta-item">
                  <span class="meta-label">Rollout</span>
                  <span class="meta-value">${flag.rollout}%</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Target</span>
                  <span class="meta-value">${flag.users}</span>
                </div>
                <button class="btn-icon edit-flag" data-flag="${flag.key}">✏️</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /** @private API Keys Module */
  _renderApiKeysModule() {
    return `
      <div class="admin-module" data-module="apikeys">
        <div class="module-header-row">
          <h2>API Keys Management</h2>
          <button class="btn-primary" id="create-apikey-btn">+ Create Key</button>
        </div>

        <div class="keys-list">
          ${[
            { id: 'ak_live_1234...', name: 'Production Key', user: 'john@company.com', created: '2024-01-10', lastUsed: '2 hours ago', calls: 15420, status: 'active' },
            { id: 'ak_test_5678...', name: 'Testing Key', user: 'dev@company.com', created: '2024-01-15', lastUsed: '5 min ago', calls: 892, status: 'active' },
            { id: 'ak_live_9012...', name: 'Mobile App Key', user: 'mobile@company.com', created: '2023-12-01', lastUsed: '1 day ago', calls: 45120, status: 'active' },
            { id: 'ak_live_3456...', name: 'Old Integration', user: 'legacy@oldco.com', created: '2023-06-15', lastUsed: '30 days ago', calls: 120, status: 'revoked' }
          ].map(key => `
            <div class="key-item">
              <div class="key-header">
                <code class="key-id">${key.id}</code>
                <span class="key-status status-${key.status}">${key.status}</span>
              </div>
              <div class="key-details">
                <span class="key-name">${key.name}</span>
                <span class="key-user">Owner: ${key.user}</span>
              </div>
              <div class="key-stats">
                <span>Created: ${key.created}</span>
                <span>Last used: ${key.lastUsed}</span>
                <span>Total calls: ${key.calls.toLocaleString()}</span>
              </div>
              <div class="key-actions">
                <button class="btn-secondary btn-sm copy-key" data-key="${key.id}">Copy</button>
                <button class="btn-secondary btn-sm rotate-key" data-key="${key.id}">Rotate</button>
                ${key.status === 'active' ? `<button class="btn-danger btn-sm revoke-key" data-key="${key.id}">Revoke</button>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /** @private Sessions Module */
  _renderSessionsModule() {
    return `
      <div class="admin-module" data-module="sessions">
        <div class="module-header-row">
          <h2>Active Sessions</h2>
          <button class="btn-danger" id="revoke-all-sessions-btn">Revoke All Sessions</button>
        </div>

        <div class="sessions-toolbar">
          <input type="text" placeholder="Filter by user or IP..." class="filter-input">
          <select class="filter-select">
            <option value="">All Sessions</option>
            <option value="web">Web</option>
            <option value="api">API</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>

        <div class="sessions-list-admin">
          ${Array.from({ length: 8 }, (_, i) => ({
            id: `sess_${i}`,
            user: [`alice@mail.com`, `bob@corp.io`, `charlie@tech.co`, `diana@art.net`, `eve@music.me`, `frank@beat.fm`, `grace@song.ly`, `henry@tune.io`][i],
            ip: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
            device: ['Chrome / Windows', 'Safari / macOS', 'Firefox / Linux', 'App / iOS', 'App / Android'][i % 5],
            created: `${Math.floor(Math.random() * 59) + 1} min ago`,
            activity: ['Generating track', 'Browsing library', 'Viewing settings', 'Downloading', 'Idle'][i % 5]
          })).map(sess => `
            <div class="session-row">
              <div class="session-user">
                <span class="session-avatar">${sess.user.charAt(0).toUpperCase()}</span>
                <span class="session-email">${sess.user}</span>
              </div>
              <div class="session-info">
                <span class="session-ip">${sess.ip}</span>
                <span class="session-device">${sess.device}</span>
              </div>
              <div class="session-meta">
                <span class="session-created">${sess.created}</span>
                <span class="session-activity">${sess.activity}</span>
              </div>
              <button class="btn-danger btn-xs revoke-session" data-session="${sess.id}">Revoke</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /** @private Audit Logs Module */
  _renderAuditModule() {
    return `
      <div class="admin-module" data-module="audit">
        <div class="module-header-row">
          <h2>Audit Logs</h2>
          <button class="btn-secondary" id="export-audit-btn">Export Logs</button>
        </div>

        <div class="audit-filters">
          <input type="text" placeholder="Search logs..." class="filter-input">
          <select class="filter-select">
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
          </select>
          <select class="filter-select">
            <option value="">All Resources</option>
            <option value="user">User</option>
            <option value="track">Track</option>
            <option value="apikey">API Key</option>
            <option value="setting">Setting</option>
          </select>
          <input type="datetime-local" class="filter-input" id="audit-date-from">
          <span>to</span>
          <input type="datetime-local" class="filter-input" id="audit-date-to">
        </div>

        <div class="audit-log">
          ${[
            { time: '2024-01-18 14:32:15', user: 'admin@sonix.ai', action: 'update', resource: 'feature_flag', details: 'Enabled "studio_mode"', ip: '10.0.0.1' },
            { time: '2024-01-18 14:28:43', user: 'system', action: 'create', resource: 'track', details: 'Track #89234 generated by user@x.com', ip: '-' },
            { time: '2024-01-18 14:25:11', user: 'admin@sonix.ai', action: 'delete', resource: 'api_key', details: 'Revoked key ak_old_1234', ip: '10.0.0.1' },
            { time: '2024-01-18 14:20:00', user: 'john@mail.com', action: 'login', resource: 'session', details: 'Successful login from Chrome/Windows', ip: '203.45.67.89' },
            { time: '2024-01-18 14:15:33', user: 'admin@sonix.ai', action: 'update', resource: 'user', details: 'Changed role for jane@doe.com to "pro"', ip: '10.0.0.1' }
          ].map(log => `
            <div class="log-entry">
              <span class="log-time">${log.time}</span>
              <span class="log-user">${log.user}</span>
              <span class="log-action action-${log.action}">${log.action.toUpperCase()}</span>
              <span class="log-resource">${log.resource}</span>
              <span class="log-details">${log.details}</span>
              <span class="log-ip">${log.ip}</span>
            </div>
          `).join('')}
        </div>

        <div class="pagination-mini">
          <button disabled>← Previous</button>
          <button class="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>Next →</button>
        </div>
      </div>
    `;
  },

  /** @private Login History Module */
  _renderLoginsModule() {
    return `
      <div class="admin-module" data-module="logins">
        <div class="module-header-row">
          <h2>Login History</h2>
          <button class="btn-secondary" id="export-logins-btn">Export</button>
        </div>

        <div class="login-stats">
          <div class="login-stat success">
            <span class="ls-value">12,459</span>
            <span class="ls-label">Successful Today</span>
          </div>
          <div class="login-stat danger">
            <span class="ls-value">23</span>
            <span class="ls-label">Failed Attempts</span>
          </div>
          <div class="login-stat warning">
            <span class="ls-value">7</span>
            <span class="ls-label">Suspicious Logins</span>
          </div>
        </div>

        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Status</th>
                <th>IP Address</th>
                <th>Location</th>
                <th>Device/Browser</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${Array.from({ length: 10 }, (_, i) => ({
                time: `2024-01-18 ${String(14 - Math.floor(i/3)).padStart(2, '0')}:${String((i*17)%60).padStart(2, '0')}:${String(i*23%60).padStart(2, '0')}`,
                user: [`alice@mail.com`, `bob@corp.io`, `newuser@test.net`, `admin@sonix.ai`, `unknown@hack.ru`][i % 5],
                status: i === 9 ? 'failed' : i === 8 ? 'suspicious' : 'success',
                ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
                location: ['New York, US', 'London, UK', 'Tokyo, JP', 'Berlin, DE', 'Unknown'][i % 5],
                device: ['Chrome 120 / Windows 11', 'Safari 17 / macOS 14', 'Firefox 121 / Ubuntu', 'Unknown Bot'][i % 4]
              })).map(login => `
                <tr class="login-${login.status}">
                  <td class="mono">${login.time}</td>
                  <td>${login.user}</td>
                  <td><span class="status-badge status-${login.status}">${login.status}</span></td>
                  <td class="mono">${login.ip}</td>
                  <td>${login.location}</td>
                  <td class="small">${login.device}</td>
                  <td>
                    ${login.status !== 'success' ? `<button class="btn-danger btn-xs investigate" data-ip="${login.ip}">Investigate</button>` : '-'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /** @private System Settings Module */
  _renderSystemModule() {
    return `
      <div class="admin-module" data-module="system">
        <div class="module-header-row">
          <h2>System Settings</h2>
        </div>

        <form id="system-settings-form" class="settings-form">
          <div class="settings-section">
            <h3 class="section-heading">General Configuration</h3>
            
            <div class="field-row">
              <div class="field-group">
                <label>Site Name</label>
                <input type="text" class="text-input" value="Sonix AI Music Generator">
              </div>
              <div class="field-group">
                <label>Maintenance Mode</label>
                <label class="toggle-switch">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label>Max File Size (MB)</label>
                <input type="number" class="text-input" value="50">
              </div>
              <div class="field-group">
                <label>Max Daily Generations (Free Tier)</label>
                <input type="number" class="text-input" value="5">
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3 class="section-heading">Rate Limiting</h3>
            
            <div class="field-row">
              <div class="field-group">
                <label>API Rate Limit (req/min)</label>
                <input type="number" class="text-input" value="60">
              </div>
              <div class="field-group">
                <label>Generation Queue Size</label>
                <input type="number" class="text-input" value="100">
              </div>
            </div>

            <div class="field-group full-width">
              <label>Blocked IPs (one per line)</label>
              <textarea class="textarea-input" rows="4" placeholder="Enter blocked IP addresses..."></textarea>
            </div>
          </div>

          <div class="settings-section">
            <h3 class="section-heading">Email Settings</h3>
            
            <div class="field-row">
              <div class="field-group">
                <label>SMTP Host</label>
                <input type="text" class="text-input" value="smtp.sonix.ai" placeholder="smtp.example.com">
              </div>
              <div class="field-group">
                <label>SMTP Port</label>
                <input type="number" class="text-input" value="587">
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label>Sender Email</label>
                <input type="email" class="text-input" value="noreply@sonix.ai">
              </div>
              <div class="field-group">
                <label>Sender Name</label>
                <input type="text" class="text-input" value="Sonix Team">
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3 class="section-heading">Storage Configuration</h3>
            
            <div class="storage-config">
              <div class="storage-provider">
                <label>Primary Storage Provider</label>
                <select class="select-input">
                  <option value="s3" selected>AWS S3</option>
                  <option value="gcs">Google Cloud Storage</option>
                  <option value="azure">Azure Blob Storage</option>
                  <option value="local">Local filesystem</option>
                </select>
              </div>
              <div class="storage-bucket">
                <label>Bucket Name</label>
                <input type="text" class="text-input" value="sonix-production-media">
              </div>
            </div>

            <div class="storage-quota">
              <label>Global Storage Quota</label>
              <div class="quota-display">
                <div class="quota-bar">
                  <div class="quota-fill" style="width: 72%"></div>
                </div>
                <span class="quota-text">7.2 TB / 10 TB used (72%)</span>
              </div>
            </div>
          </div>

          <div class="settings-section danger-zone">
            <h3 class="section-heading danger">Danger Zone</h3>
            
            <div class="danger-actions">
              <div class="danger-item">
                <div>
                  <strong>Clear All Caches</strong>
                  <p>Remove all cached data including model caches and CDN</p>
                </div>
                <button class="btn-danger" id="clear-all-cache-btn">Clear Caches</button>
              </div>
              <div class="danger-item">
                <div>
                  <strong>Reset Generation Queue</strong>
                  <p>Cancel all pending generations. This cannot be undone!</p>
                </div>
                <button class="btn-danger" id="reset-queue-btn">Reset Queue</button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" id="reset-system-form">Discard Changes</button>
            <button type="submit" class="btn-primary">Save System Settings</button>
          </div>
        </form>
      </div>
    `;
  },

  // ==================== MOCK DATA GENERATORS ====================

  /** @private Generate mock users */
  _generateMockUsers() {
    const names = [
      { name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', tracks: 142, joined: '2023-06-15', lastActive: '2 min ago' },
      { name: 'Bob Smith', email: 'bob@music.co', role: 'pro', status: 'active', tracks: 89, joined: '2023-08-22', lastActive: '15 min ago' },
      { name: 'Charlie Brown', email: 'charlie@test.io', role: 'user', status: 'active', tracks: 23, joined: '2024-01-05', lastActive: '1 hour ago' },
      { name: 'Diana Prince', email: 'diana@studio.net', role: 'pro', status: 'active', tracks: 256, joined: '2023-03-10', lastActive: '5 min ago' },
      { name: 'Eve Williams', email: 'eve@artist.me', role: 'user', status: 'suspended', tracks: 7, joined: '2024-01-12', lastActive: '3 days ago' },
      { name: 'Frank Miller', email: 'frank@beat.fm', role: 'user', status: 'pending', tracks: 0, joined: '2024-01-18', lastActive: 'Never' },
      { name: 'Grace Lee', email: 'grace@song.ly', role: 'pro', status: 'active', tracks: 178, joined: '2023-07-01', lastActive: '30 min ago' },
      { name: 'Henry Davis', email: 'henry@tune.io', role: 'user', status: 'active', tracks: 45, joined: '2023-11-20', lastActive: '2 hours ago' }
    ];
    return names.map((u, i) => ({ id: `usr_${i + 1}`, ...u }));
  },

  /** @private Generate mock tracks */
  _generateMockTracks() {
    const tracks = [
      { id: '89234', title: 'Summer Vibes Mix', user: 'alice@x.com', genre: 'Electronic', duration: '3:24', size: '8.2 MB', status: 'ready', created: '2024-01-18' },
      { id: '89233', title: 'Midnight Jazz', user: 'bob@y.com', genre: 'Jazz', duration: '4:15', size: '10.1 MB', status: 'ready', created: '2024-01-18' },
      { id: '89232', title: 'Urban Beats Vol. 5', user: 'carol@z.com', genre: 'Hip-Hop', duration: '2:58', size: '7.4 MB', status: 'processing', created: '2024-01-18' },
      { id: '89231', title: 'Acoustic Morning', user: 'dan@a.com', genre: 'Folk', duration: '3:45', size: '9.0 MB', status: 'ready', created: '2024-01-17' },
      { id: '89230', title: 'Neon Dreams', user: 'eve@b.com', genre: 'Synthwave', duration: '5:12', size: '12.8 MB', status: 'failed', created: '2024-01-17' }
    ];
    return tracks;
  },

  /** @private Generate top users */
  _generateTopUsers() {
    return [
      { user: 'prod@studiopro.com', generations: 1245, downloads: 890, storage: '4.2 GB', plan: 'enterprise' },
      { user: 'dj@mixmaster.io', generations: 982, downloads: 654, storage: '3.8 GB', plan: 'pro' },
      { user: 'creator@musicnet.co', generations: 756, downloads: 432, storage: '2.1 GB', plan: 'pro' },
      { user: 'artist@soundlab.me', generations: 543, downloads: 298, storage: '1.5 GB', plan: 'pro' },
      { user: 'maker@beats.fm', generations: 421, downloads: 187, storage: '980 MB', plan: 'user' }
    ];
  },

  // ==================== INITIALIZATION ====================

  /**
   * Initialize admin module with callbacks
   * @param {Object} callbacks - Callback functions
   */
  initAdmin(callbacks = {}) {
    this._state.callbacks = callbacks;
    this._destroyEvents();
    this._attachEvents();
  },

  /**
   * Attach all event listeners
   * @private
   */
  _attachEvents() {
    const root = document.getElementById('admin-root');
    if (!root) return;

    // Navigation buttons
    root.querySelectorAll('.nav-btn').forEach(btn => {
      const handler = () => this._switchModule(btn.dataset.module);
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Sidebar toggle
    const sidebarToggle = root.querySelector('#sidebar-toggle');
    if (sidebarToggle) {
      const handler = () => {
        document.querySelector('.admin-sidebar')?.classList.toggle('collapsed');
      };
      sidebarToggle.addEventListener('click', handler);
      this._state.eventListeners.push({ element: sidebarToggle, event: 'click', handler });
    }

    // System settings form
    const sysForm = root.querySelector('#system-settings-form');
    if (sysForm) {
      const handler = (e) => {
        e.preventDefault();
        if (this._state.callbacks.onSaveSettings) {
          this._state.callbacks.onSaveSettings(this._collectSystemSettings());
        }
      };
      sysForm.addEventListener('submit', handler);
      this._state.eventListeners.push({ element: sysForm, event: 'submit', handler });
    }

    // Feature flag toggles
    root.querySelectorAll('[data-flag]').forEach(toggle => {
      const handler = () => {
        console.log(`Flag ${toggle.dataset.flag} set to ${toggle.checked}`);
      };
      toggle.addEventListener('change', handler);
      this._state.eventListeners.push({ element: toggle, event: 'change', handler });
    });
  },

  /**
   * Switch to a different admin module
   * @private
   */
  _switchModule(moduleId) {
    if (!this.modules.find(m => m.id === moduleId)) return;

    this._state.activeModule = moduleId;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.module === moduleId);
    });

    // Update header title
    const activeMod = this.modules.find(m => m.id === moduleId);
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle && activeMod) {
      headerTitle.textContent = activeMod.label;
    }

    // Replace content
    const contentEl = document.getElementById('admin-content');
    if (contentEl) {
      contentEl.innerHTML = this._renderActiveModule();
      this._attachEvents();
    }

    // Callback
    if (this._state.callbacks.onModuleChange) {
      this._state.callbacks.onModuleChange(moduleId);
    }
  },

  /**
   * Collect system settings from form
   * @private
   */
  _collectSystemSettings() {
    return {}; // Implementation would collect all form values
  },

  /**
   * Clean up events
   * @private
   */
  _destroyEvents() {
    this._state.eventListeners.forEach(({ element, event, handler }) => {
      if (element) element.removeEventListener(event, handler);
    });
    this._state.eventListeners = [];
  },

  /**
   * Destroy admin module
   */
  destroyAdmin() {
    this._destroyEvents();
    this._state.callbacks = {};
  },

  // Utility methods

  /** @private Escape HTML */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /** @private Format date */
  _formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  /** @private Format relative time */
  _formatRelativeTime(dateStr) {
    if (!dateStr) return '-';
    return dateStr; // Simplified for mock data
  }
};

// Default export
export default AdminModule;
