/**
 * Dashboard Module - Main landing view for Sonix AI Music Generator
 * Displays welcome header, mode selector, stats, and recent tracks
 * @module DashboardModule
 */

export const DashboardModule = {
  // Current state
  _state: {
    username: 'Artist',
    plan: 'Free',
    selectedMode: null,
    recentTracks: [],
    stats: {
      tracksGenerated: 0,
      creditsRemaining: 0,
      storageUsed: { used: 0, total: 0 }
    },
    callbacks: {},
    eventListeners: []
  },

  /**
   * Render the complete dashboard HTML
   * @param {Object} options - Configuration options
   * @param {string} options.username - User's display name
   * @param {string} options.plan - User's subscription plan
   * @param {Array} options.recentTracks - Array of recent track objects
   * @param {Object} options.stats - Usage statistics
   * @returns {string} Complete dashboard HTML string
   */
  renderDashboard(options = {}) {
    this._state = {
      ...this._state,
      username: options.username || this._state.username,
      plan: options.plan || this._state.plan,
      recentTracks: options.recentTracks || this._state.recentTracks,
      stats: options.stats || this._state.stats
    };

    return `
      <div class="dashboard-container" id="dashboard-root">
        ${this._renderWelcomeHeader()}
        ${this._renderModeSelector()}
        ${this._renderStatsRow()}
        ${this._renderRecentTracks()}
      </div>
    `;
  },

  /**
   * Render welcome header with user info and plan badge
   * @private
   */
  _renderWelcomeHeader() {
    const { username, plan } = this._state;
    const planColors = {
      'Free': '#6b7280',
      'Pro': '#3b82f6',
      'Studio': '#8b5cf6',
      'Enterprise': '#f59e0b'
    };
    const badgeColor = planColors[plan] || planColors['Free'];

    return `
      <div class="welcome-header">
        <div class="welcome-text">
          <h1>Welcome back, <span class="username">${this._escapeHtml(username)}</span></h1>
          <p class="welcome-subtitle">Ready to create something amazing today?</p>
        </div>
        <div class="plan-badge" style="--badge-color: ${badgeColor}">
          <span class="plan-icon">${plan === 'Enterprise' ? '👑' : plan === 'Studio' ? '🎵' : plan === 'Pro' ? '⭐' : '🎶'}</span>
          <span class="plan-name">${this._escapeHtml(plan)} Plan</span>
          ${plan !== 'Enterprise' ? '<button class="upgrade-btn" data-action="upgrade">Upgrade</button>' : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render mode selector cards
   * @private
   */
  _renderModeSelector() {
    const modes = [
      {
        id: 'simple',
        name: 'Simple Mode',
        description: 'Perfect for beginners. Just describe what you want.',
        icon: 'Sparkles',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        features: ['AI-powered prompts', 'One-click generation', 'Auto-enhancement']
      },
      {
        id: 'custom',
        name: 'Custom Mode',
        description: 'Full control over every parameter of your track.',
        icon: 'Sliders',
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
        features: ['Advanced parameters', 'Genre selection', 'Fine-tuned controls']
      },
      {
        id: 'studio',
        name: 'Studio Mode',
        description: 'Ableton-inspired interface for professional producers.',
        icon: 'Disc3',
        color: '#ff6b35',
        gradient: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)',
        features: ['Track lanes', 'Loop controls', 'BPM sync', 'Template library']
      },
      {
        id: 'composer',
        name: 'Composer Mode',
        description: 'Logic Pro-style songwriting workspace.',
        icon: 'Music2',
        color: '#a855f7',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
        features: ['Song structure', 'Section editing', 'Arrangement view']
      },
      {
        id: 'sound-designer',
        name: 'Sound Designer',
        description: 'iZotope-inspired audio engineering suite.',
        icon: 'Waves',
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)',
        features: ['Frequency control', 'Effects chain', 'Layer mixer']
      }
    ];

    return `
      <section class="mode-selector">
        <h2 class="section-title">Choose Your Creative Mode</h2>
        <div class="mode-grid">
          ${modes.map(mode => this._renderModeCard(mode)).join('')}
        </div>
      </section>
    `;
  },

  /**
   * Render individual mode card
   * @private
   */
  _renderModeCard(mode) {
    const icons = {
      Sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
      Sliders: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>`,
      Disc3: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" x2="12" y1="2" y2="4"/><line x1="12" x2="12" y1="20" y2="22"/><line x1="2" x2="4" y1="12" y2="12"/><line x1="20" x2="22" y1="12" y2="12"/></svg>`,
      Music2: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="18" r="4"/><path d="M12 18V2l7 4"/></svg>`,
      Waves: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v3"/><path d="M6 6v7"/><path d="M10 3v10"/><path d="M14 8v5"/><path d="M18 4v9"/><path d="M22 7v6"/></svg>`
    };

    return `
      <article class="mode-card" data-mode="${mode.id}" style="--mode-color: ${mode.color}; --mode-gradient: ${mode.gradient}">
        <div class="card-icon" style="background: ${mode.gradient}">
          ${icons[mode.icon] || icons.Sparkles}
        </div>
        <div class="card-content">
          <h3>${mode.name}</h3>
          <p>${mode.description}</p>
          <ul class="card-features">
            ${mode.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        <button class="card-select-btn" data-action="select-mode" data-mode="${mode.id}">
          Select Mode →
        </button>
      </article>
    `;
  },

  /**
   * Render statistics row
   * @private
   */
  _renderStatsRow() {
    const { tracksGenerated, creditsRemaining, storageUsed } = this._state.stats;
    const storagePercent = storageUsed.total > 0 
      ? Math.round((storageUsed.used / storageUsed.total) * 100) 
      : 0;

    return `
      <section class="stats-row">
        <div class="stat-card stat-tracks">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${tracksGenerated.toLocaleString()}</span>
            <span class="stat-label">Tracks Generated</span>
          </div>
        </div>
        <div class="stat-card stat-credits">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${creditsRemaining.toLocaleString()}</span>
            <span class="stat-label">Credits Remaining</span>
          </div>
        </div>
        <div class="stat-card stat-storage">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${this._formatBytes(storageUsed.used)}</span>
            <span class="stat-label">Storage Used</span>
            <div class="storage-bar">
              <div class="storage-fill" style="width: ${storagePercent}%"></div>
            </div>
            <span class="storage-text">${storagePercent}% of ${this._formatBytes(storageUsed.total)}</span>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * Render recent tracks grid
   * @private
   */
  _renderRecentTracks() {
    const { recentTracks } = this._state;
    
    if (!recentTracks || recentTracks.length === 0) {
      return `
        <section class="recent-tracks empty-state">
          <div class="empty-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            <h3>No tracks yet</h3>
            <p>Your generated tracks will appear here</p>
            <button class="create-first-btn" data-action="create-first">Create Your First Track</button>
          </div>
        </section>
      `;
    }

    const displayTracks = recentTracks.slice(0, 5);

    return `
      <section class="recent-tracks">
        <div class="section-header">
          <h2 class="section-title">Recent Tracks</h2>
          <a href="#/tracks" class="view-all-link" data-action="view-all">View All →</a>
        </div>
        <div class="tracks-grid">
          ${displayTracks.map(track => this._renderTrackCard(track)).join('')}
        </div>
      </section>
    `;
  },

  /**
   * Render individual track card in recent grid
   * @private
   */
  _renderTrackCard(track) {
    const duration = this._formatDuration(track.duration);
    const createdDate = this._formatDate(track.createdAt);
    const genreColors = {
      pop: '#ec4899', rock: '#ef4444', jazz: '#f59e0b', electronic: '#8b5cf6',
      hiphop: '#10b981', classical: '#6366f1', ambient: '#06b6d4', lofi: '#84cc16'
    };
    const genreColor = genreColors[(track.genre || '').toLowerCase()] || '#6b7280';

    return `
      <article class="track-card" data-track-id="${track.id || ''}">
        <div class="track-artwork" style="--genre-color: ${genreColor}">
          <div class="artwork-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <button class="play-overlay-btn" data-action="play-preview" data-track-id="${track.id || ''}" title="Play Preview">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
        </div>
        <div class="track-info">
          <h4 class="track-title">${this._escapeHtml(track.title || 'Untitled Track')}</h4>
          <span class="track-genre" style="color: ${genreColor}">${this._escapeHtml(track.genre || 'Unknown')}</span>
          <div class="track-meta">
            <span class="track-duration">${duration}</span>
            <span class="track-date">${createdDate}</span>
          </div>
        </div>
        <div class="track-actions">
          <button class="action-btn favorite-btn" data-action="favorite" data-track-id="${track.id || ''}" title="${track.isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${track.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
          <button class="action-btn download-btn" data-action="download" data-track-id="${track.id || ''}" title="Download">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>
        </div>
      </article>
    `;
  },

  /**
   * Initialize dashboard event handlers
   * @param {Object} callbacks - Callback functions for various actions
   * @param {Function} callbacks.onModeSelect - Called when a mode is selected
   * @param {Function} callbacks.onUpgrade - Called when upgrade button clicked
   * @param {Function} callbacks.onPlayPreview - Called to play track preview
   * @param {Function} callbacks.onFavorite - Called when favorite toggled
   * @param {Function} callbacks.onDownload - Called when download requested
   * @param {Function} callbacks.onViewAll - Called to view all tracks
   * @param {Function} callbacks.onCreateFirst - Called to create first track
   */
  initDashboard(callbacks = {}) {
    this._state.callbacks = callbacks;
    this.destroyDashboard();

    const root = document.getElementById('dashboard-root');
    if (!root) return;

    // Mode selection
    root.querySelectorAll('[data-action="select-mode"]').forEach(btn => {
      const handler = (e) => {
        e.preventDefault();
        const mode = e.currentTarget.dataset.mode;
        if (callbacks.onModeSelect) callbacks.onModeSelect(mode);
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Card click also triggers selection
    root.querySelectorAll('.mode-card').forEach(card => {
      const handler = (e) => {
        if (e.target.closest('.card-select-btn')) return;
        const mode = card.dataset.mode;
        if (callbacks.onModeSelect) callbacks.onModeSelect(mode);
      };
      card.addEventListener('click', handler);
      this._state.eventListeners.push({ element: card, event: 'click', handler });
    });

    // Upgrade button
    const upgradeBtn = root.querySelector('[data-action="upgrade"]');
    if (upgradeBtn && callbacks.onUpgrade) {
      const handler = () => callbacks.onUpgrade();
      upgradeBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: upgradeBtn, event: 'click', handler });
    }

    // Play preview buttons
    root.querySelectorAll('[data-action="play-preview"]').forEach(btn => {
      const handler = (e) => {
        e.stopPropagation();
        const trackId = btn.dataset.trackId;
        if (callbacks.onPlayPreview) callbacks.onPlayPreview(trackId);
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Favorite buttons
    root.querySelectorAll('[data-action="favorite"]').forEach(btn => {
      const handler = (e) => {
        e.stopPropagation();
        const trackId = btn.dataset.trackId;
        if (callbacks.onFavorite) callbacks.onFavorite(trackId);
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Download buttons
    root.querySelectorAll('[data-action="download"]').forEach(btn => {
      const handler = (e) => {
        e.stopPropagation();
        const trackId = btn.dataset.trackId;
        if (callbacks.onDownload) callbacks.onDownload(trackId);
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // View all link
    const viewAllLink = root.querySelector('[data-action="view-all"]');
    if (viewAllLink && callbacks.onViewAll) {
      const handler = (e) => {
        e.preventDefault();
        callbacks.onViewAll();
      };
      viewAllLink.addEventListener('click', handler);
      this._state.eventListeners.push({ element: viewAllLink, event: 'click', handler });
    }

    // Create first track button
    const createFirstBtn = root.querySelector('[data-action="create-first"]');
    if (createFirstBtn && callbacks.onCreateFirst) {
      const handler = () => callbacks.onCreateFirst();
      createFirstBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: createFirstBtn, event: 'click', handler });
    }

    // Add hover effects for mode cards
    root.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('mouseenter', () => card.classList.add('hovered'));
      card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
    });
  },

  /**
   * Clean up all event listeners and state
   */
  destroyDashboard() {
    this._state.eventListeners.forEach(({ element, event, handler }) => {
      if (element) {
        element.removeEventListener(event, handler);
      }
    });
    this._state.eventListeners = [];
    this._state.callbacks = {};
  },

  /**
   * Update dashboard data without full re-render
   * @param {Object} updates - Partial state updates
   */
  updateData(updates) {
    Object.assign(this._state, updates);
    
    // Update specific sections based on what changed
    if (updates.stats) {
      const statsEl = document.querySelector('.stats-row');
      if (statsEl) {
        statsEl.outerHTML = this._renderStatsRow();
      }
    }
    
    if (updates.recentTracks) {
      const tracksEl = document.querySelector('.recent-tracks');
      if (tracksEl) {
        tracksEl.outerHTML = this._renderRecentTracks();
        // Re-init events for new elements
        if (Object.keys(this._state.callbacks).length > 0) {
          this.initDashboard(this._state.callbacks);
        }
      }
    }
  },

  /**
   * Set active mode visually
   * @param {string} modeId - The mode ID to highlight
   */
  setActiveMode(modeId) {
    this._state.selectedMode = modeId;
    document.querySelectorAll('.mode-card').forEach(card => {
      card.classList.toggle('active', card.dataset.mode === modeId);
    });
  },

  // Utility methods

  /** @private Escape HTML to prevent XSS */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /** @private Format bytes to human readable string */
  _formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /** @private Format seconds to mm:ss */
  _formatDuration(seconds) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  /** @private Format date to relative or short format */
  _formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Default export for compatibility
export default DashboardModule;
