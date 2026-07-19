import { createStore } from "./index.js";

var STORAGE_KEY = "restaurant_settings";

var defaults = {
  restaurant_name: "El Fogon Caribeno",
  address: "123 Main Street, San Juan, PR 00901",
  phone: "+1 787-555-0123",
  email: "info@elfogon.com",
  tax_rate: 11.5,
  currency_symbol: "$",
  currency_code: "USD",
};

function loadFromStorage() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

var settingsStore = createStore({
  settings: loadFromStorage() || defaults,
});

export function getSettings() {
  return settingsStore.getState().settings;
}

export function updateSettings(data) {
  var current = settingsStore.getState().settings;
  var updated = {};
  Object.keys(current).forEach(function (key) {
    updated[key] = data[key] !== undefined ? data[key] : current[key];
  });
  settingsStore.setState({ settings: updated });
  saveToStorage(updated);
}

export function resetSettings() {
  settingsStore.setState({ settings: defaults });
  saveToStorage(defaults);
}

export function getState() {
  return settingsStore.getState();
}

export function subscribe(listener) {
  return settingsStore.subscribe(listener);
}
