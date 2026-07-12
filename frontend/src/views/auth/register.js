import * as authStore from "../../store/auth.js";
import { ROLES, ROLE_LABELS } from "../../services/mockUsers.js";

export function renderRegister(container) {
  const user = authStore.currentUser();

  if (!user || user.role !== ROLES.ADMIN) {
    container.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-red-600">Access Denied</h2>
          <p class="mt-2 text-gray-600">Only administrators can create new users.</p>
          <a href="#/login" class="mt-4 inline-block text-indigo-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create New User
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Admin panel — add staff or client accounts
          </p>
        </div>
        <form id="register-form" class="mt-8 space-y-6">
          <div id="register-error" class="hidden rounded-md bg-red-50 p-4">
            <p class="text-sm text-red-700"></p>
          </div>
          <div id="register-success" class="hidden rounded-md bg-green-50 p-4">
            <p class="text-sm text-green-700"></p>
          </div>
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="new-username" class="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="new-username"
                name="username"
                type="text"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g. john_doe"
              />
            </div>
            <div>
              <label for="new-email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="new-email"
                name="email"
                type="email"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="john@restaurant.com"
              />
            </div>
            <div>
              <label for="new-password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="new-password"
                name="password"
                type="password"
                required
                minlength="6"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="Minimum 6 characters"
              />
            </div>
            <div>
              <label for="new-role" class="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="new-role"
                name="role"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a role</option>
                <option value="${ROLES.CLIENT}">${ROLE_LABELS[ROLES.CLIENT]}</option>
                <option value="${ROLES.WAITER}">${ROLE_LABELS[ROLES.WAITER]}</option>
                <option value="${ROLES.CHEF}">${ROLE_LABELS[ROLES.CHEF]}</option>
                <option value="${ROLES.CASHIER}">${ROLE_LABELS[ROLES.CASHIER]}</option>
              </select>
            </div>
          </div>
          <div class="flex space-x-4">
            <button
              type="submit"
              class="flex-1 justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create User
            </button>
            <a
              href="#/dashboard"
              class="flex-1 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </a>
          </div>
        </form>

        <div class="mt-8">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Existing Users</h3>
          <div id="user-list" class="rounded-md border border-gray-200 divide-y divide-gray-200"></div>
        </div>
      </div>
    </div>
  `;

  renderUserList(container);

  const form = container.querySelector("#register-form");
  const errorBox = container.querySelector("#register-error");
  const errorText = errorBox.querySelector("p");
  const successBox = container.querySelector("#register-success");
  const successText = successBox.querySelector("p");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    errorBox.classList.add("hidden");
    successBox.classList.add("hidden");

    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const role = form.role.value;

    if (!username || !email || !password || !role) {
      errorText.textContent = "All fields are required.";
      errorBox.classList.remove("hidden");
      return;
    }

    if (password.length < 6) {
      errorText.textContent = "Password must be at least 6 characters.";
      errorBox.classList.remove("hidden");
      return;
    }

    const result = authStore.addUser({ username, email, password, role });

    if (result.success) {
      successText.textContent = `User "${result.user.username}" (${ROLE_LABELS[result.user.role]}) created successfully.`;
      successBox.classList.remove("hidden");
      form.reset();
      renderUserList(container);
    } else {
      errorText.textContent = result.error;
      errorBox.classList.remove("hidden");
    }
  });
}

function renderUserList(container) {
  const listEl = container.querySelector("#user-list");
  const users = authStore.listUsers();

  if (users.length === 0) {
    listEl.innerHTML = '<p class="p-4 text-sm text-gray-500">No users found.</p>';
    return;
  }

  listEl.innerHTML = users
    .map(
      (u) => `
      <div class="flex items-center justify-between p-3 hover:bg-gray-50">
        <div>
          <p class="text-sm font-medium text-gray-900">${u.username}</p>
          <p class="text-xs text-gray-500">${u.email}</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            u.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }">
            ${ROLE_LABELS[u.role] || u.role}
          </span>
        </div>
      </div>
    `
    )
    .join("");
}
