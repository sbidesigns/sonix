/**
 * SONIX Components - HTML Component Factories
 * Returns HTML strings for common UI components
 * Works with CSS classes defined in components.css
 */

// ===== BUTTON COMPONENT =====

/**
 * Create a button element or HTML string
 * @param {Object} props - Button properties
 * @param {string} props.label - Button text
 * @param {string} [props.variant='primary'] - Style variant (primary, secondary, ghost, danger, outline, success)
 * @param {string} [props.size='md'] - Size (xs, sm, md, lg, xl)
 * @param {string} [props.icon] - Icon name (from ICONS)
 * @param {string} [props.iconPosition='left'] - Icon position (left, right)
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.type='button'] - Button type
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Function|string} [props.onClick] - Click handler or inline JS
 * @param {string} [props.id] - Element ID
 * @param {string} [props.title] - Title attribute
 * @returns {string} HTML string
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  id,
  title,
  fullWidth = false
} = {}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');
  
  const attrs = [
    `class="${classes}"`,
    type ? `type="${type}"` : '',
    disabled ? 'disabled' : '',
    id ? `id="${id}"` : '',
    title ? `title="${title}"` : '',
    onClick && typeof onClick === 'function' ? '' : (onClick ? `onclick="${onClick}"` : '')
  ].filter(Boolean).join(' ');
  
  const iconHtml = icon ? `<span class="btn-icon-wrapper">${getIconSvg(icon, 18)}</span>` : '';
  const labelHtml = label || '';
  
  return `<button ${attrs}>${iconPosition === 'left' ? iconHtml + labelHtml : labelHtml + iconHtml}</button>`;
}

// ===== CARD COMPONENT =====

/**
 * Create a card component
 * @param {Object} props - Card properties
 * @param {string} [props.title] - Card title
 * @param {string} [props.description] - Card description
 * @param {string} [props.children] - Card body content (HTML)
 * @param {Array} [props.actions] - Footer action buttons (HTML strings)
 * @param {string} [props.icon] - Header icon name
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.variant='default'] - Card variant (default, flat, glass, elevated, interactive)
 * @param {string} [props.id] - Card ID
 * @returns {string} HTML string
 */
export function Card({
  title,
  description,
  children,
  actions,
  icon,
  className = '',
  variant = 'default',
  id
} = {}) {
  const cardClasses = [
    'card',
    variant !== 'default' ? `card-${variant}` : '',
    className
  ].filter(Boolean).join(' ');
  
  let headerHtml = '';
  if (title) {
    headerHtml = `
      <div class="card-header">
        <div class="flex items-center gap-3">
          ${icon ? getIconSvg(icon, 20, 'text-accent') : ''}
          <div>
            <h3>${escapeHtml(title)}</h3>
            ${description ? `<p class="text-sm text-secondary m-0">${escapeHtml(description)}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  let footerHtml = '';
  if (actions && actions.length > 0) {
    footerHtml = `
      <div class="card-footer">
        ${actions.join('\n        ')}
      </div>
    `;
  }
  
  return `
    <div class="${cardClasses}"${id ? ` id="${id}"` : ''}>
      ${headerHtml}
      ${children ? `<div class="card-body">\n        ${children}\n      </div>` : ''}
      ${footerHtml}
    </div>
  `;
}

// ===== INPUT COMPONENT =====

/**
 * Create a form input with optional label
 * @param {Object} props - Input properties
 * @param {string} [props.label] - Field label
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.value] - Initial value
 * @param {string} [props.name] - Input name attribute
 * @param {string} [props.id] - Input ID
 * @param {Function|string} [props.onChange] - Change handler
 * @param {string} [props.error] - Error message
 * @param {string} [props.hint] - Hint text below input
 * @param {boolean} [props.required=false] - Required field
 * @param {string} [props.icon] - Icon inside input
 * @param {string} [props.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Input({
  label,
  type = 'text',
  placeholder,
  value = '',
  name,
  id,
  onChange,
  error,
  hint,
  required = false,
  icon,
  className = ''
} = {}) {
  const inputId = id || `input-${generateId()}`;
  const errorClass = error ? 'input-error' : '';
  const inputClasses = ['input', errorClass, className].filter(Boolean).join(' ');
  
  const attrs = [
    `class="${inputClasses}"`,
    `type="${type}"`,
    placeholder ? `placeholder="${placeholder}"` : '',
    value !== undefined ? `value="${value}"` : '',
    name ? `name="${name}"` : '',
    `id="${inputId}"`,
    required ? 'required' : '',
    onChange && typeof onChange === 'function' ? '' : (onChange ? `onchange="${onChange}"` : '')
  ].filter(Boolean).join(' ');
  
  return `
    <div class="form-group">
      ${label ? `<label class="form-label${required ? ' required' : ''}" for="${inputId}">${escapeHtml(label)}</label>` : ''}
      ${icon ? `
        <div class="input-icon-wrapper">
          <span class="input-icon">${getIconSvg(icon, 16)}</span>
          <input ${attrs} />
        </div>
      ` : `<input ${attrs} />`}
      ${error ? `<p class="error-message">${escapeHtml(error)}</p>` : ''}
      ${hint ? `<p class="form-hint">${escapeHtml(hint)}</p>` : ''}
    </div>
  `;
}

// ===== BADGE COMPONENT =====

/**
 * Create a badge component
 * @param {Object} props - Badge properties
 * @param {string} props.label - Badge text
 * @param {string} [props.variant='default'] - Variant (default, success, warning, error, info, primary)
 * @param {boolean} [props.dot=false] - Show dot indicator
 * @param {string} [props.icon] - Icon before text
 * @param {string} [props.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Badge({
  label,
  variant = 'default',
  dot = false,
  icon,
  className = ''
} = {}) {
  const classes = [
    'badge',
    variant !== 'default' ? `badge-${variant}` : '',
    className
  ].filter(Boolean).join(' ');
  
  const dotHtml = dot ? '<span class="badge-dot"></span>' : '';
  const iconHtml = icon ? getIconSvg(icon, 12) : '';
  
  return `<span class="${classes}">${dotHtml}${iconHtml}${escapeHtml(label)}</span>`;
}

// ===== PROGRESS BAR COMPONENT =====

/**
 * Create a progress bar
 * @param {Object} props - Progress properties
 * @param {number} props.value - Current value
 * @param {number} [props.max=100] - Maximum value
 * @param {boolean} [props.showLabel=true] - Show percentage label
 * @param {string} [props.size='md'] - Size (sm, md, lg, xl)
 * @param {string} [props.variant='primary'] - Color variant (primary, success, warning, error)
 * @param {boolean} [props.indeterminate=false] - Indeterminate animation
 * @param {string} [props.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Progress({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  variant = 'primary',
  indeterminate = false,
  className = ''
} = {}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const barClasses = [
    'progress-bar',
    size !== 'md' ? `progress-${size}` : '',
    indeterminate ? 'progress-indeterminate' : '',
    className
  ].filter(Boolean).join(' ');
  
  const fillClasses = [
    'progress-fill',
    variant !== 'primary' ? variant : ''
  ].filter(Boolean).join(' ');
  
  return `
    <div class="${barClasses}">
      ${showLabel ? `
        <div class="progress-label">
          <span class="progress-value">${Math.round(percentage)}%</span>
          <span class="progress-max">of ${max}</span>
        </div>
      ` : ''}
      <div class="${fillClasses}" style="width: ${indeterminate ? '30%' : `${percentage}%`}"></div>
    </div>
  `;
}

// ===== TABS COMPONENT =====

/**
 * Create a tabbed interface
 * @param {Object} props - Tabs properties
 * @param {Array<{id: string, label: string, icon?: string}>} props.tabs - Tab definitions
 * @param {string} [props.activeTab] - Currently active tab ID
 * @param {Function|string} [props.onTabChange] - Tab change handler
 * @param {string} [props.variant='default'] - Variant (default, pills)
 * @param {string} [props.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Tabs({
  tabs = [],
  activeTab,
  onTabChange,
  variant = 'default',
  className = ''
} = {}) {
  if (!tabs.length) return '';
  
  const activeId = activeTab || tabs[0].id;
  const listClasses = [
    'tab-list',
    variant === 'pills' ? 'tab-list-pills' : ''
  ].filter(Boolean).join(' ');
  
  const tabsHtml = tabs.map(tab => {
    const isActive = tab.id === activeId;
    const tabClasses = [
      'tab',
      isActive ? 'tab-active' : ''
    ].filter(Boolean).join(' ');
    
    const iconHtml = tab.icon ? getIconSvg(tab.icon, 16) : '';
    
    return `
      <button 
        class="${tabClasses}"
        data-tab-id="${tab.id}"
        onclick="${typeof onTabChange === 'string' ? onTabChange : `window.__tabs_onChange('${tab.id}')`}"
      >
        ${iconHtml}${escapeHtml(tab.label)}
      </button>
    `;
  }).join('\n      ');
  
  // Generate panel placeholders
  const panelsHtml = tabs.map(tab => `
    <div class="tab-panel${tab.id === activeId ? ' tab-panel-active' : ''}" data-panel-id="${tab.id}"></div>
  `).join('\n    ');
  
  return `
    <div class="tabs ${className}" data-tabs-container>
      <div class="${listClasses}">
        ${tabsHtml}
      </div>
      ${panelsHtml}
    </div>
  `;
}

// ===== TABLE COMPONENT =====

/**
 * Create a data table
 * @param {Object} props - Table properties
 * @param {Array<{key: string, label: string}>} props.columns - Column definitions
 * @param {Array<Object>} [props.data=[]] - Row data
 * @param {Array<Object>} [props.actions=[]] - Action column definitions
 * @param {string} [props.emptyMessage='No data available'] - Empty state message
 * @param {boolean} [props.striped=true] - Striped rows
 * @param {boolean} [props.compact=false] - Compact mode
 * @param {string} [props.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Table({
  columns = [],
  data = [],
  actions = [],
  emptyMessage = 'No data available',
  striped = true,
  compact = false,
  className = ''
} = {}) {
  if (!columns.length) return '';
  
  const wrapperClasses = [
    'table-wrapper',
    striped ? 'table-striped' : '',
    compact ? 'table-compact' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Header row
  const headerCells = columns.map(col => 
    `<th class="table-cell table-header">${escapeHtml(col.label)}</th>`
  ).join('\n          ');
  
  if (actions.length > 0) {
    // Add empty header for actions column
    headerCells += `\n          <th class="table-cell table-header" style="width: 120px;">Actions</th>`;
  }
  
  // Data rows
  let rowsHtml = '';
  
  if (!data || data.length === 0) {
    rowsHtml = `
      <tr>
        <td class="table-cell" colspan="${columns.length + (actions.length > 0 ? 1 : 0)}" style="text-align: center; padding: 2rem;">
          <p class="text-muted mb-0">${emptyMessage}</p>
        </td>
      </tr>
    `;
  } else {
    rowsHtml = data.map(row => {
      const cells = columns.map(col => {
        const value = row[col.key];
        const formattedValue = col.render ? col.render(value, row) : escapeHtml(String(value ?? ''));
        return `<td class="table-cell">${formattedValue}</td>`;
      }).join('\n            ');
      
      let actionsCell = '';
      if (actions.length > 0) {
        const actionButtons = actions.map(action => {
          const btnClasses = [
            'btn',
            `btn-${action.variant || 'ghost'}`,
            'btn-xs'
          ].join(' ');
          
          return `
            <button 
              class="${btnClasses}"
              onclick="${typeof action.onClick === 'string' ? action.onClick : `window.__table_action('${action.key}', '${row.id || ''}')`}"
              title="${action.label || ''}"
            >
              ${action.icon ? getIconSvg(action.icon, 14) : escapeHtml(action.label || '')}
            </button>
          `;
        }).join('');
        
        actionsCell = `\n            <td class="table-cell"><div class="flex gap-1">${actionButtons}</div></td>`;
      }
      
      return `
        <tr class="table-row" data-row-id="${row.id || ''}">
          ${cells}${actionsCell}
        </tr>
      `;
    }).join('\n      ');
  }
  
  return `
    <div class="${wrapperClasses}">
      <table class="table">
        <thead>
          <tr class="table-header">
            ${headerCells}
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

// ===== TOGGLE SWITCH COMPONENT =====

/**
 * Create a toggle switch
 * @param {Object} props - Toggle properties
 * @param {boolean} [props.checked=false] - Checked state
 * @param {Function|string} [props.onChange] - Change handler
 * @param {string} [props.label] - Label text
 * @param {string} [props.name] - Input name
 * @param {string} [props.id] - Toggle ID
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Toggle({
  checked = false,
  onChange,
  label,
  name,
  id,
  disabled = false,
  className = ''
} = {}) {
  const toggleId = id || `toggle-${generateId()}`;
  
  return `
    <label class="toggle ${className}">
      <input 
        type="checkbox" 
        class="toggle-input"
        id="${toggleId}"
        ${name ? `name="${name}"` : ''}
        ${checked ? 'checked' : ''}
        ${disabled ? 'disabled' : ''}
        onchange="${typeof onChange === 'string' ? onChange : `window.__toggle_change('${toggleId}', this.checked)`}"
      />
      <span class="toggle-track">
        <span class="toggle-thumb"></span>
      </span>
      ${label ? `<span class="toggle-label">${escapeHtml(label)}</span>` : ''}
    </label>
  `;
}

// ===== SPINNER COMPONENT =====

/**
 * Create a loading spinner
 * @param {Object} props - Spinner properties
 * @param {string} [props.size='md'] - Size (sm, md, lg, xl)
 * @param {string} [props.text] - Optional loading text
 * @param {string} [props.variant='spinner'] - Type (spinner, dots, pulse)
 * @param {string} [props.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Spinner({
  size = 'md',
  text,
  variant = 'spinner',
  className = ''
} = {}) {
  const spinnerClasses = [
    'spinner',
    `spinner-${size}`,
    className
  ].filter(Boolean).join(' ');
  
  let spinnerInner = '';
  
  switch (variant) {
    case 'dots':
      spinnerInner = '<div class="spinner-dots"><span></span><span></span><span></span></div>';
      break;
    case 'pulse':
      spinnerInner = '<div class="spinner-pulse"></div>';
      break;
    default:
      spinnerInner = '<div class="spinner-spinner"></div>';
  }
  
  const textHtml = text ? `<span class="spinner-text">${escapeHtml(text)}</span>` : '';
  
  return `<div class="${spinnerClasses}">${spinnerInner}${textHtml}</div>`;
}

// ===== EMPTY STATE COMPONENT =====

/**
 * Create an empty state placeholder
 * @param {Object} props - Empty state properties
 * @param {string} [props.icon] - Icon name
 * @param {string} props.title - Main heading
 * @param {string} [props.description] - Description text
 * @param {string} [props.action] - Action button HTML
 * @param {string} [props.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
} = {}) {
  const iconHtml = icon ? `
    <div class="empty-state-icon">
      ${getIconSvg(icon, 32)}
    </div>
  ` : '';
  
  const actionHtml = action ? `<div class="empty-state-action">${action}</div>` : '';
  
  return `
    <div class="empty-state ${className}">
      ${iconHtml}
      <h3 class="empty-state-title">${escapeHtml(title)}</h3>
      ${description ? `<p class="empty-state-description">${escapeHtml(description)}</p>` : ''}
      ${actionHtml}
    </div>
  `;
}

// ===== HELPER FUNCTIONS =====

let idCounter = 0;

/**
 * Generate unique ID for elements
 * @returns {string} Unique ID
 */
function generateId() {
  return `comp-${++idCounter}-${Date.now().toString(36)}`;
}

/**
 * Get SVG icon markup by name
 * @param {string} name - Icon name
 * @param {number} [size=24] - Icon size
 * @param {string} [className=''] - Additional classes
 * @returns {string} SVG HTML string
 */
function getIconSvg(name, size = 24, className = '') {
  // Import icons dynamically or use simple path set
  const iconPaths = {
    Music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    Play: '<polygon points="5 3 19 12 5 21 5 3"/>',
    Pause: '<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>',
    Stop: '<rect width="16" height="16" x="4" y="4" rx="2"/>',
    Download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    Trash2: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    Edit: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
    Eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    Heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    Star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    Search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    Filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    Settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    User: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/>',
    Zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    Sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
    CheckCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    XCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    AlertTriangle: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
    Info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    RefreshCw: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    HardDrive: '<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',
    Cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="4" height="4" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
    Volume2: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    VolumeX: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/>',
    Moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    Sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    Plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    Minus: '<path d="M5 12h14"/>',
    Clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    Gauge: '<path d="m12 14 4-4"/><path d="M3.5 5.5 6 8"/><path d="m2 12 3.5 0"/><path d="m3.5 18.5 2.5-2.5"/><path d="m17 18.5 2.5-2.5"/><path d="m22 12-3.5 0"/><path d="m20.5 5.5-2.5 2.5"/><circle cx="12" cy="12" r="3"/>',
    Package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    ChevronDown: '<path d="m6 9 6 6 6-6"/>',
    ChevronUp: '<path d="m18 15-6-6-6 6"/>',
    ChevronLeft: '<path d="m15 18-6-6 6-6"/>',
    ChevronRight: '<path d="m9 18 6-6-6-6"/>',
    ArrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    ArrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    ExternalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    Loader2: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>'
  };
  
  const paths = iconPaths[name];
  if (!paths) return '';
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}">${paths}</svg>`;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

// Export all components as default object
const Components = {
  Button,
  Card,
  Input,
  Badge,
  Progress,
  Tabs,
  Table,
  Toggle,
  Spinner,
  EmptyState
};

export default Components;

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.SonixComponents = Components;
}
