/**
 * AppShell Component
 * Main layout wrapper with sidebar + topbar + content area
 *
 * @param {Object} props
 * @param {string} props.activeView - Current active view ID
 * @param {string} props.topbarTitle - Title for the topbar
 * @param {string} props.content - HTML content to render in the content area
 * @param {string} props.userInitials - User initials for avatar
 * @param {string} props.userName - User display name
 * @param {string} props.userRole - User role text
 * @param {Array}  props.navItems - Navigation items array
 * @returns {string} HTML string
 */

import { Sidebar } from './Sidebar.js';
import { Topbar } from './Topbar.js';

/**
 * Render the AppShell layout HTML
 * @param {Object} props
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    activeView = 'dashboard',
    topbarTitle = 'Dashboard',
    content = '',
    userInitials = 'JD',
    userName = 'John Doe',
    userRole = 'Manager',
    navItems = []
  } = props;

  return `
    <div class="grid grid-cols-[256px_1fr] grid-rows-[64px_1fr] h-screen overflow-hidden">

      <!-- Sidebar — spans full height (row 1 / -1) -->
      ${Sidebar({
        activeView,
        navItems,
        userInitials,
        userName,
        userRole
      })}

      <!-- Topbar — row 1, column 2 -->
      ${Topbar({
        title: topbarTitle
      })}

      <!-- Content area — row 2, column 2 -->
      <main class="overflow-y-auto overflow-x-hidden p-6 bg-brand-100" id="appContent">
        ${content}
      </main>

    </div>
  `;
}

/**
 * Initialize AppShell interactivity
 * Attaches navigation listeners and initializes child components
 */
export function init() {
  const navItems = document.querySelectorAll('#appSidebar .nav-item');

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const viewId = item.getAttribute('data-view');
      if (viewId) {
        document.dispatchEvent(new CustomEvent('app:navigate', {
          detail: { view: viewId }
        }));
      }
    });
  });
}

/**
 * Cleanup AppShell
 * Remove event listeners before unmounting
 */
export function destroy() {
  // Cleanup handled by router
}

// Default export for router
export default { render, init, destroy };
