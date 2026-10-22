/**
 * SONIX Toast - Toast Notification System
 * Lightweight, non-blocking notification system with auto-dismiss
 */

// Icon SVGs for different toast types (inline to avoid dependency)
const TOAST_ICONS = {
  success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
  warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
};

const DEFAULT_DURATION = 3000;
const MAX_TOASTS = 5;

let container = null;
let toastCount = 0;
let activeToasts = new Map();

/**
 * Initialize the toast container
 * @returns {HTMLElement} The container element
 */
function getContainer() {
  if (!container) {
    container = document.getElementById('toast-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }
  
  return container;
}

/**
 * Create a toast element
 * @param {string} message - The message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {number} duration - Duration in ms before auto-dismiss
 * @returns {Object} Toast controller object
 */
function createToastElement(message, type, duration) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  
  const id = `toast-${++toastCount}`;
  toast.id = id;
  
  // Build toast HTML
  toast.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close" aria-label="Close notification">
      ${TOAST_ICONS.close}
    </button>
  `;
  
  // Close button handler
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => dismissToast(id));
  
  return { element: toast, id };
}

/**
 * Dismiss a toast with animation
 * @param {string} id - Toast ID to dismiss
 */
function dismissToast(id) {
  const toastData = activeToasts.get(id);
  
  if (!toastData) return;
  
  const { element, timer } = toastData;
  
  // Clear auto-dismiss timer if exists
  if (timer) {
    clearTimeout(timer);
  }
  
  // Add removing class for animation
  element.classList.add('removing');
  
  // Remove after animation completes
  setTimeout(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
    activeToasts.delete(id);
  }, 300);
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} [type='info'] - Type of toast (success, error, warning, info)
 * @param {number} [duration=3000] - Duration in milliseconds before auto-dismiss
 * @returns {Object} Controller object with dismiss method
 */
function show(message, type = 'info', duration = DEFAULT_DURATION) {
  const containerEl = getContainer();
  
  // Limit number of visible toasts
  if (activeToasts.size >= MAX_TOASTS) {
    const oldestId = activeToasts.keys().next().value;
    if (oldestId) {
      dismissToast(oldestId);
    }
  }
  
  // Create toast element
  const { element, id } = createToastElement(message, type, duration);
  
  // Set up auto-dismiss timer
  let timer = null;
  if (duration > 0) {
    timer = setTimeout(() => {
      dismissToast(id);
    }, duration);
  }
  
  // Store toast data
  activeToasts.set(id, { element, timer });
  
  // Add to DOM
  containerEl.appendChild(element);
  
  // Return controller
  return {
    id,
    dismiss: () => dismissToast(id),
    updateMessage: (newMessage) => {
      const contentEl = element.querySelector('.toast-title');
      if (contentEl) {
        contentEl.textContent = newMessage;
      }
    }
  };
}

/**
 * Toast API - Main export object
 * Provides convenience methods for each toast type
 */
const Toast = {
  /**
   * Show a success toast
   * @param {string} message - Success message
   * @param {number} [duration] - Duration in ms
   * @returns {Object} Toast controller
   */
  success(message, duration) {
    return show(message, 'success', duration || DEFAULT_DURATION);
  },
  
  /**
   * Show an error toast
   * @param {string} message - Error message
   * @param {number} [duration] - Duration in ms (errors show longer by default)
   * @returns {Object} Toast controller
   */
  error(message, duration) {
    return show(message, 'error', duration || 5000);
  },
  
  /**
   * Show a warning toast
   * @param {string} message - Warning message
   * @param {number} [duration] - Duration in ms
   * @returns {Object} Toast controller
   */
  warning(message, duration) {
    return show(message, 'warning', duration || DEFAULT_DURATION);
  },
  
  /**
   * Show an info toast
   * @param {string} message - Info message
   * @param {number} [duration] - Duration in ms
   * @returns {Object} Toast controller
   */
  info(message, duration) {
    return show(message, 'info', duration || DEFAULT_DURATION);
  },
  
  /**
   * Show a custom toast with full control
   * @param {string} message - Message to display
   * @param {string} type - Toast type
   * @param {number} duration - Duration in ms
   * @returns {Object} Toast controller
   */
  show,
  
  /**
   * Dismiss all active toasts
   */
  dismissAll() {
    activeToasts.forEach((_, id) => dismissToast(id));
  },
  
  /**
   * Get count of active toasts
   * @returns {number}
   */
  getActiveCount() {
    return activeToasts.size;
  },
  
  /**
   * Destroy the toast container and clean up
   */
  destroy() {
    this.dismissAll();
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    container = null;
  }
};

// Named exports
export default Toast;
export const toast = Toast;
export { show as showToast, dismissToast };

// Also attach to window for global access (optional)
if (typeof window !== 'undefined') {
  window.Toast = Toast;
  window.toast = Toast;
}
