import {
  getUsers,
  saveUsers,
  generateId,
  saveSession,
  getSession,
  clearSession,
} from "./mockUsers.js";

export function login(username, password) {
  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return { success: false, error: "Invalid username or password" };
  }

  saveSession(user);
  return { success: true, user: { ...user, password: undefined } };
}

export function logout() {
  clearSession();
}

export function getCurrentUser() {
  return getSession();
}

export function createUser({ username, email, password, role }) {
  const users = getUsers();

  if (users.find((u) => u.username === username)) {
    return { success: false, error: "Username already exists" };
  }

  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email already exists" };
  }

  const newUser = {
    id: generateId(),
    username,
    email,
    password,
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, user: { ...newUser, password: undefined } };
}

export function deleteUser(userId) {
  const users = getUsers();
  const target = users.find((u) => u.id === userId);

  if (!target) {
    return { success: false, error: "User not found" };
  }

  if (target.role === "admin") {
    const adminCount = users.filter((u) => u.role === "admin").length;
    if (adminCount <= 1) {
      return { success: false, error: "Cannot delete the last admin" };
    }
  }

  const filtered = users.filter((u) => u.id !== userId);
  saveUsers(filtered);
  return { success: true };
}

export function updateUserRole(userId, newRole) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return { success: false, error: "User not found" };
  }

  if (users[index].role === "admin") {
    const adminCount = users.filter((u) => u.role === "admin").length;
    if (adminCount <= 1) {
      return { success: false, error: "Cannot change the last admin's role" };
    }
  }

  users[index].role = newRole;
  saveUsers(users);
  return { success: true, user: { ...users[index], password: undefined } };
}

export function getAllUsersSafe() {
  return getUsers().map(({ password, ...u }) => u);
}
