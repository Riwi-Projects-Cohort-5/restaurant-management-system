import { apiLogin, apiGet, apiPost, apiDelete, apiPut, getToken, removeToken } from "./api.js";

const SESSION_KEY = "rms_session";

function mapBackendUser(u) {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    name: u.full_name || u.username,
    role: u.role,
    is_active: u.is_active,
    createdAt: u.created_at,
  };
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  removeToken();
}

export async function login(username, password) {
  try {
    await apiLogin(username, password);
    const me = await apiGet("/api/v1/users/me");
    const user = mapBackendUser(me);
    saveSession(user);
    return { success: true, user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function logout() {
  clearSession();
}

export function getCurrentUser() {
  return getSession();
}

export async function createUser({ username, email, password, role, full_name }) {
  try {
    const data = await apiPost("/api/v1/auth/register", {
      username,
      email,
      password,
      full_name: full_name || username,
      role: role || "waiter",
    });
    return { success: true, user: mapBackendUser(data) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteUser(userId) {
  try {
    await apiDelete(`/api/v1/users/${userId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateUserRole(userId, newRole) {
  try {
    const data = await apiPut(`/api/v1/users/${userId}`, { role: newRole });
    return { success: true, user: mapBackendUser(data) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getAllUsersSafe() {
  try {
    const users = await apiGet("/api/v1/users/");
    return users.map(mapBackendUser);
  } catch {
    return [];
  }
}

export async function refreshCurrentUser() {
  try {
    const me = await apiGet("/api/v1/users/me");
    const user = mapBackendUser(me);
    saveSession(user);
    return user;
  } catch {
    clearSession();
    return null;
  }
}
