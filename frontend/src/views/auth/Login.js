import * as authStore from "../../store/auth.js";
import { getHomeRoute } from "../../utils/routeGuard.js";
import { ROLE_LABELS } from "../../services/mockUsers.js";

export function renderLogin(container) {
  container.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Restaurant Management System
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <form id="login-form" class="mt-8 space-y-6">
          <div id="login-error" class="hidden rounded-md bg-red-50 p-4">
            <p class="text-sm text-red-700"></p>
          </div>
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </div>
          <div class="mt-4 text-center text-xs text-gray-500">
            <p class="mb-2">Demo accounts (password same as username + "123"):</p>
            <div class="flex flex-wrap justify-center gap-2">
              ${Object.entries(ROLE_LABELS)
                .map(
                  ([role, label]) =>
                    `<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">${label}</span>`
                )
                .join("")}
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = container.querySelector("#login-form");
  const errorBox = container.querySelector("#login-error");
  const errorText = errorBox.querySelector("p");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value;

    if (!username || !password) {
      errorText.textContent = "Please enter both username and password.";
      errorBox.classList.remove("hidden");
      return;
    }

    const result = authStore.login(username, password);

    if (result.success) {
      window.location.hash = `#${getHomeRoute(result.user.role)}`;
    } else {
      errorText.textContent = result.error;
      errorBox.classList.remove("hidden");
    }
  });
}
