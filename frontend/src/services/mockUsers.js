const STORAGE_KEY = "rms_users";
const SESSION_KEY = "rms_session";

const DEFAULT_USERS = [
  {
    id: "usr_001",
    username: "admin",
    email: "admin@restaurant.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_003",
    username: "waiter",
    email: "waiter@restaurant.com",
    password: "waiter123",
    role: "waiter",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_004",
    username: "chef",
    email: "chef@restaurant.com",
    password: "chef123",
    role: "chef",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_005",
    username: "cashier",
    email: "cashier@restaurant.com",
    password: "cashier123",
    role: "cashier",
    createdAt: new Date().toISOString(),
  },
];

export const ROLES = {
  ADMIN: "admin",
  WAITER: "waiter",
  CHEF: "chef",
  CASHIER: "cashier",
};

export const ROLE_LABELS = {
  admin: "Administrator",
  waiter: "Waiter",
  chef: "Chef",
  cashier: "Cashier",
};

export function initMockUsers() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  }
}

export function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function generateId() {
  return "usr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function saveSession(user) {
  const { password, ...safe } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
