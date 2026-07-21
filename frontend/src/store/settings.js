import { createStore } from "./index.js";
import { apiGet, apiPut } from "../services/api.js";

const defaults = {
  restaurant_name: "El Fogon Caribeno",
  address: "",
  phone: "",
  email: "",
  tax_rate: 11.5,
  currency: "USD",
};

const settingsStore = createStore({
  settings: defaults,
  loaded: false,
});

function mapSetting(s) {
  return {
    restaurant_name: s.restaurant_name || defaults.restaurant_name,
    address: s.address || defaults.address,
    phone: s.phone || defaults.phone,
    email: s.email || defaults.email,
    tax_rate: s.tax_rate || defaults.tax_rate,
    currency: s.currency || defaults.currency,
  };
}

export async function loadSettings() {
  try {
    const data = await apiGet("/api/v1/settings/");
    settingsStore.setState({ settings: mapSetting(data), loaded: true });
  } catch {
    settingsStore.setState({ loaded: true });
  }
}

export function getSettings() {
  return settingsStore.getState().settings;
}

export async function updateSettings(data) {
  try {
    const result = await apiPut("/api/v1/settings/", data);
    settingsStore.setState({ settings: mapSetting(result) });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function resetSettings() {
  settingsStore.setState({ settings: defaults });
}

export function getState() {
  return settingsStore.getState();
}

export function subscribe(listener) {
  return settingsStore.subscribe(listener);
}
