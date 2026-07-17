import { createIcons, icons } from 'lucide';
import * as authStore from './store/auth.js';
import { getHomeRoute, isRouteAllowed } from './utils/routeGuard.js';
import AppShell from './components/layout/AppShell.js';
import Dashboard from './views/dashboard/Dashboard.js';
import PosView from './views/orders/PosView.js';
import Kitchen from './views/kitchen/Kitchen.js';
import TablesView from './views/tables/Tables.js';
import LoginView from './views/auth/LoginView.js';
import RegisterView from './views/auth/RegisterView.js';
import ReservationsView from './views/reservations/ReservationsView.js';
import { initMockUsers } from './services/mockUsers.js';

initMockUsers();

window.createIcons = function () {
  createIcons({ icons });
};

var currentView = null;
var appEl = document.getElementById('app');

var routes = {
  '/login': { view: LoginView, shell: false, auth: false },
  '/register': { view: RegisterView, shell: false, auth: false },
  '/dashboard': { view: Dashboard, shell: true, auth: true },
  '/pos': { view: PosView, shell: true, auth: true },
  '/kitchen': { view: Kitchen, shell: true, auth: true },
  '/tables': { view: TablesView, shell: true, auth: true },
  '/reservations': { view: ReservationsView, shell: true, auth: true },
  '/admin': { view: PosView, shell: true, auth: true },
  '/orders': { view: PosView, shell: true, auth: true },
};

function getRoute() {
  return window.location.hash.slice(1) || '/login';
}

function destroyView() {
  if (currentView && currentView.destroy) {
    currentView.destroy();
  }
  currentView = null;
}

function renderView() {
  var path = getRoute();
  var user = authStore.currentUser();

  if (path !== '/login' && path !== '/register') {
    if (!user) {
      window.location.hash = '#/login';
      return;
    }
  }

  if (path === '/login' || path === '/register') {
    if (user) {
      var home = getHomeRoute(user.role);
      window.location.hash = '#' + home;
      return;
    }
  }

  var route = routes[path];
  if (!route) {
    if (user) {
      var defaultRoute = getHomeRoute(user.role);
      window.location.hash = '#' + defaultRoute;
    } else {
      window.location.hash = '#/login';
    }
    return;
  }

  if (route.auth && !user) {
    window.location.hash = '#/login';
    return;
  }

  if (route.shell) {
    window.currentRole = user ? user.role : 'admin';
    window.userData = user ? {
      name: user.displayName || user.username || 'Admin',
      initials: (user.displayName || user.username || 'AD').split(' ').map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2),
      role: user.role || 'admin',
    } : { name: 'Admin', initials: 'AD', role: 'admin' };
    AppShell.render(appEl);
  }

  var container = route.shell ? document.getElementById('main-content') : appEl;
  if (!container) return;

  destroyView();

  container.innerHTML = '';
  var viewEl = document.createElement('div');
  viewEl.id = 'current-view';
  container.appendChild(viewEl);

  route.view.render(viewEl);
  currentView = route.view;

  window.createIcons();

  if (route.view.init) {
    route.view.init();
  }
}

window.addEventListener('hashchange', function () {
  renderView();
});

window.navigate = function (path) {
  window.location.hash = '#' + path;
};

document.addEventListener('DOMContentLoaded', function () {
  renderView();
});
