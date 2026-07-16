import * as authStore from "../../store/auth.js";
import * as reservationStore from "../../store/reservations.js";
import { STATUS_LABELS, STATUS_COLORS, initMockReservations } from "../../services/mockReservations.js";

initMockReservations();

function statusBadge(status) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;
  const label = STATUS_LABELS[status] || status;
  return `<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}">
    <span class="h-1.5 w-1.5 rounded-full ${colors.dot}"></span>
    ${label}
  </span>`;
}

function renderTable(reservations) {
  if (reservations.length === 0) {
    return `<tr><td colspan="7" class="px-6 py-12 text-center text-sm text-gray-500">No se encontraron reservas</td></tr>`;
  }

  return reservations
    .map(
      (r) => `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${r.code}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${r.guestName}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${r.date}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${r.time}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${r.partySize} personas</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Mesa ${r.tableNumber || "—"}</td>
        <td class="px-6 py-4 whitespace-nowrap">${statusBadge(r.status)}</td>
      </tr>`
    )
    .join("");
}

export function renderReservations(container) {
  const user = authStore.currentUser();
  reservationStore.loadReservations();
  const reservations = reservationStore.getState().filteredReservations;

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Reservas</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                ${user.username}
                <span class="ml-1 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                  ${user.role}
                </span>
              </span>
              <a href="#/dashboard" class="text-sm text-indigo-600 hover:underline">Dashboard</a>
              <button id="logout-btn" class="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 class="text-lg font-semibold text-gray-900">Listado de Reservas</h2>
              <span id="results-count" class="text-sm text-gray-500">${reservations.length} reserva(s)</span>
            </div>

            <div class="mt-4 flex flex-col sm:flex-row gap-3">
              <div>
                <label for="filter-date" class="block text-xs font-medium text-gray-500 mb-1">Fecha</label>
                <input type="date" id="filter-date" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label for="filter-status" class="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                <select id="filter-status" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                  <option value="">Todos</option>
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="completed">Completada</option>
                </select>
              </div>
              <div class="flex-1">
                <label for="filter-search" class="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
                <input type="text" id="filter-search" placeholder="Código, nombre o teléfono..." class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
              </div>
              <div class="flex items-end">
                <button id="clear-filters" class="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 whitespace-nowrap">
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personas</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody id="reservations-body" class="bg-white divide-y divide-gray-200">
                ${renderTable(reservations)}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `;

  const dateInput = document.getElementById("filter-date");
  const statusInput = document.getElementById("filter-status");
  const searchInput = document.getElementById("filter-search");
  const resultsCount = document.getElementById("results-count");
  const tbody = document.getElementById("reservations-body");

  function updateView() {
    reservationStore.applyFilters({
      date: dateInput.value,
      status: statusInput.value,
      search: searchInput.value,
    });
    const filtered = reservationStore.getState().filteredReservations;
    tbody.innerHTML = renderTable(filtered);
    resultsCount.textContent = `${filtered.length} reserva(s)`;
  }

  dateInput.addEventListener("change", updateView);
  statusInput.addEventListener("change", updateView);
  searchInput.addEventListener("input", updateView);

  document.getElementById("clear-filters").addEventListener("click", () => {
    dateInput.value = "";
    statusInput.value = "";
    searchInput.value = "";
    updateView();
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    authStore.logout();
    window.location.hash = "#/login";
  });

  reservationStore.subscribe(() => {
    const filtered = reservationStore.getState().filteredReservations;
    tbody.innerHTML = renderTable(filtered);
    resultsCount.textContent = `${filtered.length} reserva(s)`;
  });
}
