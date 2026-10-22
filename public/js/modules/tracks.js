/**
 * Tracks Module - Track library with table/list view, search, filters, pagination
 * Manages user's generated music tracks collection
 * @module TracksModule
 */

export const TracksModule = {
  // State management
  _state: {
    tracks: [],
    filteredTracks: [],
    currentPage: 1,
    perPage: 20,
    searchQuery: '',
    genreFilter: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    viewMode: 'table', // 'table' or 'grid'
    selectedIds: new Set(),
    isLoading: false,
    callbacks: {},
    eventListeners: []
  },

  // Genre options for filter
  genreOptions: [
    { value: '', label: 'All Genres' },
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' },
    { value: 'hiphop', label: 'Hip-Hop' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'classical', label: 'Classical' },
    { value: 'ambient', label: 'Ambient' },
    { value: 'lofi', label: 'Lo-Fi' },
    { value: 'rnb', label: 'R&B' },
    { value: 'country', label: 'Country' },
    { value: 'other', label: 'Other' }
  ],

  // Sort options
  sortOptions: [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'duration', label: 'Duration' },
    { value: 'genre', label: 'Genre' }
  ],

  /**
   * Render the tracks module
   * @param {Object} options - Configuration options
   * @returns {string} Complete tracks HTML
   */
  renderTracks(options = {}) {
    this._state.tracks = options.tracks || [];
    this._state.filteredTracks = [...this._state.tracks];
    this._applyFilters();

    return `
      <div class="tracks-container" id="tracks-root">
        ${this._renderToolbar()}
        ${this._state.filteredTracks.length > 0 ? this._renderContent() : this._renderEmptyState()}
        ${this._state.filteredTracks.length > 0 ? this._renderPagination() : ''}
      </div>
    `;
  },

  /**
   * Render toolbar with search, filters, and view toggle
   * @private
   */
  _renderToolbar() {
    const { searchQuery, genreFilter, viewMode } = this._state;

    return `
      <div class="tracks-toolbar">
        <div class="toolbar-left">
          <div class="search-box">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              id="tracks-search" 
              class="search-input" 
              placeholder="Search tracks by title, genre..."
              value="${this._escapeHtml(searchQuery)}"
            >
            ${searchQuery ? '<button class="clear-search" id="clear-search-btn">×</button>' : ''}
          </div>
          
          <div class="filter-dropdown">
            <select id="tracks-genre-filter" class="filter-select">
              ${this.genreOptions.map(g => `
                <option value="${g.value}" ${g.value === genreFilter ? 'selected' : ''}>${g.label}</option>
              `).join('')}
            </select>
          </div>

          <div class="sort-dropdown">
            <select id="tracks-sort" class="filter-select">
              ${this.sortOptions.map(s => `
                <option value="${s.value}" ${s.value === this._state.sortBy ? 'selected' : ''}>${s.label}</option>
              `).join('')}
            </select>
            <button class="sort-order-btn" id="sort-order-btn" title="Toggle sort order">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${this._state.sortOrder === 'desc' 
                  ? '<path d="M12 5v14M19 12l-7 7-7-7"/>' 
                  : '<path d="M12 19V5M5 12l7-7 7 7"/>'}
              </svg>
            </button>
          </div>
        </div>

        <div class="toolbar-right">
          <span class="tracks-count">${this._state.filteredTracks.length} tracks</span>
          
          <div class="view-toggle">
            <button class="view-btn ${viewMode === 'table' ? 'active' : ''}" data-view="table" title="Table View">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
            </button>
            <button class="view-btn ${viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="Grid View">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
          </div>

          ${this._state.selectedIds.size > 0 ? `
            <div class="bulk-actions">
              <span class="selected-count">${this._state.selectedIds.size} selected</span>
              <button class="bulk-btn bulk-download" id="bulk-download-btn" title="Download Selected">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download
              </button>
              <button class="bulk-btn bulk-delete danger" id="bulk-delete-btn" title="Delete Selected">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                Delete
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render main content area (table or grid)
   * @private
   */
  _renderContent() {
    const paginatedTracks = this._getPaginatedTracks();
    
    if (this._state.viewMode === 'grid') {
      return this._renderGridView(paginatedTracks);
    }
    return this._renderTableView(paginatedTracks);
  },

  /**
   * Render table view
   * @private
   */
  _renderTableView(tracks) {
    return `
      <div class="tracks-table-wrapper">
        <table class="tracks-table">
          <thead>
            <tr>
              <th class="col-checkbox">
                <input type="checkbox" id="select-all-checkbox" ${this._isAllSelected() ? 'checked' : ''}>
              </th>
              <th class="col-title">Title</th>
              <th class="col-genre">Genre</th>
              <th class="col-duration">Duration</th>
              <th class="col-created">Created</th>
              <th class="col-status">Status</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tracks.map(track => this._renderTableRow(track)).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  /**
   * Render single table row
   * @private
   */
  _renderTableRow(track) {
    const isSelected = this._state.selectedIds.has(track.id);
    const genreColors = {
      pop: '#ec4899', rock: '#ef4444', jazz: '#f59e0b', electronic: '#8b5cf6',
      hiphop: '#10b981', classical: '#6366f1', ambient: '#06b6d4', lofi: '#84cc16',
      rnb: '#f97316', country: '#eab308'
    };
    const genreColor = genreColors[(track.genre || '').toLowerCase()] || '#6b7280';

    return `
      <tr class="track-row ${isSelected ? 'selected' : ''}" data-track-id="${track.id}">
        <td class="col-checkbox">
          <input type="checkbox" class="row-checkbox" data-track-id="${track.id}" ${isSelected ? 'checked' : ''}>
        </td>
        <td class="col-title">
          <div class="title-cell">
            <div class="track-thumbnail" style="--genre-color: ${genreColor}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
            <div class="title-info">
              <span class="title-text">${this._escapeHtml(track.title || 'Untitled Track')}</span>
              ${track.isFavorite ? '<span class="favorite-badge">★</span>' : ''}
            </div>
          </div>
        </td>
        <td class="col-genre">
          <span class="genre-tag" style="color: ${genreColor}; background: ${genreColor}20">
            ${this._escapeHtml(track.genre || 'Unknown')}
          </span>
        </td>
        <td class="col-duration">${this._formatDuration(track.duration)}</td>
        <td class="col-created">
          <span class="date-full">${this._formatFullDate(track.createdAt)}</span>
          <span class="date-relative">${this._formatRelativeDate(track.createdAt)}</span>
        </td>
        <td class="col-status">
          <span class="status-badge status-${(track.status || 'ready').toLowerCase()}">
            ${this._capitalize(track.status || 'Ready')}
          </span>
        </td>
        <td class="col-actions">
          <div class="action-buttons">
            <button class="action-btn play-btn" data-action="play" data-track-id="${track.id}" title="Play Preview">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
            <button class="action-btn favorite-btn ${track.isFavorite ? 'favorited' : ''}" data-action="favorite" data-track-id="${track.id}" title="${track.isFavorite ? 'Unfavorite' : 'Favorite'}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${track.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
            <button class="action-btn download-btn" data-action="download" data-track-id="${track.id}" title="Download">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </button>
            <button class="action-btn more-btn" data-action="more" data-track-id="${track.id}" title="More Options">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            <button class="action-btn delete-btn danger" data-action="delete" data-track-id="${track.id}" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  },

  /**
   * Render grid view
   * @private
   */
  _renderGridView(tracks) {
    const genreColors = {
      pop: '#ec4899', rock: '#ef4444', jazz: '#f59e0b', electronic: '#8b5cf6',
      hiphop: '#10b981', classical: '#6366f1', ambient: '#06b6d4', lofi: '#84cc16'
    };

    return `
      <div class="tracks-grid-view">
        ${tracks.map(track => {
          const genreColor = genreColors[(track.genre || '').toLowerCase()] || '#6b7280';
          return `
            <article class="track-card ${this._state.selectedIds.has(track.id) ? 'selected' : ''}" data-track-id="${track.id}">
              <div class="card-checkbox">
                <input type="checkbox" class="row-checkbox" data-track-id="${track.id}" ${this._state.selectedIds.has(track.id) ? 'checked' : ''}>
              </div>
              <div class="card-artwork" style="--genre-color: ${genreColor}">
                <div class="artwork-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                </div>
                <button class="play-overlay" data-action="play" data-track-id="${track.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
                ${track.isFavorite ? '<span class="favorite-indicator">★</span>' : ''}
              </div>
              <div class="card-body">
                <h3 class="card-title">${this._escapeHtml(track.title || 'Untitled Track')}</h3>
                <span class="card-genre" style="color: ${genreColor}">${this._escapeHtml(track.genre || 'Unknown')}</span>
                <div class="card-meta">
                  <span class="meta-duration">${this._formatDuration(track.duration)}</span>
                  <span class="meta-date">${this._formatRelativeDate(track.createdAt)}</span>
                </div>
              </div>
              <div class="card-actions">
                <button class="card-action-btn" data-action="favorite" data-track-id="${track.id}" title="Favorite">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${track.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
                <button class="card-action-btn" data-action="download" data-track-id="${track.id}" title="Download">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </button>
                <button class="card-action-btn danger" data-action="delete" data-track-id="${track.id}" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;
  },

  /**
   * Render empty state
   * @private
   */
  _renderEmptyState() {
    const hasTracks = this._state.tracks.length > 0;
    
    return `
      <div class="empty-state">
        <div class="empty-content">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              ${hasTracks 
                ? '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'
                : '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'}
            </svg>
          </div>
          <h3 class="empty-title">${hasTracks ? 'No matching tracks found' : 'No tracks yet'}</h3>
          <p class="empty-message">
            ${hasTracks 
              ? 'Try adjusting your search or filter criteria'
              : 'Your generated tracks will appear here. Start creating music!'}
          </p>
          ${!hasTracks ? `
            <button class="empty-action-btn" id="empty-create-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              Create Your First Track
            </button>
          ` : ''}
          ${hasTracks ? `
            <button class="empty-action-btn secondary" id="clear-filters-btn">
              Clear Filters
            </button>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render pagination controls
   * @private
   */
  _renderPagination() {
    const totalPages = this._getTotalPages();
    const currentPage = this._state.currentPage;
    
    if (totalPages <= 1) return '';

    const pages = this._getPageNumbers();
    
    return `
      <div class="pagination">
        <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          Previous
        </button>
        
        <div class="page-numbers">
          ${pages.map(page => {
            if (page === '...') {
              return '<span class="page-ellipsis">...</span>';
            }
            return `<button class="page-num ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`;
          }).join('')}
        </div>
        
        <button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        
        <div class="page-info">
          Page ${currentPage} of ${totalPages}
        </div>
      </div>
    `;
  },

  /**
   * Initialize tracks module with event handlers
   * @param {Object} callbacks - Callback functions
   * @param {Function} callbacks.onPlay - Play preview callback
   * @param {Function} callbacks.onFavorite - Toggle favorite callback
   * @param {Function} callbacks.onDownload - Download callback
   * @param {Function} callbacks.onDelete - Delete callback
   * @param {Function} callbacks.onCreateNew - Create new track callback
   */
  initTracks(callbacks = {}) {
    this._state.callbacks = callbacks;
    this._destroyEvents();
    this._attachEvents();
  },

  /**
   * Attach all event listeners
   * @private
   */
  _attachEvents() {
    const root = document.getElementById('tracks-root');
    if (!root) return;

    // Search input
    const searchInput = root.querySelector('#tracks-search');
    if (searchInput) {
      let debounceTimer;
      const handler = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this._state.searchQuery = searchInput.value;
          this._applyFiltersAndUpdate();
        }, 300);
      };
      searchInput.addEventListener('input', handler);
      this._state.eventListeners.push({ element: searchInput, event: 'input', handler });
    }

    // Clear search button
    const clearSearchBtn = root.querySelector('#clear-search-btn');
    if (clearSearchBtn) {
      const handler = () => {
        const searchInput = root.querySelector('#tracks-search');
        if (searchInput) {
          searchInput.value = '';
          this._state.searchQuery = '';
          this._applyFiltersAndUpdate();
        }
      };
      clearSearchBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: clearSearchBtn, event: 'click', handler });
    }

    // Genre filter
    const genreFilter = root.querySelector('#tracks-genre-filter');
    if (genreFilter) {
      const handler = () => {
        this._state.genreFilter = genreFilter.value;
        this._applyFiltersAndUpdate();
      };
      genreFilter.addEventListener('change', handler);
      this._state.eventListeners.push({ element: genreFilter, event: 'change', handler });
    }

    // Sort select
    const sortSelect = root.querySelector('#tracks-sort');
    if (sortSelect) {
      const handler = () => {
        this._state.sortBy = sortSelect.value;
        this._applyFiltersAndUpdate();
      };
      sortSelect.addEventListener('change', handler);
      this._state.eventListeners.push({ element: sortSelect, event: 'change', handler });
    }

    // Sort order toggle
    const sortOrderBtn = root.querySelector('#sort-order-btn');
    if (sortOrderBtn) {
      const handler = () => {
        this._state.sortOrder = this._state.sortOrder === 'asc' ? 'desc' : 'asc';
        this._applyFiltersAndUpdate();
      };
      sortOrderBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: sortOrderBtn, event: 'click', handler });
    }

    // View toggle buttons
    root.querySelectorAll('.view-btn').forEach(btn => {
      const handler = () => {
        this._state.viewMode = btn.dataset.view;
        this._updateView();
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Select all checkbox
    const selectAllCheckbox = root.querySelector('#select-all-checkbox');
    if (selectAllCheckbox) {
      const handler = () => {
        if (selectAllCheckbox.checked) {
          this._getPaginatedTracks().forEach(t => this._state.selectedIds.add(t.id));
        } else {
          this._state.selectedIds.clear();
        }
        this._updateView();
      };
      selectAllCheckbox.addEventListener('change', handler);
      this._state.eventListeners.push({ element: selectAllCheckbox, event: 'change', handler });
    }

    // Row checkboxes
    root.querySelectorAll('.row-checkbox').forEach(checkbox => {
      const handler = () => {
        const trackId = checkbox.dataset.trackId;
        if (checkbox.checked) {
          this._state.selectedIds.add(trackId);
        } else {
          this._state.selectedIds.delete(trackId);
        }
        this._updateToolbar();
      };
      checkbox.addEventListener('change', handler);
      this._state.eventListeners.push({ element: checkbox, event: 'change', handler });
    });

    // Action buttons (play, favorite, download, delete)
    root.querySelectorAll('[data-action]').forEach(btn => {
      const handler = (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const trackId = btn.dataset.trackId;
        this._handleAction(action, trackId);
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Pagination buttons
    root.querySelectorAll('.page-btn, .page-num').forEach(btn => {
      const handler = () => {
        const page = parseInt(btn.dataset.page);
        if (page && page !== this._state.currentPage) {
          this._state.currentPage = page;
          this._updateView();
          document.getElementById('tracks-root')?.scrollIntoView({ behavior: 'smooth' });
        }
      };
      btn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Empty state actions
    const createBtn = root.querySelector('#empty-create-btn');
    if (createBtn) {
      const handler = () => {
        if (this._state.callbacks.onCreateNew) this._state.callbacks.onCreateNew();
      };
      createBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: createBtn, event: 'click', handler });
    }

    const clearFiltersBtn = root.querySelector('#clear-filters-btn');
    if (clearFiltersBtn) {
      const handler = () => {
        this._state.searchQuery = '';
        this._state.genreFilter = '';
        this._applyFiltersAndUpdate();
      };
      clearFiltersBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: clearFiltersBtn, event: 'click', handler });
    }

    // Bulk actions
    const bulkDownloadBtn = root.querySelector('#bulk-download-btn');
    if (bulkDownloadBtn) {
      const handler = () => this._handleBulkAction('download');
      bulkDownloadBtn.addEventListener('click', handler);
      this._state.eventListeners.push({ element: bulkDownloadBtn, event: 'click', handler });
    }

    const bulkDeleteBtn = root.querySelector('#bulk-delete-btn');
    if (bulkDeleteBtn) {
      const helper = () => this._handleBulkAction('delete');
      bulkDeleteBtn.addEventListener('click', helper);
      this._state.eventListeners.push({ element: bulkDeleteBtn, event: 'click', helper });
    }
  },

  /**
   * Handle action button clicks
   * @private
   */
  _handleAction(action, trackId) {
    const callbacks = this._state.callbacks;
    
    switch (action) {
      case 'play':
        if (callbacks.onPlay) callbacks.onPlay(trackId);
        break;
      case 'favorite':
        if (callbacks.onFavorite) callbacks.onFavorite(trackId);
        break;
      case 'download':
        if (callbacks.onDownload) callbacks.onDownload(trackId);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this track?')) {
          if (callbacks.onDelete) callbacks.onDelete(trackId);
        }
        break;
      case 'more':
        // Could open a context menu or modal
        break;
    }
  },

  /**
   * Handle bulk actions
   * @private
   */
  _handleBulkAction(action) {
    const ids = Array.from(this._state.selectedIds);
    if (ids.length === 0) return;

    const callbacks = this._state.callbacks;
    
    if (action === 'download' && callbacks.onBulkDownload) {
      callbacks.onBulkDownload(ids);
    } else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${ids.length} tracks?`)) {
        if (callbacks.onBulkDelete) callbacks.onBulkDelete(ids);
      }
    }
  },

  /**
   * Apply filters and update view
   * @private
   */
  _applyFiltersAndUpdate() {
    this._state.currentPage = 1;
    this._applyFilters();
    this._updateView();
  },

  /**
   * Apply search and filter criteria
   * @private
   */
  _applyFilters() {
    let filtered = [...this._state.tracks];

    // Search filter
    if (this._state.searchQuery) {
      const query = this._state.searchQuery.toLowerCase();
      filtered = filtered.filter(track =>
        (track.title || '').toLowerCase().includes(query) ||
        (track.genre || '').toLowerCase().includes(query)
      );
    }

    // Genre filter
    if (this._state.genreFilter) {
      filtered = filtered.filter(track =>
        (track.genre || '').toLowerCase() === this._state.genreFilter.toLowerCase()
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal = a[this._state.sortBy];
      let bVal = b[this._state.sortBy];
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return this._state.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return this._state.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this._state.filteredTracks = filtered;
  },

  /**
   * Get paginated subset of tracks
   * @private
   */
  _getPaginatedTracks() {
    const start = (this._state.currentPage - 1) * this._state.perPage;
    return this._state.filteredTracks.slice(start, start + this._state.perPage);
  },

  /**
   * Get total number of pages
   * @private
   */
  _getTotalPages() {
    return Math.ceil(this._state.filteredTracks.length / this._state.perPage);
  },

  /**
   * Get page numbers for pagination display
   * @private
   */
  _getPageNumbers() {
    const totalPages = this._getTotalPages();
    const current = this._state.currentPage;
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      
      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (current < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  },

  /**
   * Check if all visible items are selected
   * @private
   */
  _isAllSelected() {
    const paginated = this._getPaginatedTracks();
    return paginated.length > 0 && paginated.every(t => this._state.selectedIds.has(t.id));
  },

  /**
   * Update only the toolbar portion
   * @private
   */
  _updateToolbar() {
    const toolbar = document.querySelector('.tracks-toolbar');
    if (toolbar) {
      toolbar.outerHTML = this._renderToolbar();
      // Re-attach toolbar events
      this._attachEvents();
    }
  },

  /**
   * Full view update
   * @private
   */
  _updateView() {
    const root = document.getElementById('tracks-root');
    if (!root) return;

    root.innerHTML = `
      ${this._renderToolbar()}
      ${this._state.filteredTracks.length > 0 ? this._renderContent() : this._renderEmptyState()}
      ${this._state.filteredTracks.length > 0 ? this._renderPagination() : ''}
    `;
    
    this._attachEvents();
  },

  /**
   * Clean up all event listeners
   * @private
   */
  _destroyEvents() {
    this._state.eventListeners.forEach(({ element, event, handler }) => {
      if (element) element.removeEventListener(event, handler);
    });
    this._state.eventListeners = [];
  },

  /**
   * Destroy tracks module
   */
  destroyTracks() {
    this._destroyEvents();
    this._state.selectedIds.clear();
    this._state.callbacks = {};
  },

  /**
   * Update tracks data
   * @param {Array} tracks - New tracks array
   */
  setTracks(tracks) {
    this._state.tracks = tracks;
    this._state.filteredTracks = [...tracks];
    this._applyFilters();
    this._updateView();
  },

  /**
   * Add a single track
   * @param {Object} track - Track object to add
   */
  addTrack(track) {
    this._state.tracks.unshift(track);
    this._applyFilters();
    this._updateView();
  },

  /**
   * Remove a track by ID
   * @param {string} trackId - Track ID to remove
   */
  removeTrack(trackId) {
    this._state.tracks = this._state.tracks.filter(t => t.id !== trackId);
    this._state.selectedIds.delete(trackId);
    this._applyFilters();
    this._updateView();
  },

  /**
   * Toggle favorite status
   * @param {string} trackId - Track ID to toggle
   */
  toggleFavorite(trackId) {
    const track = this._state.tracks.find(t => t.id === trackId);
    if (track) {
      track.isFavorite = !track.isFavorite;
      this._updateView();
    }
  },

  // Utility methods

  /** @private Escape HTML */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /** @private Format duration */
  _formatDuration(seconds) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  /** @private Format full date */
  _formatFullDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
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
    return this._formatFullDate(dateStr);
  },

  /** @private Capitalize first letter */
  _capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

// Default export
export default TracksModule;
