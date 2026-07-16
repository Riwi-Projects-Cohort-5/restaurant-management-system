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
      <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontró reserva</h3>
      <p class="mt-1 text-sm text-gray-500">
        ${query ? `No hay resultados para "<strong>${query}</strong>"` : "Ingresa un código o consulta tus reservas."}
      </p>
    </div>
  `;
}

export function renderReservationStatus(container) {
  const user = authStore.currentUser();
  reservationStore.loadReservations();

  const userReservations = reservationStore.getReservationsByUser(user.id);

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Mis Reservas</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                ${user.username}
                <span class="ml-1 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                  ${user.role}
                </span>
              </span>
              <button id="logout-btn" class="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Buscar Reserva</h2>
          <div class="flex gap-3">
            <input
              type="text"
              id="search-code"
              placeholder="Ingresa el código de reserva (ej. RES-001)"
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            />
            <button id="search-btn" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Buscar
            </button>
          </div>
          <div id="search-result" class="mt-4"></div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Todas mis Reservas</h2>
          <div id="user-reservations" class="space-y-4">
            ${userReservations.length > 0
              ? userReservations.map(reservationCard).join("")
              : noResultsMessage("")
            }
          </div>
        </div>
      </main>
    </div>
  `;

  const searchResult = document.getElementById("search-result");
  const userReservationsDiv = document.getElementById("user-reservations");
  const searchInput = document.getElementById("search-code");

  function doSearch() {
    const code = searchInput.value.trim();
    if (!code) {
      searchResult.innerHTML = "";
      return;
    }

    const found = reservationStore.getReservationByCode(code);
    if (found) {
      searchResult.innerHTML = `
        <h3 class="text-sm font-medium text-gray-700 mb-2">Resultado:</h3>
        ${reservationCard(found)}
      `;
    } else {
      searchResult.innerHTML = `
        <p class="text-sm text-red-600">No se encontró una reserva con el código "<strong>${code}</strong>"</p>
      `;
    }
  }

  document.getElementById("search-btn").addEventListener("click", doSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    authStore.logout();
    window.location.hash = "#/login";
  });

  reservationStore.subscribe(() => {
    const updated = reservationStore.getReservationsByUser(user.id);
    userReservationsDiv.innerHTML =
      updated.length > 0
        ? updated.map(reservationCard).join("")
        : noResultsMessage("");
  });
}
