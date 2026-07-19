import { createStore } from "./index.js";
import * as reportService from "../services/mockReports.js";

reportService.initMockReports();

const reportsStore = createStore({
  sales: null,
  topProducts: [],
  dailySales: [],
});

export function loadSalesReport(startDate, endDate) {
  const sales = reportService.getSalesReport(startDate, endDate);
  reportsStore.setState({ sales: sales });
}

export function loadTopProducts(startDate, endDate, limit) {
  const products = reportService.getTopProducts(startDate, endDate, limit);
  reportsStore.setState({ topProducts: products });
}

export function loadDailySales() {
  const daily = reportService.getDailySales();
  reportsStore.setState({ dailySales: daily });
}

export function getState() {
  return reportsStore.getState();
}

export function subscribe(listener) {
  return reportsStore.subscribe(listener);
}
