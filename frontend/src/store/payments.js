import { createStore } from "./index.js";
import * as paymentService from "../services/paymentService.js";

const paymentsStore = createStore({
  payments: [],
  filteredPayments: [],
  filters: { status: "", search: "", date: "" },
  selectedPayment: null,
  error: null,
});

export async function loadPayments() {
  const all = await paymentService.getAllPayments();
  paymentsStore.setState({ payments: all, filteredPayments: all });
}

export async function applyFilters({ status, search, date } = {}) {
  const current = paymentsStore.getState().filters;
  const filters = {
    status: status !== undefined ? status : current.status,
    search: search !== undefined ? search : current.search,
    date: date !== undefined ? date : current.date,
  };

  const filtered = await paymentService.filterPayments(filters);
  paymentsStore.setState({ filters, filteredPayments: filtered });
}

export function clearFilters() {
  const all = paymentsStore.getState().payments;
  paymentsStore.setState({
    filters: { status: "", search: "", date: "" },
    filteredPayments: all,
  });
}

export function getFilteredPayments() {
  return paymentsStore.getState().filteredPayments;
}

export async function getPaymentById(id) {
  return await paymentService.getPaymentById(id);
}

export async function refreshPayments() {
  const all = await paymentService.getAllPayments();
  const filters = paymentsStore.getState().filters;
  const filtered = await paymentService.filterPayments(filters);
  paymentsStore.setState({ payments: all, filteredPayments: filtered });
}

export function getState() {
  return paymentsStore.getState();
}

export function subscribe(listener) {
  return paymentsStore.subscribe(listener);
}

export default {
  loadPayments,
  applyFilters,
  clearFilters,
  getFilteredPayments,
  getPaymentById,
  refreshPayments,
  getState,
  subscribe,
};
