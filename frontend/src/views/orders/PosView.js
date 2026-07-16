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
import { fetchOrders, fetchMenu, createOrder } from '../../api/orders.js';
import { exportToCsv } from '../../utils/csvExport.js';
import { currentUser } from '../../store/auth.js';

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
  menuItems: [],
  allOrders: [],
  loaded: false,
};

const TAX_RATE = 0.10;

function getCategories() {
  var cats = ['All'];
  _state.menuItems.forEach(function (item) {
    if (cats.indexOf(item.cat) === -1) {
      cats.push(item.cat);
    }
  });
  return cats;
}

function getFilteredOrders() {
  if (_state.currentFilter === 'all') return _state.allOrders;
  if (_state.currentFilter === 'active') {
    return _state.allOrders.filter(function (o) {
      return o.status === 'new' || o.status === 'preparing' || o.status === 'ready' || o.status === 'served';
    });
  }
  return _state.allOrders.filter(function (o) {
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
  if (status === 'cancelled') return StatusStepper({ steps: steps, isCancelled: true });
  var statusIndex = { new: 0, preparing: 1, ready: 2, served: 3, completed: 3 };
  var currentIdx = statusIndex[status] != null ? statusIndex[status] : -1;
  steps = steps.map(function (s, idx) {
    if (idx < currentIdx) return { label: s.label, status: 'done' };
    if (idx === currentIdx) return { label: s.label, status: 'current' };
    return { label: s.label, status: '' };
  });
  return StatusStepper({ steps: steps, isCancelled: false });
}

function buildOrderDetailHtml(order) {
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
    return '<div class="flex justify-between py-2 border-b border-brand-100 last:border-0">' +
      '<div class="flex items-center gap-3">' +
        '<span class="text-sm font-semibold text-brand-900">' + item.qty + 'x</span>' +
        '<span class="text-sm text-secondary-700">' + item.name + '</span>' +
      '</div>' +
      '<span class="text-sm font-semibold text-brand-900">$' + (item.price * item.qty).toFixed(2) + '</span>' +
    '</div>';
  }).join('');

  var noteHtml = order.note
    ? DetailSection({ title: 'Special Instructions', children: '<p class="text-sm text-secondary-600">' + order.note + '</p>' })
    : '';

  return '<div class="space-y-6">' +
    buildStatusStepper(order.status) +
    DetailGrid({ cells: detailCells }) +
    DetailSection({
      title: 'Order Items',
      headerRight: '<span class="text-sm font-semibold text-brand-900">' + order.items.length + ' items</span>',
      children: itemsListHtml,
    }) +
    noteHtml +
  '</div>';
}

function exportOrdersCsv() {
  var rows = getFilteredOrders().map(function (o) {
    return {
      'Order ID': o.id,
      'Table': o.table,
      'Server': o.server,
      'Placed At': o.placedAt,
      'Items': o.items.map(function (i) { return i.qty + 'x ' + i.name; }).join('; '),
      'Total': '$' + o.total.toFixed(2),
      'Status': o.status,
      'Note': o.note || '',
      'Created By': o.createdBy,
    };
  });
  exportToCsv('orders-export', ['Order ID', 'Table', 'Server', 'Placed At', 'Items', 'Total', 'Status', 'Note', 'Created By'], rows, { includeBOM: true });
}

function renderOrdersList() {
  var headerHtml = PageHeader({
    title: 'Orders',
    actions: '<button type="button" data-onclick="posExportOrders" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md border border-brand-300 bg-white text-brand-700 hover:bg-brand-50 transition-colors"><i data-lucide="download" class="w-4 h-4"></i> Export CSV</button>' +
      '<button type="button" data-onclick="posNewOrder" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md border border-primary-600 bg-primary-600 text-white hover:bg-primary-700 transition-colors"><i data-lucide="plus" class="w-4 h-4"></i> New Order</button>',
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

  return '<div id="orders-list">' + headerHtml + filtersHtml + Card({ children: tableHtml }) + '</div>';
}

function renderOrdersNew() {
  var headerHtml = PageHeader({
    title: 'New Order',
    backButton: { label: 'Back', onClick: 'posBackToList' },
    actions: '<span class="inline-flex items-center gap-1.5 rounded-full font-semibold px-2.5 py-0.5 text-xs bg-info-100 text-info-700">Table ' + _state.selectedTable + '</span>',
  });

  var categories = getCategories();
  var filteredItems = _state.activeCategory === 'All'
    ? _state.menuItems
    : _state.menuItems.filter(function (m) { return m.cat === _state.activeCategory; });

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

  return '<div id="orders-new">' + headerHtml +
    '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pos-layout">' +
      '<div class="lg:col-span-2">' + categoryTabsHtml + menuGridHtml + '</div>' +
      '<div class="lg:col-span-1">' + cartHtml + '</div>' +
    '</div>' +
  '</div>';
}

function renderOrdersDetail() {
  var order = _state.allOrders.find(function (o) { return o.id === _state.selectedOrderId; });
  if (!order) return '';
  var headerHtml = PageHeader({
    title: 'Order #' + order.id,
    backButton: { label: 'Back', onClick: 'posBackToList' },
  });
  return '<div id="orders-detail">' + headerHtml + Card({ children: buildOrderDetailHtml(order) }) + '</div>';
}

function renderInnerHtml() {
  if (_state.currentSubView === 'list') return renderOrdersList();
  if (_state.currentSubView === 'new') return renderOrdersNew();
  if (_state.currentSubView === 'detail') return renderOrdersDetail();
  return '';
}

export function render() {
  return '<div id="view-pos" class="p-6">' + renderInnerHtml() + '</div>';
}

export function init() {
  _state.loaded = false;
  _state.allOrders = [];
  _state.menuItems = [];

  Promise.all([
    fetchOrders(),
    fetchMenu(),
  ]).then(function (results) {
    if (results[0].ok) _state.allOrders = results[0].data;
    if (results[1].ok) _state.menuItems = results[1].data;
    _state.loaded = true;
    rerender();
  });

  window.posFilterOrders = function (e) {
    var btn = e.currentTarget || e.target;
    var filter = btn.getAttribute('data-filter');
    if (filter) { _state.currentFilter = filter; rerender(); }
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
    if (cat) { _state.activeCategory = cat; rerender(); }
  };

  window.posAddToCart = function (e) {
    var card = e.currentTarget || e.target;
    var itemId = parseInt(card.getAttribute('data-item-id'), 10);
    var menuItem = _state.menuItems.find(function (m) { return m.id === itemId; });
    if (!menuItem) return;
    var existing = _state.cart.find(function (c) { return c.id === menuItem.id; });
    if (existing) { existing.qty += 1; }
    else { _state.cart.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, qty: 1, emoji: menuItem.emoji }); }
    rerender();
  };

  window.posUpdateQty = function (e) {
    var btn = e.currentTarget || e.target;
    var itemId = parseInt(btn.getAttribute('data-item-id'), 10);
    var item = _state.cart.find(function (c) { return c.id === itemId; });
    if (item) { item.qty += 1; rerender(); }
  };

  window.posRemoveFromCart = function (e) {
    var btn = e.currentTarget || e.target;
    var itemId = parseInt(btn.getAttribute('data-item-id'), 10);
    var item = _state.cart.find(function (c) { return c.id === itemId; });
    if (!item) return;
    if (item.qty <= 1) { _state.cart = _state.cart.filter(function (c) { return c.id !== itemId; }); }
    else { item.qty -= 1; }
    rerender();
  };

  window.posSendOrder = function () {
    if (_state.cart.length === 0) return;
    var user = currentUser();
    createOrder({
      table: _state.selectedTable,
      items: _state.cart.map(function (c) { return { name: c.name, qty: c.qty, price: c.price }; }),
      note: null,
      server: user ? user.username : 'Unknown',
      createdBy: user ? user.role : 'waiter',
    }).then(function () {
      return fetchOrders();
    }).then(function (res) {
      if (res.ok) _state.allOrders = res.data;
      _state.cart = [];
      _state.currentSubView = 'list';
      rerender();
    });
  };

  window.posSaveDraft = function () { _state.currentSubView = 'list'; rerender(); };
  window.posDropOrder = function () { _state.cart = []; rerender(); };

  window.posViewDetail = function (e) {
    var btn = e.currentTarget || e.target;
    var orderId = parseInt(btn.getAttribute('data-order-id'), 10);
    _state.selectedOrderId = orderId;
    _state.currentSubView = 'detail';
    rerender();
  };

  window.posExportOrders = exportOrdersCsv;

  bindDataOnclickListeners();
}

function rerender() {
  var container = document.getElementById('view-pos');
  if (!container) return;
  container.innerHTML = renderInnerHtml();
  bindDataOnclickListeners();
}

function bindDataOnclickListeners() {
  document.querySelectorAll('[data-onclick]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.addEventListener('click', window[handlerName]);
    }
  });
  if (typeof window.createIcons === 'function') window.createIcons();
}

export function destroy() {
  var handlers = [
    'posFilterOrders', 'posNewOrder', 'posBackToList',
    'posSelectCategory', 'posAddToCart', 'posUpdateQty',
    'posRemoveFromCart', 'posSendOrder', 'posSaveDraft',
    'posDropOrder', 'posViewDetail', 'posExportOrders',
  ];
  handlers.forEach(function (name) { delete window[name]; });
  document.querySelectorAll('[data-onclick]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.removeEventListener('click', window[handlerName]);
    }
  });
}

export default { render, init, destroy };
