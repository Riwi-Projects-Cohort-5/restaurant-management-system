import { ROLES } from "../services/mockUsers.js";

const ROLE_HOME = {
  [ROLES.ADMIN]: "/dashboard",
  [ROLES.WAITER]: "/orders",
  [ROLES.CHEF]: "/kitchen",
  [ROLES.CASHIER]: "/payments",
};

const ROLE_ACCESS = {
  "/dashboard": [ROLES.ADMIN, ROLES.CHEF, ROLES.WAITER, ROLES.CASHIER],
  "/orders": [ROLES.ADMIN, ROLES.WAITER],
  "/kitchen": [ROLES.ADMIN, ROLES.CHEF],
  "/payments": [ROLES.ADMIN, ROLES.CASHIER],
  "/reservations": [ROLES.ADMIN],
  "/reservation-status": [ROLES.ADMIN, ROLES.WAITER],
  "/admin": [ROLES.ADMIN],
  "/create-user": [ROLES.ADMIN],
  "/tables": [ROLES.ADMIN, ROLES.WAITER],
  "/menu": ["*"],
  "/": ["*"],
};

export function getHomeRoute(role) {
  return ROLE_HOME[role] || "/dashboard";
}

export function isRouteAllowed(path, userRole) {
  const allowed = ROLE_ACCESS[path];
  if (!allowed) return false;
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
    window.location.hash = `#${getHomeRoute(user.role)}`;
    return false;
  }
  return true;
}
