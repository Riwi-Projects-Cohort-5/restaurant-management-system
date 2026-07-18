import { createStore } from "./index.js";
import * as auth from "../services/authService.js";
import { ROLES } from "../services/mockUsers.js";

const authStore = createStore({
  user: auth.getCurrentUser(),
  isAuthenticated: !!auth.getCurrentUser(),
  error: null,
});

export function login(username, password) {
  const result = auth.login(username, password);

  if (result.success) {
    authStore.setState({
      user: result.user,
      isAuthenticated: true,
      error: null,
    });
  } else {
    authStore.setState({ error: result.error });
  }

  return result;
}

export function logout() {
  auth.logout();
  authStore.setState({ user: null, isAuthenticated: false, error: null });
}

export function currentUser() {
  return authStore.getState().user;
}

export function isAuthenticated() {
  return authStore.getState().isAuthenticated;
}

export function error() {
  return authStore.getState().error;
}

export function clearError() {
  authStore.setState({ error: null });
}

export function hasRole(...roles) {
  const user = authStore.getState().user;
  return user ? roles.includes(user.role) : false;
}

export function canAccess(allowedRoles) {
  const user = authStore.getState().user;
  if (!user) return false;
  if (allowedRoles.includes("*")) return true;
  return allowedRoles.includes(user.role);
}

export function addUser(userData) {
  const currentUser = authStore.getState().user;

  if (!currentUser || currentUser.role !== ROLES.ADMIN) {
    return { success: false, error: "Only admins can create users" };
  }

  return auth.createUser(userData);
}

export function removeUser(userId) {
  return auth.deleteUser(userId);
}

export function changeUserRole(userId, newRole) {
  return auth.updateUserRole(userId, newRole);
}

export function listUsers() {
  return auth.getAllUsersSafe();
}

export function subscribe(listener) {
  return authStore.subscribe(listener);
}

export default {
  login,
  logout,
  currentUser() {
    return currentUser();
  },
  isAuthenticated() {
    return isAuthenticated();
  },
  error() {
    return error();
  },
  clearError,
  hasRole,
  canAccess,
  addUser,
  removeUser,
  changeUserRole,
  listUsers,
  subscribe,
};
