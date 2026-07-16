/**
 * Kitchen View
 * @route /kitchen
 *
 * Composes: PageHeader, KanbanColumn, KanbanCard, Button
 *
 * State:
 * - kitchenOrders: []
 */

import { render as PageHeader } from '../../components/common/PageHeader.js';
import { render as KanbanColumn } from '../../components/kitchen/KanbanColumn.js';
import { render as Button } from '../../components/ui/Button.js';

const kitchenOrders = [
  { id: 1043, table: 3, status: 'new', time: 1, items: [{qty:1,name:'Margherita Pizza'},{qty:2,name:'Sparkling Water'},{qty:1,name:'Tiramisu'}], note: 'No olives on pizza' },
  { id: 1042, table: 5, status: 'preparing', time: 5, items: [{qty:1,name:'Grilled Chicken'},{qty:1,name:'Caesar Salad'}], note: 'Extra dressing' },
  { id: 1041, table: 2, status: 'ready', time: 12, items: [{qty:1,name:'Ribeye Steak'},{qty:2,name:'House Wine'},{qty:2,name:'Caesar Salad'}], note: null },
  { id: 1040, table: 8, status: 'preparing', time: 18, items: [{qty:2,name:'Fish Tacos'}], note: null },
  { id: 1037, table: 6, status: 'new', time: 0, items: [{qty:2,name:'Margherita Pizza'},{qty:2,name:'Sparkling Water'}], note: null },
];

function getOrdersByStatus(status) {
  return kitchenOrders.filter(function (o) {
    return o.status === status;
  });
}

function renderKanbanBoard() {
  var newOrders = getOrdersByStatus('new');
  var preparingOrders = getOrdersByStatus('preparing');
  var readyOrders = getOrdersByStatus('ready');

  var newColumn = KanbanColumn({
    title: 'New Orders',
    status: 'new',
    orders: newOrders,
    actionLabel: 'Start Preparing',
    actionColor: 'bg-info-600 text-white hover:bg-info-700',
    onAction: 'kitchenStartPreparing',
  });

  var preparingColumn = KanbanColumn({
    title: 'Preparing',
    status: 'preparing',
    orders: preparingOrders,
    actionLabel: 'Mark Ready',
    actionColor: 'bg-warning-600 text-white hover:bg-warning-700',
    onAction: 'kitchenMarkReady',
  });

  var readyColumn = KanbanColumn({
    title: 'Ready to Serve',
    status: 'ready',
    orders: readyOrders,
    actionLabel: 'Mark Served',
    actionColor: 'bg-success-600 text-white hover:bg-success-700',
    onAction: 'kitchenMarkServed',
  });

  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 kanban-board">
      ${newColumn}
      ${preparingColumn}
      ${readyColumn}
    </div>
  `;
}

function renderInnerHtml() {
  var headerHtml = PageHeader({
    title: 'Kitchen Dashboard',
    actions: Button({
      variant: 'secondary',
      icon: 'refresh-cw',
      children: 'Refresh',
      onClick: 'kitchenRefresh',
    }),
  });

  return `
    ${headerHtml}
    ${renderKanbanBoard()}
  `;
}

/**
 * Render the Kitchen view
 * @returns {string} HTML string
 */
export function render() {
  return `
    <div id="view-kitchen" class="p-6">
      ${renderInnerHtml()}
    </div>
  `;
}

/**
 * Initialize Kitchen view interactivity
 * Binds event handlers for kanban action buttons
 */
export function init() {
  window.kitchenRefresh = function () {
    rerender();
  };

  window.kitchenStartPreparing = function (e) {
    var btn = e.currentTarget || e.target;
    var orderId = parseInt(btn.getAttribute('data-order-id'), 10);
    var order = kitchenOrders.find(function (o) { return o.id === orderId; });
    if (order) {
      order.status = 'preparing';
    }
    rerender();
  };

  window.kitchenMarkReady = function (e) {
    var btn = e.currentTarget || e.target;
    var orderId = parseInt(btn.getAttribute('data-order-id'), 10);
    var order = kitchenOrders.find(function (o) { return o.id === orderId; });
    if (order) {
      order.status = 'ready';
    }
    rerender();
  };

  window.kitchenMarkServed = function (e) {
    var btn = e.currentTarget || e.target;
    var orderId = parseInt(btn.getAttribute('data-order-id'), 10);
    var idx = kitchenOrders.findIndex(function (o) { return o.id === orderId; });
    if (idx !== -1) {
      kitchenOrders.splice(idx, 1);
    }
    rerender();
  };

  window.kitchenViewDetail = function (e) {
    var btn = e.currentTarget || e.target;
    var orderId = parseInt(btn.getAttribute('data-order-id'), 10);
    console.log('[Kitchen] View detail for order #' + orderId);
  };

  bindDataOnclcikListeners();
}

function rerender() {
  var container = document.getElementById('view-kitchen');
  if (!container) return;
  container.innerHTML = renderInnerHtml();
  bindDataOnclcikListeners();
}

function bindDataOnclcikListeners() {
  document.querySelectorAll('[data-onclick-action]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick-action');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.addEventListener('click', window[handlerName]);
    }
  });

  document.querySelectorAll('[data-onclick-detail]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick-detail');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.addEventListener('click', window[handlerName]);
    }
  });

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
 * Cleanup Kitchen view
 */
export function destroy() {
  var handlers = [
    'kitchenRefresh', 'kitchenStartPreparing',
    'kitchenMarkReady', 'kitchenMarkServed',
    'kitchenViewDetail',
  ];
  handlers.forEach(function (name) {
    delete window[name];
  });

  document.querySelectorAll('[data-onclick-action]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick-action');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.removeEventListener('click', window[handlerName]);
    }
  });

  document.querySelectorAll('[data-onclick-detail]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick-detail');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.removeEventListener('click', window[handlerName]);
    }
  });

  document.querySelectorAll('[data-onclick]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.removeEventListener('click', window[handlerName]);
    }
  });
}

export default { render, init, destroy };
