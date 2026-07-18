import {
  getAllProducts,
  getAllCategories,
  initMockProducts,
  initMockCategories,
} from "../services/menuService.js";

initMockCategories();
initMockProducts();

export const menuItems = getAllProducts()
  .map(function (product) {
    var category = getAllCategories().find(function (c) {
      return c.id === product.category_id;
    });
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      cat: category ? category.name : "Other",
      emoji: product.image_url || null,
    };
  })
  .filter(function (item) {
    return item.available;
  });

export const allOrders = [
  {
    id: 1043,
    table: 3,
    items: [
      { name: "Margherita Pizza", qty: 1, price: 14.0 },
      { name: "Caesar Salad", qty: 1, price: 12.0 },
      { name: "Iced Tea", qty: 2, price: 4.0 },
    ],
    total: 38.5,
    status: "draft",
    time: "1 min ago",
    note: "Sin camareros \u2014 cocinero pide no usar camareros en la pizza",
    server: "Maria C.",
    createdBy: "waiter",
    placedAt: "8:42 PM",
  },
  {
    id: 1042,
    table: 5,
    items: [
      { name: "Grilled Chicken", qty: 2, price: 18.5 },
      { name: "Caesar Salad", qty: 1, price: 12.0 },
    ],
    total: 49.3,
    status: "completed",
    time: "2 min ago",
    note: null,
    server: "Juan R.",
    createdBy: "waiter",
    placedAt: "8:30 PM",
  },
  {
    id: 1041,
    table: 2,
    items: [
      { name: "Ribeye Steak", qty: 1, price: 32.0 },
      { name: "Grilled Salmon", qty: 1, price: 24.0 },
      { name: "House Wine", qty: 2, price: 8.0 },
    ],
    total: 79.2,
    status: "preparing",
    time: "8 min ago",
    note: "Allergy: shellfish",
    server: "Maria C.",
    createdBy: "admin",
    placedAt: "8:22 PM",
  },
  {
    id: 1040,
    table: 8,
    items: [
      { name: "Classic Burger", qty: 1, price: 15.0 },
      { name: "French Fries", qty: 1, price: 5.0 },
    ],
    total: 22.0,
    status: "new",
    time: "12 min ago",
    note: null,
    server: "Juan R.",
    createdBy: "waiter",
    placedAt: "8:18 PM",
  },
  {
    id: 1039,
    table: 1,
    items: [
      { name: "Fish Tacos", qty: 2, price: 13.5 },
      { name: "Guacamole", qty: 1, price: 8.0 },
    ],
    total: 37.4,
    status: "completed",
    time: "18 min ago",
    note: null,
    server: "Maria C.",
    createdBy: "waiter",
    placedAt: "8:10 PM",
  },
  {
    id: 1038,
    table: 10,
    items: [
      { name: "Pasta Carbonara", qty: 2, price: 16.0 },
      { name: "Bruschetta", qty: 1, price: 8.0 },
      { name: "Tiramisu", qty: 1, price: 9.0 },
      { name: "House Wine", qty: 2, price: 8.0 },
    ],
    total: 64.9,
    status: "cancelled",
    time: "25 min ago",
    note: "Cliente se fue",
    server: "Juan R.",
    createdBy: "admin",
    placedAt: "7:55 PM",
  },
  {
    id: 1037,
    table: 6,
    items: [
      { name: "Margherita Pizza", qty: 2, price: 14.0 },
      { name: "Sparkling Water", qty: 2, price: 3.0 },
    ],
    total: 37.4,
    status: "completed",
    time: "35 min ago",
    note: null,
    server: "Maria C.",
    createdBy: "waiter",
    placedAt: "7:45 PM",
  },
  {
    id: 1036,
    table: 3,
    items: [
      { name: "Club Sandwich", qty: 1, price: 11.0 },
      { name: "Onion Rings", qty: 1, price: 6.5 },
      { name: "Iced Tea", qty: 1, price: 4.0 },
    ],
    total: 23.65,
    status: "completed",
    time: "42 min ago",
    note: null,
    server: "Juan R.",
    createdBy: "waiter",
    placedAt: "7:38 PM",
  },
  {
    id: 1035,
    table: 9,
    items: [
      { name: "Ribeye Steak", qty: 2, price: 32.0 },
      { name: "Caesar Salad", qty: 2, price: 12.0 },
      { name: "House Wine", qty: 2, price: 8.0 },
    ],
    total: 118.8,
    status: "completed",
    time: "50 min ago",
    note: null,
    server: "Maria C.",
    createdBy: "admin",
    placedAt: "7:30 PM",
  },
];

export let kitchenOrders = [
  {
    id: 1039,
    table: 8,
    status: "new",
    time: 2,
    items: [
      { qty: 2, name: "Grilled Chicken" },
      { qty: 1, name: "Caesar Salad" },
    ],
    note: null,
  },
  {
    id: 1044,
    table: 3,
    status: "new",
    time: 5,
    items: [
      { qty: 1, name: "Margherita Pizza" },
      { qty: 2, name: "Sparkling Water" },
      { qty: 1, name: "Tiramisu" },
    ],
    note: "No olives on pizza",
  },
  {
    id: 1045,
    table: 11,
    status: "new",
    time: 1,
    items: [
      { qty: 3, name: "Classic Burger" },
      { qty: 3, name: "French Fries" },
    ],
    note: null,
  },
  {
    id: 1041,
    table: 2,
    status: "preparing",
    time: 18,
    items: [
      { qty: 1, name: "Ribeye Steak (medium-rare)" },
      { qty: 1, name: "Grilled Salmon" },
      { qty: 2, name: "House Wine" },
    ],
    note: "Allergy: shellfish",
  },
  {
    id: 1037,
    table: 6,
    status: "preparing",
    time: 8,
    items: [
      { qty: 2, name: "Pasta Carbonara" },
      { qty: 1, name: "Bruschetta" },
    ],
    note: null,
  },
  {
    id: 1042,
    table: 5,
    status: "ready",
    time: 4,
    items: [
      { qty: 1, name: "Club Sandwich" },
      { qty: 1, name: "Onion Rings" },
      { qty: 1, name: "Iced Tea" },
    ],
    note: null,
  },
  {
    id: 1043,
    table: 1,
    status: "ready",
    time: 1,
    items: [
      { qty: 2, name: "Fish Tacos" },
      { qty: 1, name: "Guacamole" },
    ],
    note: null,
  },
];

export function setKitchenOrders(arr) {
  kitchenOrders.length = 0;
  arr.forEach(function (o) {
    kitchenOrders.push(o);
  });
}

export const areas = [
  { id: 1, name: "Main Hall", icon: "home" },
  { id: 2, name: "Terrace", icon: "sun" },
  { id: 3, name: "Seaside Pier", icon: "waves" },
];

export const tables = [
  { id: 1, seats: 4, area: 1, status: "available", info: "Free", timer: null },
  { id: 2, seats: 6, area: 1, status: "occupied", info: "Order #1041", timer: "24 min" },
  { id: 3, seats: 2, area: 1, status: "occupied", info: "Order #1043", timer: "0 min" },
  { id: 4, seats: 4, area: 1, status: "available", info: "Free", timer: null },
  { id: 5, seats: 4, area: 2, status: "occupied", info: "Order #1042", timer: "6 min" },
  { id: 6, seats: 8, area: 2, status: "occupied", info: "Order #1037", timer: "32 min" },
  { id: 7, seats: 2, area: 2, status: "reserved", info: "7:30 PM", timer: null },
  { id: 8, seats: 4, area: 3, status: "occupied", info: "Order #1040", timer: "12 min" },
  { id: 9, seats: 6, area: 3, status: "available", info: "Free", timer: null },
  { id: 10, seats: 4, area: 3, status: "reserved", info: "8:00 PM", timer: null },
  { id: 11, seats: 2, area: 1, status: "available", info: "Free", timer: null },
  { id: 12, seats: 6, area: 2, status: "available", info: "Free", timer: null },
];

export const LIFECYCLE = ["draft", "new", "preparing", "ready", "served", "completed"];

export function canTransition(role, from, to) {
  if (to === "cancelled") return role === "admin";
  if (role === "admin") return true;
  if (role === "waiter") {
    var fi = LIFECYCLE.indexOf(from);
    var ti = LIFECYCLE.indexOf(to);
    if (fi === -1 || ti === -1) return false;
    return ti === fi + 1;
  }
  if (role === "cook") {
    var fi2 = LIFECYCLE.indexOf(from);
    var ti2 = LIFECYCLE.indexOf(to);
    if (fi2 === -1 || ti2 === -1) return false;
    return ti2 === fi2 + 1 && fi2 >= 1 && ti2 <= 4;
  }
  return false;
}

export function recalcOrder(order) {
  var subtotal = order.items.reduce(function (sum, i) {
    return sum + (i.price || 0) * i.qty;
  }, 0);
  order.total = Math.round(subtotal * 1.1 * 100) / 100;
}

export var currentRole = "admin";

export function setCurrentRole(role) {
  currentRole = role;
}
