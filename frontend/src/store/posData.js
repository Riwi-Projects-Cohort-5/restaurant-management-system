import { apiGet, apiPost, apiPut, apiDelete } from "../services/api.js";
import * as menuService from "../services/menuService.js";
import * as locationService from "../services/locationService.js";

export let menuItems = [];
export let allOrders = [];
export let kitchenOrders = [];
export let draftOrders = [];
let draftCounter = 1;
const _userMap = {};
let _usersLoaded = false;
let _menuLoaded = false;

export const areas = [
  { id: 1, name: "Main Hall", icon: "home" },
  { id: 2, name: "Terrace", icon: "sun" },
  { id: 3, name: "Seaside Pier", icon: "waves" },
];

export let tables = [];

export const LIFECYCLE = ["draft", "new", "preparing", "ready", "served", "completed"];

const STATUS_MAP_TO_BACKEND = {
  draft: null,
  new: "pending",
  preparing: "in_progress",
  ready: "in_progress",
  served: "served",
  completed: "completed",
  cancelled: "cancelled",
};

const STATUS_MAP_TO_FRONTEND = {
  pending: "new",
  in_progress: "preparing",
  served: "served",
  completed: "completed",
  cancelled: "cancelled",
};

export async function loadUsers() {
  if (_usersLoaded) return;
  try {
    const users = await apiGet("/api/v1/users/");
    users.forEach(function (u) {
      _userMap[u.id] = u.full_name || u.username;
    });
    _usersLoaded = true;
  } catch {
    // ignore - userMap stays empty
  }
}

export async function loadMenuItems() {
  const products = await menuService.getAllProducts();
  const categories = await menuService.getAllCategories();
  menuItems = products
    .map(function (product) {
      const category = categories.find(function (c) {
        return c.id === product.category_id;
      });
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        available: product.available,
        cat: category ? category.name : "Other",
        emoji: product.image_url || null,
      };
    })
    .filter(function (item) {
      return item.available;
    });
  _menuLoaded = true;
}

export async function loadOrders() {
  try {
    await loadUsers();
    if (!_menuLoaded) await loadMenuItems();
    const orders = await apiGet("/api/v1/orders/?limit=50");
    allOrders = orders.map(function (o) {
      const serverName = _userMap[o.waiter_id] || o.waiter_id || "";
      return {
        id: typeof o.id === "string" ? o.id.slice(0, 8) : o.id,
        fullId: o.id,
        table: o.table_id,
        items: (o.order_items || []).map(function (oi) {
          const matched = menuItems.find(function (m) {
            return String(m.id) === String(oi.menu_item_id);
          });
          return {
            name: matched ? matched.name : oi.menu_item_id,
            qty: oi.quantity,
            price: parseFloat(oi.unit_price),
          };
        }),
        total: parseFloat(o.total),
        status: STATUS_MAP_TO_FRONTEND[o.status] || o.status,
        time: formatTimeAgo(o.created_at),
        note: null,
        server: serverName,
        createdBy: serverName,
        reservationId: o.reservation_id || null,
        placedAt: o.created_at
          ? new Date(o.created_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })
          : "",
      };
    });
  } catch {
    allOrders = [];
  }
}

export async function loadKitchenOrders() {
  try {
    const orders = await apiGet("/api/v1/kitchen/");
    const grouped = {};
    orders.forEach(function (o) {
      const key = o.order_id;
      if (!grouped[key]) {
        grouped[key] = {
          fullId: key,
          kitchenIds: [],
          items: [],
          statuses: [],
          lineStatuses: [],
          created_at: o.created_at,
          notes: null,
        };
      }
      grouped[key].kitchenIds.push(o.id);
      grouped[key].items.push({ name: o.menu_item_name, qty: o.quantity });
      grouped[key].statuses.push(o.status);
      grouped[key].lineStatuses.push({ id: o.id, status: o.status });
      if (o.notes) grouped[key].notes = o.notes;
      if (o.created_at && (!grouped[key].created_at || o.created_at < grouped[key].created_at)) {
        grouped[key].created_at = o.created_at;
      }
    });
    kitchenOrders = Object.keys(grouped).map(function (key) {
      const g = grouped[key];
      const matchedOrder = allOrders.find(function (o) {
        return o.fullId === key;
      });
      const tableNum = matchedOrder ? matchedOrder.table : 0;
      let status = "new";
      if (g.statuses.indexOf("preparing") !== -1) status = "preparing";
      if (
        g.statuses.every(function (s) {
          return s === "ready";
        })
      )
        status = "ready";
      if (
        g.statuses.every(function (s) {
          return s === "delivered";
        })
      )
        status = "served";
      return {
        id: typeof key === "string" ? key.slice(0, 8) : key,
        fullId: g.fullId,
        kitchenIds: g.kitchenIds,
        lineStatuses: g.lineStatuses,
        table: tableNum,
        status: status,
        time: g.created_at
          ? Math.floor((Date.now() - new Date(g.created_at).getTime()) / 60000)
          : 0,
        items: g.items,
        note: g.notes,
      };
    });
  } catch {
    kitchenOrders = [];
  }
}

export async function loadTables() {
  try {
    const items = await apiGet("/api/v1/tables/");
    tables = items.map(function (t, index) {
      return {
        id: t.id,
        number: t.number || index + 1,
        seats: t.capacity,
        area: t.location_id || null,
        areaName: t.location_ref ? t.location_ref.name : "",
        status: t.status || "available",
        info: t.status === "available" ? "Free" : t.status === "reserved" ? "Reserved" : "Occupied",
        timer: null,
      };
    });
  } catch {
    tables = [];
  }
}

export async function loadAreas() {
  const locs = await locationService.getAllLocations();
  areas.length = 0;
  locs.forEach(function (loc) {
    areas.push({ id: loc.id, name: loc.name, icon: "map-pin" });
  });
}

export async function createTable(tableData) {
  try {
    const result = await apiPost("/api/v1/tables/", {
      number: tableData.number,
      capacity: tableData.capacity,
      location_id: tableData.location_id || null,
    });
    await loadTables();
    return { success: true, table: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateTable(tableId, data) {
  try {
    const result = await apiPut("/api/v1/tables/" + tableId, {
      capacity: data.capacity,
      status: data.status,
      location_id: data.location_id,
    });
    await loadTables();
    return { success: true, table: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteTable(tableId) {
  try {
    await apiDelete("/api/v1/tables/" + tableId);
    await loadTables();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function createArea(areaData) {
  return locationService.createLocation(areaData);
}

export async function updateArea(areaId, areaData) {
  return locationService.updateLocation(areaId, areaData);
}

export async function deleteArea(areaId) {
  return locationService.deleteLocation(areaId);
}

export async function createOrder(tableId, reservationId) {
  try {
    const body = { table_id: tableId };
    if (reservationId) body.reservation_id = reservationId;
    const result = await apiPost("/api/v1/orders/", body);
    await loadOrders();
    return { success: true, order: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function addOrderItem(orderId, menuItemId, quantity, notes) {
  try {
    const body = {
      menu_item_id: menuItemId,
      quantity: quantity || 1,
    };
    if (notes) body.notes = notes;
    const result = await apiPost("/api/v1/orders/" + orderId + "/items", body);
    await loadOrders();
    return { success: true, order: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateOrderStatus(orderId, frontendStatus) {
  const backendStatus = STATUS_MAP_TO_BACKEND[frontendStatus];
  if (!backendStatus) return { success: false, error: "Cannot persist status: " + frontendStatus };
  try {
    const result = await apiPut("/api/v1/orders/" + orderId + "/status", { status: backendStatus });
    await loadOrders();
    await loadKitchenOrders();
    window.dispatchEvent(new CustomEvent("orders:updated"));
    return { success: true, order: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteOrder(orderId) {
  try {
    await apiDelete("/api/v1/orders/" + orderId);
    await loadOrders();
    await loadKitchenOrders();
    window.dispatchEvent(new CustomEvent("orders:updated"));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateKitchenOrderStatus(kitchenOrderId, newStatus, silent) {
  try {
    const result = await apiPut("/api/v1/kitchen/" + kitchenOrderId + "/status", {
      status: newStatus,
    });
    if (!silent) {
      await loadOrders();
      await loadKitchenOrders();
      window.dispatchEvent(new CustomEvent("orders:updated"));
    }
    return { success: true, order: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateAllKitchenOrderStatuses(
  lineStatuses,
  newStatus,
  expectedCurrentStatus
) {
  let lastResult;
  const targetIds = expectedCurrentStatus
    ? lineStatuses
        .filter(function (ls) {
          return ls.status === expectedCurrentStatus;
        })
        .map(function (ls) {
          return ls.id;
        })
    : lineStatuses.map(function (ls) {
        return ls.id;
      });
  if (targetIds.length === 0) {
    return { success: false, error: "No kitchen order IDs match the expected status" };
  }
  for (const kid of targetIds) {
    lastResult = await updateKitchenOrderStatus(kid, newStatus, true);
  }
  await loadOrders();
  await loadKitchenOrders();
  window.dispatchEvent(new CustomEvent("orders:updated"));
  return lastResult || { success: false, error: "No kitchen order IDs provided" };
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + " min ago";
  const hours = Math.floor(mins / 60);
  return hours + "h ago";
}

export function setKitchenOrders(arr) {
  kitchenOrders.length = 0;
  arr.forEach(function (o) {
    kitchenOrders.push(o);
  });
}

export function canTransition(role, from, to) {
  if (to === "cancelled") return role === "admin";
  if (role === "admin") return true;
  if (role === "waiter") {
    const fi = LIFECYCLE.indexOf(from);
    const ti = LIFECYCLE.indexOf(to);
    if (fi === -1 || ti === -1) return false;
    return ti === fi + 1 && fi >= 3;
  }
  if (role === "chef") {
    const fi2 = LIFECYCLE.indexOf(from);
    const ti2 = LIFECYCLE.indexOf(to);
    if (fi2 === -1 || ti2 === -1) return false;
    return ti2 === fi2 + 1 && fi2 >= 1 && ti2 <= 3;
  }
  return false;
}

export function recalcOrder(order) {
  const subtotal = order.items.reduce(function (sum, i) {
    return sum + (i.price || 0) * i.qty;
  }, 0);
  order.total = Math.round(subtotal * 1.1 * 100) / 100;
}

export let currentRole = "admin";

export function setCurrentRole(role) {
  currentRole = role;
}

export function saveDraft(cartItems, tableId) {
  const draft = {
    id: "draft-" + draftCounter++,
    table: tableId || null,
    items: cartItems.map(function (c) {
      return { name: c.name, qty: c.qty, price: c.price, id: c.id };
    }),
    total: 0,
    status: "draft",
    time: "Just now",
    note: null,
    server: "Admin",
    createdBy: "admin",
    placedAt: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  };
  recalcOrder(draft);
  draftOrders.unshift(draft);
  return draft;
}

export function deleteDraft(draftId) {
  draftOrders = draftOrders.filter(function (d) {
    return d.id !== draftId;
  });
}

export function getDraftById(draftId) {
  return (
    draftOrders.find(function (d) {
      return d.id === draftId;
    }) || null
  );
}
