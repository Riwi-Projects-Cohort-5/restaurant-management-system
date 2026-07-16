const AREAS_KEY = "rms_areas";
const TABLES_KEY = "rms_tables";

const DEFAULT_AREAS = [
  { id: 1, name: "Main Hall", icon: "home" },
  { id: 2, name: "Terrace", icon: "sun" },
  { id: 3, name: "Seaside Pier", icon: "waves" },
];

const DEFAULT_TABLES = [
  { id: 1, seats: 4, area: 1, status: "occupied", info: "Order #1041", timer: "24 min" },
  { id: 2, seats: 2, area: 1, status: "occupied", info: "Order #1038", timer: "30 min" },
  { id: 3, seats: 4, area: 1, status: "occupied", info: "Order #1043", timer: "1 min" },
  { id: 4, seats: 6, area: 1, status: "available", info: "Free", timer: null },
  { id: 5, seats: 2, area: 1, status: "occupied", info: "Order #1040", timer: "18 min" },
  { id: 6, seats: 4, area: 2, status: "reserved", info: "7:30 PM", timer: null },
  { id: 7, seats: 2, area: 2, status: "occupied", info: "Order #1042", timer: "5 min" },
  { id: 8, seats: 8, area: 2, status: "available", info: "Free", timer: null },
  { id: 9, seats: 4, area: 2, status: "available", info: "Free", timer: null },
  { id: 10, seats: 6, area: 3, status: "occupied", info: "Order #1039", timer: "25 min" },
  { id: 11, seats: 4, area: 3, status: "reserved", info: "8:00 PM", timer: null },
  { id: 12, seats: 2, area: 3, status: "available", info: "Free", timer: null },
];

function delay(ms = 80) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function initIfEmpty(key, defaults) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(defaults));
  }
  return JSON.parse(localStorage.getItem(key));
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function fetchAreas() {
  await delay();
  const areas = initIfEmpty(AREAS_KEY, DEFAULT_AREAS);
  return { ok: true, data: areas };
}

export async function fetchTables() {
  await delay();
  const tables = initIfEmpty(TABLES_KEY, DEFAULT_TABLES);
  return { ok: true, data: tables };
}

export async function createArea(areaData) {
  await delay();
  const areas = initIfEmpty(AREAS_KEY, DEFAULT_AREAS);
  const newArea = {
    id: Date.now(),
    name: areaData.name,
    icon: areaData.icon || "home",
  };
  areas.push(newArea);
  save(AREAS_KEY, areas);
  return { ok: true, data: newArea };
}

export async function updateArea(id, updates) {
  await delay();
  const areas = initIfEmpty(AREAS_KEY, DEFAULT_AREAS);
  const idx = areas.findIndex((a) => a.id === id);
  if (idx === -1) return { ok: false, error: "Area not found" };
  areas[idx] = { ...areas[idx], ...updates };
  save(AREAS_KEY, areas);
  return { ok: true, data: areas[idx] };
}

export async function deleteArea(id) {
  await delay();
  const areas = initIfEmpty(AREAS_KEY, DEFAULT_AREAS);
  const filtered = areas.filter((a) => a.id !== id);
  if (filtered.length === areas.length) return { ok: false, error: "Area not found" };
  save(AREAS_KEY, filtered);
  return { ok: true };
}

export async function createTable(tableData) {
  await delay();
  const tables = initIfEmpty(TABLES_KEY, DEFAULT_TABLES);
  const newTable = {
    id: Date.now(),
    seats: tableData.seats || 4,
    area: tableData.area,
    status: "available",
    info: "Free",
    timer: null,
  };
  tables.push(newTable);
  save(TABLES_KEY, tables);
  return { ok: true, data: newTable };
}

export async function updateTable(id, updates) {
  await delay();
  const tables = initIfEmpty(TABLES_KEY, DEFAULT_TABLES);
  const idx = tables.findIndex((t) => t.id === id);
  if (idx === -1) return { ok: false, error: "Table not found" };
  tables[idx] = { ...tables[idx], ...updates };
  save(TABLES_KEY, tables);
  return { ok: true, data: tables[idx] };
}

export async function deleteTable(id) {
  await delay();
  const tables = initIfEmpty(TABLES_KEY, DEFAULT_TABLES);
  const filtered = tables.filter((t) => t.id !== id);
  if (filtered.length === tables.length) return { ok: false, error: "Table not found" };
  save(TABLES_KEY, filtered);
  return { ok: true };
}
