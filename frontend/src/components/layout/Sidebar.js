/**
 * Sidebar Component
 * Vertical navigation with sections, items, and user footer
 *
 * @param {Object} props
 * @param {string} props.activeView - Currently active view ID
 * @param {Array}  props.navItems - [{id, label, icon, badge?, section}]
 * @param {string} props.userInitials - User initials
 * @param {string} props.userName - User name
 * @param {string} props.userRole - User role
 * @returns {string} HTML string
 */

/**
 * Render the Sidebar HTML
 * @param {Object} props
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    activeView = 'dashboard',
    navItems = [],
    userInitials = 'JD',
    userName = 'John Doe',
    userRole = 'Manager'
  } = props;

  const sections = groupBySection(navItems);

  return `
    <aside class="grid-row-[1/-1] flex flex-col bg-brand-500 text-white h-screen overflow-hidden"
           id="appSidebar">

      <!-- Logo header -->
      <div class="flex items-center gap-3 px-5 h-16 border-b border-white/15 shrink-0">
        <img src="/src/assets/logos/logo-01.png" alt="El Fogón" class="h-8 w-auto object-contain" draggable="false">
        <span class="text-lg font-semibold tracking-tight font-display">El Fogón</span>
      </div>

      <!-- Navigation sections -->
      <nav class="flex-1 overflow-y-auto py-4 px-3" id="sidebarNav">
        ${sections.map(function (section) {
          return `
          <div class="mb-6">
            <h3 class="px-3 mb-2 text-2xs font-semibold uppercase tracking-widest text-white/50">
              ${section.label}
            </h3>
            <ul class="flex flex-col gap-1">
              ${section.items.map(function (item) {
                const isActive = item.id === activeView;
                return `
                <li>
                  <a href="#"
                     class="nav-item group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                            text-sm font-medium leading-normal no-underline
                            transition-colors duration-fast
                            ${isActive
                              ? 'bg-white text-brand-700'
                              : 'text-white hover:bg-white/15'
                            }"
                     data-view="${item.id}"
                     aria-current="${isActive ? 'page' : 'false'}">

                    <!-- Active indicator bar -->
                    ${isActive ? '<span class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-400 rounded-r-full"></span>' : ''}

                    <!-- Icon -->
                    <i data-lucide="${item.icon}" class="w-5 h-5 shrink-0
                       ${isActive ? 'text-brand-600' : 'text-white/70 group-hover:text-white'}"></i>

                    <!-- Label -->
                    <span class="flex-1">${item.label}</span>

                    <!-- Badge -->
                    ${item.badge ? `
                    <span class="flex items-center justify-center min-w-5 h-5 px-1.5
                                 bg-accent-400 text-brand-900 text-2xs font-bold rounded-full">
                      ${item.badge}
                    </span>
                    ` : ''}
                  </a>
                </li>
                `;
              }).join('')}
            </ul>
          </div>
          `;
        }).join('')}
      </nav>

      <!-- User footer -->
      <div class="shrink-0 border-t border-white/15 px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-9 h-9 rounded-full
                      bg-white/20 text-white text-sm font-semibold shrink-0">
            ${userInitials}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate leading-tight">${userName}</p>
            <p class="text-xs text-white/50 truncate leading-tight">${userRole}</p>
          </div>
          <button class="sidebar-logout flex items-center justify-center w-8 h-8 rounded-lg
                         text-white/50 hover:text-white hover:bg-white/15
                         transition-colors duration-fast"
                  title="Sign out"
                  aria-label="Sign out">
            <i data-lucide="log-out" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

    </aside>
  `;
}

/**
 * Initialize Sidebar interactivity
 * Handles nav item clicks and logout
 */
export function init() {
  const navItems = document.querySelectorAll('#appSidebar .nav-item');

  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const viewId = item.getAttribute('data-view');

      // Update active state
      navItems.forEach(function (el) {
        el.classList.remove('bg-white', 'text-brand-700');
        el.classList.add('text-white');
        const existingBar = el.querySelector('.absolute');
        if (existingBar) existingBar.remove();
      });

      item.classList.add('bg-white', 'text-brand-700');
      item.classList.remove('text-white');

      // Dispatch navigation event
      if (viewId) {
        document.dispatchEvent(new CustomEvent('app:navigate', {
          detail: { view: viewId }
        }));
      }
    });
  });

  // Logout button
  const logoutBtn = document.querySelector('#appSidebar .sidebar-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      document.dispatchEvent(new CustomEvent('app:logout'));
    });
  }
}

/**
 * Cleanup Sidebar
 */
export function destroy() {
  // Cleanup handled by AppShell
}

/**
 * Group nav items by section
 * @param {Array} items
 * @returns {Array} [{label, items}]
 */
function groupBySection(items) {
  const map = {};

  items.forEach(function (item) {
    const section = item.section || 'General';
    if (!map[section]) {
      map[section] = { label: section, items: [] };
    }
    map[section].items.push(item);
  });

  return Object.values(map);
}

// Default export
export default { render, init, destroy };
