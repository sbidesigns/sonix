/**
 * Waveform Visualizer Module
 * Canvas-based audio visualization with multiple display modes
 * Part of the Sonix AI Music Platform
 */

// ============================================================================
// WAVEFORM VISUALIZER CLASS
// ============================================================================

/**
 * WaveformVisualizer provides real-time audio visualization on a canvas element
 * Supports multiple visualization modes: waveform, bars, circular
 * 
 * @example
 * const visualizer = new WaveformVisualizer(document.getElementById('canvas'));
 * visualizer.connect(audioContext, sourceNode);
 * visualizer.setMode('bars');
 * visualizer.start();
 */
class WaveformVisualizer {
  /**
   * Create a new WaveformVisualizer instance
   * 
   * @param {HTMLCanvasElement} canvas - Canvas element to draw on
   * @param {Object} [options] - Configuration options
   * @param {string} [options.mode='waveform'] - Initial visualization mode
   * @param {string} [options.foreground='#00ff88'] - Primary color
   * @param {string} [options.background='#1a1a2e'] - Background color
   * @param {number} [options.barCount=64] - Number of bars for bars mode
   * @param {number} [options.lineWidth=2] - Line width for waveform mode
   * @param {boolean} [options.mirror=false] - Mirror visualization vertically
   * @param {number} [options.smoothing=0.8] - Data smoothing factor
   */
  constructor(canvas, options = {}) {
    // Validate canvas element
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('WaveformVisualizer requires an HTMLCanvasElement');
    }

    // Store canvas and context
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Configuration options
    this._mode = options.mode || 'waveform';
    this._foreground = options.foreground || '#00ff88';
    this._background = options.background || '#1a1a2e';
    this._barCount = options.barCount || 64;
    this._lineWidth = options.lineWidth || 2;
    this._mirror = options.mirror || false;
    this._smoothing = options.smoothing ?? 0.8;

    // Audio nodes
    this._analyser = null;
    this._audioContext = null;
    this._sourceNode = null;

    // Animation state
    this._animationId = null;
    this._isRunning = false;
    this._dataArray = null;
    this._previousData = null;

    // Bind animation loop to preserve context
    this._animate = this._animate.bind(this);

    // Set initial canvas size
    this.resize();
  }

  // =========================================================================
  // CONNECTION
  // =========================================================================

  /**
   * Connect the visualizer to an audio context and source node
   * Creates an internal analyser node if one isn't provided
   * 
   * @param {AudioContext} audioContext - The Web Audio context
   * @param {AudioNode} sourceNode - Source audio node to analyze
   * @param {AnalyserNode} [existingAnalyser] - Optional existing analyser node
   * @returns {WaveformVisualizer} This instance for chaining
   */
  connect(audioContext, sourceNode, existingAnalyser) {
    // Validate inputs
    if (!audioContext) {
      throw new Error('AudioContext is required');
    }
    if (!sourceNode) {
      throw new Error('SourceNode is required');
    }

    this._audioContext = audioContext;
    this._sourceNode = sourceNode;

    // Use existing analyser or create new one
    if (existingAnalyser) {
      this._analyser = existingAnalyser;
    } else {
      this._analyser = audioContext.createAnalyser();
      this._analyser.fftSize = 2048;
      this._analyser.smoothingTimeConstant = this._smoothing;
      
      // Connect source to analyser
      sourceNode.connect(this._analyser);
    }

    // Initialize data arrays
    this._dataArray = new Uint8Array(this._analyser.frequencyBinCount);
    this._previousData = new Uint8Array(this._analyser.frequencyBinCount);

    return this;
  }

  /**
   * Disconnect from audio nodes and clean up
   */
  disconnect() {
    this.stop();
    
    if (this._analyser && this._sourceNode) {
      try {
        this._sourceNode.disconnect(this._analyser);
      } catch (e) {
        // Ignore disconnection errors
      }
    }

    this._analyser = null;
    this._sourceNode = null;
    this._audioContext = null;
    this._dataArray = null;
    this._previousData = null;
  }

  // =========================================================================
  // ANIMATION CONTROL
  // =========================================================================

  /**
   * Start the visualization animation loop
   */
  start() {
    if (this._isRunning) return;
    
    this._isRunning = true;
    this._animate();
  }

  /**
   * Stop the visualization animation loop
   */
  stop() {
    this._isRunning = false;
    
    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
      this._animationId = null;
    }

    // Draw final cleared state
    this._drawBackground();
  }

  /**
   * Check if visualizer is currently running
   * @returns {boolean}
   */
  get isRunning() {
    return this._isRunning;
  }

  // =========================================================================
  // MODE CONTROL
  // =========================================================================

  /**
   * Set the visualization mode
   * 
   * @param {string} mode - One of: 'waveform', 'bars', 'circular'
   * @throws {Error} If mode is invalid
   */
  setMode(mode) {
    const validModes = ['waveform', 'bars', 'circular'];
    
    if (!validModes.includes(mode)) {
      throw new Error(`Invalid mode: ${mode}. Valid modes are: ${validModes.join(', ')}`);
    }
    
    this._mode = mode;
  }

  /**
   * Get current visualization mode
   * @returns {string}
   */
  get mode() {
    return this._mode;
  }

  // =========================================================================
  // APPEARANCE
  // =========================================================================

  /**
   * Set foreground (primary) color
   * @param {string} color - CSS color value
   */
  setColor(color) {
    this._foreground = color;
  }

  /**
   * Set background color
   * @param {string} color - CSS color value
   */
  setBackgroundColor(color) {
    this._background = color;
  }

  /**
   * Enable or disable mirrored visualization
   * @param {boolean} mirror
   */
  setMirror(mirror) {
    this._mirror = mirror;
  }

  /**
   * Set number of bars for bars mode
   * @param {number} count
   */
  setBarCount(count) {
    this._barCount = Math.max(8, Math.min(256, count));
  }

  /**
   * Set line width for waveform mode
   * @param {number} width
   */
  setLineWidth(width) {
    this._lineWidth = Math.max(0.5, Math.min(10, width));
  }

  /**
   * Set smoothing time constant for analyser
   * @param {number} smoothing - Value between 0 and 1
   */
  setSmoothing(smoothing) {
    this._smoothing = Math.max(0, Math.min(1, smoothing));
    if (this._analyser) {
      this._analyser.smoothingTimeConstant = this._smoothing;
    }
  }

  // =========================================================================
  // RESIZE
  // =========================================================================

  /**
   * Resize canvas to match its container dimensions
   * Should be called when container size changes
   */
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    
    // Store logical dimensions
    this._width = rect.width;
    this._height = rect.height;
  }

  /**
   * Get canvas dimensions
   * @returns {{ width: number, height: number }}
   */
  getDimensions() {
    return {
      width: this._width || this.canvas.width,
      height: this._height || this.canvas.height
    };
  }

  // =========================================================================
  // ANIMATION LOOP
  // =========================================================================

  /**
   * Main animation loop
   * @private
   */
  _animate() {
    if (!this._isRunning) return;

    this._update();
    this._draw();

    this._animationId = requestAnimationFrame(this._animate);
  }

  /**
   * Update data from analyser
   * @private
   */
  _update() {
    if (!this._analyser || !this._dataArray) return;

    // Get appropriate data based on mode
    if (this._mode === 'waveform') {
      this._analyser.getByteTimeDomainData(this._dataArray);
    } else {
      this._analyser.getByteFrequencyData(this._dataArray);
    }

    // Apply smoothing between frames
    for (let i = 0; i < this._dataArray.length; i++) {
      this._dataArray[i] = Math.round(
        this._previousData[i] * this._smoothing + 
        this._dataArray[i] * (1 - this._smoothing)
      );
    }
    
    // Copy current data to previous
    this._previousData.set(this._dataArray);
  }

  /**
   * Draw the visualization
   * @private
   */
  _draw() {
    this._drawBackground();

    switch (this._mode) {
      case 'waveform':
        this._drawWaveform();
        break;
      case 'bars':
        this._drawBars();
        break;
      case 'circular':
        this._drawCircular();
        break;
      default:
        this._drawWaveform();
    }
  }

  /**
   * Draw background
   * @private
   */
  _drawBackground() {
    const { ctx, canvas } = this;
    const { width, height } = this.getDimensions();
    
    ctx.fillStyle = this._background;
    ctx.fillRect(0, 0, width, height);
  }

  // =========================================================================
  // DRAWING METHODS
  // =========================================================================

  /**
   * Draw waveform (oscilloscope style)
   * @private
   */
  _drawWaveform() {
    const { ctx } = this;
    const { width, height } = this.getDimensions();
    const data = this._dataArray;
    
    if (!data) return;

    ctx.beginPath();
    ctx.strokeStyle = this._foreground;
    ctx.lineWidth = this._lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const sliceWidth = width / data.length;
    let x = 0;

    // Find center Y position
    const centerY = height / 2;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0; // Normalize to 0-2 range
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();

    // Draw mirror if enabled
    if (this._mirror) {
      ctx.beginPath();
      x = 0;

      for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128.0;
        const y = height - (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw center line
    ctx.beginPath();
    ctx.strokeStyle = this._foreground;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  /**
   * Draw frequency bars (spectrum analyzer style)
   * @private
   */
  _drawBars() {
    const { ctx } = this;
    const { width, height } = this.getDimensions();
    const data = this._dataArray;
    
    if (!data) return;

    const barCount = this._barCount;
    const barWidth = (width / barCount) - 2;
    const gap = 2;
    const step = Math.floor(data.length / barCount);

    for (let i = 0; i < barCount; i++) {
      // Average values for this bar
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += data[i * step + j];
      }
      const average = sum / step;
      
      // Calculate bar height
      const barHeight = (average / 255) * height * 0.9;
      const x = i * (barWidth + gap);
      const y = height - barHeight;

      // Create gradient for bar
      const gradient = ctx.createLinearGradient(x, height, x, y);
      gradient.addColorStop(0, this._foreground);
      gradient.addColorStop(1, this._adjustColorBrightness(this._foreground, 50));

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw mirror if enabled
      if (this._mirror) {
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x, 0, barWidth, barHeight * 0.5);
        ctx.globalAlpha = 1;
      }
    }
  }

  /**
   * Draw circular/radial visualization
   * @private
   */
  _drawCircular() {
    const { ctx } = this;
    const { width, height } = this.getDimensions();
    const data = this._dataArray;
    
    if (!data) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const barCount = this._barCount;
    const step = Math.floor(data.length / barCount);

    ctx.save();
    ctx.translate(centerX, centerY);

    for (let i = 0; i < barCount; i++) {
      // Average values for this segment
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += data[i * step + j];
      }
      const average = sum / step;

      // Calculate angle
      const angle = (i / barCount) * Math.PI * 2;
      const barHeight = (average / 255) * radius * 0.8;

      // Calculate coordinates
      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle) * (radius + barHeight);
      const y2 = Math.sin(angle) * (radius + barHeight);

      // Draw line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = this._foreground;
      ctx.lineWidth = Math.max(2, (Math.PI * 2 * radius) / barCount - 1);
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw mirror (inner)
      if (this._mirror) {
        const innerX = Math.cos(angle) * (radius - barHeight * 0.5);
        const innerY = Math.sin(angle) * (radius - barHeight * 0.5);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(innerX, innerY);
        ctx.globalAlpha = 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = this._foreground;
    ctx.fill();

    ctx.restore();
  }

  /**
   * Adjust color brightness
   * @private
   * @param {string} color - CSS color
   * @param {number} amount - Amount to adjust (-255 to 255)
   * @returns {string} Adjusted color
   */
  _adjustColorBrightness(color, amount) {
    // Simple hex color adjustment
    let hex = color.replace('#', '');
    
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    
    const num = parseInt(hex, 16);
    let r = Math.min(255, Math.max(0, (num >> 16) + amount));
    let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    let b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  // =========================================================================
  // UTILITY
  // =========================================================================

  /**
   * Take a snapshot of the current visualization
   * @returns {string} Data URL of the canvas image
   */
  snapshot() {
    return this.canvas.toDataURL('image/png');
  }

  /**
   * Clear the canvas and stop animation
   */
  clear() {
    this.stop();
    this._drawBackground();
  }

  /**
   * Destroy the visualizer and release resources
   */
  destroy() {
    this.stop();
    this.disconnect();
    this.ctx = null;
    this.canvas = null;
  }
}

// Export the WaveformVisualizer class
export default WaveformVisualizer;
export { WaveformVisualizer };
