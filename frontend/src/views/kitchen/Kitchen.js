import { kitchenOrders, setKitchenOrders } from '../../store/posData.js';

function timeClass(minutes) {
  return minutes > 15 ? 'text-error-600 font-bold' : '';
}

function moveOrder(id, fromStatus) {
  var order = kitchenOrders.find(function (o) { return o.id === id; });
  if (!order) return;
  var next = { new: 'preparing', preparing: 'ready', ready: 'ready' };
  if (order.status === fromStatus && next[fromStatus]) {
    order.status = next[fromStatus];
    KitchenView.render(document.getElementById('current-view'));
    window.createIcons();
  }
}

function renderColumn(title, status, bgClass) {
  var orders = kitchenOrders.filter(function (o) { return o.status === status; });

  var html = '<div class="flex flex-col gap-3 flex-1 min-w-0">';
  html += '<div class="flex items-center justify-between px-3">';
  html += '<h3 class="text-sm font-semibold text-primary-700 font-display">' + title + '</h3>';
  html += '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-primary-700 text-xs font-bold border border-brand-300">' + orders.length + '</span>';
  html += '</div>';
  html += '<div class="space-y-3">';
  orders.forEach(function (order) {
    html += renderCard(order, status);
  });
  html += '</div></div>';
  return html;
}

function renderCard(order, status) {
  var actionLabel = status === 'new' ? 'Start Preparing' : status === 'preparing' ? 'Mark Ready' : 'Delivered';

  var html = '<div class="bg-white border border-brand-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">';
  html += '<div class="flex items-center justify-between mb-2">';
  html += '<span class="text-sm font-semibold text-primary-700 font-display">Table ' + order.table + '</span>';
  html += '<span class="text-xs text-brand-500 font-mono ' + timeClass(order.time) + '">' + order.time + ' min</span>';
  html += '</div>';

  html += '<div class="space-y-1 mb-3">';
  order.items.forEach(function (item) {
    html += '<p class="text-sm text-brand-700">' + item.qty + 'x ' + item.name + '</p>';
  });
  html += '</div>';

  if (order.note) {
    html += '<div class="border-l-2 border-accent-400 pl-3 py-1 mb-3">';
    html += '<p class="text-xs text-brand-500 italic">' + order.note + '</p>';
    html += '</div>';
  }

  html += '<div class="flex gap-2">';
  html += '<button class="flex-1 h-8 px-3 text-xs font-semibold rounded-lg bg-transparent text-primary-600 hover:bg-primary-50 border border-primary-300 cursor-pointer transition-colors">Details</button>';
  html += '<button data-kitchen-action="move" data-order-id="' + order.id + '" data-from-status="' + status + '" class="flex-1 h-8 px-3 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer transition-colors">' + actionLabel + '</button>';
  html += '</div></div>';

  return html;
}

var KitchenView = {
  render: function (el) {
    var html = '<div class="space-y-6">';
    html += '<div class="flex items-center justify-between">';
    html += '<h2 class="text-xl font-semibold text-primary-700 font-display">Kitchen Orders</h2>';
    html += '<div class="flex gap-3">';
    html += '<div class="flex items-center gap-2 text-sm text-brand-600">';
    html += '<span class="w-3 h-3 rounded-full bg-error-500"></span> Urgent (&gt;15 min)';
    html += '</div>';
    html += '</div></div>';

    html += '<div class="flex gap-4">';
    html += renderColumn('New Orders', 'new', 'bg-info-50');
    html += renderColumn('Preparing', 'preparing', 'bg-accent-50');
    html += renderColumn('Ready', 'ready', 'bg-success-50');
    html += '</div></div>';

    el.innerHTML = html;

    el.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-kitchen-action="move"]');
      if (btn) {
        var oid = parseInt(btn.getAttribute('data-order-id'));
        var from = btn.getAttribute('data-from-status');
        moveOrder(oid, from);
      }
    });
  },

  init: function () {},
  destroy: function () {}
};

export default KitchenView;
