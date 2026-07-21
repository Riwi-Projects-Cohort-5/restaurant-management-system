import { createStore } from "./index.js";
import * as auth from "../services/authService.js";

const savedUser = auth.getCurrentUser();

const authStore = createStore({
  user: savedUser,
  isAuthenticated: !!savedUser,
  error: null,
});

export async function login(username, password) {
  const result = await auth.login(username, password);

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

export function setRole(newRole) {
  const user = authStore.getState().user;
  if (!user) return;
  user.role = newRole;
  authStore.setState({ user: user });
}

export async function addUser(userData) {
  const u = authStore.getState().user;
  if (!u || u.role !== "admin") {
    return { success: false, error: "Only admins can create users" };
  }
  return await auth.createUser(userData);
}

export async function removeUser(userId) {
  return await auth.deleteUser(userId);
}

export async function changeUserRole(userId, newRole) {
  return await auth.updateUserRole(userId, newRole);
}

export async function listUsers() {
  return await auth.getAllUsersSafe();
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
