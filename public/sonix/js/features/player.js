/**
 * Audio Player Module
 * HTML5 Audio API + Web Audio API based player with full playback controls
 * Part of the Sonix AI Music Platform
 */

// ============================================================================
// AUDIO PLAYER CLASS
// ============================================================================

/**
 * AudioPlayer class provides comprehensive audio playback functionality
 * Combines HTML5 Audio element with Web Audio API for advanced features
 * 
 * @example
 * const player = new AudioPlayer();
 * player.init().then(() => {
 *   player.onPlay = () => console.log('Playing!');
 *   player.load('/audio/track.mp3').then(() => player.play());
 * });
 */
class AudioPlayer {
  constructor() {
    // Core audio elements
    this._audio = null;
    this._audioContext = null;
    this._sourceNode = null;
    this._gainNode = null;
    this._analyserNode = null;

    // State properties
    this._playing = false;
    this._duration = 0;
    this._currentTime = 0;
    this._volume = 1;
    this._muted = false;
    this._loop = false;
    this._loaded = false;
    this._src = '';

    // Event callbacks
    this.onPlay = null;
    this.onPause = null;
    this.onEnd = null;
    this.onTimeUpdate = null;
    this.onError = null;
    this.onLoad = null;
    this.onSeek = null;
    this.onVolumeChange = null;

    // Bind methods to preserve context
    this._handlePlay = this._handlePlay.bind(this);
    this._handlePause = this._handlePause.bind(this);
    this._handleEnd = this._handleEnd.bind(this);
    this._handleTimeUpdate = this._handleTimeUpdate.bind(this);
    this._handleError = this._handleError.bind(this);
    this._handleLoadedMetadata = this._handleLoadedMetadata.bind(this);
    this._handleCanPlay = this._handleCanPlay.bind(this);
    this._handleSeeking = this._handleSeeking.bind(this);
    this._handleSeeked = this._handleSeeked.bind(this);
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  /**
   * Initialize the audio player
   * Creates audio element and sets up Web Audio context
   * 
   * @returns {Promise<AudioPlayer>} Returns this instance for chaining
   */
  async init() {
    try {
      // Create HTML5 Audio element
      this._audio = new Audio();
      this._audio.preload = 'metadata';

      // Set up event listeners
      this._setupAudioEvents();

      // Create Web Audio Context
      this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create gain node for volume control
      this._gainNode = this._audioContext.createGain();
      this._gainNode.gain.value = this._volume;
      this._gainNode.connect(this._audioContext.destination);

      // Create analyser node for visualization
      this._analyserNode = this._audioContext.createAnalyser();
      this._analyserNode.fftSize = 2048;
      this._analyserNode.smoothingTimeConstant = 0.8;

      console.log('AudioPlayer initialized successfully');
      return this;

    } catch (error) {
      console.error('Failed to initialize AudioPlayer:', error);
      throw error;
    }
  }

  /**
   * Set up event listeners on the audio element
   * @private
   */
  _setupAudioEvents() {
    this._audio.addEventListener('play', this._handlePlay);
    this._audio.addEventListener('pause', this._handlePause);
    this._audio.addEventListener('ended', this._handleEnd);
    this._audio.addEventListener('timeupdate', this._handleTimeUpdate);
    this._audio.addEventListener('error', this._handleError);
    this._audio.addEventListener('loadedmetadata', this._handleLoadedMetadata);
    this._audio.addEventListener('canplay', this._handleCanPlay);
    this._audio.addEventListener('seeking', this._handleSeeking);
    this._audio.addEventListener('seeked', this._handleSeeked);
    this._audio.addEventListener('volumechange', () => {
      if (this.onVolumeChange) this.onVolumeChange(this.volume);
    });
  }

  // =========================================================================
  // LOADING
  // =========================================================================

  /**
   * Load an audio file from URL or path
   * 
   * @param {string|Blob|File} src - Audio source (URL, Blob, or File)
   * @returns {Promise<void>} Resolves when audio is ready to play
   */
  async load(src) {
    if (!this._audio) {
      throw new Error('Player not initialized. Call init() first.');
    }

    // Stop any current playback
    this.stop();

    // Set source
    this._src = typeof src === 'string' ? src : URL.createObjectURL(src);
    this._audio.src = this._src;
    this._loaded = false;

    return new Promise((resolve, reject) => {
      const onCanPlay = () => {
        this._audio.removeEventListener('canplay', onCanPlay);
        this._audio.removeEventListener('error', onError);
        resolve();
      };

      const onError = (e) => {
        this._audio.removeEventListener('canplay', onCanPlay);
        this._audio.removeEventListener('error', onError);
        reject(new Error(`Failed to load audio: ${this._audio.error?.message || 'Unknown error'}`));
      };

      this._audio.addEventListener('canplay', onCanPlay);
      this._audio.addEventListener('error', onError);
    });
  }

  /**
   * Load audio from ArrayBuffer (useful for cached/generated audio)
   * 
   * @param {ArrayBuffer} arrayBuffer - Audio data as ArrayBuffer
   * @param {string} [type='audio/wav'] - MIME type of the audio
   * @returns {Promise<void>}
   */
  async loadFromArrayBuffer(arrayBuffer, type = 'audio/wav') {
    const blob = new Blob([arrayBuffer], { type });
    return this.load(blob);
  }

  // =========================================================================
  // PLAYBACK CONTROLS
  // =========================================================================

  /**
   * Start or resume playback
   * Resumes AudioContext if suspended (browser autoplay policy)
   * 
   * @returns {Promise<void>}
   */
  async play() {
    if (!this._audio) {
      throw new Error('Player not initialized');
    }

    if (!this._audio.src) {
      throw new Error('No audio loaded');
    }

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this._audioContext.state === 'suspended') {
        await this._audioContext.resume();
      }

      // Connect source node if not connected
      this._connectSource();

      await this._audio.play();
      this._playing = true;

    } catch (error) {
      console.error('Playback failed:', error);
      throw error;
    }
  }

  /**
   * Pause playback
   */
  pause() {
    if (this._audio && !this._audio.paused) {
      this._audio.pause();
      this._playing = false;
    }
  }

  /**
   * Stop playback and reset position to beginning
   */
  stop() {
    if (this._audio) {
      this._audio.pause();
      this._audio.currentTime = 0;
      this._playing = false;
      this._disconnectSource();
    }
  }

  /**
   * Seek to a specific time position
   * 
   * @param {number} time - Time position in seconds
   */
  seek(time) {
    if (this._audio) {
      const clampedTime = Math.max(0, Math.min(time, this.duration));
      this._audio.currentTime = clampedTime;
      this._currentTime = clampedTime;
    }
  }

  /**
   * Jump forward by specified number of seconds
   * 
   * @param {number} [seconds=10] - Seconds to skip forward
   */
  forward(seconds = 10) {
    this.seek(this.currentTime + seconds);
  }

  /**
   * Jump backward by specified number of seconds
   * 
   * @param {number} [seconds=10] - Seconds to skip backward
   */
  backward(seconds = 10) {
    this.seek(this.currentTime - seconds);
  }

  // =========================================================================
  // VOLUME CONTROL
  // =========================================================================

  /**
   * Set volume level
   * 
   * @param {number} volume - Volume level between 0 and 1
   */
  setVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this._volume = clampedVolume;
    
    if (this._audio) {
      this._audio.volume = this._muted ? 0 : clampedVolume;
    }
    
    if (this._gainNode) {
      this._gainNode.gain.value = this._muted ? 0 : clampedVolume;
    }
  }

  /**
   * Mute/unmute the player
   * 
   * @param {boolean} [muted] - If provided, set mute state; otherwise toggle
   * @returns {boolean} Current muted state
   */
  toggleMute(muted) {
    this._muted = muted !== undefined ? muted : !this._muted;
    
    if (this._audio) {
      this._audio.volume = this._muted ? 0 : this._volume;
    }
    
    if (this._gainNode) {
      this._gainNode.gain.value = this._muted ? 0 : this._volume;
    }

    return this._muted;
  }

  // =========================================================================
  // GETTERS
  // =========================================================================

  /** @returns {boolean} Whether audio is currently playing */
  get playing() {
    return this._playing;
  }

  /** @returns {number} Total duration in seconds */
  get duration() {
    return this._duration || (this._audio ? this._audio.duration : 0);
  }

  /** @returns {number} Current playback position in seconds */
  get currentTime() {
    return this._currentTime || (this._audio ? this._audio.currentTime : 0);
  }

  /** @returns {number} Current volume level (0-1) */
  get volume() {
    return this._volume;
  }

  /** @returns {boolean} Whether player is muted */
  get muted() {
    return this._muted;
  }

  /** @returns {boolean} Whether loop mode is enabled */
  get loop() {
    return this._loop;
  }

  /** @returns {boolean} Whether audio is loaded and ready */
  get loaded() {
    return this._loaded;
  }

  /** @returns {string} Current audio source URL */
  get src() {
    return this._src;
  }

  /** @returns {number} Playback progress as percentage (0-100) */
  get progress() {
    if (!this.duration) return 0;
    return (this.currentTime / this.duration) * 100;
  }

  /** @returns {boolean} Whether audio is paused */
  get paused() {
    return this._audio ? this._audio.paused : true;
  }

  /** @returns {number} Buffered percentage (0-100) */
  get buffered() {
    if (!this._audio || !this._audio.buffered.length) return 0;
    const buffered = this._audio.buffered.end(this._audio.buffered.length - 1);
    return (buffered / this.duration) * 100;
  }

  // =========================================================================
  // SETTERS
  // =========================================================================

  /** @param {boolean} value Enable/disable loop mode */
  set loop(value) {
    this._loop = value;
    if (this._audio) {
      this._audio.loop = value;
    }
  }

  /** @param {number} value Set current time directly */
  set currentTime(value) {
    this.seek(value);
  }

  /** @param {number} value Set volume directly */
  set volume(value) {
    this.setVolume(value);
  }

  // =========================================================================
  // WEB AUDIO API ACCESSORS
  // =========================================================================

  /**
   * Get the Web Audio AnalyserNode for visualization
   * @returns {AnalyserNode}
   */
  getAnalyser() {
    return this._analyserNode;
  }

  /**
   * Get the Web AudioContext
   * @returns {AudioContext}
   */
  getAudioContext() {
    return this._audioContext;
  }

  /**
   * Get frequency data from analyser
   * 
   * @param {Uint8Array} [dataArray] - Optional pre-allocated array
   * @returns {Uint8Array} Frequency data
   */
  getFrequencyData(dataArray) {
    if (!this._analyserNode) return new Uint8Array(0);
    
    const bufferLength = this._analyserNode.frequencyBinCount;
    const data = dataArray || new Uint8Array(bufferLength);
    this._analyserNode.getByteFrequencyData(data);
    return data;
  }

  /**
   * Get time domain data from analyser (waveform)
   * 
   * @param {Uint8Array} [dataArray] - Optional pre-allocated array
   * @returns {Uint8Array} Time domain data
   */
  getTimeDomainData(dataArray) {
    if (!this._analyserNode) return new Uint8Array(0);
    
    const bufferLength = this._analyserNode.frequencyBinCount;
    const data = dataArray || new Uint8Array(bufferLength);
    this._analyserNode.getByteTimeDomainData(data);
    return data;
  }

  // =========================================================================
  // UTILITY METHODS
  // =========================================================================

  /**
   * Get duration formatted as MM:SS or H:MM:SS
   * @returns {string}
   */
  getDurationFormatted() {
    return this._formatTime(this.duration);
  }

  /**
   * Get current time formatted as MM:SS or H:MM:SS
   * @returns {string}
   */
  getCurrentTimeFormatted() {
    return this._formatTime(this.currentTime);
  }

  /**
   * Format time in seconds to readable string
   * @private
   * @param {number} seconds
   * @returns {string}
   */
  _formatTime(seconds) {
    if (!seconds || !isFinite(seconds)) return '0:00';
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  /**
   * Connect audio element to Web Audio graph
   * @private
   */
  _connectSource() {
    if (this._sourceNode) return;
    
    if (this._audioContext && this._audio) {
      this._sourceNode = this._audioContext.createMediaElementSource(this._audio);
      this._sourceNode.connect(this._gainNode);
      this._sourceNode.connect(this._analyserNode);
    }
  }

  /**
   * Disconnect audio element from Web Audio graph
   * @private
   */
  _disconnectSource() {
    if (this._sourceNode) {
      try {
        this._sourceNode.disconnect();
      } catch (e) {
        // Ignore disconnection errors
      }
      this._sourceNode = null;
    }
  }

  /**
   * Clean up resources and destroy the player
   */
  destroy() {
    this.stop();
    
    if (this._audio) {
      this._removeAudioEvents();
      this._audio.src = '';
      this._audio = null;
    }
    
    if (this._audioContext) {
      this._audioContext.close().catch(() => {});
      this._audioContext = null;
    }
    
    this._gainNode = null;
    this._analyserNode = null;
    this._sourceNode = null;
  }

  /**
   * Remove event listeners from audio element
   * @private
   */
  _removeAudioEvents() {
    if (this._audio) {
      this._audio.removeEventListener('play', this._handlePlay);
      this._audio.removeEventListener('pause', this._handlePause);
      this._audio.removeEventListener('ended', this._handleEnd);
      this._audio.removeEventListener('timeupdate', this._handleTimeUpdate);
      this._audio.removeEventListener('error', this._handleError);
      this._audio.removeEventListener('loadedmetadata', this._handleLoadedMetadata);
      this._audio.removeEventListener('canplay', this._handleCanPlay);
      this._audio.removeEventListener('seeking', this._handleSeeking);
      this._audio.removeEventListener('seeked', this._handleSeeked);
    }
  }

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  /** @private */
  _handlePlay() {
    this._playing = true;
    if (this.onPlay) this.onPlay(this.currentTime);
  }

  /** @private */
  _handlePause() {
    this._playing = false;
    if (this.onPause) this.onPause(this.currentTime);
  }

  /** @private */
  _handleEnd() {
    this._playing = false;
    if (this.onEnd) this.onEnd(this.currentTime);
  }

  /** @private */
  _handleTimeUpdate() {
    this._currentTime = this._audio.currentTime;
    if (this.onTimeUpdate) this.onTimeUpdate(this.currentTime, this.duration, this.progress);
  }

  /** @private */
  _handleError(e) {
    console.error('Audio error:', this._audio?.error);
    if (this.onError) this.onError(this._audio?.error || e);
  }

  /** @private */
  _handleLoadedMetadata() {
    this._duration = this._audio.duration;
  }

  /** @private */
  _handleCanPlay() {
    this._loaded = true;
    if (this.onLoad) this.onLoad(this.src);
  }

  /** @private */
  _handleSeeking() {
    if (this.onSeek) this.onSeek(this._audio.currentTime, 'seeking');
  }

  /** @private */
  _handleSeeked() {
    this._currentTime = this._audio.currentTime;
    if (this.onSeek) this.onSeek(this._audio.currentTime, 'seeked');
  }
}

// Export the AudioPlayer class
export default AudioPlayer;
export { AudioPlayer };
