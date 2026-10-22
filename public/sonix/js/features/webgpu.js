/**
 * WebGPU Detection and Model Definitions
 * Provides WebGPU capability detection, VRAM estimation, and model registry
 * for the Sonix AI Music Platform
 */

// ============================================================================
// MODEL REGISTRY
// ============================================================================

/**
 * Available AI models for music generation, voice synthesis, and audio processing
 * Each model includes metadata for size, capabilities, and feature flags
 */
export const AVAILABLE_MODELS = [
  {
    id: 'musicgen-vocals',
    name: 'MusicGen Vocals',
    description: 'Full song generation with vocals using Meta\'s MusicGen architecture',
    size: 4.2 * 1024 * 1024 * 1024, // 4.2GB in bytes
    sizeFormatted: '4.2 GB',
    category: 'full-song',
    capabilities: ['vocals', 'melody', 'genre-transfer', 'text-to-music'],
    features: {
      vocals: true,
      instrumental: false,
      voiceCloning: false,
      stemSeparation: false
    },
    supportedBackends: ['webgpu', 'wasm'],
    minVRAM: '4 GB',
    recommendedVRAM: '6 GB',
    license: 'CC-BY-NC-4.0',
    tags: ['vocals', 'full-song', 'text-to-music', 'meta']
  },
  {
    id: 'jukebox-full',
    name: 'Jukebox Full',
    description: 'OpenAI Jukebox model for full song generation with vocals',
    size: 20 * 1024 * 1024 * 1024, // 20GB in bytes
    sizeFormatted: '20 GB',
    category: 'full-song',
    capabilities: ['vocals', 'multi-genre', 'artist-style', 'full-composition'],
    features: {
      vocals: true,
      instrumental: false,
      voiceCloning: false,
      stemSeparation: false
    },
    supportedBackends: ['webgpu'],
    minVRAM: '16 GB',
    recommendedVRAM: '24 GB',
    license: 'MIT',
    tags: ['vocals', 'full-song', 'openai', 'large-model']
  },
  {
    id: 'minimax-music-03',
    name: 'MiniMax Music v3',
    description: 'Advanced music generation with high-quality vocal synthesis',
    size: 5.8 * 1024 * 1024 * 1024, // 5.8GB in bytes
    sizeFormatted: '5.8 GB',
    category: 'full-song',
    capabilities: ['vocals', 'high-fidelity', 'multi-instrument', 'lyrics-sync'],
    features: {
      vocals: true,
      instrumental: false,
      voiceCloning: false,
      stemSeparation: false
    },
    supportedBackends: ['webgpu', 'wasm'],
    minVRAM: '6 GB',
    recommendedVRAM: '8 GB',
    license: 'Proprietary',
    tags: ['vocals', 'full-song', 'minimax', 'high-quality']
  },
  {
    id: 'suno-v5',
    name: 'Suno v5',
    description: 'Latest Suno model for radio-quality song generation with vocals',
    size: 4.5 * 1024 * 1024 * 1024, // 4.5GB in bytes
    sizeFormatted: '4.5 GB',
    category: 'full-song',
    capabilities: ['vocals', 'radio-quality', 'genre-agnostic', 'fast-generation'],
    features: {
      vocals: true,
      instrumental: false,
      voiceCloning: false,
      stemSeparation: false
    },
    supportedBackends: ['webgpu', 'wasm'],
    minVRAM: '4 GB',
    recommendedVRAM: '6 GB',
    license: 'Proprietary',
    tags: ['vocals', 'full-song', 'suno', 'popular']
  },
  {
    id: 'udio-2',
    name: 'Udio 2',
    description: 'Udio\'s second generation model with exceptional vocal quality',
    size: 5.2 * 1024 * 1024 * 1024, // 5.2GB in bytes
    sizeFormatted: '5.2 GB',
    category: 'full-song',
    capabilities: ['vocals', 'studio-quality', 'complex-arrangements', 'emotional-expression'],
    features: {
      vocals: true,
      instrumental: false,
      voiceCloning: false,
      stemSeparation: false
    },
    supportedBackends: ['webgpu', 'wasm'],
    minVRAM: '6 GB',
    recommendedVRAM: '8 GB',
    license: 'Proprietary',
    tags: ['vocals', 'full-song', 'udio', 'studio']
  },
  {
    id: 'musicgen-small',
    name: 'MusicGen Small',
    description: 'Lightweight instrumental music generation model',
    size: 300 * 1024 * 1024, // 300MB in bytes
    sizeFormatted: '300 MB',
    category: 'instrumental',
    capabilities: ['instrumental', 'fast', 'low-memory', 'melody-conditioned'],
    features: {
      vocals: false,
      instrumental: true,
      voiceCloning: false,
      stemSeparation: false
    },
    supportedBackends: ['webgpu', 'wasm', 'cpu'],
    minVRAM: '512 MB',
    recommendedVRAM: '1 GB',
    license: 'CC-BY-NC-4.0',
    tags: ['instrumental', 'lightweight', 'meta', 'fast']
  },
  {
    id: 'musicgen-medium',
    name: 'MusicGen Medium',
    description: 'Balanced instrumental generation with improved quality',
    size: 1.5 * 1024 * 1024 * 1024, // 1.5GB in bytes
    sizeFormatted: '1.5 GB',
    category: 'instrumental',
    capabilities: ['instrumental', 'balanced', 'good-quality', 'multi-style'],
    features: {
      vocals: false,
      instrumental: true,
      voiceCloning: false,
      stemSeparation: false
    },
    supportedBackends: ['webgpu', 'wasm', 'cpu'],
    minVRAM: '2 GB',
    recommendedVRAM: '3 GB',
    license: 'CC-BY-NC-4.0',
    tags: ['instrumental', 'balanced', 'meta']
  },
  {
    id: 'xtts-v2',
    name: 'XTTS v2',
    description: 'Coqui XTTS v2 text-to-speech with voice cloning support',
    size: 1 * 1024 * 1024 * 1024, // 1GB in bytes
    sizeFormatted: '1 GB',
    category: 'voice',
    capabilities: ['tts', 'voice-cloning', 'multilingual', 'emotional-control'],
    features: {
      vocals: false,
      instrumental: false,
      voiceCloning: true,
      stemSeparation: false
    },
    supportedBackends: ['webgpu', 'wasm', 'cpu'],
    minVRAM: '2 GB',
    recommendedVRAM: '4 GB',
    license: 'CPML',
    tags: ['voice', 'tts', 'cloning', 'coqui', 'multilingual']
  },
  {
    id: 'bark',
    name: 'Bark',
    description: 'Suno Bark text-to-audio model with expressive voice generation',
    size: 900 * 1024 * 1024, // 900MB in bytes
    sizeFormatted: '900 MB',
    category: 'voice',
    capabilities: ['tts', 'sound-effects', 'music-snippets', 'expressive'],
    features: {
      vocals: false,
      instrumental: false,
      voiceCloning: false,
      stemSeparation: false
    },
    supportedBackends: ['webgpu', 'wasm', 'cpu'],
    minVRAM: '2 GB',
    recommendedVRAM: '4 GB',
    license: 'MIT',
    tags: ['voice', 'tts', 'suno', 'expressive']
  },
  {
    id: 'demucs-hybrid',
    name: 'Demucs Hybrid',
    description: 'High-quality source separation for stems extraction',
    size: 500 * 1024 * 1024, // 500MB in bytes
    sizeFormatted: '500 MB',
    category: 'effect',
    capabilities: ['stem-separation', 'vocal-isolation', 'drum-extraction', 'bass-extraction', 'other-extraction'],
    features: {
      vocals: false,
      instrumental: false,
      voiceCloning: false,
      stemSeparation: true
    },
    supportedBackends: ['webgpu', 'wasm', 'cpu'],
    minVRAM: '1 GB',
    recommendedVRAM: '2 GB',
    license: 'MIT',
    tags: ['effect', 'separation', 'demucs', 'stems']
  }
];

// ============================================================================
// WEBGPU DETECTION
// ============================================================================

/**
 * Detects WebGPU support and gathers adapter information
 * Handles browsers that may not have requestAdapterInfo() available
 * 
 * @returns {Promise<Object>} WebGPU detection result
 * @returns {boolean} returns.supported - Whether WebGPU is available
 * @returns {string} returns.fallbackReason - Reason if not supported
 * @returns {Object} returns.adapter - Adapter info if available
 * @returns {Object} returns.limits - GPU limits
 * @returns {string} returns.recommendedBackend - Recommended compute backend
 * @returns {string} returns.vramEstimate - Estimated VRAM available
 */
export async function detectWebGPU() {
  try {
    // Check if navigator.gpu exists (WebGPU API available)
    if (!navigator.gpu) {
      return { 
        supported: false, 
        fallbackReason: 'WebGPU not supported' 
      };
    }

    // Request GPU adapter
    const adapter = await navigator.gpu.requestAdapter();
    
    if (!adapter) {
      return { 
        supported: false, 
        fallbackReason: 'No GPU adapter' 
      };
    }

    // Try to get adapter info (may not be available in all browsers)
    let info = null;
    try {
      if (typeof adapter.requestAdapterInfo === 'function') {
        info = await adapter.requestAdapterInfo();
      }
    } catch (e) {
      // Silently handle missing requestAdapterInfo
      console.warn('requestAdapterInfo not available:', e.message);
    }

    // Get adapter limits for capability assessment
    const limits = adapter.limits;

    // Estimate VRAM based on max buffer size
    let vram = 'Unknown';
    const maxBuf = limits.maxBufferSize || 0;
    
    if (maxBuf >= 2**32) {
      vram = '8+ GB';
    } else if (maxBuf >= 2**30) {
      vram = '4-8 GB';
    } else if (maxBuf > 0) {
      vram = '2-4 GB';
    } else {
      vram = 'Available';
    }

    return { 
      supported: true, 
      adapter: info, 
      limits, 
      recommendedBackend: 'webgpu', 
      vramEstimate: vram 
    };

  } catch (e) {
    return { 
      supported: false, 
      fallbackReason: e.message 
    };
  }
}

/**
 * Check if a specific model can run on current hardware
 * 
 * @param {Object} model - Model object from AVAILABLE_MODELS
 * @param {Object} gpuInfo - Result from detectWebGPU()
 * @returns {Object} Compatibility result with reasons
 */
export function checkModelCompatibility(model, gpuInfo) {
  const issues = [];
  const warnings = [];

  // Check basic WebGPU support
  if (!gpuInfo.supported) {
    issues.push(`WebGPU not available: ${gpuInfo.fallbackReason}`);
    return { compatible: false, issues, warnings, canFallback: true };
  }

  // Check VRAM requirements
  const vramMap = {
    '512 MB': 0.5,
    '1 GB': 1,
    '2 GB': 2,
    '4 GB': 4,
    '6 GB': 6,
    '8 GB': 8,
    '16 GB': 16,
    '24 GB': 24
  };

  const minVRAM = vramMap[model.minVRAM] || 0;
  const estimatedVRAM = parseVramEstimate(gpuInfo.vramEstimate);

  if (estimatedVRAM < minVRAM) {
    issues.push(`Insufficient VRAM: need ${model.minVRAM}, estimated ${gpuInfo.vramEstimate}`);
  } else if (estimatedVRAM < (vramMap[model.recommendedVRAM] || 0)) {
    warnings.push(`Below recommended VRAM of ${model.recommendedVRAM}`);
  }

  // Check backend compatibility
  const hasWebGPU = model.supportedBackends.includes('webgpu');
  const hasWASM = model.supportedBackends.includes('wasm');

  if (!hasWebGPU && !hasWASM) {
    issues.push('No compatible backend available');
  }

  return {
    compatible: issues.length === 0,
    issues,
    warnings,
    canFallback: hasWASM && !gpuInfo.supported,
    recommendedBackend: gpuInfo.supported ? 'webgpu' : (hasWASM ? 'wasm' : 'none')
  };
}

/**
 * Parse VRAM estimate string to numeric value in GB
 * 
 * @param {string} estimate - VRAM estimate string
 * @returns {number} Estimated VRAM in GB
 */
function parseVramEstimate(estimate) {
  if (!estimate || estimate === 'Unknown' || estimate === 'Available') {
    return 4; // Default assumption
  }
  
  const match = estimate.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    return estimate.includes('+') ? num + 2 : num;
  }
  
  return 4;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format bytes into human-readable string
 * 
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted byte string
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format seconds into human-readable duration string
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string (MM:SS or H:MM:SS)
 */
export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '0:00';

  seconds = Math.floor(seconds);
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get all models that support vocal generation
 * 
 * @returns {Array} Array of models with vocals capability
 */
export function getModelsWithVocals() {
  return AVAILABLE_MODELS.filter(model => model.features.vocals);
}

/**
 * Get all instrumental-only models (no vocals)
 * 
 * @returns {Array} Array of instrumental models
 */
export function getInstrumentalModels() {
  return AVAILABLE_MODELS.filter(model => model.features.instrumental);
}

/**
 * Get models by category
 * 
 * @param {string} category - Category filter ('full-song', 'instrumental', 'voice', 'effect')
 * @returns {Array} Array of models in the specified category
 */
export function getModelsByCategory(category) {
  return AVAILABLE_MODELS.filter(model => model.category === category);
}

/**
 * Get a model by its ID
 * 
 * @param {string} id - Model ID
 * @returns {Object|null} Model object or null if not found
 */
export function getModelById(id) {
  return AVAILABLE_MODELS.find(model => model.id === id) || null;
}

/**
 * Get all models that support a specific backend
 * 
 * @param {string} backend - Backend type ('webgpu', 'wasm', 'cpu')
 * @returns {Array} Array of compatible models
 */
export function getModelsForBackend(backend) {
  return AVAILABLE_MODELS.filter(model => 
    model.supportedBackends.includes(backend)
  );
}

/**
 * Calculate total size of all models
 * 
 * @returns {Object} Object with total bytes and formatted string
 */
export function getTotalModelsSize() {
  const totalBytes = AVAILABLE_MODELS.reduce((sum, model) => sum + model.size, 0);
  return {
    bytes: totalBytes,
    formatted: formatBytes(totalBytes)
  };
}

/**
 * Sort models by size (ascending or descending)
 * 
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array of models
 */
export function getModelsSortedBySize(order = 'asc') {
  return [...AVAILABLE_MODELS].sort((a, b) => {
    return order === 'asc' ? a.size - b.size : b.size - a.size;
  });
}

/**
 * Search models by query string
 * Searches name, description, and tags
 * 
 * @param {string} query - Search query
 * @returns {Array} Matching models
 */
export function searchModels(query) {
  if (!query) return [...AVAILABLE_MODELS];
  
  const lowerQuery = query.toLowerCase();
  
  return AVAILABLE_MODELS.filter(model => 
    model.name.toLowerCase().includes(lowerQuery) ||
    model.description.toLowerCase().includes(lowerQuery) ||
    model.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    model.id.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get models that fit within a given VRAM budget
 * 
 * @param {string} vramBudget - Available VRAM (e.g., '4 GB')
 * @returns {Array} Models that can fit in the VRAM budget
 */
export function getModelsForVRAM(vramBudget) {
  const vramMap = {
    '512 MB': 0.5,
    '1 GB': 1,
    '2 GB': 2,
    '4 GB': 4,
    '6 GB': 6,
    '8 GB': 8,
    '16 GB': 16,
    '24 GB': 24
  };

  const budgetGB = vramMap[vramBudget] || parseVramEstimate(vramBudget);

  return AVAILABLE_MODELS.filter(model => {
    const minGB = vramMap[model.minVRAM] || 0;
    return minGB <= budgetGB;
  });
}

// Export default with commonly used items
export default {
  AVAILABLE_MODELS,
  detectWebGPU,
  checkModelCompatibility,
  formatBytes,
  formatDuration,
  getModelsWithVocals,
  getInstrumentalModels,
  getModelsByCategory,
  getModelById,
  getModelsForBackend,
  getTotalModelsSize,
  getModelsSortedBySize,
  searchModels,
  getModelsForVRAM
};
