import * as authStore from "../../store/auth.js";
import * as reservationStore from "../../store/reservations.js";
import { STATUS_LABELS, STATUS_COLORS, initMockReservations } from "../../services/mockReservations.js";
import { exportToCsv } from "../../utils/csvExport.js";

initMockReservations();

let _editingId = null;

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
    return `<tr><td colspan="8" class="px-6 py-12 text-center text-sm text-gray-500">No se encontraron reservas</td></tr>`;
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
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
          <button data-action="edit" data-id="${r.id}" class="text-indigo-600 hover:text-indigo-900">Editar</button>
          <button data-action="delete" data-id="${r.id}" class="text-red-600 hover:text-red-900">Eliminar</button>
        </td>
      </tr>`
    )
    .join("");
}

function exportReservationsCsv() {
  const filtered = reservationStore.getState().filteredReservations;
  const rows = filtered.map((r) => ({
    'Code': r.code,
    'Guest Name': r.guestName,
    'Phone': r.guestPhone,
    'Date': r.date,
    'Time': r.time,
    'Party Size': r.partySize,
    'Table': r.tableNumber || '',
    'Status': r.status,
    'Notes': r.notes || '',
    'Created At': r.createdAt,
  }));
  exportToCsv('reservations-export', ['Code', 'Guest Name', 'Phone', 'Date', 'Time', 'Party Size', 'Table', 'Status', 'Notes', 'Created At'], rows, { includeBOM: true });
}

function openModal(reservation) {
  _editingId = reservation ? reservation.id : null;
  const modal = document.getElementById("reservation-modal");
  const title = document.getElementById("modal-title");
  const form = document.getElementById("reservation-form");
  const errorBox = document.getElementById("modal-error");

  title.textContent = reservation ? "Editar Reserva" : "Nueva Reserva";
  errorBox.classList.add("hidden");

  if (reservation) {
    form["guest-name"].value = reservation.guestName;
    form["guest-phone"].value = reservation.guestPhone || "";
    form["res-date"].value = reservation.date;
    form["res-time"].value = reservation.time;
    form["party-size"].value = reservation.partySize;
    form["table-number"].value = reservation.tableNumber || "";
    form["res-status"].value = reservation.status;
    form["res-notes"].value = reservation.notes || "";
  } else {
    form.reset();
    form["res-status"].value = "pending";
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  const modal = document.getElementById("reservation-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  _editingId = null;
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById("reservation-form");
  const errorBox = document.getElementById("modal-error");
  const errorText = errorBox.querySelector("p");

  const guestName = form["guest-name"].value.trim();
  const guestPhone = form["guest-phone"].value.trim();
  const date = form["res-date"].value;
  const time = form["res-time"].value;
  const partySize = parseInt(form["party-size"].value, 10);
  const tableNumber = form["table-number"].value ? parseInt(form["table-number"].value, 10) : null;
  const status = form["res-status"].value;
  const notes = form["res-notes"].value.trim();

  if (!guestName || !date || !time || !partySize) {
    errorText.textContent = "Nombre, fecha, hora y cantidad de personas son requeridos.";
    errorBox.classList.remove("hidden");
    return;
  }

  const data = { guestName, guestPhone, date, time, partySize, tableNumber, status, notes };

  let result;
  if (_editingId) {
    result = reservationStore.updateReservation(_editingId, data);
  } else {
    result = reservationStore.createReservation(data);
  }

  if (result.success) {
    closeModal();
    updateView();
  } else {
    errorText.textContent = result.error;
    errorBox.classList.remove("hidden");
  }
}

function handleDelete(id) {
  const reservations = reservationStore.getState().reservations;
  const reservation = reservations.find((r) => r.id === id);
  if (!reservation) return;

  if (!confirm(`¿Eliminar la reserva ${reservation.code} de ${reservation.guestName}?`)) return;

  const result = reservationStore.deleteReservation(id);
  if (result.success) updateView();
}

function bindTableActions() {
  const tbody = document.getElementById("reservations-body");
  if (!tbody) return;

  tbody.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const action = e.currentTarget.getAttribute("data-action");
      const id = e.currentTarget.getAttribute("data-id");

      if (action === "edit") {
        const reservations = reservationStore.getState().reservations;
        const reservation = reservations.find((r) => r.id === id);
        if (reservation) openModal(reservation);
      } else if (action === "delete") {
        handleDelete(id);
      }
    });
  });
}

function updateView() {
  const dateInput = document.getElementById("filter-date");
  const statusInput = document.getElementById("filter-status");
  const searchInput = document.getElementById("filter-search");

  reservationStore.applyFilters({
    date: dateInput ? dateInput.value : "",
    status: statusInput ? statusInput.value : "",
    search: searchInput ? searchInput.value : "",
  });

  const filtered = reservationStore.getState().filteredReservations;
  const tbody = document.getElementById("reservations-body");
  const resultsCount = document.getElementById("results-count");

  if (tbody) tbody.innerHTML = renderTable(filtered);
  if (resultsCount) resultsCount.textContent = `${filtered.length} reservation(s)`;

  bindTableActions();
}

export function renderReservations(container) {
  const user = authStore.currentUser();
  reservationStore.loadReservations();
  const reservations = reservationStore.getState().filteredReservations;

  container.innerHTML = `
    <div class="space-y-0">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Reservations</h2>
        <div class="flex items-center gap-3">
          <button id="new-reservation-btn" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Nueva Reserva
          </button>
          <button id="export-reservations-btn" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export CSV
          </button>
          <span id="results-count" class="text-sm text-gray-500">${reservations.length} reservation(s)</span>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="mt-4 flex flex-col sm:flex-row gap-3">
            <div>
              <label for="filter-date" class="block text-xs font-medium text-gray-500 mb-1">Date</label>
              <input type="date" id="filter-date" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label for="filter-status" class="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select id="filter-status" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div class="flex-1">
              <label for="filter-search" class="block text-xs font-medium text-gray-500 mb-1">Search</label>
              <input type="text" id="filter-search" placeholder="Code, name or phone..." class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            </div>
            <div class="flex items-end">
              <button id="clear-filters" class="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 whitespace-nowrap">
                Clear filters
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party Size</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody id="reservations-body" class="bg-white divide-y divide-gray-200">
              ${renderTable(reservations)}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div id="reservation-modal" class="hidden fixed inset-0 z-50 items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 id="modal-title" class="text-lg font-semibold text-gray-900">Nueva Reserva</h3>
          <button id="modal-close" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <form id="reservation-form" class="px-6 py-4 space-y-4">
          <div id="modal-error" class="hidden rounded-md bg-red-50 p-3">
            <p class="text-sm text-red-700"></p>
          </div>
          <div>
            <label for="guest-name" class="block text-sm font-medium text-gray-700">Nombre del invitado *</label>
            <input type="text" id="guest-name" name="guest-name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="Juan Perez" />
          </div>
          <div>
            <label for="guest-phone" class="block text-sm font-medium text-gray-700">Telefono</label>
            <input type="text" id="guest-phone" name="guest-phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="+52 55 1234 5678" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="res-date" class="block text-sm font-medium text-gray-700">Fecha *</label>
              <input type="date" id="res-date" name="res-date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label for="res-time" class="block text-sm font-medium text-gray-700">Hora *</label>
              <input type="time" id="res-time" name="res-time" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="party-size" class="block text-sm font-medium text-gray-700">Personas *</label>
              <input type="number" id="party-size" name="party-size" min="1" max="50" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label for="table-number" class="block text-sm font-medium text-gray-700">Mesa</label>
              <input type="number" id="table-number" name="table-number" min="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="Opcional" />
            </div>
          </div>
          <div>
            <label for="res-status" class="block text-sm font-medium text-gray-700">Estado</label>
            <select id="res-status" name="res-status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
              <option value="completed">Completada</option>
            </select>
          </div>
          <div>
            <label for="res-notes" class="block text-sm font-medium text-gray-700">Notas</label>
            <textarea id="res-notes" name="res-notes" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="Mesa junto a la ventana..."></textarea>
          </div>
          <div class="flex justify-end gap-3 pt-2 border-t border-gray-200">
            <button type="button" id="modal-cancel" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const dateInput = document.getElementById("filter-date");
  const statusInput = document.getElementById("filter-status");
  const searchInput = document.getElementById("filter-search");

  dateInput.addEventListener("change", updateView);
  statusInput.addEventListener("change", updateView);
  searchInput.addEventListener("input", updateView);

  document.getElementById("clear-filters").addEventListener("click", () => {
    dateInput.value = "";
    statusInput.value = "";
    searchInput.value = "";
    updateView();
  });

  document.getElementById("export-reservations-btn").addEventListener("click", exportReservationsCsv);
  document.getElementById("new-reservation-btn").addEventListener("click", () => openModal(null));
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  document.getElementById("reservation-form").addEventListener("submit", handleFormSubmit);

  document.getElementById("reservation-modal").addEventListener("click", (e) => {
    if (e.target.id === "reservation-modal") closeModal();
  });

  document.getElementById("logout-btn")?.addEventListener("click", () => {
    authStore.logout();
    window.location.hash = "#/login";
  });

  bindTableActions();

  reservationStore.subscribe(() => {
    const filtered = reservationStore.getState().filteredReservations;
    const tbody = document.getElementById("reservations-body");
    const resultsCount = document.getElementById("results-count");
    if (tbody) tbody.innerHTML = renderTable(filtered);
    if (resultsCount) resultsCount.textContent = `${filtered.length} reservation(s)`;
    bindTableActions();
  });
}
