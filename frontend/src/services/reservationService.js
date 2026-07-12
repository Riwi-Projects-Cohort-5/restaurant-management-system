import {
  getReservations,
  saveReservations,
  generateReservationId,
  generateReservationCode,
} from "./mockReservations.js";

export function getAllReservations() {
  return getReservations();
}

export function getReservationById(id) {
  return getReservations().find((r) => r.id === id) || null;
}

export function getReservationByCode(code) {
  const normalized = code.trim().toUpperCase();
  return getReservations().find((r) => r.code === normalized) || null;
}

export function getReservationsByUser(userId) {
  return getReservations().filter((r) => r.userId === userId);
}

export function getReservationsByDate(date) {
  return getReservations().filter((r) => r.date === date);
}

export function getReservationsByStatus(status) {
  return getReservations().filter((r) => r.status === status);
}

export function filterReservations({ date, status, search }) {
  let results = getReservations();

  if (date) {
    results = results.filter((r) => r.date === date);
  }

  if (status) {
    results = results.filter((r) => r.status === status);
  }

  if (search) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        r.guestName.toLowerCase().includes(q) ||
        r.guestPhone.includes(q)
    );
  }

  return results;
}

export function createReservation(data) {
  const reservations = getReservations();

  const newReservation = {
    id: generateReservationId(),
    code: generateReservationCode(),
    guestName: data.guestName,
    guestPhone: data.guestPhone || "",
    userId: data.userId || null,
    date: data.date,
    time: data.time,
    partySize: data.partySize,
    tableNumber: data.tableNumber || null,
    status: "pending",
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
  };

  reservations.push(newReservation);
  saveReservations(reservations);

  return { success: true, reservation: newReservation };
}

export function updateReservationStatus(id, newStatus) {
  const reservations = getReservations();
  const index = reservations.findIndex((r) => r.id === id);

  if (index === -1) {
    return { success: false, error: "Reservation not found" };
  }

  reservations[index].status = newStatus;
  saveReservations(reservations);

  return { success: true, reservation: reservations[index] };
}

export function deleteReservation(id) {
  const reservations = getReservations();
  const filtered = reservations.filter((r) => r.id !== id);

  if (filtered.length === reservations.length) {
    return { success: false, error: "Reservation not found" };
  }

  saveReservations(filtered);
  return { success: true };
}
