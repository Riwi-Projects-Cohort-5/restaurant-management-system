import { createIcons, icons } from "lucide";
import * as authStore from "./store/auth.js";
import { getHomeRoute, isRouteAllowed } from "./utils/routeGuard.js";
import AppShell from "./components/layout/AppShell.js";
import Dashboard from "./views/dashboard/Dashboard.js";
import PosView from "./views/orders/PosView.js";
import Kitchen from "./views/kitchen/Kitchen.js";
import TablesView from "./views/tables/Tables.js";
import Login from "./views/auth/Login.js";
import Register from "./views/auth/register.js";
import Reservations from "./views/reservations/list.js";
import Payments from "./views/payments/list.js";
import Menu from "./views/menu/list.js";
import { initMockUsers } from "./services/mockUsers.js";

initMockUsers();

window.createIcons = function () {
  createIcons({ icons });
};

var currentView = null;

var routes = {
  "/login": { view: Login, shell: false, auth: false },
  "/register": { view: Register, shell: false, auth: false },
  "/dashboard": { view: Dashboard, shell: true, auth: true },
  "/pos": { view: PosView, shell: true, auth: true },
  "/kitchen": { view: Kitchen, shell: true, auth: true },
  "/tables": { view: TablesView, shell: true, auth: true },
  "/reservations": { view: Reservations, shell: true, auth: true },
  "/payments": { view: Payments, shell: true, auth: true },
  "/menu": { view: Menu, shell: true, auth: true },
  "/admin": { view: PosView, shell: true, auth: true },
  "/orders": { view: PosView, shell: true, auth: true },
};

function getRoute() {
  return window.location.hash.slice(1) || "/login";
}

function destroyView() {
  if (currentView && currentView.destroy) {
    currentView.destroy();
  }
  currentView = null;
}

function renderView() {
  try {
    var path = getRoute();
    var user = authStore.currentUser();

    if (path !== "/login" && path !== "/register") {
      if (!user) {
        window.location.hash = "#/login";
        return;
      }
    }

    if (path === "/login" || path === "/register") {
      if (user) {
        var home = getHomeRoute(user.role);
        window.location.hash = "#" + home;
        return;
      }
    }

    var route = routes[path];
    if (!route) {
      if (user) {
        var defaultRoute = getHomeRoute(user.role);
        window.location.hash = "#" + defaultRoute;
      } else {
        window.location.hash = "#/login";
      }
      return;
    }

    if (route.auth && !user) {
      window.location.hash = "#/login";
      return;
    }

    if (route.shell) {
      window.currentRole = user ? user.role : "admin";
      var roleLabels = {
        admin: "Administrator",
        waiter: "Waiter",
        chef: "Chef",
        cashier: "Cashier",
        client: "Client",
      };
      var username = user ? user.displayName || user.username || "Admin" : "Admin";
      var initials = username
        .split(" ")
        .map(function (w) {
          return w[0];
        })
        .join("")
        .toUpperCase()
        .slice(0, 2);
      var roleText = roleLabels[user ? user.role : "admin"] || "Administrator";
      window.userData = {
        name: username,
        initials: initials,
        role: roleText,
      };
      AppShell.render(document.getElementById("app"));
      AppShell.updateTopbarTitle(path);
      var logoutBtn = document.getElementById("appShellLogout");
      if (logoutBtn) {
        logoutBtn.onclick = function () {
          authStore.logout();
          window.location.hash = "#/login";
        };
      }
    }

    var container = route.shell
      ? document.getElementById("main-content")
      : document.getElementById("app");
    if (!container) return;

    destroyView();

    container.innerHTML = "";
    var viewEl = document.createElement("div");
    viewEl.id = "current-view";
    container.appendChild(viewEl);

    route.view.render(viewEl);
    currentView = route.view;

    window.createIcons();

    if (route.view.init) {
      route.view.init();
    }
  } catch (err) {
    console.error("[app] renderView failed", err);
    var errorEl = document.getElementById("app");
    if (errorEl) {
      errorEl.innerHTML = '<pre style="color:red;padding:1rem;">' + err.stack + "</pre>";
    }
  }
}

window.addEventListener("hashchange", function () {
  renderView();
});

window.navigate = function (path) {
  window.location.hash = "#" + path;
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    renderView();
  });
} else {
  renderView();
}
