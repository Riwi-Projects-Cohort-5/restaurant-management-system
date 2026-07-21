import { kitchenOrders, loadKitchenOrders, loadOrders, updateAllKitchenOrderStatuses } from "../../store/posData.js";

const KITCHEN_STATUS_MAP = {
  new: "pending",
  preparing: "preparing",
  ready: "ready",
  served: "delivered",
};

async function moveOrder(id, newStatus) {
  const order = kitchenOrders.find(function (o) {
    return o.id === id || o.fullId === id;
  });
  if (!order) return;

  const backendStatus = KITCHEN_STATUS_MAP[newStatus];
  if (backendStatus && order.kitchenIds && order.kitchenIds.length > 0) {
    await updateAllKitchenOrderStatuses(order.kitchenIds, backendStatus);
  } else {
    if (newStatus === "served") {
      const idx = kitchenOrders.indexOf(order);
      if (idx > -1) kitchenOrders.splice(idx, 1);
    } else {
      order.status = newStatus;
    }
  }
  const el = document.getElementById("current-view");
  if (el) {
    await KitchenView.render(el);
    window.createIcons();
  }
}

function renderColumn(col) {
  const orders = kitchenOrders.filter(function (o) {
    return o.status === col.key;
  });

  let html = '<div class="flex flex-col rounded-xl overflow-hidden ' + col.colBg + '">';
  html += '<div class="flex items-center justify-between px-5 py-4">';
  html += '<span class="text-[15px] font-bold ' + col.headerColor + '">' + col.label + "</span>";
  html +=
    '<span class="text-xs font-bold px-2 py-0.5 rounded-full ' +
    col.countBg +
    " " +
    col.countColor +
    '">' +
    orders.length +
    "</span>";
  html += "</div>";
  html += '<div class="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-3">';

  if (orders.length === 0) {
    html += '<div class="text-center py-6 text-secondary-400 text-[13px]">No orders</div>';
  } else {
    orders.forEach(function (order) {
      html += renderCard(order, col);
    });
  }

  html += "</div></div>";
  return html;
}

function renderCard(order, col) {
  const actionLabel =
    col.key === "new" ? "Start Preparing" : col.key === "preparing" ? "Mark Ready" : "Served";
  const actionBg =
    col.key === "new"
      ? "bg-brand-600 hover:bg-brand-700"
      : col.key === "preparing"
        ? "bg-primary-600 hover:bg-primary-700"
        : "bg-brand-600 hover:bg-brand-700";
  const isUrgent = order.time > 15;

  let html =
    '<div class="bg-white border border-brand-300 rounded-lg p-4 shadow-[0_2px_6px_rgba(114,49,23,0.08)]">';

  html += '<div class="flex items-center justify-between mb-3">';
  html += '<span class="text-sm font-bold text-brand-800">Table ' + order.table + "</span>";
  html +=
    '<span class="inline-flex items-center gap-1 text-xs ' +
    (isUrgent ? "text-error-600 font-semibold" : "text-secondary-500") +
    '">';
  html += '<i data-lucide="clock" class="w-3.5 h-3.5"></i> ' + order.time + " min</span>";
  html += "</div>";

  html += '<div class="flex flex-col gap-1 mb-3">';
  order.items.forEach(function (item) {
    html += '<div class="text-[13px] text-neutral-600 flex items-center gap-2">';
    html +=
      '<span class="font-bold text-brand-700 min-w-[20px]">' + item.qty + "x</span> " + item.name;
    html += "</div>";
  });
  html += "</div>";

  if (order.note) {
    html +=
      '<div class="text-xs text-accent-700 italic p-2 mb-3 rounded bg-accent-50 border-l-[3px] border-accent-400">' +
      order.note +
      "</div>";
  }

  html += '<div class="flex gap-2">';
  html +=
    '<button data-kitchen-action="details" data-order-id="' +
    order.id +
    '" class="flex-1 h-8 px-3 text-xs font-semibold rounded-lg bg-transparent text-primary-600 hover:bg-primary-50 border border-primary-300 cursor-pointer transition-colors">Details</button>';
  html +=
    '<button data-kitchen-action="move" data-order-id="' +
    order.id +
    '" data-from-status="' +
    col.key +
    '" data-next-status="' +
    col.next +
    '" class="flex-1 h-8 px-3 text-xs font-semibold rounded-lg text-white border-0 cursor-pointer transition-colors ' +
    actionBg +
    '">' +
    actionLabel +
    "</button>";
  html += "</div></div>";

  return html;
}

function showDetailsModal(order) {
  const existing = document.getElementById("kitchen-details-modal");
  if (existing) existing.remove();

  let itemsHtml = "";
  order.items.forEach(function (item) {
    itemsHtml += '<div class="flex justify-between text-sm py-1 border-b border-brand-100">';
    itemsHtml += '<span>' + item.qty + 'x ' + item.name + '</span>';
    itemsHtml += "</div>";
  });

  let modal =
    '<div id="kitchen-details-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">';
  modal += '<div class="bg-white rounded-xl shadow-xl w-[400px] max-h-[80vh] flex flex-col">';
  modal += '<div class="flex items-center justify-between px-5 py-4 border-b border-brand-100">';
  modal += '<h3 class="text-base font-bold text-brand-800">Order Details</h3>';
  modal += '<button id="kitchen-modal-close" class="text-brand-400 hover:text-brand-600 bg-transparent border-0 cursor-pointer"><i data-lucide="x" class="w-5 h-5"></i></button>';
  modal += "</div>";
  modal += '<div class="px-5 py-4 overflow-y-auto flex-1">';
  modal += '<div class="mb-3"><span class="text-sm font-semibold text-brand-700">Table: </span><span class="text-sm text-brand-800">' + order.table + '</span></div>';
  modal += '<div class="mb-3"><span class="text-sm font-semibold text-brand-700">Status: </span><span class="text-sm text-brand-800 capitalize">' + order.status + '</span></div>';
  modal += '<div class="mb-3"><span class="text-sm font-semibold text-brand-700">Time: </span><span class="text-sm text-brand-800">' + order.time + ' min</span></div>';
  modal += '<div class="mb-3">';
  modal += '<p class="text-sm font-semibold text-brand-700 mb-1">Items:</p>';
  modal += itemsHtml;
  modal += "</div>";
  if (order.note) {
    modal += '<div class="mt-3 p-3 bg-accent-50 border-l-[3px] border-accent-400 rounded">';
    modal += '<p class="text-xs font-semibold text-accent-700 mb-1">Kitchen Note:</p>';
    modal += '<p class="text-sm text-accent-700 italic">' + order.note + '</p>';
    modal += "</div>";
  }
  modal += "</div>";
  modal += '<div class="px-5 py-3 border-t border-brand-100 flex justify-end">';
  modal += '<button id="kitchen-modal-close-btn" class="h-8 px-4 text-sm font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white border-0 cursor-pointer transition-colors">Close</button>';
  modal += "</div></div></div>";

  document.body.insertAdjacentHTML("beforeend", modal);
  window.createIcons();

  function closeModal() {
    const m = document.getElementById("kitchen-details-modal");
    if (m) m.remove();
  }
  document.getElementById("kitchen-modal-close").onclick = closeModal;
  document.getElementById("kitchen-modal-close-btn").onclick = closeModal;
  document.getElementById("kitchen-details-modal").onclick = function (e) {
    if (e.target === this) closeModal();
  };
}

const KitchenView = {
  render: async function (el) {
    await loadOrders();
    await loadKitchenOrders();
    const cols = [
      {
        key: "new",
        label: "New Orders",
        next: "preparing",
        colBg: "bg-info-50",
        headerColor: "text-info-700",
        countBg: "bg-info-100",
        countColor: "text-info-700",
      },
      {
        key: "preparing",
        label: "Preparing",
        next: "ready",
        colBg: "bg-accent-50",
        headerColor: "text-accent-700",
        countBg: "bg-accent-100",
        countColor: "text-accent-700",
      },
      {
        key: "ready",
        label: "Ready to Serve",
        next: "served",
        colBg: "bg-success-50",
        headerColor: "text-success-700",
        countBg: "bg-success-100",
        countColor: "text-success-700",
      },
    ];

    let html = '<div class="flex flex-col h-full">';

    html += '<div class="flex items-center justify-between mb-5">';
    html += '<h2 class="text-xl font-bold text-brand-900">Kitchen Orders</h2>';
    html += '<div class="flex items-center gap-2 text-sm text-brand-600">';
    html += '<span class="w-3 h-3 rounded-full bg-error-500"></span> Urgent (&gt;15 min)';
    html += "</div></div>";

    html += '<div class="flex-1 grid grid-cols-3 gap-5 min-h-0">';
    cols.forEach(function (col) {
      html += renderColumn(col);
    });
    html += "</div></div>";

    el.innerHTML = html;
  },

  init: function () {
    const el = document.getElementById("current-view");
    if (!el) return;
    this._clickHandler = function (e) {
      const moveBtn = e.target.closest('[data-kitchen-action="move"]');
      if (moveBtn) {
        const oid = moveBtn.getAttribute("data-order-id");
        const next = moveBtn.getAttribute("data-next-status");
        moveOrder(oid, next);
        return;
      }
      const detailsBtn = e.target.closest('[data-kitchen-action="details"]');
      if (detailsBtn) {
        const oid = detailsBtn.getAttribute("data-order-id");
        const order = kitchenOrders.find(function (o) {
          return o.id === oid || o.fullId === oid;
        });
        if (order) showDetailsModal(order);
      }
    };
    el.addEventListener("click", this._clickHandler);
  },
  destroy: function () {
    const el = document.getElementById("current-view");
    if (el && this._clickHandler) {
      el.removeEventListener("click", this._clickHandler);
      this._clickHandler = null;
    }
  },
};

export default KitchenView;
