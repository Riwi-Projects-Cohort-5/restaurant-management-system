import { createStore } from "./index.js";
import * as menuService from "../services/menuService.js";

const menuStore = createStore({
  products: menuService.getAllProducts(),
  categories: menuService.getAllCategories(),
  filteredProducts: menuService.getAllProducts(),
  filters: { category: "", available: "", search: "" },
  selectedProduct: null,
  error: null,
});

export function loadProducts() {
  const all = menuService.getAllProducts();
  menuStore.setState({ products: all, filteredProducts: all });
}

export function loadCategories() {
  const cats = menuService.getAllCategories();
  menuStore.setState({ categories: cats });
}

export function applyFilters({ category, available, search } = {}) {
  const current = menuStore.getState().filters;
  const filters = {
    category: category !== undefined ? category : current.category,
    available: available !== undefined ? available : current.available,
    search: search !== undefined ? search : current.search,
  };

  const filtered = menuService.filterProducts(filters);
  menuStore.setState({ filters, filteredProducts: filtered });
}

export function clearFilters() {
  const all = menuStore.getState().products;
  menuStore.setState({
    filters: { category: "", available: "", search: "" },
    filteredProducts: all,
  });
}

export function getFilteredProducts() {
  return menuStore.getState().filteredProducts;
}

export function getProductById(id) {
  return menuService.getProductById(id);
}

export function refreshProducts() {
  const all = menuService.getAllProducts();
  const filters = menuStore.getState().filters;
  const filtered = menuService.filterProducts(filters);
  menuStore.setState({ products: all, filteredProducts: filtered });
}

export function getState() {
  return menuStore.getState();
}

export function subscribe(listener) {
  return menuStore.subscribe(listener);
}

export default {
  loadProducts,
  loadCategories,
  applyFilters,
  clearFilters,
  getFilteredProducts,
  getProductById,
  refreshProducts,
  getState,
  subscribe,
};
