/**
 * Model Cache Manager
 * IndexedDB-based caching system for AI model files with download progress tracking
 * Part of the Sonix AI Music Platform
 */

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

const DB_NAME = 'sonix-model-cache';
const DB_VERSION = 1;
const STORE_NAME = 'models';

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Open or create the IndexedDB database for model caching
 * 
 * @returns {Promise<IDBDatabase>} Database instance
 * @throws {Error} If database cannot be opened
 */
export async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open database: ${request.error?.message || 'Unknown error'}`));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object store for models if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        
        // Create indexes for efficient querying
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('cachedAt', 'cachedAt', { unique: false });
        store.createIndex('size', 'size', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }
    };
  });
}

/**
 * Save a model to the IndexedDB cache
 * 
 * @param {Object} model - Model object to cache
 * @param {string} model.id - Unique model identifier
 * @param {string} model.name - Human-readable model name
 * @param {ArrayBuffer} model.data - Model binary data
 * @param {number} model.size - Size in bytes
 * @param {string} model.category - Model category
 * @param {Object} [model.metadata] - Additional metadata
 * @returns {Promise<Object>} Saved model record
 */
export async function saveModelToCache(model) {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const record = {
      id: model.id,
      name: model.name,
      data: model.data,
      size: model.size || (model.data ? model.data.byteLength : 0),
      category: model.category || 'unknown',
      status: 'cached',
      cachedAt: Date.now(),
      lastAccessed: Date.now(),
      metadata: model.metadata || {},
      version: model.version || '1.0.0'
    };

    const request = store.put(record);

    request.onsuccess = () => {
      resolve(record);
    };

    request.onerror = () => {
      reject(new Error(`Failed to save model: ${request.error?.message || 'Unknown error'}`));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Retrieve a cached model by its ID
 * 
 * @param {string} id - Model identifier
 * @returns {Promise<Object|null>} Cached model or null if not found
 */
export async function getCachedModel(id) {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const result = request.result;
      
      if (result) {
        // Update last accessed time
        result.lastAccessed = Date.now();
        const updateTransaction = db.transaction([STORE_NAME], 'readwrite');
        const updateStore = updateTransaction.objectStore(STORE_NAME);
        updateStore.put(result);
      }
      
      resolve(result || null);
    };

    request.onerror = () => {
      reject(new Error(`Failed to get model: ${request.error?.message || 'Unknown error'}`));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Get all cached models from the database
 * 
 * @param {Object} [options] - Query options
 * @param {string} [options.category] - Filter by category
 * @param {string} [options.status] - Filter by status
 * @returns {Promise<Array>} Array of cached model records
 */
export async function getAllCachedModels(options = {}) {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      let results = request.result || [];
      
      // Apply filters if provided
      if (options.category) {
        results = results.filter(m => m.category === options.category);
      }
      
      if (options.status) {
        results = results.filter(m => m.status === options.status);
      }

      // Sort by cached date (newest first)
      results.sort((a, b) => b.cachedAt - a.cachedAt);
      
      resolve(results);
    };

    request.onerror = () => {
      reject(new Error(`Failed to get models: ${request.error?.message || 'Unknown error'}`));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Delete a specific cached model
 * 
 * @param {string} id - Model identifier to delete
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export async function deleteCachedModel(id) {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // First check if model exists
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      if (!getRequest.result) {
        resolve(false);
        return;
      }

      const deleteRequest = store.delete(id);

      deleteRequest.onsuccess = () => {
        resolve(true);
      };

      deleteRequest.onerror = () => {
        reject(new Error(`Failed to delete model: ${deleteRequest.error?.message || 'Unknown error'}`));
      };
    };

    getRequest.onerror = () => {
      reject(new Error(`Failed to find model: ${getRequest.error?.message || 'Unknown error'}`));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Clear all cached models from the database
 * 
 * @returns {Promise<number}> Number of models deleted
 */
export async function clearAllCachedModels() {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Get count before clearing
    const countRequest = store.count();
    
    countRequest.onsuccess = () => {
      const count = countRequest.result;
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        resolve(count);
      };

      clearRequest.onerror = () => {
        reject(new Error(`Failed to clear models: ${clearRequest.error?.message || 'Unknown error'}`));
      };
    };

    countRequest.onerror = () => {
      reject(new Error(`Failed to count models: ${countRequest.error?.message || 'Unknown error'}`));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

// ============================================================================
// MODEL DOWNLOADING
// ============================================================================

/**
 * Download a model file with progress tracking using ReadableStream
 * 
 * @param {string} url - URL of the model file to download
 * @param {Function} onProgress - Progress callback(progressEvent)
 * @param {AbortSignal} [signal] - Optional AbortSignal for cancellation
 * @returns {Promise<ArrayBuffer>} Downloaded model data as ArrayBuffer
 * @throws {Error} If download fails or is aborted
 */
export async function downloadModel(url, onProgress, signal) {
  return new Promise(async (resolve, reject) => {
    try {
      // Create abort controller if signal is provided
      const controller = new AbortController();
      
      if (signal) {
        signal.addEventListener('abort', () => controller.abort());
      }

      // Start fetch with streaming
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/octet-stream, application/*'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Get content length if available
      const contentLength = response.headers.get('Content-Length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      // Check if response body supports streaming
      if (!response.body) {
        // Fallback for browsers without ReadableStream support
        const arrayBuffer = await response.arrayBuffer();
        
        if (onProgress) {
          onProgress({
            loaded: arrayBuffer.byteLength,
            total: arrayBuffer.byteLength,
            percent: 100,
            speed: 0,
            estimatedTimeRemaining: 0
          });
        }
        
        resolve(arrayBuffer);
        return;
      }

      // Use ReadableStream for progressive download
      const reader = response.body.getReader();
      const chunks = [];
      let loaded = 0;
      let startTime = performance.now();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        loaded += value.length;

        // Calculate and report progress
        if (onProgress) {
          const elapsed = (performance.now() - startTime) / 1000; // seconds
          const speed = elapsed > 0 ? loaded / elapsed : 0; // bytes per second
          const percent = total > 0 ? Math.round((loaded / total) * 100) : Math.round(loaded / (1024 * 1024));
          const remaining = speed > 0 && total > 0 ? (total - loaded) / speed : 0;

          onProgress({
            loaded,
            total,
            percent: Math.min(percent, 100),
            speed,
            estimatedTimeRemaining: remaining,
            chunkSize: value.length
          });
        }
      }

      // Combine all chunks into single ArrayBuffer
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const resultArray = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of chunks) {
        resultArray.set(chunk, offset);
        offset += chunk.length;
      }

      resolve(resultArray.buffer);

    } catch (error) {
      if (error.name === 'AbortError') {
        reject(new Error('Download cancelled'));
      } else {
        reject(error);
      }
    }
  });
}

/**
 * Download and cache a model in one operation
 * 
 * @param {string} url - URL to download model from
 * @param {Object} modelInfo - Model metadata
 * @param {Function} [onProgress] - Progress callback
 * @param {AbortSignal} [signal] - AbortSignal for cancellation
 * @returns {Promise<Object>} Cached model record
 */
export async function downloadAndCacheModel(url, modelInfo, onProgress, signal) {
  // Download the model data
  const data = await downloadModel(url, onProgress, signal);

  // Save to cache
  const cachedModel = await saveModelToCache({
    id: modelInfo.id,
    name: modelInfo.name,
    data: data,
    size: data.byteLength,
    category: modelInfo.category,
    metadata: {
      url: url,
      downloadedAt: Date.now(),
      ...modelInfo.metadata
    },
    version: modelInfo.version
  });

  return cachedModel;
}

// ============================================================================
// CACHE UTILITIES
// ============================================================================

/**
 * Get total size of all cached models
 * 
 * @returns {Promise<Object>} Size info with bytes and formatted string
 */
export async function getTotalCacheSize() {
  const models = await getAllCachedModels();
  const totalBytes = models.reduce((sum, m) => sum + (m.size || 0), 0);
  
  return {
    bytes: totalBytes,
    formatted: formatSize(totalBytes),
    modelCount: models.length
  };
}

/**
 * Get storage quota information
 * 
 * @returns {Promise<Object>} Storage quota details
 */
export async function getStorageQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    
    return {
      quota: estimate.quota,
      usage: estimate.usage,
      usagePercentage: ((estimate.usage / estimate.quota) * 100).toFixed(2),
      available: estimate.quota - estimate.usage,
      quotaFormatted: formatSize(estimate.quota),
      usageFormatted: formatSize(estimate.usage),
      availableFormatted: formatSize(estimate.quota - estimate.usage)
    };
  }
  
  return {
    quota: null,
    usage: null,
    usagePercentage: null,
    available: null,
    quotaFormatted: 'Unknown',
    usageFormatted: 'Unknown',
    availableFormatted: 'Unknown'
  };
}

/**
 * Check if a model is cached
 * 
 * @param {string} id - Model ID to check
 * @returns {Promise<boolean>} True if model is cached
 */
export async function isModelCached(id) {
  const model = await getCachedModel(id);
  return model !== null;
}

/**
 * Update model metadata without modifying the cached data
 * 
 * @param {string} id - Model ID
 * @param {Object} metadata - Metadata to merge
 * @returns {Promise<Object>} Updated model record
 */
export async function updateModelMetadata(id, metadata) {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const model = getRequest.result;
      
      if (!model) {
        reject(new Error(`Model ${id} not found`));
        return;
      }

      // Merge metadata
      model.metadata = { ...model.metadata, ...metadata };
      model.lastAccessed = Date.now();

      const putRequest = store.put(model);
      
      putRequest.onsuccess = () => resolve(model);
      putRequest.onerror = () => reject(new Error('Failed to update metadata'));
    };

    getRequest.onerror = () => {
      reject(new Error(`Failed to get model: ${getRequest.error?.message}`));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Format size in bytes to human-readable string
 * 
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
function formatSize(bytes) {
  if (!bytes) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  
  return `${value.toFixed(i > 0 ? 2 : 0)} ${units[i]}`;
}

/**
 * Request persistent storage permission
 * Useful for preventing browser cleanup of cached models
 * 
 * @returns {Promise<boolean>} True if persistence was granted
 */
export async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    return await navigator.storage.persist();
  }
  return false;
}

// Export default with all functions
export default {
  openDB,
  saveModelToCache,
  getCachedModel,
  getAllCachedModels,
  deleteCachedModel,
  clearAllCachedModels,
  downloadModel,
  downloadAndCacheModel,
  getTotalCacheSize,
  getStorageQuota,
  isModelCached,
  updateModelMetadata,
  requestPersistentStorage
};
