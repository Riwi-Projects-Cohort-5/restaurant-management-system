import { createStore } from "./index.js";
import * as reservationService from "../services/reservationService.js";

const reservationsStore = createStore({
  reservations: [],
  filteredReservations: [],
  filters: { date: "", status: "", search: "" },
  selectedReservation: null,
  error: null,
});

export async function loadReservations() {
  const all = await reservationService.getAllReservations();
  reservationsStore.setState({ reservations: all, filteredReservations: all });
}

export async function applyFilters({ date, status, search } = {}) {
  const current = reservationsStore.getState().filters;
  const filters = {
    date: date !== undefined ? date : current.date,
    status: status !== undefined ? status : current.status,
    search: search !== undefined ? search : current.search,
  };

  const filtered = await reservationService.filterReservations(filters);
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

export async function getReservationByCode(code) {
  return await reservationService.getReservationByCode(code);
}

export async function getReservationsByUser(userId) {
  return await reservationService.getReservationsByUser(userId);
}

export async function refreshReservations() {
  const all = await reservationService.getAllReservations();
  const filters = reservationsStore.getState().filters;
  const filtered = await reservationService.filterReservations(filters);
  reservationsStore.setState({ reservations: all, filteredReservations: filtered });
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
  getState,
  subscribe,
};
