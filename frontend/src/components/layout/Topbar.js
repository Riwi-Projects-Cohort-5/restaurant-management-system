/**
 * Topbar Component
 * Horizontal top bar with title, search, and actions
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} [props.onSearch] - Search callback name
 * @param {boolean} [props.hasNotifications] - Show notification dot
 * @returns {string} HTML string
 */

/**
 * Render the Topbar HTML
 * @param {Object} props
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    title = 'Dashboard',
    hasNotifications = false
  } = props;

  return `
    <header class="flex items-center px-6 gap-4 h-16 bg-brand-50 border-b-2 border-brand-300"
            id="appTopbar">

      <!-- Page title -->
      <h1 class="text-lg font-bold font-display text-brand-800 mr-auto">
        ${title}
      </h1>

      <!-- Search bar -->
      <div class="relative flex items-center">
        <input type="text"
               id="topbarSearch"
               class="w-60 h-9 pl-9 pr-4 text-sm font-normal leading-normal text-neutral-900
                      bg-white border border-brand-300 rounded-full outline-none
                      placeholder:text-neutral-400
                      focus:border-brand-500 focus:shadow-[var(--ring-brand)]
                      hover:not-focus:border-brand-400
                      transition-colors duration-fast"
               placeholder="Search..."
               aria-label="Search">
        <i data-lucide="search" class="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none"></i>
      </div>

      <!-- Divider -->
      <div class="w-px h-6 bg-brand-300" aria-hidden="true"></div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2">

        <!-- Notifications -->
        <button class="topbar-btn relative flex items-center justify-center w-9 h-9
                       bg-white border border-brand-300 rounded-full
                       text-neutral-600 hover:text-brand-700 hover:border-brand-400
                       transition-colors duration-fast"
                aria-label="Notifications">
          <i data-lucide="bell" class="w-4 h-4"></i>
          ${hasNotifications ? '<span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-error-500 rounded-full border-2 border-brand-50"></span>' : ''}
        </button>

        <!-- Settings -->
        <button class="topbar-btn relative flex items-center justify-center w-9 h-9
                       bg-white border border-brand-300 rounded-full
                       text-neutral-600 hover:text-brand-700 hover:border-brand-400
                       transition-colors duration-fast"
                aria-label="Settings">
          <i data-lucide="settings" class="w-4 h-4"></i>
        </button>

      </div>

    </header>
  `;
}

/**
 * Initialize Topbar interactivity
 * Handles search input and button actions
 */
export function init() {
  const searchInput = document.getElementById('topbarSearch');
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          document.dispatchEvent(new CustomEvent('app:search', {
            detail: { query }
          }));
        }
      }
    });
  }

  const settingsBtn = document.querySelector('#appTopbar .topbar-btn[aria-label="Settings"]');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', function () {
      document.dispatchEvent(new CustomEvent('app:navigate', {
        detail: { view: 'settings' }
      }));
    });
  }
}

/**
 * Cleanup Topbar
 */
export function destroy() {
  // Cleanup handled by AppShell
}

// Default export
export default { render, init, destroy };
