/**
 * Generator Module - Core music generation interface with 5 modes
 * Supports Simple, Custom, Studio, Composer, and Sound Designer modes
 * @module GeneratorModule
 */

export const GeneratorModule = {
  // Constants
  MODES: {
    SIMPLE: 'simple',
    CUSTOM: 'custom',
    STUDIO: 'studio',
    COMPOSER: 'composer',
    SOUND_DESIGNER: 'sound-designer'
  },

  // State management
  _state: {
    currentMode: 'simple',
    isGenerating: false,
    progress: 0,
    callbacks: {},
    api: null,
    store: null,
    toast: null,
    player: null,
    models: [],
    eventListeners: []
  },

  // Genre definitions
  genres: [
    { value: '', label: 'Any Genre' },
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' },
    { value: 'hiphop', label: 'Hip-Hop' },
    { value: 'electronic', label: 'Electronic / EDM' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'classical', label: 'Classical' },
    { value: 'ambient', label: 'Ambient' },
    { value: 'lofi', label: 'Lo-Fi' },
    { value: 'rnb', label: 'R&B' },
    { value: 'country', label: 'Country' },
    { value: 'metal', label: 'Metal' },
    { value: 'reggae', label: 'Reggae' },
    { value: 'blues', label: 'Blues' },
    { value: 'folk', label: 'Folk' },
    { value: 'soul', label: 'Soul' },
    { value: 'punk', label: 'Punk' },
    { value: 'indie', label: 'Indie' }
  ],

  // Mood definitions
  moods: [
    { value: '', label: 'Any Mood' },
    { value: 'happy', label: 'Happy & Uplifting' },
    { value: 'sad', label: 'Sad & Melancholic' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'calm', label: 'Calm & Relaxing' },
    { value: 'dark', label: 'Dark & Moody' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'epic', label: 'Epic & Cinematic' },
    { value: 'nostalgic', label: 'Nostalgic' },
    { value: 'aggressive', label: 'Aggressive' },
    { value: 'dreamy', label: 'Dreamy & Ethereal' },
    { value: 'playful', label: 'Playful & Fun' }
  ],

  // Musical keys
  keys: [
    { value: '', label: 'Auto Detect' },
    { value: 'C', label: 'C Major' },
    { value: 'Cs', label: 'C# Major' },
    { value: 'D', label: 'D Major' },
    { value: 'Ds', label: 'D# Major' },
    { value: 'E', label: 'E Major' },
    { value: 'F', label: 'F Major' },
    { value: 'Fs', label: 'F# Major' },
    { value: 'G', label: 'G Major' },
    { value: 'Gs', label: 'G# Major' },
    { value: 'A', label: 'A Major' },
    { value: 'As', label: 'A# Major' },
    { value: 'B', label: 'B Major' },
    { value: 'Am', label: 'A Minor' },
    { value: 'Em', label: 'E Minor' },
    { value: 'Dm', label: 'D Minor' },
    { value: 'Bm', label: 'B Minor' },
    { value: 'Fsm', label: 'F# Minor' },
    { value: 'Csm', label: 'C# Minor' },
    { value: 'Gsm', label: 'G# Minor' }
  ],

  /**
   * Render the generator container with current mode
   * @returns {string} Complete generator HTML
   */
  renderGenerator() {
    return `
      <div class="generator-container" id="generator-root">
        <div class="generator-header">
          <div class="mode-tabs">
            <button class="mode-tab active" data-gen-mode="simple">✨ Simple</button>
            <button class="mode-tab" data-gen-mode="custom">⚙️ Custom</button>
            <button class="mode-tab" data-gen-mode="studio">🎛️ Studio</button>
            <button class="mode-tab" data-gen-mode="composer">🎼 Composer</button>
            <button class="mode-tab" data-gen-mode="sound-designer">🎚️ Sound Designer</button>
          </div>
        </div>
        <div class="generator-body">
          ${this._renderCurrentMode()}
        </div>
        <div class="generator-footer" id="gen-footer" style="display: none;">
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" id="gen-progress-fill" style="width: 0%"></div>
            </div>
            <span class="progress-text" id="gen-progress-text">Preparing...</span>
          </div>
          <button class="cancel-btn" id="gen-cancel-btn" type="button">Cancel Generation</button>
        </div>
      </div>
    `;
  },

  /**
   * Render the current active mode content
   * @private
   */
  _renderCurrentMode() {
    switch (this._state.currentMode) {
      case this.MODES.SIMPLE:
        return this._renderSimpleMode();
      case this.MODES.CUSTOM:
        return this._renderCustomMode();
      case this.MODES.STUDIO:
        return this._renderStudioMode();
      case this.MODES.COMPOSER:
        return this._renderComposerMode();
      case this.MODES.SOUND_DESIGNER:
        return this._renderSoundDesignerMode();
      default:
        return this._renderSimpleMode();
    }
  },

  /**
   * Render Simple Mode - Beginner-friendly prompt-based generation
   * @private
   */
  _renderSimpleMode() {
    return `
      <div class="simple-generator" id="simple-mode">
        <div class="simple-header">
          <h2>What do you want to create?</h2>
          <p class="simple-hint">Describe your song in natural language and let AI do the magic</p>
        </div>
        
        <div class="prompt-area">
          <textarea 
            id="simple-prompt" 
            class="prompt-textarea"
            placeholder="Describe your song... e.g., 'A upbeat pop song about summer adventures with catchy chorus and tropical vibes'"
            rows="4"
          ></textarea>
          <div class="prompt-examples">
            <span class="examples-label">Try:</span>
            <button class="example-chip" data-example="pop-summer">🌴 Summer Pop Hit</button>
            <button class="example-chip" data-example="lofi-study">📚 Lo-Fi Study Beats</button>
            <button class="example-chip" data-example="cinematic-epic">🎬 Cinematic Epic</button>
            <button class="example-chip" data-example="jazz-evening">🍷 Evening Jazz</button>
          </div>
        </div>

        <div class="mode-toggle">
          <button class="toggle-btn active" data-vocal-mode="vocals" id="btn-vocals">
            <span class="toggle-icon">🎤</span>
            With Vocals
          </button>
          <button class="toggle-btn" data-vocal-mode="instrumental" id="btn-instrumental">
            <span class="toggle-icon">🎹</span>
            Instrumental
          </button>
        </div>

        <div class="quick-options">
          <div class="quick-option">
            <label>Duration</label>
            <select id="simple-duration">
              <option value="30">30 seconds</option>
              <option value="60" selected>1 minute</option>
              <option value="120">2 minutes</option>
              <option value="180">3 minutes</option>
              <option value="300">5 minutes</option>
            </select>
          </div>
          <div class="quick-option">
            <label>Vibe</label>
            <select id="simple-mood">
              <option value="">Any Vibe</option>
              ${this.moods.slice(1, 7).map(m => `<option value="${m.value}">${m.label}</option>`).join('')}
            </select>
          </div>
        </div>

        <button class="generate-btn primary-generate" id="simple-generate-btn">
          <span class="btn-icon">✨</span>
          Generate Track
        </button>
      </div>
    `;
  },

  /**
   * Render Custom Mode - Full parameter control
   * @private
   */
  _renderCustomMode() {
    return `
      <div class="custom-generator" id="custom-mode">
        <h2>Custom Track Generation</h2>
        <p class="mode-description">Fine-tune every aspect of your generated track</p>
        
        <form id="custom-form" class="custom-form">
          <div class="form-section">
            <h3>Basic Parameters</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="custom-genre">Genre</label>
                <select id="custom-genre" class="form-control">
                  ${this.genres.map(g => `<option value="${g.value}">${g.label}</option>`).join('')}
                </select>
              </div>
              
              <div class="form-group">
                <label for="custom-mood">Mood</label>
                <select id="custom-mood" class="form-control">
                  ${this.moods.map(m => `<option value="${m.value}">${m.label}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="custom-key">Key</label>
                <select id="custom-key" class="form-control">
                  ${this.keys.map(k => `<option value="${k.value}">${k.label}</option>`).join('')}
                </select>
              </div>
              
              <div class="form-group">
                <label for="custom-tempo">Tempo: <span id="tempo-value">120</span> BPM</label>
                <input type="range" id="custom-tempo" min="60" max="200" value="120" class="slider">
                <div class="slider-labels">
                  <span>Slow (60)</span>
                  <span>Fast (200)</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="custom-duration">Duration: <span id="duration-value">120</span>s</label>
              <input type="range" id="custom-duration" min="10" max="300" value="120" step="10" class="slider">
              <div class="slider-labels">
                <span>Short (10s)</span>
                <span>Long (5min)</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Lyrics & Vocals</h3>
            <div class="form-group">
              <label for="custom-lyrics">Lyrics (optional)</label>
              <textarea id="custom-lyrics" class="form-control lyrics-input" placeholder="Enter your lyrics here, or leave empty for instrumental..." rows="5"></textarea>
            </div>
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" id="custom-autolyrics">
                <span class="checkmark"></span>
                Auto-generate lyrics from prompt
              </label>
            </div>
          </div>

          <div class="form-section">
            <h3>Advanced Settings</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="custom-model">AI Model</label>
                <select id="custom-model" class="form-control">
                  <option value="auto">Auto Select (Recommended)</option>
                  <option value="sonix-v2">Sonix v2 (Balanced)</option>
                  <option value="sonix-pro">Sonix Pro (High Quality)</option>
                  <option value="sonix-fast">Sonix Fast (Quick)</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="custom-quality">Quality</label>
                <select id="custom-quality" class="form-control">
                  <option value="standard">Standard</option>
                  <option value="high" selected>High Quality</option>
                  <option value="premium">Premium (2x credits)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="custom-variations">
                <span class="checkmark"></span>
                Generate 3 variations to choose from
              </label>
            </div>
          </div>

          <button type="submit" class="generate-btn custom-generate">
            <span class="btn-icon">🎵</span>
            Generate Custom Track
          </button>
        </form>
      </div>
    `;
  },

  /**
   * Render Studio Mode - Ableton-inspired producer interface
   * @private
   */
  _renderStudioMode() {
    return `
      <div class="studio-generator" id="studio-mode" style="--studio-accent: #ff6b35">
        <div class="studio-toolbar">
          <div class="transport-controls">
            <button class="transport-btn" id="studio-play" title="Play/Pause">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
            <button class="transport-btn" id="studio-stop" title="Stop">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16"/></svg>
            </button>
            <button class="transport-btn loop-active" id="studio-loop" title="Loop">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            </button>
          </div>
          
          <div class="bpm-display">
            <span class="bpm-label">BPM</span>
            <span class="bpm-value" id="studio-bpm">128</span>
            <div class="bpm-controls">
              <button class="bpm-adjust" data-adjust="-1">−</button>
              <button class="bpm-adjust" data-adjust="+1">+</button>
            </div>
          </div>

          <div class="key-display">
            <span class="key-label">Key</span>
            <select id="studio-key" class="key-select">
              ${this.keys.slice(1, 13).map(k => `<option value="${k.value}">${k.label.replace(' Major', '')}</option>`).join('')}
            </select>
          </div>

          <div class="time-display">
            <span class="time-value" id="studio-time">00:00:00</span>
          </div>
        </div>

        <div class="genre-templates">
          <span class="template-label">Quick Templates:</span>
          <div class="template-buttons">
            <button class="template-btn active" data-template="edm" style="--tmpl-color: #8b5cf6">EDM</button>
            <button class="template-btn" data-template="hiphop" style="--tmpl-color: #f59e0b">Hip-Hop</button>
            <button class="template-btn" data-template="rock" style="--tmpl-color: #ef4444">Rock</button>
            <button class="template-btn" data-template="jazz" style="--tmpl-color: #10b981">Jazz</button>
            <button class="template-btn" data-template="lofi" style="--tmpl-color: #84cc16">Lo-Fi</button>
            <button class="template-btn" data-template="ambient" style="--tmpl-color: #06b6d4">Ambient</button>
          </div>
        </div>

        <div class="track-lanes">
          <div class="lane-header">
            <span class="lane-name">Track Name</span>
            <span class="lane-controls">M | S | A</span>
          </div>
          
          <div class="lane" data-lane="drums">
            <div class="lane-info">
              <span class="lane-icon">🥁</span>
              <span class="lane-name-text">Drums</span>
            </div>
            <div class="lane-waveform">
              <canvas class="waveform-canvas" id="waveform-drums"></canvas>
            </div>
            <div class="lane-fader">
              <input type="range" class="volume-fader" min="0" max="100" value="80" orient="vertical">
            </div>
          </div>

          <div class="lane" data-lane="bass">
            <div class="lane-info">
              <span class="lane-icon">🎸</span>
              <span class="lane-name-text">Bass</span>
            </div>
            <div class="lane-waveform">
              <canvas class="waveform-canvas" id="waveform-bass"></canvas>
            </div>
            <div class="lane-fader">
              <input type="range" class="volume-fader" min="0" max="100" value="70" orient="vertical">
            </div>
          </div>

          <div class="lane" data-lane="melody">
            <div class="lane-info">
              <span class="lane-icon">🎹</span>
              <span class="lane-name-text">Melody</span>
            </div>
            <div class="lane-waveform">
              <canvas class="waveform-canvas" id="waveform-melody"></canvas>
            </div>
            <div class="lane-fader">
              <input type="range" class="volume-fader" min="0" max="100" value="75" orient="vertical">
            </div>
          </div>

          <div class="lane" data-lane="vocals">
            <div class="lane-info">
              <span class="lane-icon">🎤</span>
              <span class="lane-name-text">Vocals</span>
            </div>
            <div class="lane-waveform">
              <canvas class="waveform-canvas" id="waveform-vocals"></canvas>
            </div>
            <div class="lane-fader">
              <input type="range" class="volume-fader" min="0" max="100" value="85" orient="vertical">
            </div>
          </div>

          <div class="lane add-lane" id="add-lane-btn">
            <span class="add-icon">+</span>
            <span>Add Track</span>
          </div>
        </div>

        <div class="studio-footer">
          <div class="loop-settings">
            <label>Loop Range:</label>
            <input type="number" id="loop-start" value="1" min="1" class="loop-input" placeholder="Start">
            <span>-</span>
            <input type="number" id="loop-end" value="16" min="1" class="loop-input" placeholder="End">
            <span class="loop-unit">bars</span>
          </div>
          <button class="generate-btn studio-generate" id="studio-generate-btn">
            <span class="btn-icon">🎛️</span>
            Generate in Studio
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Render Composer Mode - Logic Pro songwriter interface
   * @private
   */
  _renderComposerMode() {
    const sections = [
      { id: 'intro', name: 'Intro', duration: 4, color: '#94a3b8' },
      { id: 'verse1', name: 'Verse 1', duration: 8, color: '#a855f7' },
      { id: 'chorus', name: 'Chorus', duration: 8, color: '#ec4899' },
      { id: 'verse2', name: 'Verse 2', duration: 8, color: '#a855f7' },
      { id: 'bridge', name: 'Bridge', duration: 4, color: '#f59e0b' },
      { id: 'chorus2', name: 'Chorus 2', duration: 8, color: '#ec4899' },
      { id: 'outro', name: 'Outro', duration: 4, color: '#94a3b8' }
    ];

    return `
      <div class="composer-generator" id="composer-mode" style="--composer-accent: #a855f7">
        <div class="composer-header">
          <h2>Song Arranger</h2>
          <div class="composer-tools">
            <button class="tool-btn" id="composer-add-section" title="Add Section">+ Section</button>
            <button class="tool-btn" id="composer-clear" title="Clear All">Clear</button>
            <button class="tool-btn" id="composer-template" title="Load Template">Templates</button>
          </div>
        </div>

        <div class="song-structure">
          <div class="structure-label">Song Structure</div>
          <div class="sections-container" id="sections-container">
            ${sections.map((section, index) => `
              <div class="song-section" data-section="${section.id}" style="--section-color: ${section.color}">
                <div class="section-handle">⋮⋮</div>
                <div class="section-block">
                  <span class="section-name">${section.name}</span>
                  <span class="section-bars">${section.duration} bars</span>
                </div>
                <div class="section-actions">
                  <button class="section-edit" data-edit="${section.id}" title="Edit Section">✏️</button>
                  <button class="section-delete" data-delete="${section.id}" title="Delete Section">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="arrangement-timeline">
          <div class="timeline-header">
            <div class="timeline-ruler">
              ${Array.from({ length: 45 }, (_, i) => `
                <div class="ruler-mark ${i % 4 === 0 ? 'major' : ''}" style="left: ${(i / 44) * 100}%">
                  ${i % 4 === 0 ? `<span>${i + 1}</span>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
          <div class="timeline-tracks">
            ${sections.map(section => `
              <div class="timeline-row" data-row="${section.id}">
                <div class="row-label">${section.name}</div>
                <div class="row-content">
                  <div class="region" style="background: ${section.color}33; border-left: 3px solid ${section.color}">
                    <span class="region-label">${section.name}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section-editor" id="section-editor" style="display: none;">
          <h3>Edit Section: <span id="editing-section-name">-</span></h3>
          <div class="editor-fields">
            <div class="field-group">
              <label>Mood</label>
              <select id="section-mood">
                ${this.moods.map(m => `<option value="${m.value}">${m.label}</option>`).join('')}
              </select>
            </div>
            <div class="field-group">
              <label>Instruments</label>
              <div class="instrument-tags">
                <label class="tag-label"><input type="checkbox" checked> Piano</label>
                <label class="tag-label"><input type="checkbox"> Strings</label>
                <label class="tag-label"><input type="checkbox"> Synth</label>
                <label class="tag-label"><input type="checkbox"> Guitar</label>
                <label class="tag-label"><input type="checkbox"> Drums</label>
                <label class="tag-label"><input type="checkbox"> Bass</label>
              </div>
            </div>
            <div class="field-group">
              <label>Intensity</label>
              <input type="range" id="section-intensity" min="0" max="100" value="50" class="slider">
            </div>
            <div class="field-group">
              <label>Lyrics/Notes</label>
              <textarea id="section-notes" rows="3" placeholder="Add lyrics or notes for this section..."></textarea>
            </div>
          </div>
          <div class="editor-actions">
            <button class="btn-secondary" id="section-cancel">Cancel</button>
            <button class="btn-primary" id="section-save">Save Changes</button>
          </div>
        </div>

        <div class="composer-footer">
          <div class="song-stats">
            <span>Total Duration: <strong id="total-duration">~3:30</strong></span>
            <span>Sections: <strong id="total-sections">7</strong></span>
          </div>
          <button class="generate-btn composer-generate" id="composer-generate-btn">
            <span class="btn-icon">🎼</span>
            Compose Song
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Render Sound Designer Mode - iZotope-inspired technical panel
   * @private
   */
  _renderSoundDesignerMode() {
    return `
      <div class="sound-designer-generator" id="sound-designer-mode" style="--sd-accent: #06b6d4">
        <div class="sd-header">
          <h2>Sound Design Studio</h2>
          <p class="sd-subtitle">Professional audio engineering controls</p>
        </div>

        <div class="sd-panel">
          <!-- Frequency Control -->
          <div class="sd-section frequency-section">
            <h3 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 10v3"/><path d="M6 6v7"/><path d="M10 3v10"/><path d="M14 8v5"/><path d="M18 4v9"/><path d="M22 7v6"/></svg>
              Frequency Spectrum
            </h3>
            <div class="frequency-sliders">
              <div class="freq-band" data-freq="sub">
                <label>Sub<br><span>20-60Hz</span></label>
                <input type="range" class="freq-slider" min="-12" max="12" value="0" orient="vertical">
                <span class="freq-value">0 dB</span>
              </div>
              <div class="freq-band" data-freq="bass">
                <label>Bass Low<br><span>60-250Hz</span></label>
                <input type="range" class="freq-slider" min="-12" max="12" value="2" orient="vertical">
                <span class="freq-value">+2 dB</span>
              </div>
              <div class="freq-band" data-freq="mid">
                <label>Mid<br><span>250-4kHz</span></label>
                <input type="range" class="freq-slider" min="-12" max="12" value="0" orient="vertical">
                <span class="freq-value">0 dB</span>
              </div>
              <div class="freq-band" data-freq="high">
                <label>High<br><span>4-12kHz</span></label>
                <input type="range" class="freq-slider" min="-12" max="12" value="1" orient="vertical">
                <span class="freq-value">+1 dB</span>
              </div>
              <div class="freq-band" data-freq="top">
                <label>Air Top<br><span>12-20kHz</span></label>
                <input type="range" class="freq-slider" min="-12" max="12" value="3" orient="vertical">
                <span class="freq-value">+3 dB</span>
              </div>
            </div>
            <div class="freq-analyzer">
              <canvas id="freq-analyzer-canvas" width="400" height="100"></canvas>
            </div>
          </div>

          <!-- Timbre Controls -->
          <div class="sd-section timbre-section">
            <h3 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M1 12h6m6 0h6"/></svg>
              Timbre Shaping
            </h3>
            <div class="timbre-knobs">
              <div class="knob-control" data-param="brightness">
                <div class="knob" data-value="50">
                  <svg viewBox="0 0 60 60" class="knob-svg">
                    <circle cx="30" cy="30" r="26" class="knob-track"/>
                    <circle cx="30" cy="30" r="26" class="knob-fill" style="stroke-dasharray: ${50 * 1.63} 163"/>
                    <line x1="30" y1="30" x2="30" y2="8" class="knob-indicator" transform="rotate(${50 * 2.7 - 135}, 30, 30)"/>
                  </svg>
                </div>
                <span class="knob-label">Brightness</span>
                <span class="knob-value">50%</span>
              </div>
              <div class="knob-control" data-param="warmth">
                <div class="knob" data-value="65">
                  <svg viewBox="0 0 60 60" class="knob-svg">
                    <circle cx="30" cy="30" r="26" class="knob-track"/>
                    <circle cx="30" cy="30" r="26" class="knob-fill" style="stroke-dasharray: ${65 * 1.63} 163"/>
                    <line x1="30" y1="30" x2="30" y2="8" class="knob-indicator" transform="rotate(${65 * 2.7 - 135}, 30, 30)"/>
                  </svg>
                </div>
                <span class="knob-label">Warmth</span>
                <span class="knob-value">65%</span>
              </div>
              <div class="knob-control" data-param="depth">
                <div class="knob" data-value="40">
                  <svg viewBox="0 0 60 60" class="knob-svg">
                    <circle cx="30" cy="30" r="26" class="knob-track"/>
                    <circle cx="30" cy="30" r="26" class="knob-fill" style="stroke-dasharray: ${40 * 1.63} 163"/>
                    <line x1="30" y1="30" x2="30" y2="8" class="knob-indicator" transform="rotate(${40 * 2.7 - 135}, 30, 30)"/>
                  </svg>
                </div>
                <span class="knob-label">Depth</span>
                <span class="knob-value">40%</span>
              </div>
              <div class="knob-control" data-param="presence">
                <div class="knob" data-value="55">
                  <svg viewBox="0 0 60 60" class="knob-svg">
                    <circle cx="30" cy="30" r="26" class="knob-track"/>
                    <circle cx="30" cy="30" r="26" class="knob-fill" style="stroke-dasharray: ${55 * 1.63} 163"/>
                    <line x1="30" y1="30" x2="30" y2="8" class="knob-indicator" transform="rotate(${55 * 2.7 - 135}, 30, 30)"/>
                  </svg>
                </div>
                <span class="knob-label">Presence</span>
                <span class="knob-value">55%</span>
              </div>
            </div>
          </div>

          <!-- Effects Chain -->
          <div class="sd-section effects-section">
            <h3 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              Effects Chain
            </h3>
            <div class="effects-chain">
              <div class="effect-slot active" data-effect="reverb">
                <div class="effect-header">
                  <span class="effect-name">Reverb</span>
                  <label class="effect-toggle">
                    <input type="checkbox" checked>
                    <span class="toggle-switch"></span>
                  </label>
                </div>
                <div class="effect-controls">
                  <div class="control-row">
                    <label>Size</label>
                    <input type="range" min="0" max="100" value="40" class="mini-slider">
                  </div>
                  <div class="control-row">
                    <label>Decay</label>
                    <input type="range" min="0" max="100" value="50" class="mini-slider">
                  </div>
                  <div class="control-row">
                    <label>Mix</label>
                    <input type="range" min="0" max="100" value="25" class="mini-slider">
                  </div>
                </div>
              </div>

              <div class="effect-slot active" data-effect="delay">
                <div class="effect-header">
                  <span class="effect-name">Delay</span>
                  <label class="effect-toggle">
                    <input type="checkbox" checked>
                    <span class="toggle-switch"></span>
                  </label>
                </div>
                <div class="effect-controls">
                  <div class="control-row">
                    <label>Time</label>
                    <input type="range" min="0" max="100" value="35" class="mini-slider">
                  </div>
                  <div class="control-row">
                    <label>Feedback</label>
                    <input type="range" min="0" max="100" value="30" class="mini-slider">
                  </div>
                  <div class="control-row">
                    <label>Mix</label>
                    <input type="range" min="0" max="100" value="20" class="mini-slider">
                  </div>
                </div>
              </div>

              <div class="effect-slot" data-effect="compressor">
                <div class="effect-header">
                  <span class="effect-name">Compressor</span>
                  <label class="effect-toggle">
                    <input type="checkbox">
                    <span class="toggle-switch"></span>
                  </label>
                </div>
                <div class="effect-controls collapsed">
                  <div class="control-row">
                    <label>Threshold</label>
                    <input type="range" min="0" max="100" value="60" class="mini-slider">
                  </div>
                  <div class="control-row">
                    <label>Ratio</label>
                    <input type="range" min="0" max="100" value="40" class="mini-slider">
                  </div>
                </div>
              </div>

              <div class="effect-slot" data-effect="distortion">
                <div class="effect-header">
                  <span class="effect-name">Distortion</span>
                  <label class="effect-toggle">
                    <input type="checkbox">
                    <span class="toggle-switch"></span>
                  </label>
                </div>
                <div class="effect-controls collapsed">
                  <div class="control-row">
                    <label>Drive</label>
                    <input type="range" min="0" max="100" value="30" class="mini-slider">
                  </div>
                  <div class="control-row">
                    <label>Tone</label>
                    <input type="range" min="0" max="100" value="50" class="mini-slider">
                  </div>
                </div>
              </div>

              <div class="effect-slot add-effect" id="add-effect-btn">
                <span>+ Add Effect</span>
              </div>
            </div>
          </div>

          <!-- Layer Mixer -->
          <div class="sd-section mixer-section">
            <h3 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x4="4" y1="21" y2="14"/><line x1="4" x4="4" y1="10" y2="3"/><line x1="12" x4="12" y1="21" y2="12"/><line x1="12" x4="12" y1="8" y2="3"/><line x1="20" x4="20" y1="21" y2="16"/><line x1="20" x4="20" y1="12" y2="3"/></svg>
              Layer Mixer
            </h3>
            <div class="layer-mixer">
              <div class="mixer-channel" data-layer="main">
                <span class="channel-name">Main Output</span>
                <input type="range" class="channel-volume" min="0" max="100" value="85">
                <div class="channel-meter">
                  <div class="meter-fill" style="height: 70%"></div>
                </div>
              </div>
              <div class="mixer-channel" data-layer="layer1">
                <span class="channel-name">Layer 1</span>
                <input type="range" class="channel-volume" min="0" max="100" value="75">
                <div class="channel-meter">
                  <div class="meter-fill" style="height: 55%"></div>
                </div>
              </div>
              <div class="mixer-channel" data-layer="layer2">
                <span class="channel-name">Layer 2</span>
                <input type="range" class="channel-volume" min="0" max="100" value="60">
                <div class="channel-meter">
                  <div class="meter-fill" style="height: 40%"></div>
                </div>
              </div>
              <div class="mixer-channel add-layer" id="add-layer-btn">
                <span>+ Add Layer</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sd-footer">
          <button class="btn-secondary sd-reset" id="sd-reset-btn">Reset All</button>
          <button class="btn-secondary sd-preset" id="sd-preset-btn">Load Preset</button>
          <button class="generate-btn sd-generate" id="sd-generate-btn">
            <span class="btn-icon">🎚️</span>
            Design Sound
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Initialize generator with dependencies and attach events
   * @param {Object} config - Configuration object
   * @param {Object} config.api - API client for generation requests
   * @param {Object} config.store - State store for persistence
   * @param {Object} config.toast - Toast notification system
   * @param {Object} config.player - Audio player instance
   * @param {Array} config.models - Available AI models
   * @param {Function} config.onGenerated - Callback when generation completes
   */
  initGenerator(config = {}) {
    this._state.api = config.api;
    this._state.store = config.store;
    this._state.toast = config.toast;
    this._state.player = config.player;
    this._state.models = config.models || [];
    this._state.callbacks = { onGenerated: config.onGenerated };
    
    this.destroyGenerator();
    this._attachGeneratorEvents();
  },

  /**
   * Attach all event listeners for the generator
   * @private
   */
  _attachGeneratorEvents() {
    const root = document.getElementById('generator-root');
    if (!root) return;

    // Mode tab switching
    root.querySelectorAll('.mode-tab').forEach(tab => {
      const handler = () => {
        const mode = tab.dataset.genMode;
        this.setGeneratorMode(mode);
      };
      tab.addEventListener('click', handler);
      this._state.eventListeners.push({ element: tab, event: 'click', handler });
    });

    // Simple mode events
    this._initSimpleEvents(root);
    
    // Custom mode events
    this._initCustomEvents(root);
    
    // Studio mode events
    this._initStudioEvents(root);
    
    // Composer mode events
    this._initComposerEvents(root);
    
    // Sound designer events
    this._initSoundDesignerEvents(root);
  },

  /**
   * Initialize simple mode events
   * @private
   */
  _initSimpleEvents(root) {
    // Vocal/instrumental toggle
    const vocalBtns = root.querySelectorAll('[data-vocal-mode]');
    vocalBtns.forEach(btn => {
      const handler = () => {
        vocalBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Example chips
    const examples = {
      'pop-summer': 'An upbeat tropical pop song about summer adventures with catchy chorus, bright synths, and danceable beat perfect for beach parties',
      'lofi-study': 'Chill lo-fi hip hop beats for studying, with soft piano melodies, gentle vinyl crackle, and relaxed atmosphere',
      'cinematic-epic': 'Epic cinematic orchestral piece with powerful brass, soaring strings, dramatic percussion, and heroic themes',
      'jazz-evening': 'Smooth evening jazz with warm saxophone, upright bass, soft piano chords, and intimate lounge atmosphere'
    };

    root.querySelectorAll('.example-chip').forEach(chip => {
      const handler = () => {
        const example = chip.dataset.example;
        const textarea = root.querySelector('#simple-prompt');
        if (textarea && examples[example]) {
          textarea.value = examples[example];
          textarea.focus();
        }
      };
      chip.addEventListener('click', handler);
      this._state.eventListeners.push({ element: chip, event: 'click', handler });
    });

    // Generate button
    const simpleGenBtn = root.querySelector('#simple-generate-btn');
    if (simpleGenBtn) {
      const handler = () => this._handleGenerate('simple');
      simpleGenBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: simpleGenBtn, event: 'click', handler });
    }
  },

  /**
   * Initialize custom mode events
   * @private
   */
  _initCustomEvents(root) {
    // Tempo slider display
    const tempoSlider = root.querySelector('#custom-tempo');
    const tempoValue = root.querySelector('#tempo-value');
    if (tempoSlider && tempoValue) {
      const handler = () => { tempoValue.textContent = tempoSlider.value; };
      tempoSlider.addEventListener('input', handler);
      this._state.eventListeners.push({ element: tempoSlider, event: 'input', handler });
    }

    // Duration slider display
    const durSlider = root.querySelector('#custom-duration');
    const durValue = root.querySelector('#duration-value');
    if (durSlider && durValue) {
      const handler = () => { durValue.textContent = durSlider.value; };
      durSlider.addEventListener('input', handler);
      this._state.eventListeners.push({ element: durSlider, event: 'input', handler });
    }

    // Form submit
    const customForm = root.querySelector('#custom-form');
    if (customForm) {
      const handler = (e) => {
        e.preventDefault();
        this._handleGenerate('custom');
      };
      customForm.addEventListener('submit', handler);
      this._state.eventListeners.push({ element: customForm, event: 'submit', handler });
    }
  },

  /**
   * Initialize studio mode events
   * @private
   */
  _initStudioEvents(root) {
    // BPM controls
    const bpmDisplay = root.querySelector('#studio-bpm');
    root.querySelectorAll('.bpm-adjust').forEach(btn => {
      const handler = () => {
        const adjust = parseInt(btn.dataset.adjust);
        const current = parseInt(bpmDisplay.textContent);
        const newBpm = Math.min(220, Math.max(40, current + adjust));
        bpmDisplay.textContent = newBpm;
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Template buttons
    root.querySelectorAll('.template-btn').forEach(btn => {
      const handler = () => {
        root.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Transport buttons
    const playBtn = root.querySelector('#studio-play');
    if (playBtn) {
      const handler = () => playBtn.classList.toggle('playing');
      playBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: playBtn, event: 'click', handler });
    }

    // Loop toggle
    const loopBtn = root.querySelector('#studio-loop');
    if (loopBtn) {
      const handler = () => loopBtn.classList.toggle('loop-active');
      loopBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: loopBtn, event: 'click', handler });
    }

    // Generate button
    const studioGenBtn = root.querySelector('#studio-generate-btn');
    if (studioGenBtn) {
      const handler = () => this._handleGenerate('studio');
      studioGenBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: studioGenBtn, event: 'click', handler });
    }
  },

  /**
   * Initialize composer mode events
   * @private
   */
  _initComposerEvents(root) {
    // Section edit buttons
    root.querySelectorAll('.section-edit').forEach(btn => {
      const handler = () => {
        const sectionId = btn.dataset.edit;
        this._showSectionEditor(sectionId);
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Section delete buttons
    root.querySelectorAll('.section-delete').forEach(btn => {
      const handler = () => {
        const sectionId = btn.dataset.delete;
        const section = root.querySelector(`[data-section="${sectionId}"]`);
        if (section) section.remove();
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Cancel edit
    const cancelBtn = root.querySelector('#section-cancel');
    if (cancelBtn) {
      const handler = () => {
        root.querySelector('#section-editor').style.display = 'none';
      };
      cancelBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: cancelBtn, event: 'click', handler });
    }

    // Save section
    const saveBtn = root.querySelector('#section-save');
    if (saveBtn) {
      const handler = () => {
        root.querySelector('#section-editor').style.display = 'none';
        if (this._state.toast) {
          this._state.toast.success('Section updated successfully');
        }
      };
      saveBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: saveBtn, event: 'click', handler });
    }

    // Generate button
    const composerGenBtn = root.querySelector('#composer-generate-btn');
    if (composerGenBtn) {
      const handler = () => this._handleGenerate('composer');
      composerGenBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: composerGenBtn, event: 'click', handler });
    }
  },

  /**
   * Show section editor panel
   * @private
   */
  _showSectionEditor(sectionId) {
    const editor = document.querySelector('#section-editor');
    const nameSpan = document.querySelector('#editing-section-name');
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (editor && section) {
      nameSpan.textContent = section.querySelector('.section-name').textContent;
      editor.style.display = 'block';
      editor.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /**
   * Initialize sound designer mode events
   * @private
   */
  _initSoundDesignerEvents(root) {
    // Frequency sliders
    root.querySelectorAll('.freq-slider').forEach(slider => {
      const handler = () => {
        const band = slider.closest('.freq-band');
        const valueDisplay = band.querySelector('.freq-value');
        const val = parseInt(slider.value);
        valueDisplay.textContent = (val >= 0 ? '+' : '') + val + ' dB';
      };
      slider.addEventListener('input', handler);
      this._state.eventListeners.push({ element: slider, event: 'input', handler });
    });

    // Effect toggles
    root.querySelectorAll('.effect-toggle input').forEach(toggle => {
      const handler = () => {
        const slot = toggle.closest('.effect-slot');
        slot.classList.toggle('active', toggle.checked);
      };
      toggle.addEventListener('change', handler);
      this._state.eventListeners.push({ element: toggle, event: 'change', handler });
    });

    // Channel volume meters
    root.querySelectorAll('.channel-volume').forEach(slider => {
      const handler = () => {
        const channel = slider.closest('.mixer-channel');
        const meterFill = channel.querySelector('.meter-fill');
        if (meterFill) {
          meterFill.style.height = slider.value + '%';
        }
      };
      slider.addEventListener('input', handler);
      this._state.eventListeners.push({ element: slider, event: 'input', handler });
    });

    // Reset button
    const resetBtn = root.querySelector('#sd-reset-btn');
    if (resetBtn) {
      const handler = () => {
        if (confirm('Reset all sound design settings?')) {
          location.reload();
        }
      };
      resetBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: resetBtn, event: 'click', handler });
    }

    // Generate button
    const sdGenBtn = root.querySelector('#sd-generate-btn');
    if (sdGenBtn) {
      const handler = () => this._handleGenerate('sound-designer');
      sdGenBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: sdGenBtn, event: 'click', handler });
    }
  },

  /**
   * Handle generate action for any mode
   * @private
   */
  async _handleGenerate(mode) {
    if (this._state.isGenerating) return;

    const params = this._collectParams(mode);
    
    if (!params.prompt && mode === 'simple') {
      if (this._state.toast) {
        this._state.toast.error('Please enter a description for your track');
      }
      return;
    }

    this._startGeneration();

    try {
      // Simulate API call (replace with actual API call)
      if (this._state.api) {
        await this._state.api.generate(params);
      } else {
        await this._simulateGeneration(params);
      }

      this._completeGeneration(params);

      if (this._state.callbacks.onGenerated) {
        this._state.callbacks.onGenerated({
          ...params,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      this._errorGeneration(error.message);
      if (this._state.toast) {
        this._state.toast.error('Generation failed: ' + error.message);
      }
    }
  },

  /**
   * Collect parameters from current mode UI
   * @private
   */
  _collectParams(mode) {
    const baseParams = { mode };

    switch (mode) {
      case 'simple':
        return {
          ...baseParams,
          prompt: document.getElementById('simple-prompt')?.value || '',
          vocals: document.querySelector('[data-vocal-mode="vocals"]')?.classList.contains('active'),
          duration: parseInt(document.getElementById('simple-duration')?.value || 60),
          mood: document.getElementById('simple-mood')?.value || ''
        };

      case 'custom':
        return {
          ...baseParams,
          genre: document.getElementById('custom-genre')?.value || '',
          mood: document.getElementById('custom-mood')?.value || '',
          tempo: parseInt(document.getElementById('custom-tempo')?.value || 120),
          key: document.getElementById('custom-key')?.value || '',
          duration: parseInt(document.getElementById('custom-duration')?.value || 120),
          lyrics: document.getElementById('custom-lyrics')?.value || '',
          model: document.getElementById('custom-model')?.value || 'auto',
          quality: document.getElementById('custom-quality')?.value || 'high'
        };

      case 'studio':
        return {
          ...baseParams,
          bpm: parseInt(document.getElementById('studio-bpm')?.textContent || 128),
          key: document.getElementById('studio-key')?.value || 'Am',
          template: document.querySelector('.template-btn.active')?.dataset.template || 'edm'
        };

      case 'composer':
        const sections = [];
        document.querySelectorAll('.song-section').forEach(s => {
          sections.push({
            id: s.dataset.section,
            name: s.querySelector('.section-name')?.textContent
          });
        });
        return { ...baseParams, sections };

      case 'sound-designer':
        const freqSettings = {};
        document.querySelectorAll('.freq-band').forEach(band => {
          freqSettings[band.dataset.freq] = parseInt(band.querySelector('.freq-slider')?.value || 0);
        });
        return { ...baseParams, frequency: freqSettings };

      default:
        return baseParams;
    }
  },

  /**
   * Start generation UI state
   * @private
   */
  _startGeneration() {
    this._state.isGenerating = true;
    this._state.progress = 0;

    const footer = document.getElementById('gen-footer');
    const progressFill = document.getElementById('gen-progress-fill');
    const progressText = document.getElementById('gen-progress-text');

    if (footer) footer.style.display = 'flex';

    // Disable all generate buttons
    document.querySelectorAll('.generate-btn').forEach(btn => {
      btn.disabled = true;
      btn.classList.add('generating');
    });

    // Animate progress
    this._progressInterval = setInterval(() => {
      if (this._state.progress < 90) {
        this._state.progress += Math.random() * 5;
        if (progressFill) progressFill.style.width = this._state.progress + '%';
        if (progressText) {
          const stages = ['Analyzing...', 'Composing...', 'Arranging...', 'Mixing...', 'Mastering...'];
          const stageIndex = Math.min(Math.floor(this._state.progress / 20), stages.length - 1);
          progressText.textContent = stages[stageIndex];
        }
      }
    }, 500);
  },

  /**
   * Complete generation UI state
   * @private
   */
  _completeGeneration(params) {
    clearInterval(this._progressInterval);
    this._state.isGenerating = false;
    this._state.progress = 100;

    const progressFill = document.getElementById('gen-progress-fill');
    const progressText = document.getElementById('gen-progress-text');

    if (progressFill) progressFill.style.width = '100%';
    if (progressText) progressText.textContent = 'Complete!';

    setTimeout(() => {
      const footer = document.getElementById('gen-footer');
      if (footer) footer.style.display = 'none';
      
      document.querySelectorAll('.generate-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('generating');
      });

      if (this._state.toast) {
        this._state.toast.success('Track generated successfully! 🎵');
      }
    }, 1500);
  },

  /**
   * Error generation UI state
   * @private
   */
  _errorGeneration(message) {
    clearInterval(this._progressInterval);
    this._state.isGenerating = false;

    const footer = document.getElementById('gen-footer');
    if (footer) footer.style.display = 'none';

    document.querySelectorAll('.generate-btn').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('generating');
    });
  },

  /**
   * Simulate generation for demo purposes
   * @private
   */
  async _simulateGeneration(params) {
    return new Promise(resolve => setTimeout(resolve, 3000));
  },

  /**
   * Switch between generator modes
   * @param {string} mode - Mode identifier
   */
  setGeneratorMode(mode) {
    if (!Object.values(this.MODES).includes(mode)) {
      console.warn(`Unknown mode: ${mode}`);
      return;
    }

    this._state.currentMode = mode;

    // Update tab states
    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.genMode === mode);
    });

    // Replace body content
    const body = document.querySelector('.generator-body');
    if (body) {
      body.innerHTML = this._renderCurrentMode();
      // Re-attach events for new content
      this._attachGeneratorEvents();
    }
  },

  /**
   * Clean up all event listeners and state
   */
  destroyGenerator() {
    clearInterval(this._progressInterval);
    
    this._state.eventListeners.forEach(({ element, event, handler }) => {
      if (element) {
        element.removeEventListener(event, handler);
      }
    });
    this._state.eventListeners = [];
    this._state.isGenerating = false;
  },

  /**
   * Get current generation parameters
   * @returns {Object} Current parameters from active mode
   */
  getParams() {
    return this._collectParams(this._state.currentMode);
  },

  /**
   * Set parameters programmatically
   * @param {Object} params - Parameters to set
   */
  setParams(params) {
    // Implementation for programmatic parameter setting
    Object.entries(params).forEach(([key, value]) => {
      const el = document.getElementById(`simple-${key}`) || 
                 document.getElementById(`custom-${key}`) ||
                 document.getElementById(`${key}`);
      if (el) {
        if (el.tagName === 'SELECT' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = value;
          el.dispatchEvent(new Event('input'));
          el.dispatchEvent(new Event('change'));
        }
      }
    });
  }
};

// Default export
export default GeneratorModule;
