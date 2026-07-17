import { allOrders, menuItems, LIFECYCLE, canTransition, recalcOrder, currentRole } from '../../store/posData.js';
import CartPanel from '../../components/pos/CartPanel.js';
import StatusStepper from '../../components/ui/StatusStepper.js';
import DataTable from '../../components/ui/DataTable.js';

var subView = 'orders';
var activeFilter = 'all';
var selectedOrderId = null;
var editingOrder = null;
var editingItems = null;

function getFilteredOrders() {
  if (activeFilter === 'active') return allOrders.filter(function (o) { return o.status !== 'completed' && o.status !== 'cancelled'; });
  if (activeFilter === 'closed') return allOrders.filter(function (o) { return o.status === 'completed' || o.status === 'cancelled'; });
  return allOrders;
}

function renderOrderList(container) {
  var orders = getFilteredOrders();

  var html = '<div class="flex flex-col gap-4">';
  html += '<div class="flex items-center gap-3">';
  html += '<div class="flex bg-brand-100 rounded-xl p-1">';
  ['all', 'active', 'closed'].forEach(function (f) {
    var isActive = activeFilter === f;
    html += '<button data-filter="' + f + '" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border-0 ' +
      (isActive ? 'bg-white text-primary-700 shadow-sm' : 'bg-transparent text-brand-500 hover:text-primary-700') + '">' +
      f.charAt(0).toUpperCase() + f.slice(1) + '</button>';
  });
  html += '</div>';
  html += '<div class="flex-1"></div>';
  html += '<button data-action="new-order" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer">' +
    '<i data-lucide="plus" class="w-4 h-4"></i><span>New Order</span></button>';
  html += '</div>';

  html += '<div class="bg-white border border-brand-300 rounded-xl shadow-sm overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-sm text-left">';
  html += '<thead class="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border-b-2 border-brand-300"><tr>';
  html += '<th class="px-4 py-3">Order</th><th class="px-4 py-3">Table</th><th class="px-4 py-3">Items</th><th class="px-4 py-3">Total</th><th class="px-4 py-3">Status</th><th class="px-4 py-3">Placed</th><th class="px-4 py-3">Server</th><th class="px-4 py-3">Actions</th>';
  html += '</tr></thead><tbody class="divide-y divide-brand-200">';

  orders.forEach(function (order, i) {
    var bg = i % 2 === 0 ? 'bg-white' : 'bg-brand-50/50';
    var st = statusBadge(order.status);
    var canCancel = canTransition(currentRole, order.status, 'cancelled');
    var canDelete = currentRole === 'admin' && (order.status === 'draft' || order.status === 'new');
    html += '<tr class="' + bg + ' hover:bg-brand-50 transition-colors">';
    html += '<td class="px-4 py-3 font-semibold text-primary-700">#' + order.id + '</td>';
    html += '<td class="px-4 py-3">' + order.table + '</td>';
    html += '<td class="px-4 py-3">' + order.items.length + '</td>';
    html += '<td class="px-4 py-3 font-mono text-xs">$' + order.total.toFixed(2) + '</td>';
    html += '<td class="px-4 py-3">' + st + '</td>';
    html += '<td class="px-4 py-3 text-brand-500">' + order.time + '</td>';
    html += '<td class="px-4 py-3">' + order.server + '</td>';
    html += '<td class="px-4 py-3"><div class="flex items-center gap-2">';
    html += '<button data-action="view-detail" data-order-id="' + order.id + '" class="text-primary-600 hover:text-primary-800 text-xs font-semibold bg-transparent border-0 cursor-pointer">Details</button>';
    if (canCancel) {
      html += '<button data-action="cancel-order" data-order-id="' + order.id + '" class="text-error-600 hover:text-error-800 text-xs font-semibold bg-transparent border-0 cursor-pointer">Cancel</button>';
    }
    if (canDelete) {
      html += '<button data-action="delete-order" data-order-id="' + order.id + '" class="text-error-500 hover:text-error-700 text-xs bg-transparent border-0 cursor-pointer"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>';
    }
    html += '</div></td>';
    html += '</tr>';
  });

  html += '</tbody></table></div></div>';
  html += '</div>';

  container.innerHTML = html;
  setupOrderListEvents(container);
}

function renderNewOrder(container) {
  var categories = ['All', 'Main Course', 'Pizza', 'Salads', 'Burgers', 'Appetizers', 'Desserts', 'Drinks'];
  var activeCat = 'All';

  var html = '<div class="pos-layout flex gap-6">';
  html += '<div class="flex-1 min-w-0 space-y-4">';
  html += '<div class="pos-categories flex gap-2 flex-wrap">';
  categories.forEach(function (cat) {
    html += '<button data-cat="' + cat + '" class="px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ' +
      (cat === activeCat ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-brand-600 border-brand-300 hover:bg-brand-50') + '">' + cat + '</button>';
  });
  html += '</div>';

  html += '<div class="menu-grid grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">';
  menuItems.forEach(function (item) {
    html += '<div class="menu-item-card bg-white border border-brand-300 rounded-xl p-4 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2">';
    html += '<div class="text-3xl">' + (item.emoji || '\uD83C\uDF7D\uFE0F') + '</div>';
    html += '<h4 class="text-sm font-semibold text-primary-800 font-display">' + item.name + '</h4>';
    html += '<p class="text-xs text-brand-500">' + item.cat + '</p>';
    html += '<p class="text-sm font-bold text-primary-700">$' + item.price.toFixed(2) + '</p>';
    html += '<button data-action="add-to-cart" data-item-id="' + item.id + '" class="mt-auto w-full h-8 px-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold border-0 cursor-pointer transition-colors">Add to Order</button>';
    html += '</div>';
  });
  html += '</div></div>';

  html += '<div class="w-[340px] shrink-0">';
  html += CartPanel();
  html += '</div></div>';

  container.innerHTML = html;
  setupNewOrderEvents(container);
}

function renderOrderDetail(container, orderId) {
  var order = allOrders.find(function (o) { return o.id === orderId; });
  if (!order) { subView = 'orders'; renderOrderList(container); return; }

  var isEditing = editingOrder && editingOrder.id === order.id;
  var displayOrder = isEditing ? editingOrder : order;
  var subtotal = displayOrder.items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  var tax = Math.round(subtotal * 0.1 * 100) / 100;
  var total = Math.round((subtotal + tax) * 100) / 100;
  var isCancelled = displayOrder.status === 'cancelled';

  var html = '<div class="space-y-6 max-w-3xl">';
  html += '<div class="flex items-center justify-between">';
  html += '<button data-action="back-to-orders" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Orders</button>';
  html += '<h2 class="text-xl font-semibold text-primary-700 font-display">Order #' + displayOrder.id + '</h2>';
  html += '</div>';

  html += '<div class="bg-white border border-brand-300 rounded-xl p-6 shadow-sm">';
  html += '<h3 class="text-sm font-semibold text-primary-700 font-display mb-4">Order Status</h3>';
  html += StatusStepper({ status: displayOrder.status, cancelled: isCancelled });
  html += '</div>';

  html += DetailGridCompact([
    { label: 'Table', value: displayOrder.table },
    { label: 'Server', value: displayOrder.server },
    { label: 'Status', value: displayOrder.status },
    { label: 'Placed', value: displayOrder.placedAt || displayOrder.time },
    { label: 'Total', value: '$' + total.toFixed(2) },
    { label: 'Notes', value: displayOrder.note || '—' },
  ]);

  html += '<div class="bg-white border border-brand-300 rounded-xl p-5 shadow-sm">';
  html += '<h3 class="text-sm font-semibold text-primary-700 font-display mb-3">Items</h3>';
  html += '<div class="overflow-x-auto"><table class="w-full text-sm">';
  html += '<thead class="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border-b-2 border-brand-300"><tr>';
  html += '<th class="px-4 py-3 text-left">Item</th><th class="px-4 py-3 text-left">Price</th><th class="px-4 py-3 text-left">Qty</th><th class="px-4 py-3 text-left">Subtotal</th>';
  if (isEditing) html += '<th class="px-4 py-3 text-left">Actions</th>';
  html += '</tr></thead><tbody class="divide-y divide-brand-200">';

  displayOrder.items.forEach(function (item, idx) {
    var sub = (item.price * item.qty).toFixed(2);
    html += '<tr>';
    if (isEditing) {
      html += '<td class="px-4 py-2"><input data-edit-field="name" data-idx="' + idx + '" value="' + item.name + '" class="w-full border border-brand-300 rounded px-2 py-1 text-sm" /></td>';
      html += '<td class="px-4 py-2"><input data-edit-field="price" data-idx="' + idx + '" type="number" step="0.01" value="' + item.price + '" class="w-20 border border-brand-300 rounded px-2 py-1 text-sm" /></td>';
      html += '<td class="px-4 py-2"><input data-edit-field="qty" data-idx="' + idx + '" type="number" min="1" value="' + item.qty + '" class="w-16 border border-brand-300 rounded px-2 py-1 text-sm" /></td>';
      html += '<td class="px-4 py-2 font-mono text-xs">$' + sub + '</td>';
      html += '<td class="px-4 py-2"><button data-action="remove-edit-item" data-idx="' + idx + '" class="text-error-500 hover:text-error-700 bg-transparent border-0 cursor-pointer"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button></td>';
    } else {
      html += '<td class="px-4 py-2 font-semibold text-primary-700">' + item.name + '</td>';
      html += '<td class="px-4 py-2 font-mono text-xs">$' + item.price.toFixed(2) + '</td>';
      html += '<td class="px-4 py-2">' + item.qty + '</td>';
      html += '<td class="px-4 py-2 font-mono text-xs">$' + sub + '</td>';
    }
    html += '</tr>';
  });

  html += '</tbody></table></div></div>';

  html += '<div class="bg-white border border-brand-300 rounded-xl p-5 shadow-sm">';
  html += '<h3 class="text-sm font-semibold text-primary-700 font-display mb-3">Note</h3>';
  if (isEditing) {
    html += '<textarea id="order-note" class="w-full border border-brand-300 rounded-lg p-3 text-sm h-24" placeholder="Add a note...">' + (displayOrder.note || '') + '</textarea>';
  } else {
    html += '<p class="text-sm text-brand-600 italic">' + (displayOrder.note || 'No notes') + '</p>';
  }
  html += '</div>';

  html += '<div class="flex flex-wrap gap-3">';
  if (isEditing) {
    html += '<button data-action="save-edit" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer">Save Changes</button>';
    html += '<button data-action="cancel-edit" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer">Cancel</button>';
  } else {
    var transitions = getNextStatuses(displayOrder.status);
    transitions.forEach(function (t) {
      html += '<button data-action="transition" data-target="' + t + '" data-order-id="' + displayOrder.id + '" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer capitalize">Next: ' + t + '</button>';
    });

    if (canTransition(currentRole, displayOrder.status, 'cancelled')) {
      html += '<button data-action="cancel-order" data-order-id="' + displayOrder.id + '" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md bg-error-500 hover:bg-error-600 text-white border-0 cursor-pointer">Cancel Order</button>';
    }

    if (displayOrder.status === 'draft') {
      html += '<button data-action="drop-draft" data-order-id="' + displayOrder.id + '" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md bg-warning-500 hover:bg-warning-600 text-white border-0 cursor-pointer">Drop Draft</button>';
    }

    if (currentRole === 'admin' && (displayOrder.status === 'draft' || displayOrder.status === 'new')) {
      html += '<button data-action="delete-order" data-order-id="' + displayOrder.id + '" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md bg-error-600 hover:bg-error-700 text-white border-0 cursor-pointer"><i data-lucide="trash-2" class="w-4 h-4"></i> Delete</button>';
    }

    html += '<button data-action="start-edit" data-order-id="' + displayOrder.id + '" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer"><i data-lucide="pencil" class="w-4 h-4"></i> Edit Items</button>';
  }

  html += '</div></div>';

  container.innerHTML = html;
  setupOrderDetailEvents(container, order);
}

function getNextStatuses(status) {
  var next = [];
  LIFECYCLE.forEach(function (s, i) {
    if (i > LIFECYCLE.indexOf(status) && canTransition(currentRole, status, s)) {
      if (next.length === 0) next.push(s);
    }
  });
  return next;
}

function statusBadge(status) {
  var colors = { completed: 'success', preparing: 'warning', new: 'info', draft: 'brand', cancelled: 'error', ready: 'accent', served: 'neutral' };
  var c = colors[status] || 'brand';
  return '<span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-' + c + '-100 text-' + c + '-700"><span class="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>' + status + '</span>';
}

function DetailGridCompact(items) {
  var html = '<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">';
  items.forEach(function (item) {
    html += '<div class="bg-white border border-brand-300 rounded-xl p-3">';
    html += '<span class="block text-[11px] font-semibold uppercase tracking-wider text-brand-500 mb-0.5">' + item.label + '</span>';
    html += '<span class="block text-sm font-semibold text-primary-800">' + (item.value || '') + '</span>';
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function setupOrderListEvents(container) {
  container.addEventListener('click', function (e) {
    var filterBtn = e.target.closest('[data-filter]');
    if (filterBtn) {
      activeFilter = filterBtn.getAttribute('data-filter');
      renderOrderList(container);
      window.createIcons();
      return;
    }

    var newBtn = e.target.closest('[data-action="new-order"]');
    if (newBtn) {
      subView = 'new';
      editingOrder = null;
      renderNewOrder(container);
      window.createIcons();
      return;
    }

    var detailBtn = e.target.closest('[data-action="view-detail"]');
    if (detailBtn) {
      var id = parseInt(detailBtn.getAttribute('data-order-id'));
      selectedOrderId = id;
      subView = 'detail';
      editingOrder = null;
      renderOrderDetail(container, id);
      window.createIcons();
      return;
    }

    var cancelBtn = e.target.closest('[data-action="cancel-order"]');
    if (cancelBtn) {
      var cid = parseInt(cancelBtn.getAttribute('data-order-id'));
      var order = allOrders.find(function (o) { return o.id === cid; });
      if (order && canTransition(currentRole, order.status, 'cancelled')) {
        order.status = 'cancelled';
        renderOrderList(container);
        window.createIcons();
      }
      return;
    }

    var delBtn = e.target.closest('[data-action="delete-order"]');
    if (delBtn) {
      var did = parseInt(delBtn.getAttribute('data-order-id'));
      var idx = allOrders.findIndex(function (o) { return o.id === did; });
      if (idx > -1 && currentRole === 'admin') {
        allOrders.splice(idx, 1);
        renderOrderList(container);
        window.createIcons();
      }
      return;
    }
  });
}

function setupNewOrderEvents(container) {
  container.addEventListener('click', function (e) {
    var addBtn = e.target.closest('[data-action="add-to-cart"]');
    if (addBtn) {
      var itemId = parseInt(addBtn.getAttribute('data-item-id'));
      var item = menuItems.find(function (m) { return m.id === itemId; });
      if (item) {
        window.dispatchEvent(new CustomEvent('cart:add', { detail: { item: item } }));
      }
      return;
    }

    var catBtn = e.target.closest('[data-cat]');
    if (catBtn) {
      var cat = catBtn.getAttribute('data-cat');
      container.querySelectorAll('[data-cat]').forEach(function (b) {
        b.className = 'px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ' +
          (b.getAttribute('data-cat') === cat ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-brand-600 border-brand-300 hover:bg-brand-50');
      });
      var grid = container.querySelector('.menu-grid');
      if (grid) {
        grid.querySelectorAll('.menu-item-card').forEach(function (card) {
          var itemCat = card.querySelector('p.text-xs').textContent;
          card.style.display = (cat === 'All' || itemCat === cat) ? '' : 'none';
        });
      }
      return;
    }

    var backBtn = e.target.closest('[data-action="back-to-orders"]');
    if (backBtn) {
      subView = 'orders';
      renderOrderList(container);
      window.createIcons();
      return;
    }
  });
}

function setupOrderDetailEvents(container, order) {
  container.addEventListener('click', function (e) {
    var backBtn = e.target.closest('[data-action="back-to-orders"]');
    if (backBtn) {
      subView = 'orders';
      editingOrder = null;
      renderOrderList(container);
      window.createIcons();
      return;
    }

    var transBtn = e.target.closest('[data-action="transition"]');
    if (transBtn) {
      var target = transBtn.getAttribute('data-target');
      var oid = parseInt(transBtn.getAttribute('data-order-id'));
      var o = allOrders.find(function (ord) { return ord.id === oid; });
      if (o && canTransition(currentRole, o.status, target)) {
        o.status = target;
        renderOrderDetail(container, oid);
        window.createIcons();
      }
      return;
    }

    var cancelBtn = e.target.closest('[data-action="cancel-order"]');
    if (cancelBtn) {
      var cid = parseInt(cancelBtn.getAttribute('data-order-id'));
      var co = allOrders.find(function (ord) { return ord.id === cid; });
      if (co && canTransition(currentRole, co.status, 'cancelled')) {
        co.status = 'cancelled';
        renderOrderDetail(container, cid);
        window.createIcons();
      }
      return;
    }

    var dropBtn = e.target.closest('[data-action="drop-draft"]');
    if (dropBtn) {
      var did = parseInt(dropBtn.getAttribute('data-order-id'));
      var didx = allOrders.findIndex(function (o) { return o.id === did; });
      if (didx > -1) {
        allOrders.splice(didx, 1);
        subView = 'orders';
        renderOrderList(container);
        window.createIcons();
      }
      return;
    }

    var delBtn = e.target.closest('[data-action="delete-order"]');
    if (delBtn) {
      var delId = parseInt(delBtn.getAttribute('data-order-id'));
      var delIdx = allOrders.findIndex(function (o) { return o.id === delId; });
      if (delIdx > -1 && currentRole === 'admin') {
        allOrders.splice(delIdx, 1);
        subView = 'orders';
        renderOrderList(container);
        window.createIcons();
      }
      return;
    }

    var editBtn = e.target.closest('[data-action="start-edit"]');
    if (editBtn) {
      var eid = parseInt(editBtn.getAttribute('data-order-id'));
      var eo = allOrders.find(function (o) { return o.id === eid; });
      if (eo) {
        editingOrder = JSON.parse(JSON.stringify(eo));
        renderOrderDetail(container, eid);
        window.createIcons();
      }
      return;
    }

    var saveBtn = e.target.closest('[data-action="save-edit"]');
    if (saveBtn) {
      if (editingOrder) {
        var noteEl = container.querySelector('#order-note');
        if (noteEl) editingOrder.note = noteEl.value;
        editingOrder.items.forEach(function (item) {
          var nameEl = container.querySelector('[data-edit-field="name"][data-idx="' + editingOrder.items.indexOf(item) + '"]');
          var priceEl = container.querySelector('[data-edit-field="price"][data-idx="' + editingOrder.items.indexOf(item) + '"]');
          var qtyEl = container.querySelector('[data-edit-field="qty"][data-idx="' + editingOrder.items.indexOf(item) + '"]');
          if (nameEl) item.name = nameEl.value;
          if (priceEl) item.price = parseFloat(priceEl.value) || item.price;
          if (qtyEl) item.qty = parseInt(qtyEl.value) || item.qty;
        });
        recalcOrder(editingOrder);
        var orig = allOrders.find(function (o) { return o.id === editingOrder.id; });
        if (orig) Object.assign(orig, editingOrder);
        editingOrder = null;
        renderOrderDetail(container, orig.id);
        window.createIcons();
      }
      return;
    }

    var cancelEditBtn = e.target.closest('[data-action="cancel-edit"]');
    if (cancelEditBtn) {
      editingOrder = null;
      renderOrderDetail(container, order.id);
      window.createIcons();
      return;
    }

    var removeItemBtn = e.target.closest('[data-action="remove-edit-item"]');
    if (removeItemBtn && editingOrder) {
      var ridx = parseInt(removeItemBtn.getAttribute('data-idx'));
      editingOrder.items.splice(ridx, 1);
      recalcOrder(editingOrder);
      renderOrderDetail(container, editingOrder.id);
      window.createIcons();
      return;
    }
  });
}

var PosView = {
  render: function (el) {
    if (subView === 'new') {
      renderNewOrder(el);
    } else if (subView === 'detail' && selectedOrderId) {
      renderOrderDetail(el, selectedOrderId);
    } else {
      subView = 'orders';
      renderOrderList(el);
    }
  },
  init: function () {
    window.createIcons();
  },
  destroy: function () {
    editingOrder = null;
  }
};

export default PosView;
