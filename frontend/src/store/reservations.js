import { createStore } from "./index.js";
import * as reservationService from "../services/reservationService.js";

const reservationsStore = createStore({
  reservations: reservationService.getAllReservations(),
  filteredReservations: reservationService.getAllReservations(),
  filters: { date: "", status: "", search: "" },
  selectedReservation: null,
  error: null,
});

export function loadReservations() {
  const all = reservationService.getAllReservations();
  reservationsStore.setState({ reservations: all, filteredReservations: all });
}

export function applyFilters({ date, status, search } = {}) {
  const current = reservationsStore.getState().filters;
  const filters = {
    date: date !== undefined ? date : current.date,
    status: status !== undefined ? status : current.status,
    search: search !== undefined ? search : current.search,
  };

  const filtered = reservationService.filterReservations(filters);
  reservationsStore.setState({ filters, filteredReservations: filtered });
}

export function clearFilters() {
  const all = reservationsStore.getState().reservations;
  reservationsStore.setState({
    filters: { date: "", status: "", search: "" },
    filteredReservations: all,
  });
}

export function getFilteredReservations() {
  return reservationsStore.getState().filteredReservations;
}

export function getReservationByCode(code) {
  return reservationService.getReservationByCode(code);
}

export function getReservationsByUser(userId) {
  return reservationService.getReservationsByUser(userId);
}

export function refreshReservations() {
  const all = reservationService.getAllReservations();
  const filters = reservationsStore.getState().filters;
  const filtered = reservationService.filterReservations(filters);
  reservationsStore.setState({ reservations: all, filteredReservations: filtered });
}

export function createReservation(data) {
  const result = reservationService.createReservation(data);
  if (result.success) refreshReservations();
  return result;
}

export function updateReservation(id, data) {
  const result = reservationService.updateReservation(id, data);
  if (result.success) refreshReservations();
  return result;
}

export function updateReservationStatus(id, newStatus) {
  const result = reservationService.updateReservationStatus(id, newStatus);
  if (result.success) refreshReservations();
  return result;
}

export function deleteReservation(id) {
  const result = reservationService.deleteReservation(id);
  if (result.success) refreshReservations();
  return result;
}

export function getState() {
  return reservationsStore.getState();
}

export function subscribe(listener) {
  return reservationsStore.subscribe(listener);
}

export default {
  loadReservations,
  applyFilters,
  clearFilters,
  getFilteredReservations,
  getReservationByCode,
  getReservationsByUser,
  refreshReservations,
  createReservation,
  updateReservation,
  updateReservationStatus,
  deleteReservation,
  getState,
  subscribe,
};
