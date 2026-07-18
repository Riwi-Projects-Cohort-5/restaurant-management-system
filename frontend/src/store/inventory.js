import { createStore } from "./index.js";
import * as inventoryService from "../services/mockInventory.js";

var inventoryStore = createStore({
  items: [],
});

export function loadItems() {
  inventoryStore.setState({ items: inventoryService.getAllItems() });
}

export function refreshItems() {
  inventoryStore.setState({ items: inventoryService.getAllItems() });
}

export function getState() {
  return inventoryStore.getState();
}

export function subscribe(listener) {
  return inventoryStore.subscribe(listener);
}
