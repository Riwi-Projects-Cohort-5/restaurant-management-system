/**
 * POS / Orders View
 * @route /pos
 *
 * Sub-views: orders-list, orders-new, orders-detail
 * Composes: PageHeader, OrderFilters, Card, DataTable, Badge, Button,
 *           CategoryTabs, MenuItemCard, CartPanel, StatusStepper,
 *           DetailGrid, DetailSection
 *
 * State:
 * - currentSubView: 'list' | 'new' | 'detail'
 * - currentFilter: 'all' | 'active' | 'closed'
 * - cart: []
 * - allOrders: []
 * - menuItems: []
 * - currentRoleId: number (for order detail)
 */

import { render as PageHeader } from '../../components/common/PageHeader.js';
import { render as OrderFilters } from '../../components/orders/OrderFilters.js';
import { render as Card } from '../../components/ui/Card.js';
import { render as DataTable } from '../../components/ui/DataTable.js';
import { render as Badge } from '../../components/ui/Badge.js';
import { render as CategoryTabs } from '../../components/pos/CategoryTabs.js';
import { render as MenuItemCard } from '../../components/pos/MenuItemCard.js';
import { render as CartPanel } from '../../components/pos/CartPanel.js';
import { render as StatusStepper } from '../../components/orders/StatusStepper.js';
import { render as DetailGrid } from '../../components/common/DetailGrid.js';
import { render as DetailSection } from '../../components/common/DetailSection.js';

const menuItems = [
  { id: 1, name: 'Grilled Chicken', price: 24.00, cat: 'Main Course', emoji: '\uD83C\uDF57' },
  { id: 2, name: 'Caesar Salad', price: 12.00, cat: 'Salads', emoji: '\uD83E\uDD57' },
  { id: 3, name: 'Margherita Pizza', price: 14.00, cat: 'Pizza', emoji: '\uD83C\uDF55' },
  { id: 4, name: 'Sparkling Water', price: 3.00, cat: 'Drinks', emoji: '\uD83D\uDCA7' },
  { id: 5, name: 'Tiramisu', price: 9.00, cat: 'Desserts', emoji: '\uD83C\uDF70' },
  { id: 6, name: 'Bruschetta', price: 8.00, cat: 'Appetizers', emoji: '\uD83C\uDF5E' },
  { id: 7, name: 'Ribeye Steak', price: 32.00, cat: 'Main Course', emoji: '\uD83E\uDD69' },
  { id: 8, name: 'Fish Tacos', price: 13.50, cat: 'Main Course', emoji: '\uD83C\uDF2E' },
  { id: 9, name: 'Pasta Carbonara', price: 16.00, cat: 'Main Course', emoji: '\uD83C\uDF5D' },
  { id: 10, name: 'Onion Rings', price: 6.50, cat: 'Appetizers', emoji: '\uD83E\uDDC5' },
  { id: 11, name: 'Club Sandwich', price: 11.00, cat: 'Burgers', emoji: '\uD83E\uDD6A' },
  { id: 12, name: 'Iced Tea', price: 4.00, cat: 'Drinks', emoji: '\uD83E\uDDCA' },
  { id: 13, name: 'House Wine', price: 8.00, cat: 'Drinks', emoji: '\uD83C\uDF77' },
  { id: 14, name: 'Guacamole', price: 8.00, cat: 'Appetizers', emoji: '\uD83E\uDD51' },
  { id: 15, name: 'Cheeseburger', price: 15.00, cat: 'Burgers', emoji: '\uD83C\uDF54' },
  { id: 16, name: 'Chocolate Lava Cake', price: 10.00, cat: 'Desserts', emoji: '\uD83C\uDF6B' },
];

const allOrders = [
  { id: 1043, table: 3, items: [{name:'Margherita Pizza',qty:1,price:14.00},{name:'Sparkling Water',qty:2,price:3.00},{name:'Tiramisu',qty:1,price:9.00}], total: 38.50, status: 'new', time: '1 min ago', note: null, server: 'Maria C.', createdBy: 'admin', placedAt: '8:30 PM' },
  { id: 1042, table: 5, items: [{name:'Grilled Chicken',qty:1,price:24.00},{name:'Caesar Salad',qty:1,price:12.00}], total: 42.00, status: 'preparing', time: '5 min ago', note: 'Extra dressing', server: 'Juan R.', createdBy: 'admin', placedAt: '8:25 PM' },
  { id: 1041, table: 2, items: [{name:'Ribeye Steak',qty:1,price:32.00},{name:'House Wine',qty:2,price:8.00},{name:'Caesar Salad',qty:2,price:12.00}], total: 65.50, status: 'ready', time: '12 min ago', note: null, server: 'Maria C.', createdBy: 'admin', placedAt: '8:18 PM' },
  { id: 1040, table: 8, items: [{name:'Fish Tacos',qty:2,price:13.50}], total: 27.00, status: 'served', time: '18 min ago', note: null, server: 'Juan R.', createdBy: 'admin', placedAt: '8:12 PM' },
  { id: 1039, table: 1, items: [{name:'Fish Tacos',qty:2,price:13.50},{name:'Guacamole',qty:1,price:8.00}], total: 37.40, status: 'completed', time: '18 min ago', note: null, server: 'Maria C.', createdBy: 'waiter', placedAt: '8:10 PM' },
  { id: 1038, table: 10, items: [{name:'Pasta Carbonara',qty:2,price:16.00},{name:'Bruschetta',qty:1,price:8.00},{name:'Tiramisu',qty:1,price:9.00},{name:'House Wine',qty:2,price:8.00}], total: 64.90, status: 'cancelled', time: '25 min ago', note: 'Cliente se fue', server: 'Juan R.', createdBy: 'admin', placedAt: '7:55 PM' },
  { id: 1037, table: 6, items: [{name:'Margherita Pizza',qty:2,price:14.00},{name:'Sparkling Water',qty:2,price:3.00}], total: 37.40, status: 'completed', time: '35 min ago', note: null, server: 'Maria C.', createdBy: 'waiter', placedAt: '7:45 PM' },
  { id: 1036, table: 3, items: [{name:'Club Sandwich',qty:1,price:11.00},{name:'Onion Rings',qty:1,price:6.50},{name:'Iced Tea',qty:1,price:4.00}], total: 23.65, status: 'completed', time: '42 min ago', note: null, server: 'Juan R.', createdBy: 'waiter', placedAt: '7:38 PM' },
  { id: 1035, table: 9, items: [{name:'Ribeye Steak',qty:2,price:32.00},{name:'Caesar Salad',qty:2,price:12.00},{name:'House Wine',qty:2,price:8.00}], total: 118.80, status: 'completed', time: '50 min ago', note: null, server: 'Maria C.', createdBy: 'admin', placedAt: '7:30 PM' },
];

const statusBadgeMap = {
  new:        { variant: 'info',    label: 'New' },
  preparing:  { variant: 'warning', label: 'Preparing' },
  ready:      { variant: 'success', label: 'Ready' },
  served:     { variant: 'accent',  label: 'Served' },
  completed:  { variant: 'neutral', label: 'Completed' },
  cancelled:  { variant: 'error',   label: 'Cancelled' },
};

let _state = {
  currentSubView: 'list',
  currentFilter: 'all',
  cart: [],
  selectedTable: 1,
  activeCategory: 'All',
  selectedOrderId: null,
};

const TAX_RATE = 0.10;

function getCategories() {
  const cats = ['All'];
  menuItems.forEach(function (item) {
    if (cats.indexOf(item.cat) === -1) {
      cats.push(item.cat);
    }
  });
  return cats;
}

function getFilteredOrders() {
  if (_state.currentFilter === 'all') return allOrders;
  if (_state.currentFilter === 'active') {
    return allOrders.filter(function (o) {
      return o.status === 'new' || o.status === 'preparing' || o.status === 'ready' || o.status === 'served';
    });
  }
  return allOrders.filter(function (o) {
    return o.status === 'completed' || o.status === 'cancelled';
  });
}

function getCartTotals() {
  var subtotal = 0;
  _state.cart.forEach(function (item) {
    subtotal += item.price * item.qty;
  });
  var tax = subtotal * TAX_RATE;
  return { subtotal: subtotal, tax: tax, total: subtotal + tax };
}

function buildStatusStepper(status) {
  var steps = [
    { label: 'Placed', status: 'done' },
    { label: 'Preparing', status: '' },
    { label: 'Ready', status: '' },
    { label: 'Served', status: '' },
  ];

  if (status === 'cancelled') {
    return StatusStepper({ steps: steps, isCancelled: true });
  }

  var statusIndex = {
    new: 0,
    preparing: 1,
    ready: 2,
    served: 3,
    completed: 3,
  };
  var currentIdx = statusIndex[status] != null ? statusIndex[status] : -1;

  steps = steps.map(function (s, idx) {
    if (idx < currentIdx) return { label: s.label, status: 'done' };
    if (idx === currentIdx) return { label: s.label, status: 'current' };
    return { label: s.label, status: '' };
  });

  return StatusStepper({ steps: steps, isCancelled: false });
}

function buildOrderDetailHtml(order) {
  var statusIdx = { new: 0, preparing: 1, ready: 2, served: 3, completed: 3, cancelled: -1 };
  var statusLabel = (statusBadgeMap[order.status] || statusBadgeMap.new).label;

  var detailCells = [
    { label: 'Order ID', value: '#' + order.id },
    { label: 'Table', value: 'Table ' + order.table },
    { label: 'Server', value: order.server },
    { label: 'Placed At', value: order.placedAt },
    { label: 'Status', value: statusLabel },
    { label: 'Total', value: '$' + order.total.toFixed(2) },
  ];

  var itemsListHtml = order.items.map(function (item) {
    return `
      <div class="flex justify-between py-2 border-b border-brand-100 last:border-0">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-brand-900">${item.qty}x</span>
          <span class="text-sm text-secondary-700">${item.name}</span>
        </div>
        <span class="text-sm font-semibold text-brand-900">$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `;
  }).join('');

  var noteHtml = order.note
    ? DetailSection({
        title: 'Special Instructions',
        children: '<p class="text-sm text-secondary-600">' + order.note + '</p>',
      })
    : '';

  return `
    <div class="space-y-6">
      ${buildStatusStepper(order.status)}
      ${DetailGrid({ cells: detailCells })}
      ${DetailSection({
        title: 'Order Items',
        headerRight: '<span class="text-sm font-semibold text-brand-900">' + order.items.length + ' items</span>',
        children: itemsListHtml,
      })}
      ${noteHtml}
    </div>
  `;
}

function renderOrdersList() {
  var headerHtml = PageHeader({
    title: 'Orders',
    actions: '<button type="button" data-onclick="posNewOrder" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md border border-primary-600 bg-primary-600 text-white hover:bg-primary-700 transition-colors"><i data-lucide="plus" class="w-4 h-4"></i> New Order</button>',
  });

  var filtersHtml = OrderFilters({
    activeFilter: _state.currentFilter,
    onFilter: 'posFilterOrders',
  });

  var tableCols = [
    { key: 'id', label: 'Order', primary: true, render: function (v) { return '#' + v; } },
    { key: 'table', label: 'Table', render: function (v) { return 'Table ' + v; } },
    { key: 'items', label: 'Items', render: function (v) { return v.length; } },
    { key: 'total', label: 'Total', render: function (v) { return '$' + v.toFixed(2); } },
    {
      key: 'status',
      label: 'Status',
      render: function (value) {
        var b = statusBadgeMap[value] || statusBadgeMap.new;
        return Badge({ variant: b.variant, showDot: true, children: b.label });
      },
    },
    { key: 'time', label: 'Time' },
    {
      key: 'id',
      label: '',
      render: function (v, row) {
        if (row.status === 'completed' || row.status === 'cancelled') return '';
        return '<button type="button" data-onclick="posViewDetail" data-order-id="' + v + '" class="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors">View</button>';
      },
    },
  ];

  var filteredOrders = getFilteredOrders();
  var tableHtml = DataTable({ columns: tableCols, data: filteredOrders });

  return `
    <div id="orders-list">
      ${headerHtml}
      ${filtersHtml}
      ${Card({ children: tableHtml })}
    </div>
  `;
}

function renderOrdersNew() {
  var headerHtml = PageHeader({
    title: 'New Order',
    backButton: { label: 'Back', onClick: 'posBackToList' },
    actions: '<span class="inline-flex items-center gap-1.5 rounded-full font-semibold px-2.5 py-0.5 text-xs bg-info-100 text-info-700">Table ' + _state.selectedTable + '</span>',
  });

  var categories = getCategories();
  var filteredItems = _state.activeCategory === 'All'
    ? menuItems
    : menuItems.filter(function (m) { return m.cat === _state.activeCategory; });

  var categoryTabsHtml = CategoryTabs({
    categories: categories,
    activeCategory: _state.activeCategory,
    onSelect: 'posSelectCategory',
  });

  var menuGridHtml = '<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">';
  filteredItems.forEach(function (item) {
    menuGridHtml += MenuItemCard({ item: item, onClick: 'posAddToCart' });
  });
  menuGridHtml += '</div>';

  var totals = getCartTotals();
  var cartHtml = CartPanel({
    tableNumber: _state.selectedTable,
    items: _state.cart,
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total,
    onUpdateQty: 'posUpdateQty',
    onRemove: 'posRemoveFromCart',
    onSendOrder: 'posSendOrder',
    onSaveDraft: 'posSaveDraft',
    onDropOrder: 'posDropOrder',
  });

  return `
    <div id="orders-new">
      ${headerHtml}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pos-layout">
        <div class="lg:col-span-2">
          ${categoryTabsHtml}
          ${menuGridHtml}
        </div>
        <div class="lg:col-span-1">
          ${cartHtml}
        </div>
      </div>
    </div>
  `;
}

function renderOrdersDetail() {
  var order = allOrders.find(function (o) { return o.id === _state.selectedOrderId; });
  if (!order) return '';

  var headerHtml = PageHeader({
    title: 'Order #' + order.id,
    backButton: { label: 'Back', onClick: 'posBackToList' },
  });

  var detailHtml = buildOrderDetailHtml(order);

  return `
    <div id="orders-detail">
      ${headerHtml}
      ${Card({ children: detailHtml })}
    </div>
  `;
}

function renderInnerHtml() {
  if (_state.currentSubView === 'list') {
    return renderOrdersList();
  } else if (_state.currentSubView === 'new') {
    return renderOrdersNew();
  } else if (_state.currentSubView === 'detail') {
    return renderOrdersDetail();
  }
  return '';
}

/**
 * Render the POS view
 * @returns {string} HTML string
 */
export function render() {
  return `
    <div id="view-pos" class="p-6">
      ${renderInnerHtml()}
    </div>
  `;
}

/**
 * Initialize POS view interactivity
 * Binds event handlers for data-onclick attributes
 */
export function init() {
  window.posFilterOrders = function (e) {
    var btn = e.currentTarget || e.target;
    var filter = btn.getAttribute('data-filter');
    if (filter) {
      _state.currentFilter = filter;
      rerender();
    }
  };

  window.posNewOrder = function () {
    _state.currentSubView = 'new';
    _state.cart = [];
    _state.activeCategory = 'All';
    rerender();
  };

  window.posBackToList = function () {
    _state.currentSubView = 'list';
    rerender();
  };

  window.posSelectCategory = function (e) {
    var btn = e.currentTarget || e.target;
    var cat = btn.getAttribute('data-category');
    if (cat) {
      _state.activeCategory = cat;
      rerender();
    }
  };

  window.posAddToCart = function (e) {
    var card = e.currentTarget || e.target;
    var itemId = parseInt(card.getAttribute('data-item-id'), 10);
    var menuItem = menuItems.find(function (m) { return m.id === itemId; });
    if (!menuItem) return;

    var existing = _state.cart.find(function (c) { return c.id === menuItem.id; });
    if (existing) {
      existing.qty += 1;
    } else {
      _state.cart.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        qty: 1,
        emoji: menuItem.emoji,
      });
    }
    rerender();
  };

  window.posUpdateQty = function (e) {
    var btn = e.currentTarget || e.target;
    var itemId = parseInt(btn.getAttribute('data-item-id'), 10);
    var item = _state.cart.find(function (c) { return c.id === itemId; });
    if (!item) return;
    item.qty += 1;
    rerender();
  };

  window.posRemoveFromCart = function (e) {
    var btn = e.currentTarget || e.target;
    var itemId = parseInt(btn.getAttribute('data-item-id'), 10);
    var item = _state.cart.find(function (c) { return c.id === itemId; });
    if (!item) return;
    if (item.qty <= 1) {
      _state.cart = _state.cart.filter(function (c) { return c.id !== itemId; });
    } else {
      item.qty -= 1;
    }
    rerender();
  };

  window.posSendOrder = function () {
    if (_state.cart.length === 0) return;
    _state.cart = [];
    _state.currentSubView = 'list';
    rerender();
  };

  window.posSaveDraft = function () {
    _state.currentSubView = 'list';
    rerender();
  };

  window.posDropOrder = function () {
    _state.cart = [];
    rerender();
  };

  window.posViewDetail = function (e) {
    var btn = e.currentTarget || e.target;
    var orderId = parseInt(btn.getAttribute('data-order-id'), 10);
    _state.selectedOrderId = orderId;
    _state.currentSubView = 'detail';
    rerender();
  };

  bindDataOnclcikListeners();
}

function rerender() {
  var container = document.getElementById('view-pos');
  if (!container) return;
  container.innerHTML = renderInnerHtml();
  bindDataOnclcikListeners();
}

function bindDataOnclcikListeners() {
  document.querySelectorAll('[data-onclick]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.addEventListener('click', window[handlerName]);
    }
  });

  if (typeof window.createIcons === 'function') {
    window.createIcons();
  }
}

/**
 * Cleanup POS view
 */
export function destroy() {
  var handlers = [
    'posFilterOrders', 'posNewOrder', 'posBackToList',
    'posSelectCategory', 'posAddToCart', 'posUpdateQty',
    'posRemoveFromCart', 'posSendOrder', 'posSaveDraft',
    'posDropOrder', 'posViewDetail',
  ];
  handlers.forEach(function (name) {
    delete window[name];
  });

  document.querySelectorAll('[data-onclick]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.removeEventListener('click', window[handlerName]);
    }
  });
}

export default { render, init, destroy };
