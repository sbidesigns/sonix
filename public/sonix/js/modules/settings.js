/**
 * Settings Module - User preferences and configuration
 * Tabs: General, Models, Audio, Account
 * @module SettingsModule
 */

export const SettingsModule = {
  // State management
  _state: {
    activeTab: 'general',
    settings: {
      general: {
        theme: 'dark',
        language: 'en',
        defaultMode: 'simple',
        notifications: true,
        autoSave: true,
        showTooltips: true
      },
      models: {
        preferredModel: 'auto',
        cacheSize: 0,
        maxCacheSize: 512, // MB
        clearCacheOnExit: false
      },
      audio: {
        quality: 'high',
        format: 'mp3',
        sampleRate: '44100',
        normalize: true,
        limiter: true
      },
      account: {
        name: '',
        email: '',
        sessions: []
      }
    },
    callbacks: {},
    eventListeners: [],
    isLoading: false
  },

  // Available tabs definition
  tabs: [
    { id: 'general', label: 'General', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
    { id: 'models', label: 'AI Models', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>' },
    { id: 'audio', label: 'Audio', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>' },
    { id: 'account', label: 'Account', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' }
  ],

  /**
   * Render the settings module
   * @param {Object} options - Initial settings values
   * @returns {string} Complete settings HTML
   */
  renderSettings(options = {}) {
    // Merge provided settings with defaults
    if (options.settings) {
      this._state.settings = this._deepMerge(this._state.settings, options.settings);
    }

    return `
      <div class="settings-container" id="settings-root">
        <div class="settings-header">
          <h1>Settings</h1>
          <p class="settings-subtitle">Manage your preferences and account</p>
        </div>
        
        <div class="settings-layout">
          ${this._renderTabNav()}
          <div class="settings-content">
            ${this._renderTabContent()}
          </div>
        </div>

        <div class="settings-footer">
          <button class="btn-secondary" id="settings-reset-btn">Reset to Defaults</button>
          <button class="btn-primary" id="settings-save-btn">Save Changes</button>
        </div>
      </div>
    `;
  },

  /**
   * Render tab navigation
   * @private
   */
  _renderTabNav() {
    const { activeTab } = this._state;

    return `
      <nav class="settings-tabs">
        ${this.tabs.map(tab => `
          <button 
            class="tab-btn ${tab.id === activeTab ? 'active' : ''}" 
            data-tab="${tab.id}"
          >
            <span class="tab-icon">${tab.icon}</span>
            <span class="tab-label">${tab.label}</span>
          </button>
        `).join('')}
      </nav>
    `;
  },

  /**
   * Render active tab content
   * @private
   */
  _renderTabContent() {
    switch (this._state.activeTab) {
      case 'general':
        return this._renderGeneralTab();
      case 'models':
        return this._renderModelsTab();
      case 'audio':
        return this._renderAudioTab();
      case 'account':
        return this._renderAccountTab();
      default:
        return this._renderGeneralTab();
    }
  },

  /**
   * Render General tab content
   * @private
   */
  _renderGeneralTab() {
    const { general } = this._state.settings;
    
    return `
      <div class="tab-panel" data-tab="general">
        <h2 class="panel-title">General Settings</h2>
        
        <div class="settings-group">
          <h3 class="group-title">Appearance</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <label for="theme-select">Theme</label>
              <p class="setting-description">Choose your preferred interface theme</p>
            </div>
            <div class="setting-control">
              <select id="theme-select" class="select-control">
                <option value="dark" ${general.theme === 'dark' ? 'selected' : ''}>🌙 Dark</option>
                <option value="light" ${general.theme === 'light' ? 'selected' : ''}>☀️ Light</option>
                <option value="system" ${general.theme === 'system' ? 'selected' : ''}>💻 System</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label for="language-select">Language</label>
              <p class="setting-description">Select your display language</p>
            </div>
            <div class="setting-control">
              <select id="language-select" class="select-control">
                <option value="en" ${general.language === 'en' ? 'selected' : ''}>English</option>
                <option value="es" ${general.language === 'es' ? 'selected' : ''}>Español</option>
                <option value="fr" ${general.language === 'fr' ? 'selected' : ''}>Français</option>
                <option value="de" ${general.language === 'de' ? 'selected' : ''}>Deutsch</option>
                <option value="ja" ${general.language === 'ja' ? 'selected' : ''}>日本語</option>
                <option value="zh" ${general.language === 'zh' ? 'selected' : ''}>中文</option>
                <option value="ko" ${general.language === 'ko' ? 'selected' : ''}>한국어</option>
                <option value="pt" ${general.language === 'pt' ? 'selected' : ''}>Português</option>
              </select>
            </div>
          </div>
        </div>

        <div class="settings-group">
          <h3 class="group-title">Default Behavior</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <label for="default-mode-select">Default Generation Mode</label>
              <p class="setting-description">Which mode to show when opening the generator</p>
            </div>
            <div class="setting-control">
              <select id="default-mode-select" class="select-control">
                <option value="simple" ${general.defaultMode === 'simple' ? 'selected' : ''}>✨ Simple</option>
                <option value="custom" ${general.defaultMode === 'custom' ? 'selected' : ''}>⚙️ Custom</option>
                <option value="studio" ${general.defaultMode === 'studio' ? 'selected' : ''}>🎛️ Studio</option>
                <option value="composer" ${general.defaultMode === 'composer' ? 'selected' : ''}>🎼 Composer</option>
                <option value="sound-designer" ${general.defaultMode === 'sound-designer' ? 'selected' : ''}>🎚️ Sound Designer</option>
              </select>
            </div>
          </div>
        </div>

        <div class="settings-group">
          <h3 class="group-title">Notifications & UX</h3>
          
          <div class="setting-item toggle-item">
            <div class="setting-info">
              <label>Enable Notifications</label>
              <p class="setting-description">Receive alerts for generation completion and updates</p>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="notifications-toggle" ${general.notifications ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item toggle-item">
            <div class="setting-info">
              <label>Auto-save Projects</label>
              <p class="setting-description">Automatically save your work as you go</p>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="autosave-toggle" ${general.autoSave ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item toggle-item">
            <div class="setting-info">
              <label>Show Tooltips</label>
              <p class="setting-description">Display helpful tooltips on hover</p>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="tooltips-toggle" ${general.showTooltips ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Models tab content
   * @private
   */
  _renderModelsTab() {
    const { models } = this._state.settings;
    const cachePercent = models.maxCacheSize > 0 
      ? Math.round((models.cacheSize / models.maxCacheSize) * 100) 
      : 0;

    return `
      <div class="tab-panel" data-tab="models">
        <h2 class="panel-title">AI Model Settings</h2>
        
        <div class="settings-group">
          <h3 class="group-title">Model Preferences</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <label for="preferred-model-select">Preferred Model</label>
              <p class="setting-description">Default AI model for generation</p>
            </div>
            <div class="setting-control">
              <select id="preferred-model-select" class="select-control">
                <option value="auto" ${models.preferredModel === 'auto' ? 'selected' : ''}>Auto Select (Recommended)</option>
                <option value="sonix-v2" ${models.preferredModel === 'sonix-v2' ? 'selected' : ''}>Sonix v2 (Balanced)</option>
                <option value="sonix-pro" ${models.preferredModel === 'sonix-pro' ? 'selected' : ''}>Sonix Pro (High Quality)</option>
                <option value="sonix-fast" ${models.preferredModel === 'sonix-fast' ? 'selected' : ''}>Sonix Fast (Quick)</option>
                <option value="sonix-hd" ${models.preferredModel === 'sonix-hd' ? 'selected' : ''}>Sonix HD (Premium)</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <a href="#/models" class="link-btn" id="manage-models-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                Manage AI Models
              </a>
              <p class="setting-description">View available models, download new ones, or manage installed models</p>
            </div>
          </div>
        </div>

        <div class="settings-group">
          <h3 class="group-title">Cache Management</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>Model Cache Size</label>
              <p class="setting-description">Current disk space used by cached model data</p>
            </div>
            <div class="setting-control cache-display">
              <div class="cache-bar">
                <div class="cache-fill" style="width: ${cachePercent}%"></div>
              </div>
              <span class="cache-text">${this._formatBytes(models.cacheSize)} / ${this._formatBytes(models.maxCacheSize * 1024 * 1024)}</span>
            </div>
          </div>

          <div class="setting-item toggle-item">
            <div class="setting-info">
              <label>Clear Cache on Exit</label>
              <p class="setting-description">Automatically clear model cache when closing the application</p>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="clear-cache-toggle" ${models.clearCacheOnExit ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span></span>
            </div>
            <div class="setting-control">
              <button class="btn-secondary btn-sm" id="clear-cache-now-btn">Clear Cache Now</button>
            </div>
          </div>
        </div>

        <div class="settings-group info-group">
          <div class="info-card">
            <div class="info-icon">ℹ️</div>
            <div class="info-content">
              <h4>About Model Caching</h4>
              <p>Caching models locally improves generation speed by avoiding repeated downloads. Clear cache if you're experiencing issues or need to free up disk space.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Audio tab content
   * @private
   */
  _renderAudioTab() {
    const { audio } = this._state.settings;

    return `
      <div class="tab-panel" data-tab="audio">
        <h2 class="panel-title">Audio Settings</h2>
        
        <div class="settings-group">
          <h3 class="group-title">Output Quality</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <label for="quality-select">Quality Preset</label>
              <p class="setting-description">Higher quality uses more storage and processing time</p>
            </div>
            <div class="setting-control">
              <select id="quality-select" class="select-control">
                <option value="standard" ${audio.quality === 'standard' ? 'selected' : ''}>Standard (128 kbps)</option>
                <option value="high" ${audio.quality === 'high' ? 'selected' : ''}>High (256 kbps)</option>
                <option value="premium" ${audio.quality === 'premium' ? 'selected' : ''}>Premium (320 kbps)</option>
                <option value="lossless" ${audio.quality === 'lossless' ? 'selected' : ''}>Lossless (FLAC)</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label for="format-select">Output Format</label>
              <p class="setting-description">File format for downloaded tracks</p>
            </div>
            <div class="setting-control">
              <select id="format-select" class="select-control">
                <option value="mp3" ${audio.format === 'mp3' ? 'selected' : ''}>MP3 (Universal)</option>
                <option value="wav" ${audio.format === 'wav' ? 'selected' : ''}>WAV (Uncompressed)</option>
                <option value="flac" ${audio.format === 'flac' ? 'selected' : ''}>FLAC (Lossless)</option>
                <option value="ogg" ${audio.format === 'ogg' ? 'selected' : ''}>OGG Vorbis</option>
                <option value="aac" ${audio.format === 'aac' ? 'selected' : ''}>AAC (Apple)</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label for="samplerate-select">Sample Rate</label>
              <p class="setting-description">Audio sampling rate in Hz</p>
            </div>
            <div class="setting-control">
              <select id="samplerate-select" class="select-control">
                <option value="22050" ${audio.sampleRate === '22050' ? 'selected' : ''}>22,050 Hz (Low)</option>
                <option value="44100" ${audio.sampleRate === '44100' ? 'selected' : ''}>44,100 Hz (CD Quality)</option>
                <option value="48000" ${audio.sampleRate === '48000' ? 'selected' : ''}>48,000 Hz (Video)</option>
                <option value="96000" ${audio.sampleRate === '96000' ? 'selected' : ''}>96,000 Hz (Hi-Res)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="settings-group">
          <h3 class="group-title">Processing</h3>
          
          <div class="setting-item toggle-item">
            <div class="setting-info">
              <label>Normalize Audio</label>
              <p class="setting-description">Automatically adjust volume levels for consistency</p>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="normalize-toggle" ${audio.normalize ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item toggle-item">
            <div class="setting-info">
              <label>Apply Limiter</label>
              <p class="setting-description">Prevent audio clipping and peaks</p>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="limiter-toggle" ${audio.limiter ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-group info-group">
          <div class="info-card">
            <div class="info-icon">🎧</div>
            <div class="info-content">
              <h4>Audio Quality Guide</h4>
              <ul>
                <li><strong>Standard:</strong> Good for casual listening, smallest file size</li>
                <li><strong>High:</strong> Recommended for most users, great quality/size balance</li>
                <li><strong>Premium/Lossless:</strong> Best for professional use or archiving</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Account tab content
   * @private
   */
  _renderAccountTab() {
    const { account } = this._state.settings;
    const sessions = account.sessions || [];

    return `
      <div class="tab-panel" data-tab="account">
        <h2 class="panel-title">Account Settings</h2>
        
        <div class="settings-group">
          <h3 class="group-title">Profile Information</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <label for="account-name">Display Name</label>
              <p class="setting-description">How you appear to other users</p>
            </div>
            <div class="setting-control">
              <input 
                type="text" 
                id="account-name" 
                class="text-input" 
                value="${this._escapeHtml(account.name || '')}"
                placeholder="Enter your name"
              >
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label for="account-email">Email Address</label>
              <p class="setting-description">Used for notifications and account recovery</p>
            </div>
            <div class="setting-control">
              <input 
                type="email" 
                id="account-email" 
                class="text-input" 
                value="${this._escapeHtml(account.email || '')}"
                placeholder="your@email.com"
              >
            </div>
          </div>
        </div>

        <div class="settings-group">
          <h3 class="group-title">Security</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>Password</label>
              <p class="setting-description">Last changed 30 days ago</p>
            </div>
            <div class="setting-control">
              <button class="btn-secondary btn-sm" id="change-password-btn">Change Password</button>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Two-Factor Authentication</label>
              <p class="setting-description">Add an extra layer of security to your account</p>
            </div>
            <div class="setting-control">
              <button class="btn-secondary btn-sm" id="setup-2fa-btn">Set Up 2FA</button>
            </div>
          </div>
        </div>

        <div class="settings-group">
          <h3 class="group-title">Active Sessions (${sessions.length})</h3>
          
          ${sessions.length > 0 ? `
            <div class="sessions-list">
              ${sessions.map((session, index) => `
                <div class="session-item ${index === 0 ? 'current' : ''}">
                  <div class="session-device">
                    <span class="device-icon">${session.device === 'desktop' ? '🖥️' : session.device === 'mobile' ? '📱' : '💻'}</span>
                    <div class="device-info">
                      <span class="device-name">${this._escapeHtml(session.deviceName || 'Unknown Device')}</span>
                      <span class="session-meta">
                        ${this._escapeHtml(session.browser || '')} • ${this._escapeHtml(session.os || '')}
                        ${index === 0 ? '<span class="current-badge">Current</span>' : ''}
                      </span>
                    </div>
                  </div>
                  <div class="session-time">
                    <span>${this._formatRelativeDate(session.lastActive)}</span>
                  </div>
                  ${index !== 0 ? `
                    <button class="btn-danger btn-xs session-revoke" data-session-id="${session.id}">Revoke</button>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="no-sessions">No active sessions found</p>
          `}
          
          <div class="setting-item" style="margin-top: 1rem;">
            <div class="setting-info"></div>
            <div class="setting-control">
              <button class="btn-danger btn-sm" id="revoke-all-sessions-btn">Revoke All Other Sessions</button>
            </div>
          </div>
        </div>

        <div class="settings-group danger-zone">
          <h3 class="group-title danger-title">Danger Zone</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>Delete Account</label>
              <p class="setting-description danger-text">Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            <div class="setting-control">
              <button class="btn-danger" id="delete-account-btn">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Initialize settings module with callbacks
   * @param {Object} callbacks - Callback functions
   * @param {Function} callbacks.onSave - Called when settings are saved
   * @param {Function} callbacks.onReset - Called when reset is clicked
   * @param {Function} callbacks.onChangePassword - Called to change password
   * @param {Function} callbacks.onDeleteAccount - Called to delete account
   */
  initSettings(callbacks = {}) {
    this._state.callbacks = callbacks;
    this._destroyEvents();
    this._attachEvents();
  },

  /**
   * Attach all event listeners
   * @private
   */
  _attachEvents() {
    const root = document.getElementById('settings-root');
    if (!root) return;

    // Tab switching
    root.querySelectorAll('.tab-btn').forEach(btn => {
      const handler = () => {
        this._switchTab(btn.dataset.tab);
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Save button
    const saveBtn = root.querySelector('#settings-save-btn');
    if (saveBtn) {
      const handler = () => this._saveSettings();
      saveBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: saveBtn, event: 'click', handler });
    }

    // Reset button
    const resetBtn = root.querySelector('#settings-reset-btn');
    if (resetBtn) {
      const handler = () => {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
          this._resetSettings();
        }
      };
      resetBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: resetBtn, event: 'click', handler });
    }

    // Manage models link
    const modelsLink = root.querySelector('#manage-models-link');
    if (modelsLink && this._state.callbacks.onNavigateToModels) {
      const handler = (e) => {
        e.preventDefault();
        this._state.callbacks.onNavigateToModels();
      };
      modelsLink.addEventListener('click', handler);
      this._state.eventListeners.push({ element: modelsLink, event: 'click', handler });
    }

    // Clear cache button
    const clearCacheBtn = root.querySelector('#clear-cache-now-btn');
    if (clearCacheBtn) {
      const handler = () => {
        if (confirm('Clear all cached model data? This may slow down future generations.')) {
          this._state.settings.models.cacheSize = 0;
          this._updateView();
          if (this._state.toast) {
            this._state.toast.success('Cache cleared successfully');
          }
        }
      };
      clearCacheBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: clearCacheBtn, event: 'click', handler });
    }

    // Change password button
    const changePwdBtn = root.querySelector('#change-password-btn');
    if (changePwdBtn && this._state.callbacks.onChangePassword) {
      const handler = () => this._state.callbacks.onChangePassword();
      changePwdBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: changePwdBtn, event: 'click', handler });
    }

    // Delete account button
    const deleteAccountBtn = root.querySelector('#delete-account-btn');
    if (deleteAccountBtn) {
      const handler = () => {
        if (confirm('⚠️ Are you ABSOLUTELY sure?\n\nThis will permanently delete:\n• Your account\n• All generated tracks\n• All settings\n• All data\n\nThis cannot be undone!')) {
          const confirmed = confirm('Final confirmation: Type DELETE to confirm');
          if (confirmed && this._state.callbacks.onDeleteAccount) {
            this._state.callbacks.onDeleteAccount();
          }
        }
      };
      deleteAccountBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: deleteAccountBtn, event: 'click', handler });
    }

    // Session revoke buttons
    root.querySelectorAll('.session-revoke').forEach(btn => {
      const handler = () => {
        const sessionId = btn.dataset.sessionId;
        if (confirm('Revoke this session? The device will need to log in again.')) {
          btn.closest('.session-item').remove();
          if (this._state.callbacks.onRevokeSession) {
            this._state.callbacks.onRevokeSession(sessionId);
          }
        }
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Revoke all sessions
    const revokeAllBtn = root.querySelector('#revoke-all-sessions-btn');
    if (revokeAllBtn) {
      const handler = () => {
        if (confirm('Revoke all other sessions? You will be logged out everywhere except here.')) {
          if (this._state.callbacks.onRevokeAllSessions) {
            this._state.callbacks.onRevokeAllSessions();
          }
        }
      };
      revokeAllBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: revokeAllBtn, event: 'click', handler });
    }
  },

  /**
   * Switch to a different tab
   * @private
   */
  _switchTab(tabId) {
    if (!this.tabs.find(t => t.id === tabId)) return;

    this._state.activeTab = tabId;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update content panel
    const contentPanel = document.querySelector('.settings-content');
    if (contentPanel) {
      contentPanel.innerHTML = this._renderTabContent();
    }
  },

  /**
   * Collect current form values into settings object
   * @private
   */
  _collectFormValues() {
    const getVal = (id) => {
      const el = document.getElementById(id);
      return el ? el.value : undefined;
    };

    const getChecked = (id) => {
      const el = document.getElementById(id);
      return el ? el.checked : false;
    };

    return {
      general: {
        theme: getVal('theme-select') || 'dark',
        language: getVal('language-select') || 'en',
        defaultMode: getVal('default-mode-select') || 'simple',
        notifications: getChecked('notifications-toggle'),
        autoSave: getChecked('autosave-toggle'),
        showTooltips: getChecked('tooltips-toggle')
      },
      models: {
        preferredModel: getVal('preferred-model-select') || 'auto',
        ...this._state.settings.models
      },
      audio: {
        quality: getVal('quality-select') || 'high',
        format: getVal('format-select') || 'mp3',
        sampleRate: getVal('samplerate-select') || '44100',
        normalize: getChecked('normalize-toggle'),
        limiter: getChecked('limiter-toggle')
      },
      account: {
        name: getVal('account-name') || '',
        email: getVal('account-email') || '',
        ...this._state.settings.account
      }
    };
  },

  /**
   * Save current settings
   * @private
   */
  _saveSettings() {
    this._state.settings = this._collectFormValues();

    if (this._state.callbacks.onSave) {
      this._state.callbacks.onSave(this._state.settings);
    }

    // Show success feedback
    const saveBtn = document.querySelector('#settings-save-btn');
    if (saveBtn) {
      const originalText = saveBtn.textContent;
      saveBtn.textContent = 'Saved! ✓';
      saveBtn.disabled = true;
      setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
      }, 2000);
    }
  },

  /**
   * Reset settings to defaults
   * @private
   */
  _resetSettings() {
    this._state.settings = {
      general: {
        theme: 'dark',
        language: 'en',
        defaultMode: 'simple',
        notifications: true,
        autoSave: true,
        showTooltips: true
      },
      models: {
        preferredModel: 'auto',
        cacheSize: 0,
        maxCacheSize: 512,
        clearCacheOnExit: false
      },
      audio: {
        quality: 'high',
        format: 'mp3',
        sampleRate: '44100',
        normalize: true,
        limiter: true
      },
      account: {
        name: '',
        email: '',
        sessions: []
      }
    };

    this._updateView();

    if (this._state.callbacks.onReset) {
      this._state.callbacks.onReset();
    }
  },

  /**
   * Full view update
   * @private
   */
  _updateView() {
    const root = document.getElementById('settings-root');
    if (!root) return;

    const contentPanel = root.querySelector('.settings-content');
    if (contentPanel) {
      contentPanel.innerHTML = this._renderTabContent();
    }
    this._attachEvents();
  },

  /**
   * Clean up event listeners
   * @private
   */
  _destroyEvents() {
    this._state.eventListeners.forEach(({ element, event, handler }) => {
      if (element) element.removeEventListener(event, handler);
    });
    this._state.eventListeners = [];
  },

  /**
   * Destroy settings module
   */
  destroySettings() {
    this._destroyEvents();
    this._state.callbacks = {};
  },

  /**
   * Get current settings
   * @returns {Object} Current settings object
   */
  getSettings() {
    return this._collectFormValues();
  },

  /**
   * Set toast notification helper
   * @param {Object} toast - Toast notification object
   */
  setToast(toast) {
    this._state.toast = toast;
  },

  // Utility methods

  /** @private Deep merge objects */
  _deepMerge(target, source) {
    const output = { ...target };
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    });
    return output;
  },

  /** @private Escape HTML */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /** @private Format bytes */
  _formatBytes(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /** @private Format relative date */
  _formatRelativeDate(dateStr) {
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

// Default export
export default SettingsModule;
