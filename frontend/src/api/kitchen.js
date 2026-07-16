import { fetchOrders, updateOrderStatus } from "./orders.js";

const KITCHEN_STATUSES = ["new", "preparing", "ready"];

function delay(ms = 80) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchKitchenOrders() {
  await delay();
  const { ok, data: allOrders } = await fetchOrders();
  if (!ok) return { ok: false, error: "Failed to fetch orders" };

  const kitchenOrders = allOrders
    .filter((o) => KITCHEN_STATUSES.includes(o.status))
    .map((o) => ({
      id: o.id,
      table: o.table,
      status: o.status,
      time: parseTimeToMinutes(o.time),
      items: o.items.map((i) => ({ qty: i.qty, name: i.name })),
      note: o.note,
    }));

  return { ok: true, data: kitchenOrders };
}

export async function advanceKitchenOrder(id, currentStatus) {
  await delay();
  const statusFlow = { new: "preparing", preparing: "ready" };
  const next = statusFlow[currentStatus];
  if (!next) return { ok: false, error: "Cannot advance from this status" };
  return updateOrderStatus(id, next);
}

export async function markOrderServed(id) {
  await delay();
  return updateOrderStatus(id, "served");
}

function parseTimeToMinutes(timeStr) {
  if (typeof timeStr === "number") return timeStr;
  const match = timeStr?.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
