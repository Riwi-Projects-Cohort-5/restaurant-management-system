import { render as PageHeader } from '../../components/common/PageHeader.js';
import { render as KanbanColumn } from '../../components/kitchen/KanbanColumn.js';
import { render as Button } from '../../components/ui/Button.js';
import { fetchKitchenOrders, advanceKitchenOrder, markOrderServed } from '../../api/kitchen.js';
import { exportToCsv } from '../../utils/csvExport.js';

let _state = {
  kitchenOrders: [],
  loaded: false,
};

function getOrdersByStatus(status) {
  return _state.kitchenOrders.filter(function (o) { return o.status === status; });
}

function exportKitchenCsv() {
  var rows = _state.kitchenOrders.map(function (o) {
    return {
      'Order ID': o.id,
      'Table': o.table,
      'Status': o.status,
      'Minutes Waiting': o.time,
      'Items': o.items.map(function (i) { return i.qty + 'x ' + i.name; }).join('; '),
      'Note': o.note || '',
    };
  });
  exportToCsv('kitchen-status', ['Order ID', 'Table', 'Status', 'Minutes Waiting', 'Items', 'Note'], rows, { includeBOM: true });
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

  return '<div class="grid grid-cols-1 md:grid-cols-3 gap-6 kanban-board">' +
    newColumn + preparingColumn + readyColumn +
  '</div>';
}

function renderInnerHtml() {
  if (!_state.loaded) return '<div class="text-center py-12 text-gray-500">Loading kitchen orders...</div>';

  var headerHtml = PageHeader({
    title: 'Kitchen Dashboard',
    actions: Button({ variant: 'secondary', icon: 'download', children: 'Export CSV', onClick: 'kitchenExportCsv' }) +
      Button({ variant: 'secondary', icon: 'refresh-cw', children: 'Refresh', onClick: 'kitchenRefresh' }),
  });

  return headerHtml + renderKanbanBoard();
}

export function render() {
  return '<div id="view-kitchen" class="p-6">' + renderInnerHtml() + '</div>';
}

export function init() {
  _state.loaded = false;
  _state.kitchenOrders = [];

  fetchKitchenOrders().then(function (res) {
    if (res.ok) _state.kitchenOrders = res.data;
    _state.loaded = true;
    rerender();
  });

  window.kitchenRefresh = function () {
    _state.loaded = false;
    rerender();
    fetchKitchenOrders().then(function (res) {
      if (res.ok) _state.kitchenOrders = res.data;
      _state.loaded = true;
      rerender();
    });
  };

  window.kitchenStartPreparing = function (e) {
    var btn = e.currentTarget || e.target;
    var orderId = parseInt(btn.getAttribute('data-order-id'), 10);
    advanceKitchenOrder(orderId, 'new').then(function () {
      return fetchKitchenOrders();
    }).then(function (res) {
      if (res.ok) _state.kitchenOrders = res.data;
      rerender();
    });
  };

  window.kitchenMarkReady = function (e) {
    var btn = e.currentTarget || e.target;
    var orderId = parseInt(btn.getAttribute('data-order-id'), 10);
    advanceKitchenOrder(orderId, 'preparing').then(function () {
      return fetchKitchenOrders();
    }).then(function (res) {
      if (res.ok) _state.kitchenOrders = res.data;
      rerender();
    });
  };

  window.kitchenMarkServed = function (e) {
    var btn = e.currentTarget || e.target;
    var orderId = parseInt(btn.getAttribute('data-order-id'), 10);
    markOrderServed(orderId).then(function () {
      return fetchKitchenOrders();
    }).then(function (res) {
      if (res.ok) _state.kitchenOrders = res.data;
      rerender();
    });
  };

  window.kitchenViewDetail = function (e) {
    var btn = e.currentTarget || e.target;
    var orderId = parseInt(btn.getAttribute('data-order-id'), 10);
    console.log('[Kitchen] View detail for order #' + orderId);
  };

  window.kitchenExportCsv = exportKitchenCsv;

  bindDataOnclickListeners();
}

function rerender() {
  var container = document.getElementById('view-kitchen');
  if (!container) return;
  container.innerHTML = renderInnerHtml();
  bindDataOnclickListeners();
}

function bindDataOnclickListeners() {
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
  if (typeof window.createIcons === 'function') window.createIcons();
}

export function destroy() {
  var handlers = [
    'kitchenRefresh', 'kitchenStartPreparing',
    'kitchenMarkReady', 'kitchenMarkServed',
    'kitchenViewDetail', 'kitchenExportCsv',
  ];
  handlers.forEach(function (name) { delete window[name]; });

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
