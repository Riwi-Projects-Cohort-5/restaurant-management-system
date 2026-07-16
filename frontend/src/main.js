import { initMockUsers } from "./services/mockUsers.js";
import * as authStore from "./store/auth.js";
import { renderLogin } from "./views/auth/login.js";
import { renderRegister } from "./views/auth/register.js";
import { renderReservations } from "./views/reservations/list.js";
import { renderReservationStatus } from "./views/reservations/status.js";
import { getHomeRoute } from "./utils/routeGuard.js";

initMockUsers();

const app = document.getElementById("app");

function route() {
  const hash = window.location.hash || "#/login";
  const path = hash.replace("#", "");

  if (!authStore.isAuthenticated() && path !== "/login") {
    window.location.hash = "#/login";
    return;
  }

  if (authStore.isAuthenticated() && (path === "/login" || path === "/")) {
    window.location.hash = `#${getHomeRoute(authStore.currentUser().role)}`;
    return;
  }

  switch (path) {
    case "/login":
      renderLogin(app);
      break;
    case "/admin":
    case "/create-user":
      renderRegister(app);
      break;
    case "/dashboard":
      renderDashboard(app, "Dashboard");
      break;
    case "/orders":
      renderDashboard(app, "Orders");
      break;
    case "/kitchen":
      renderDashboard(app, "Kitchen");
      break;
    case "/payments":
      renderDashboard(app, "Payments");
      break;
    case "/reservations":
      renderReservations(app);
      break;
    case "/reservation-status":
      renderReservationStatus(app);
      break;
    default:
      window.location.hash = "#/login";
  }
}

function renderDashboard(app, title) {
  const user = authStore.currentUser();
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">${title}</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                ${user.username}
                <span class="ml-1 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                  ${user.role}
                </span>
              </span>
              ${
                user.role === "admin"
                  ? '<a href="#/create-user" class="text-sm text-indigo-600 hover:underline">Create User</a><a href="#/reservations" class="text-sm text-indigo-600 hover:underline">Reservas</a>'
                  : ""
              }
              ${
                user.role === "client"
                  ? '<a href="#/reservation-status" class="text-sm text-indigo-600 hover:underline">Mis Reservas</a>'
                  : ""
              }
              <button
                id="logout-btn"
                class="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <p class="text-gray-600">Welcome, <strong>${user.username}</strong>. You are logged in as <strong>${user.role}</strong>.</p>
      </main>
    </div>
  `;
  document.getElementById("logout-btn").addEventListener("click", () => {
    authStore.logout();
    window.location.hash = "#/login";
  });
}

window.addEventListener("hashchange", route);
route();
