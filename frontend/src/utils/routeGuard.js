import { ROLES } from "../services/mockUsers.js";

const ROLE_HOME = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.CLIENT]: "/dashboard",
  [ROLES.WAITER]: "/orders",
  [ROLES.CHEF]: "/kitchen",
  [ROLES.CASHIER]: "/payments",
};

const ROLE_ACCESS = {
  "/admin": [ROLES.ADMIN],
  "/dashboard": [ROLES.ADMIN, ROLES.CLIENT],
  "/orders": [ROLES.ADMIN, ROLES.WAITER],
  "/kitchen": [ROLES.ADMIN, ROLES.CHEF],
  "/payments": [ROLES.ADMIN, ROLES.CASHIER],
  "/reservations": [ROLES.ADMIN],
  "/reservation-status": [ROLES.CLIENT],
  "/inventory": [ROLES.ADMIN],
  "/reports": [ROLES.ADMIN],
  "/settings": [ROLES.ADMIN],
  "/menu": ["*"],
  "/": ["*"],
};

export function getHomeRoute(role) {
  return ROLE_HOME[role] || "/dashboard";
}

export function isRouteAllowed(path, userRole) {
  const allowed = ROLE_ACCESS[path];
  if (!allowed) return true;
  if (allowed.includes("*")) return true;
  return userRole ? allowed.includes(userRole) : false;
}

export function guard(user) {
  if (!user) {
    window.location.hash = "#/login";
    return false;
  }
  return true;
}

export function guardRole(user, allowedRoles) {
  if (!guard(user)) return false;
  if (allowedRoles.includes("*")) return true;
  if (!allowedRoles.includes(user.role)) {
    window.location.hash = "#/login";
    return false;
  }
  return true;
}
