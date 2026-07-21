import { createStore } from "./index.js";
import * as inventoryService from "../services/inventoryService.js";

const inventoryStore = createStore({
  items: [],
  lowStock: [],
});

export async function loadItems() {
  const items = await inventoryService.getAllItems();
  inventoryStore.setState({ items });
}

export async function loadLowStock() {
  const lowStock = await inventoryService.getLowStockItems();
  inventoryStore.setState({ lowStock });
}

export async function refreshItems() {
  const items = await inventoryService.getAllItems();
  inventoryStore.setState({ items });
}

export async function createItem(data) {
  const result = await inventoryService.createItem(data);
  if (result.success) {
    await refreshItems();
  }
  return result;
}

export async function updateItem(id, data) {
  const result = await inventoryService.updateItem(id, data);
  if (result.success) {
    await refreshItems();
  }
  return result;
}

export async function registerMovement(itemId, data) {
  return await inventoryService.registerMovement(itemId, data);
}

export function getState() {
  return inventoryStore.getState();
}

export function subscribe(listener) {
  return inventoryStore.subscribe(listener);
}
