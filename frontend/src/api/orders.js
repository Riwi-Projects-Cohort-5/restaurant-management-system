const STORAGE_KEY = "rms_orders";

const DEFAULT_ORDERS = [
  {
    id: 1043, table: 3, items: [
      { name: "Margherita Pizza", qty: 1, price: 14.00 },
      { name: "Sparkling Water", qty: 2, price: 3.00 },
      { name: "Tiramisu", qty: 1, price: 9.00 },
    ],
    total: 38.50, status: "new", time: "1 min ago", note: "Extra dressing",
    server: "Maria C.", createdBy: "waiter", placedAt: "8:30 PM",
  },
  {
    id: 1042, table: 7, items: [
      { name: "Grilled Chicken", qty: 2, price: 24.00 },
      { name: "Caesar Salad", qty: 1, price: 12.00 },
    ],
    total: 60.00, status: "preparing", time: "5 min ago", note: null,
    server: "Carlos R.", createdBy: "waiter", placedAt: "8:25 PM",
  },
  {
    id: 1041, table: 1, items: [
      { name: "Pasta Carbonara", qty: 1, price: 18.00 },
      { name: "Garlic Bread", qty: 2, price: 5.00 },
      { name: "Iced Tea", qty: 2, price: 3.50 },
    ],
    total: 35.00, status: "ready", time: "12 min ago", note: null,
    server: "Ana L.", createdBy: "waiter", placedAt: "8:18 PM",
  },
  {
    id: 1040, table: 5, items: [
      { name: "Pepperoni Pizza", qty: 1, price: 16.00 },
      { name: "Cola", qty: 2, price: 2.50 },
    ],
    total: 21.00, status: "served", time: "18 min ago", note: null,
    server: "Maria C.", createdBy: "waiter", placedAt: "8:12 PM",
  },
  {
    id: 1039, table: 10, items: [
      { name: "Fish Tacos", qty: 3, price: 15.00 },
      { name: "Guacamole", qty: 1, price: 8.00 },
    ],
    total: 53.00, status: "completed", time: "25 min ago", note: null,
    server: "Carlos R.", createdBy: "admin", placedAt: "8:05 PM",
  },
  {
    id: 1038, table: 2, items: [
      { name: "Veggie Burger", qty: 1, price: 16.00 },
      { name: "Fries", qty: 1, price: 6.00 },
    ],
    total: 22.00, status: "completed", time: "30 min ago", note: "No onions",
    server: "Ana L.", createdBy: "waiter", placedAt: "8:00 PM",
  },
  {
    id: 1037, table: 8, items: [
      { name: "Steak", qty: 2, price: 32.00 },
      { name: "Mashed Potatoes", qty: 2, price: 7.00 },
      { name: "Red Wine", qty: 1, price: 12.00 },
    ],
    total: 90.00, status: "new", time: "0 min ago", note: "Medium rare",
    server: "Maria C.", createdBy: "admin", placedAt: "8:30 PM",
  },
  {
    id: 1036, table: 4, items: [
      { name: "Chicken Wings", qty: 2, price: 12.00 },
      { name: "Beer", qty: 2, price: 5.00 },
    ],
    total: 34.00, status: "cancelled", time: "40 min ago", note: null,
    server: "Carlos R.", createdBy: "waiter", placedAt: "7:50 PM",
  },
  {
    id: 1035, table: 12, items: [
      { name: "Caesar Salad", qty: 1, price: 12.00 },
      { name: "Sparkling Water", qty: 1, price: 3.00 },
    ],
    total: 15.00, status: "completed", time: "45 min ago", note: null,
    server: "Ana L.", createdBy: "waiter", placedAt: "7:45 PM",
  },
];

const STORAGE_MENU_KEY = "rms_menu";

const DEFAULT_MENU = [
  { id: 1, name: "Margherita Pizza", price: 14.00, cat: "Pizza", emoji: "\uD83C\uDF55" },
  { id: 2, name: "Pepperoni Pizza", price: 16.00, cat: "Pizza", emoji: "\uD83C\uDF55" },
  { id: 3, name: "Grilled Chicken", price: 24.00, cat: "Main Course", emoji: "\uD83E\uDD69" },
  { id: 4, name: "Pasta Carbonara", price: 18.00, cat: "Main Course", emoji: "\uD83C\uDF5D" },
  { id: 5, name: "Steak", price: 32.00, cat: "Main Course", emoji: "\uD83E\uDD69" },
  { id: 6, name: "Fish Tacos", price: 15.00, cat: "Main Course", emoji: "\uD83C\uDF2E" },
  { id: 7, name: "Veggie Burger", price: 16.00, cat: "Burgers", emoji: "\uD83C\uDF54" },
  { id: 8, name: "Caesar Salad", price: 12.00, cat: "Salads", emoji: "\uD83E\uDD57" },
  { id: 9, name: "Garlic Bread", price: 5.00, cat: "Appetizers", emoji: "\uD83C\uDF5E" },
  { id: 10, name: "Chicken Wings", price: 12.00, cat: "Appetizers", emoji: "\uD83E\uDD69" },
  { id: 11, name: "Guacamole", price: 8.00, cat: "Appetizers", emoji: "\uD83E\uDD51" },
  { id: 12, name: "Fries", price: 6.00, cat: "Appetizers", emoji: "\uD83C\uDF5F" },
  { id: 13, name: "Mashed Potatoes", price: 7.00, cat: "Appetizers", emoji: "\uD83E\uDD54" },
  { id: 14, name: "Tiramisu", price: 9.00, cat: "Desserts", emoji: "\uD83C\uDF70" },
  { id: 15, name: "Cola", price: 2.50, cat: "Drinks", emoji: "\uD83E\uDD64" },
  { id: 16, name: "Iced Tea", price: 3.50, cat: "Drinks", emoji: "\uD83C\uDF75" },
  { id: 17, name: "Sparkling Water", price: 3.00, cat: "Drinks", emoji: "\uD83D\uDCA7" },
  { id: 18, name: "Beer", price: 5.00, cat: "Drinks", emoji: "\uD83C\uDF7A" },
  { id: 19, name: "Red Wine", price: 12.00, cat: "Drinks", emoji: "\uD83C\uDF77" },
];

function delay(ms = 100) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getOrders() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
  return [...DEFAULT_ORDERS];
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export async function fetchOrders(filter = "all") {
  await delay();
  let orders = getOrders();
  if (filter !== "all") {
    orders = orders.filter((o) => o.status === filter);
  }
  return { ok: true, data: orders };
}

export async function fetchOrderById(id) {
  await delay();
  const orders = getOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return { ok: false, error: "Order not found" };
  return { ok: true, data: order };
}

export async function createOrder(orderData) {
  await delay();
  const orders = getOrders();
  const newOrder = {
    id: Date.now(),
    table: orderData.table,
    items: orderData.items,
    total: orderData.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    status: "new",
    time: "0 min ago",
    note: orderData.note || null,
    server: orderData.server || "Unknown",
    createdBy: orderData.createdBy || "waiter",
    placedAt: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
  orders.unshift(newOrder);
  saveOrders(orders);
  return { ok: true, data: newOrder };
}

export async function updateOrderStatus(id, newStatus) {
  await delay();
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return { ok: false, error: "Order not found" };
  orders[idx].status = newStatus;
  saveOrders(orders);
  return { ok: true, data: orders[idx] };
}

export async function fetchMenu() {
  await delay();
  let menu = localStorage.getItem(STORAGE_MENU_KEY);
  if (menu) return { ok: true, data: JSON.parse(menu) };
  localStorage.setItem(STORAGE_MENU_KEY, JSON.stringify(DEFAULT_MENU));
  return { ok: true, data: [...DEFAULT_MENU] };
}

export async function fetchMenuCategories() {
  await delay();
  const { data: menu } = await fetchMenu();
  const cats = [...new Set(menu.map((m) => m.cat))];
  return { ok: true, data: cats };
}
