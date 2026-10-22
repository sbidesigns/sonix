/**
 * SONIX Modals - Modal Dialog System
 * Flexible modal creation with confirm/alert dialogs
 */

// Close icon SVG
const CLOSE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

// Track active modal for keyboard handling
let activeModal = null;
let modalStack = [];

/**
 * Lock body scroll when modal is open
 */
function lockBodyScroll() {
  document.body.classList.add('modal-open');
}

/**
 * Unlock body scroll when all modals are closed
 */
function unlockBodyScroll() {
  if (modalStack.length === 0) {
    document.body.classList.remove('modal-open');
  }
}

/**
 * Handle escape key to close modal
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleEscapeKey(e) {
  if (e.key === 'Escape' && activeModal) {
    activeModal.close();
  }
}

/**
 * Create a custom modal dialog
 * @param {Object} options - Modal configuration
 * @param {string} [options.title] - Modal title
 * @param {string|HTMLElement} [options.content] - Modal content (HTML string or element)
 * @param {string} [options.size='md'] - Modal size (sm, md, lg, xl)
 * @param {Function} [options.onClose] - Callback when modal is closed
 * @param {Function} [options.onConfirm] - Callback when confirm button is clicked
 * @param {string} [options.confirmText='Confirm'] - Confirm button text
 * @param {string} [options.cancelText='Cancel'] - Cancel button text
 * @param {boolean} [options.showFooter=true] - Show footer with buttons
 * @param {boolean} [options.closeOnOverlay=true] - Close when clicking overlay
 * @param {boolean} [options.closable=true] - Show close button and allow closing
 * @returns {Object} Modal controller
 */
export function createModal({
  title,
  content,
  size = 'md',
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showFooter = true,
  closeOnOverlay = true,
  closable = true
} = {}) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  // Create content wrapper
  const modalContent = document.createElement('div');
  modalContent.className = `modal-content modal-${size}`;
  
  // Build header if title provided
  let headerEl = null;
  if (title !== undefined && title !== null) {
    headerEl = document.createElement('div');
    headerEl.className = 'modal-header';
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    
    headerEl.appendChild(titleEl);
    
    if (closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-close';
      closeBtn.innerHTML = CLOSE_ICON;
      closeBtn.setAttribute('aria-label', 'Close modal');
      closeBtn.addEventListener('click', () => controller.close());
      headerEl.appendChild(closeBtn);
    }
    
    modalContent.appendChild(headerEl);
  }
  
  // Build body
  const bodyEl = document.createElement('div');
  bodyEl.className = 'modal-body';
  
  if (typeof content === 'string') {
    bodyEl.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    bodyEl.appendChild(content);
  }
  
  modalContent.appendChild(bodyEl);
  
  // Build footer
  if (showFooter) {
    const footerEl = document.createElement('div');
    footerEl.className = 'modal-footer';
    
    if (onConfirm || confirmText !== 'Confirm') {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn-secondary';
      cancelBtn.textContent = cancelText;
      cancelBtn.addEventListener('click', () => controller.close());
      footerEl.appendChild(cancelBtn);
      
      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'btn btn-primary';
      confirmBtn.textContent = confirmText;
      confirmBtn.addEventListener('click', () => {
        if (!onConfirm || onConfirm() !== false) {
          controller.close();
        }
      });
      footerEl.appendChild(confirmBtn);
    } else if (closable) {
      // Just a close button if no confirm action
      const closeBtn = document.createElement('button');
      closeBtn.className = 'btn btn-secondary';
      closeBtn.textContent = cancelText || 'Close';
      closeBtn.addEventListener('click', () => controller.close());
      footerEl.appendChild(closeBtn);
    }
    
    modalContent.appendChild(footerEl);
  }
  
  overlay.appendChild(modalContent);
  
  // Controller object
  const controller = {
    _overlay: overlay,
    _isOpen: false,
    
    /**
     * Show the modal
     * @returns {Object} Controller (for chaining)
     */
    show() {
      if (this._isOpen) return this;
      
      document.body.appendChild(this._overlay);
      this._isOpen = true;
      
      // Manage stack
      modalStack.push(this);
      activeModal = this;
      
      // Lock scroll & add escape listener
      lockBodyScroll();
      document.addEventListener('keydown', handleEscapeKey);
      
      // Focus management
      setTimeout(() => {
        if (headerEl) {
          const firstFocusable = this._overlay.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (firstFocusable) firstFocusable.focus();
        }
      }, 100);
      
      return this;
    },
    
    /**
     * Close the modal
     * @returns {Object} Controller (for chaining)
     */
    close() {
      if (!this._isOpen) return this;
      
      // Animate out
      this._overlay.style.opacity = '0';
      this._overlay.querySelector('.modal-content').style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        if (this._overlay.parentNode) {
          this._overlay.parentNode.removeChild(this._overlay);
        }
        
        this._isOpen = false;
        
        // Update stack
        const index = modalStack.indexOf(this);
        if (index > -1) {
          modalStack.splice(index, 1);
        }
        
        activeModal = modalStack.length > 0 ? modalStack[modalStack.length - 1] : null;
        
        // Cleanup
        unlockBodyScroll();
        
        if (modalStack.length === 0) {
          document.removeEventListener('keydown', handleEscapeKey);
        }
        
        // Call callback
        if (onClose) onClose();
        
        // Reset styles
        this._overlay.style.opacity = '';
        if (this._overlay.querySelector('.modal-content')) {
          this._overlay.querySelector('.modal-content').style.transform = '';
        }
      }, 200);
      
      return this;
    },
    
    /**
     * Check if modal is open
     * @returns {boolean}
     */
    isOpen() {
      return this._isOpen;
    },
    
    /**
     * Get the modal element
     * @returns {HTMLElement}
     */
    getElement() {
      return this._overlay;
    },
    
    /**
     * Get the body element for dynamic content updates
     * @returns {HTMLElement}
     */
    getBody() {
      return bodyEl;
    },
    
    /**
     * Update modal content
     * @param {string|HTMLElement} newContent - New content
     */
    setContent(newContent) {
      if (typeof newContent === 'string') {
        bodyEl.innerHTML = newContent;
      } else if (newContent instanceof HTMLElement) {
        bodyEl.innerHTML = '';
        bodyEl.appendChild(newContent);
      }
    },
    
    /**
     * Destroy the modal completely
     */
    destroy() {
      this.close();
      // Clean up references after close animation
      setTimeout(() => {
        this._overlay = null;
      }, 250);
    }
  };
  
  // Handle overlay click to close
  if (closeOnOverlay && closable) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        controller.close();
      }
    });
  }
  
  // Auto-show
  controller.show();
  
  return controller;
}

/**
 * Show a confirmation dialog
 * @param {string} message - Confirmation message
 * @param {Object} [options={}] - Additional options
 * @param {string} [options.title='Confirm'] - Dialog title
 * @param {string} [options.confirmText='Confirm'] - Confirm button text
 * @param {string} [options.cancelText='Cancel'] - Cancel button text
 * @param {string} [options.variant='primary'] - Button variant (primary, danger)
 * @returns {Promise<boolean>} Resolves to true if confirmed, false otherwise
 */
export function confirmDialog(message, options = {}) {
  return new Promise((resolve) => {
    const {
      title = 'Confirm',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      variant = 'primary'
    } = options;
    
    const modal = createModal({
      title,
      content: `<p style="margin: 0; color: var(--text-secondary);">${escapeHtml(message)}</p>`,
      size: 'sm',
      showFooter: true,
      closable: true,
      confirmText,
      cancelText,
      onConfirm: () => resolve(true),
      onClose: () => resolve(false)
    });
    
    // Style the confirm button based on variant
    setTimeout(() => {
      const confirmBtn = modal.getElement().querySelector('.btn-primary');
      if (confirmBtn && variant === 'danger') {
        confirmBtn.className = 'btn btn-danger';
      }
    }, 0);
  });
}

/**
 * Show an alert dialog
 * @param {string} message - Alert message
 * @param {Object} [options={}] - Additional options
 * @param {string} [options.title='Notice'] - Dialog title
 * @param {string} [options.buttonText='OK'] - Button text
 * @param {string} [options.type='info'] - Type (info, success, warning, error)
 * @returns {Promise<void>} Resolves when dismissed
 */
export function alertDialog(message, options = {}) {
  return new Promise((resolve) => {
    const {
      title = 'Notice',
      buttonText = 'OK',
      type = 'info'
    } = options;
    
    // Icon based on type
    const icons = {
      info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
      success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
      warning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
      error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>'
    };
    
    const iconHtml = icons[type] || icons.info;
    
    const content = `
      <div style="display: flex; align-items: flex-start; gap: 1rem;">
        <div style="flex-shrink: 0;">${iconHtml}</div>
        <p style="margin: 0; color: var(--text-secondary);">${escapeHtml(message)}</p>
      </div>
    `;
    
    const modal = createModal({
      title,
      content,
      size: 'sm',
      showFooter: true,
      closable: true,
      confirmText: buttonText,
      cancelText: '',
      onClose: () => resolve()
    });
    
    // Hide cancel button for alert-style dialogs
    setTimeout(() => {
      const buttons = modal.getElement().querySelectorAll('.modal-footer .btn');
      if (buttons.length > 1) {
        buttons[0].style.display = 'none'; // Hide cancel
      }
    }, 0);
  });
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

// Export default as createModal
export default createModal;

// Attach to window for global access (optional)
if (typeof window !== 'undefined') {
  window.Modal = { createModal, confirmDialog, alertDialog };
}
