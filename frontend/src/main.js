import { initMockUsers } from "./services/mockUsers.js";
import * as authStore from "./store/auth.js";
import { renderLogin } from "./views/auth/login.js";
import { renderRegister } from "./views/auth/register.js";
import { renderReservations } from "./views/reservations/list.js";
import { renderReservationStatus } from "./views/reservations/status.js";
import { getHomeRoute, isRouteAllowed } from "./utils/routeGuard.js";

import Dashboard from "./views/dashboard/Dashboard.js";
import PosView from "./views/orders/PosView.js";
import KitchenView from "./views/kitchen/Kitchen.js";
import TablesView from "./views/tables/Tables.js";

initMockUsers();

const app = document.getElementById("app");
let currentView = null;

function renderView(viewModule) {
  if (currentView && currentView.destroy) {
    currentView.destroy();
  }
  currentView = viewModule;
  app.innerHTML = viewModule.render();
  viewModule.init();
}

function renderFullPage(renderFn) {
  if (currentView && currentView.destroy) {
    currentView.destroy();
    currentView = null;
  }
  renderFn(app);
}

function buildNav(user) {
  const links = [];

  links.push(`<a href="#/dashboard" class="nav-link">Dashboard</a>`);

  if (user.role === "admin" || user.role === "waiter") {
    links.push(`<a href="#/orders" class="nav-link">Orders</a>`);
  }
  if (user.role === "admin" || user.role === "waiter") {
    links.push(`<a href="#/tables" class="nav-link">Tables</a>`);
  }
  if (user.role === "admin" || user.role === "chef") {
    links.push(`<a href="#/kitchen" class="nav-link">Kitchen</a>`);
  }
  if (user.role === "admin" || user.role === "cashier") {
    links.push(`<a href="#/payments" class="nav-link">Payments</a>`);
  }
  if (user.role === "admin") {
    links.push(`<a href="#/reservations" class="nav-link">Reservations</a>`);
    links.push(`<a href="#/create-user" class="nav-link">Users</a>`);
  }
  if (user.role === "waiter") {
    links.push(`<a href="#/reservation-status" class="nav-link">Reservations</a>`);
  }

  const roleLabelMap = {
    admin: "Administrator",
    chef: "Chef",
    waiter: "Waiter",
    cashier: "Cashier",
  };
  const roleColorMap = {
    admin: "bg-purple-100 text-purple-800",
    chef: "bg-orange-100 text-orange-800",
    waiter: "bg-blue-100 text-blue-800",
    cashier: "bg-green-100 text-green-800",
  };

  return `
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-1">
            <a href="#/dashboard" class="flex items-center space-x-2 mr-6">
              <i data-lucide="utensils-crossed" class="w-6 h-6 text-brand-600"></i>
              <span class="text-lg font-bold text-gray-900 hidden sm:inline">RMS</span>
            </a>
            ${links.join("")}
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 hidden sm:inline">
              ${user.username}
              <span class="ml-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColorMap[user.role] || "bg-gray-100 text-gray-800"}">
                ${roleLabelMap[user.role] || user.role}
              </span>
            </span>
            <button
              id="logout-btn"
              class="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
    <style>
      .nav-link {
        display: inline-flex;
        align-items: center;
        padding: 0 12px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #6b7280;
        border-bottom: 2px solid transparent;
        transition: color 0.15s, border-color 0.15s;
      }
      .nav-link:hover {
        color: #111827;
        border-bottom-color: #d1d5db;
      }
    </style>
  `;
}

function bindLogout() {
  const btn = document.getElementById("logout-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      if (currentView && currentView.destroy) {
        currentView.destroy();
        currentView = null;
      }
      authStore.logout();
      window.location.hash = "#/login";
    });
  }
}

function renderWithNav(contentHtml) {
  const user = authStore.currentUser();
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      ${buildNav(user)}
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        ${contentHtml}
      </main>
    </div>
  `;
  bindLogout();
  if (window.createIcons) window.createIcons();
}

function route() {
  const hash = window.location.hash || "#/login";
  const path = hash.replace("#", "");

  if (!authStore.isAuthenticated() && path !== "/login") {
    window.location.hash = "#/login";
    return;
  }

  if (authStore.isAuthenticated() && (path === "/login" || path === "/")) {
    const user = authStore.currentUser();
    window.location.hash = `#${getHomeRoute(user.role)}`;
    return;
  }

  if (authStore.isAuthenticated()) {
    const user = authStore.currentUser();
    if (!isRouteAllowed(path, user.role)) {
      window.location.hash = `#${getHomeRoute(user.role)}`;
      return;
    }
  }

  switch (path) {
    case "/login":
      renderFullPage(renderLogin);
      break;
    case "/admin":
    case "/create-user":
      renderWithNav("");
      renderRegister(app.querySelector("main"));
      bindLogout();
      break;
    case "/dashboard":
      renderWithNav(Dashboard.render());
      Dashboard.init();
      currentView = Dashboard;
      break;
    case "/orders":
      renderWithNav(PosView.render());
      PosView.init();
      currentView = PosView;
      break;
    case "/kitchen":
      renderWithNav(KitchenView.render());
      KitchenView.init();
      currentView = KitchenView;
      break;
    case "/tables":
      renderWithNav(TablesView.render());
      TablesView.init();
      currentView = TablesView;
      break;
    case "/payments":
      renderWithNav(`
        <div class="text-center py-12">
          <i data-lucide="credit-card" class="w-12 h-12 mx-auto text-gray-400 mb-4"></i>
          <h2 class="text-lg font-semibold text-gray-700">Payments</h2>
          <p class="text-gray-500 mt-2">Payment management coming soon.</p>
        </div>
      `);
      break;
    case "/reservations":
      renderWithNav("");
      renderReservations(app.querySelector("main"));
      bindLogout();
      break;
    case "/reservation-status":
      renderWithNav("");
      renderReservationStatus(app.querySelector("main"));
      bindLogout();
      break;
    default:
      window.location.hash = "#/login";
  }
}

window.addEventListener("hashchange", route);
route();
