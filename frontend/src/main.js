/**
 * El Fogón — App Entry Point
 *
 * Router Integration Guide:
 *
 * 1. Import views:
 *    import LoginView from './views/auth/Login.js';
 *    import DashboardView from './views/dashboard/Dashboard.js';
 *
 * 2. Define routes:
 *    const routes = {
 *      '/login': LoginView,
 *      '/dashboard': DashboardView,
 *      '/': LoginView, // default
 *    };
 *
 * 3. Simple hash router implementation:
 *    function getCurrentRoute() {
 *      return window.location.hash.slice(1) || '/';
 *    }
 *
 *    function navigate(path) {
 *      window.location.hash = path;
 *    }
 *
 *    function renderRoute() {
 *      const path = getCurrentRoute();
 *      const view = routes[path];
 *      const app = document.getElementById('app');
 *
 *      if (!view) {
 *        app.innerHTML = '<h1>404</h1>';
 *        return;
 *      }
 *
 *      // Cleanup previous view
 *      if (currentView?.destroy) currentView.destroy();
 *
 *      // Render new view
 *      app.innerHTML = view.render();
 *      view.init();
 *      currentView = view;
 *    }
 *
 *    window.addEventListener('hashchange', renderRoute);
 *
 * 4. Or use History API:
 *    function navigate(path) {
 *      history.pushState(null, '', path);
 *      renderRoute();
 *    }
 *
 *    window.addEventListener('popstate', renderRoute);
 */

import LoginView from './views/auth/Login.js';

// Current view reference for cleanup
let currentView = null;

// Route definitions
const routes = {
  '/login': LoginView,
  '/': LoginView,
};

/**
 * Get current route from hash or pathname
 */
function getCurrentRoute() {
  // Use hash router for simplicity
  return window.location.hash.slice(1) || '/';
}

/**
 * Navigate to a route
 * @param {string} path - Route path
 */
function navigate(path) {
  window.location.hash = path;
}

/**
 * Render the current route
 */
function renderRoute() {
  const path = getCurrentRoute();
  const view = routes[path];
  const app = document.getElementById('app');

  if (!app) return;

  if (!view) {
    app.innerHTML = '<h1 class="text-2xl text-center mt-20">404 — Page not found</h1>';
    return;
  }

  // Cleanup previous view
  if (currentView?.destroy) {
    currentView.destroy();
  }

  // Render new view
  app.innerHTML = view.render();
  view.init();
  currentView = view;
}

// Listen for route changes
window.addEventListener('hashchange', renderRoute);

// Initial render
document.addEventListener('DOMContentLoaded', renderRoute);

// Expose navigate for use in templates
window.navigate = navigate;
