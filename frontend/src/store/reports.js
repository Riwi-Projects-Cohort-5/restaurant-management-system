import { createStore } from "./index.js";
import * as reportService from "../services/reportService.js";

var reportsStore = createStore({
  sales: null,
  topProducts: [],
  dailySales: [],
  todayStats: null,
});

export async function loadSalesReport(startDate, endDate) {
  var sales = await reportService.getSalesReport(startDate, endDate);
  reportsStore.setState({ sales: sales });
}

export async function loadTopProducts(startDate, endDate, limit) {
  var products = await reportService.getTopProducts(startDate, endDate, limit);
  reportsStore.setState({ topProducts: products });
}

export async function loadDailySales(startDate, endDate) {
  var daily = await reportService.getDailySales(startDate, endDate);
  reportsStore.setState({ dailySales: daily });
}

export async function loadTodayStats() {
  var stats = await reportService.getTodayStats();
  reportsStore.setState({ todayStats: stats });
}

export function getState() {
  return reportsStore.getState();
}

export function subscribe(listener) {
  return reportsStore.subscribe(listener);
}
