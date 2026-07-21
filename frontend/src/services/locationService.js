import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

function mapLocation(loc) {
  return {
    id: loc.id,
    name: loc.name,
    created_at: loc.created_at,
    updated_at: loc.updated_at,
  };
}

export async function getAllLocations() {
  try {
    const items = await apiGet("/api/v1/locations/");
    return items.map(mapLocation);
  } catch {
    return [];
  }
}

export async function getLocationById(id) {
  try {
    const item = await apiGet("/api/v1/locations/" + id);
    return mapLocation(item);
  } catch {
    return null;
  }
}

export async function createLocation(data) {
  try {
    const item = await apiPost("/api/v1/locations/", { name: data.name });
    return { success: true, location: mapLocation(item) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateLocation(id, data) {
  try {
    const item = await apiPut("/api/v1/locations/" + id, { name: data.name });
    return { success: true, location: mapLocation(item) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteLocation(id) {
  try {
    await apiDelete("/api/v1/locations/" + id);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
