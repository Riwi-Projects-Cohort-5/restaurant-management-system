import * as authStore from "../../store/auth.js";
import * as reservationStore from "../../store/reservations.js";
import { STATUS_LABELS, STATUS_COLORS, initMockReservations } from "../../services/mockReservations.js";

initMockReservations();

function statusBadge(status) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;
  const label = STATUS_LABELS[status] || status;
  return `<span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${colors.bg} ${colors.text}">
    <span class="h-2 w-2 rounded-full ${colors.dot}"></span>
    ${label}
  </span>`;
}

function reservationCard(r) {
  return `
    <div class="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-3">
        <div>
          <span class="text-sm font-semibold text-indigo-600">${r.code}</span>
          <h3 class="text-lg font-medium text-gray-900 mt-1">${r.guestName}</h3>
        </div>
        ${statusBadge(r.status)}
      </div>
      <div class="grid grid-cols-2 gap-3 text-sm text-gray-600">
        <div>
          <span class="font-medium text-gray-500">Telefono:</span> ${r.guestPhone || "—"}
        </div>
        <div>
          <span class="font-medium text-gray-500">Fecha:</span> ${r.date}
        </div>
        <div>
          <span class="font-medium text-gray-500">Hora:</span> ${r.time}
        </div>
        <div>
          <span class="font-medium text-gray-500">Personas:</span> ${r.partySize}
        </div>
        <div>
          <span class="font-medium text-gray-500">Mesa:</span> ${r.tableNumber || "Por asignar"}
        </div>
      </div>
      ${r.notes ? `<p class="mt-3 text-sm text-gray-500 italic">${r.notes}</p>` : ""}
    </div>
  `;
}

function noResultsMessage(query) {
  return `
    <div class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontro reserva</h3>
      <p class="mt-1 text-sm text-gray-500">
        ${query ? `No hay resultados para "<strong>${query}</strong>"` : "Busca por codigo o selecciona una reserva."}
      </p>
    </div>
  `;
}

function renderAllCards(reservations) {
  if (reservations.length === 0) return noResultsMessage("");
  return `<div class="space-y-4">${reservations.map(reservationCard).join("")}</div>`;
}

export function renderReservationStatus(container) {
  const user = authStore.currentUser();
  reservationStore.loadReservations();
  const allReservations = reservationStore.getState().reservations;

  container.innerHTML = `
    <div class="space-y-0">
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Buscar Reserva por Codigo</h2>
        <div class="flex gap-3">
          <input
            type="text"
            id="search-code"
            placeholder="Ingresa el codigo de reserva (ej. RES-001)"
            class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
          <button id="search-btn" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
            Buscar
          </button>
        </div>
        <div id="search-result" class="mt-4"></div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Todas las Reservas</h2>
          <span class="text-sm text-gray-500">${allReservations.length} reserva(s)</span>
        </div>
        <div id="all-reservations">
          ${renderAllCards(allReservations)}
        </div>
      </div>
    </div>
  `;

  const searchResult = document.getElementById("search-result");
  const allReservationsDiv = document.getElementById("all-reservations");
  const searchInput = document.getElementById("search-code");

  function doSearch() {
    const code = searchInput.value.trim();
    if (!code) {
      searchResult.innerHTML = "";
      allReservationsDiv.innerHTML = renderAllCards(reservationStore.getState().reservations);
      return;
    }

    const found = reservationStore.getReservationByCode(code);
    if (found) {
      searchResult.innerHTML = `
        <h3 class="text-sm font-medium text-gray-700 mb-2">Resultado:</h3>
        ${reservationCard(found)}
      `;
      allReservationsDiv.innerHTML = renderAllCards(
        reservationStore.getState().reservations.filter((r) => r.id !== found.id)
      );
    } else {
      searchResult.innerHTML = `
        <p class="text-sm text-red-600">No se encontro una reserva con el codigo "<strong>${code}</strong>"</p>
      `;
      allReservationsDiv.innerHTML = renderAllCards(reservationStore.getState().reservations);
    }
  }

  document.getElementById("search-btn").addEventListener("click", doSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });

  reservationStore.subscribe(() => {
    const updated = reservationStore.getState().reservations;
    allReservationsDiv.innerHTML = renderAllCards(updated);
  });
}
