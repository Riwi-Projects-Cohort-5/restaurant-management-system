export const menuItems = [
  { id: 1, name: 'Grilled Chicken', price: 18.50, cat: 'Main Course', emoji: '\uD83C\uDF57' },
  { id: 2, name: 'Ribeye Steak', price: 32.00, cat: 'Main Course', emoji: '\uD83E\uDD69' },
  { id: 3, name: 'Margherita Pizza', price: 14.00, cat: 'Pizza', emoji: '\uD83C\uDF55' },
  { id: 4, name: 'Caesar Salad', price: 12.00, cat: 'Salads', emoji: '\uD83E\uDD57' },
  { id: 5, name: 'Classic Burger', price: 15.00, cat: 'Burgers', emoji: '\uD83C\uDF54' },
  { id: 6, name: 'Pasta Carbonara', price: 16.00, cat: 'Main Course', emoji: '\uD83C\uDF5D' },
  { id: 7, name: 'Fish Tacos', price: 13.50, cat: 'Main Course', emoji: '\uD83C\uDF2E' },
  { id: 8, name: 'Club Sandwich', price: 11.00, cat: 'Burgers', emoji: '\uD83E\uDD6A' },
  { id: 9, name: 'French Fries', price: 5.00, cat: 'Appetizers', emoji: '\uD83C\uDF5F' },
  { id: 10, name: 'Onion Rings', price: 6.50, cat: 'Appetizers', emoji: '\uD83E\uDDC5' },
  { id: 11, name: 'Bruschetta', price: 8.00, cat: 'Appetizers', emoji: '\uD83C\uDF5E' },
  { id: 12, name: 'Tiramisu', price: 9.00, cat: 'Desserts', emoji: '\uD83C\uDF70' },
  { id: 13, name: 'Sparkling Water', price: 3.00, cat: 'Drinks', emoji: '\uD83D\uDCA7' },
  { id: 14, name: 'House Wine', price: 8.00, cat: 'Drinks', emoji: '\uD83C\uDF77' },
  { id: 15, name: 'Iced Tea', price: 4.00, cat: 'Drinks', emoji: '\uD83E\uDDCA' },
  { id: 16, name: 'Grilled Salmon', price: 24.00, cat: 'Main Course', emoji: '\uD83C\uDF1F' },
];

export const allOrders = [
  { id: 1043, table: 3, items: [{name:'Margherita Pizza',qty:1,price:14.00},{name:'Caesar Salad',qty:1,price:12.00},{name:'Iced Tea',qty:2,price:4.00}], total: 38.50, status: 'draft', time: '1 min ago', note: 'Sin camareros \u2014 cocinero pide no usar camareros en la pizza', server: 'Maria C.', createdBy: 'waiter', placedAt: '8:42 PM' },
  { id: 1042, table: 5, items: [{name:'Grilled Chicken',qty:2,price:18.50},{name:'Caesar Salad',qty:1,price:12.00}], total: 49.30, status: 'completed', time: '2 min ago', note: null, server: 'Juan R.', createdBy: 'waiter', placedAt: '8:30 PM' },
  { id: 1041, table: 2, items: [{name:'Ribeye Steak',qty:1,price:32.00},{name:'Grilled Salmon',qty:1,price:24.00},{name:'House Wine',qty:2,price:8.00}], total: 79.20, status: 'preparing', time: '8 min ago', note: 'Allergy: shellfish', server: 'Maria C.', createdBy: 'admin', placedAt: '8:22 PM' },
  { id: 1040, table: 8, items: [{name:'Classic Burger',qty:1,price:15.00},{name:'French Fries',qty:1,price:5.00}], total: 22.00, status: 'new', time: '12 min ago', note: null, server: 'Juan R.', createdBy: 'waiter', placedAt: '8:18 PM' },
  { id: 1039, table: 1, items: [{name:'Fish Tacos',qty:2,price:13.50},{name:'Guacamole',qty:1,price:8.00}], total: 37.40, status: 'completed', time: '18 min ago', note: null, server: 'Maria C.', createdBy: 'waiter', placedAt: '8:10 PM' },
  { id: 1038, table: 10, items: [{name:'Pasta Carbonara',qty:2,price:16.00},{name:'Bruschetta',qty:1,price:8.00},{name:'Tiramisu',qty:1,price:9.00},{name:'House Wine',qty:2,price:8.00}], total: 64.90, status: 'cancelled', time: '25 min ago', note: 'Cliente se fue', server: 'Juan R.', createdBy: 'admin', placedAt: '7:55 PM' },
  { id: 1037, table: 6, items: [{name:'Margherita Pizza',qty:2,price:14.00},{name:'Sparkling Water',qty:2,price:3.00}], total: 37.40, status: 'completed', time: '35 min ago', note: null, server: 'Maria C.', createdBy: 'waiter', placedAt: '7:45 PM' },
  { id: 1036, table: 3, items: [{name:'Club Sandwich',qty:1,price:11.00},{name:'Onion Rings',qty:1,price:6.50},{name:'Iced Tea',qty:1,price:4.00}], total: 23.65, status: 'completed', time: '42 min ago', note: null, server: 'Juan R.', createdBy: 'waiter', placedAt: '7:38 PM' },
  { id: 1035, table: 9, items: [{name:'Ribeye Steak',qty:2,price:32.00},{name:'Caesar Salad',qty:2,price:12.00},{name:'House Wine',qty:2,price:8.00}], total: 118.80, status: 'completed', time: '50 min ago', note: null, server: 'Maria C.', createdBy: 'admin', placedAt: '7:30 PM' },
];

export let kitchenOrders = [
  { id: 1039, table: 8, status: 'new', time: 2, items: [{qty:2,name:'Grilled Chicken'},{qty:1,name:'Caesar Salad'}], note: null },
  { id: 1044, table: 3, status: 'new', time: 5, items: [{qty:1,name:'Margherita Pizza'},{qty:2,name:'Sparkling Water'},{qty:1,name:'Tiramisu'}], note: 'No olives on pizza' },
  { id: 1045, table: 11, status: 'new', time: 1, items: [{qty:3,name:'Classic Burger'},{qty:3,name:'French Fries'}], note: null },
  { id: 1041, table: 2, status: 'preparing', time: 18, items: [{qty:1,name:'Ribeye Steak (medium-rare)'},{qty:1,name:'Grilled Salmon'},{qty:2,name:'House Wine'}], note: 'Allergy: shellfish' },
  { id: 1037, table: 6, status: 'preparing', time: 8, items: [{qty:2,name:'Pasta Carbonara'},{qty:1,name:'Bruschetta'}], note: null },
  { id: 1042, table: 5, status: 'ready', time: 4, items: [{qty:1,name:'Club Sandwich'},{qty:1,name:'Onion Rings'},{qty:1,name:'Iced Tea'}], note: null },
  { id: 1043, table: 1, status: 'ready', time: 1, items: [{qty:2,name:'Fish Tacos'},{qty:1,name:'Guacamole'}], note: null },
];

export function setKitchenOrders(arr) {
  kitchenOrders.length = 0;
  arr.forEach(function (o) { kitchenOrders.push(o); });
}

export const areas = [
  { id: 1, name: 'Main Hall', icon: 'home' },
  { id: 2, name: 'Terrace', icon: 'sun' },
  { id: 3, name: 'Seaside Pier', icon: 'waves' },
];

export const tables = [
  { id: 1, seats: 4, area: 1, status: 'available', info: 'Free', timer: null },
  { id: 2, seats: 6, area: 1, status: 'occupied', info: 'Order #1041', timer: '24 min' },
  { id: 3, seats: 2, area: 1, status: 'occupied', info: 'Order #1043', timer: '0 min' },
  { id: 4, seats: 4, area: 1, status: 'available', info: 'Free', timer: null },
  { id: 5, seats: 4, area: 2, status: 'occupied', info: 'Order #1042', timer: '6 min' },
  { id: 6, seats: 8, area: 2, status: 'occupied', info: 'Order #1037', timer: '32 min' },
  { id: 7, seats: 2, area: 2, status: 'reserved', info: '7:30 PM', timer: null },
  { id: 8, seats: 4, area: 3, status: 'occupied', info: 'Order #1040', timer: '12 min' },
  { id: 9, seats: 6, area: 3, status: 'available', info: 'Free', timer: null },
  { id: 10, seats: 4, area: 3, status: 'reserved', info: '8:00 PM', timer: null },
  { id: 11, seats: 2, area: 1, status: 'available', info: 'Free', timer: null },
  { id: 12, seats: 6, area: 2, status: 'available', info: 'Free', timer: null },
];

export const LIFECYCLE = ['draft','new','preparing','ready','served','completed'];

export function canTransition(role, from, to) {
  if (to === 'cancelled') return role === 'admin';
  if (role === 'admin') return true;
  if (role === 'waiter') {
    var fi = LIFECYCLE.indexOf(from);
    var ti = LIFECYCLE.indexOf(to);
    if (fi === -1 || ti === -1) return false;
    return ti === fi + 1;
  }
  if (role === 'cook') {
    var fi2 = LIFECYCLE.indexOf(from);
    var ti2 = LIFECYCLE.indexOf(to);
    if (fi2 === -1 || ti2 === -1) return false;
    return ti2 === fi2 + 1 && fi2 >= 1 && ti2 <= 4;
  }
  return false;
}

export function recalcOrder(order) {
  var subtotal = order.items.reduce(function (sum, i) { return sum + (i.price || 0) * i.qty; }, 0);
  order.total = Math.round(subtotal * 1.1 * 100) / 100;
}

export var currentRole = 'admin';

export function setCurrentRole(role) {
  currentRole = role;
}
