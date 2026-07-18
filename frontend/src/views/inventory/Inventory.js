import * as inventoryStore from "../../store/inventory.js";
import {
  initMockInventory,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  createMovement,
  getMovementsByItem,
  UNITS,
} from "../../services/mockInventory.js";

initMockInventory();

var subView = "list";
var selectedId = null;
var activeFilter = "all";
var searchQuery = "";

function stockStatus(item) {
  var qty = parseFloat(item.quantity);
  var min = parseFloat(item.min_stock);
  if (!item.is_active) return "inactive";
  if (qty <= min) return "low_stock";
  return "active";
}

function statusBadge(item) {
  var status = stockStatus(item);
  var labels = { active: "In Stock", low_stock: "Low Stock", inactive: "Inactive" };
  var colors = {
    active: "bg-success-100 text-success-700",
    low_stock: "bg-error-100 text-error-700",
    inactive: "bg-neutral-100 text-neutral-600",
  };
  var dots = { active: "bg-success-500", low_stock: "bg-error-500", inactive: "bg-neutral-500" };
  return (
    '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ' +
    colors[status] +
    '">' +
    '<span class="w-1.5 h-1.5 rounded-full ' +
    dots[status] +
    '"></span>' +
    labels[status] +
    "</span>"
  );
}

function stockBar(item) {
  var qty = parseFloat(item.quantity);
  var min = parseFloat(item.min_stock);
  var max = Math.max(qty, min * 2, 1);
  var pct = Math.min((qty / max) * 100, 100);
  var barColor = qty <= min ? "bg-error-500" : "bg-success-500";
  return (
    '<div class="flex items-center gap-2">' +
    '<div class="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">' +
    '<div class="' + barColor + ' h-full rounded-full" style="width:' + pct + '%"></div>' +
    "</div>" +
    '<span class="text-xs font-semibold text-brand-800 min-w-[40px] text-right">' + qty + "</span>" +
    "</div>"
  );
}

function getFiltered() {
  var all = inventoryStore.getState().items;
  var filtered = all;

  if (activeFilter === "low_stock") {
    filtered = filtered.filter(function (i) {
      return stockStatus(i) === "low_stock";
    });
  } else if (activeFilter === "inactive") {
    filtered = filtered.filter(function (i) {
      return !i.is_active;
    });
  } else if (activeFilter === "active") {
    filtered = filtered.filter(function (i) {
      return i.is_active;
    });
  }

  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    filtered = filtered.filter(function (i) {
      return i.name.toLowerCase().includes(q) || i.unit.toLowerCase().includes(q);
    });
  }

  return filtered;
}

function formatDate(dateStr) {
  var date = new Date(dateStr);
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

/* ── List View ── */

function renderList(el) {
  var items = getFiltered();
  var allItems = inventoryStore.getState().items;
  var counts = { all: allItems.length };
  counts.active = allItems.filter(function (i) { return i.is_active && stockStatus(i) !== "low_stock"; }).length;
  counts.low_stock = allItems.filter(function (i) { return stockStatus(i) === "low_stock"; }).length;
  counts.inactive = allItems.filter(function (i) { return !i.is_active; }).length;

  var html = '<div class="space-y-5">';

  html += '<div class="flex items-center justify-between">';
  html += '<div><h2 class="text-xl font-semibold text-brand-900 font-display">Inventory</h2>';
  html += '<p class="text-sm text-secondary-500 mt-0.5">' + items.length + " item" + (items.length !== 1 ? "s" : "") + "</p></div>";
  html += '<div class="flex gap-2">';
  if (counts.low_stock > 0) {
    html += '<span class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-error-100 text-error-700"><i data-lucide="alert-triangle" class="w-4 h-4"></i> ' + counts.low_stock + " low stock</span>";
  }
  html += '<button data-action="create-item" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer transition-colors"><i data-lucide="plus" class="w-4 h-4"></i> Add Item</button>';
  html += "</div></div>";

  html += '<div class="flex flex-wrap gap-2">';
  var tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "In Stock" },
    { key: "low_stock", label: "Low Stock" },
    { key: "inactive", label: "Inactive" },
  ];
  tabs.forEach(function (tab) {
    var isActive = activeFilter === tab.key;
    html += '<button data-filter="' + tab.key + '" class="px-4 py-2 rounded-full text-sm font-semibold border cursor-pointer transition-colors ' +
      (isActive ? "bg-brand-500 text-white border-brand-500" : "bg-white text-brand-600 border-brand-300 hover:bg-brand-50") + '">' +
      tab.label + ' <span class="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ' +
      (isActive ? "bg-white/20 text-white" : "bg-brand-200 text-brand-700") + '">' +
      (counts[tab.key] || 0) + "</span></button>";
  });
  html += "</div>";

  html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
  html += '<div class="px-5 py-3 border-b border-brand-100">';
  html += '<div class="flex items-center gap-2 border border-brand-200 rounded-lg px-3 py-2 bg-white">';
  html += '<i data-lucide="search" class="w-4 h-4 text-brand-400 shrink-0"></i>';
  html += '<input type="text" id="inv-search" value="' + searchQuery + '" placeholder="Search inventory..." class="flex-1 text-sm text-neutral-900 outline-none border-none bg-transparent placeholder:text-secondary-400" />';
  if (searchQuery) {
    html += '<button data-action="clear-search" class="text-secondary-400 hover:text-secondary-600 cursor-pointer bg-transparent border-none p-0"><i data-lucide="x" class="w-4 h-4"></i></button>';
  }
  html += "</div></div>";

  html += '<div class="overflow-x-auto">';
  html += '<table class="w-full">';
  html += '<thead><tr class="border-b-2 border-brand-100">';
  var cols = ["Item", "Unit", "Stock Level", "Min Stock", "Status", "Updated", "Actions"];
  cols.forEach(function (c) {
    html += '<th class="px-5 py-3 text-left text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50">' + c + "</th>";
  });
  html += "</tr></thead>";
  html += "<tbody>";

  if (items.length === 0) {
    html += '<tr><td colspan="7" class="px-5 py-12 text-center">';
    html += '<div class="flex flex-col items-center gap-2">';
    html += '<i data-lucide="package" class="w-12 h-12 text-brand-300"></i>';
    html += '<p class="text-sm text-secondary-500">No inventory items found</p>';
    if (searchQuery || activeFilter !== "all") {
      html += '<button data-action="clear-filters" class="text-sm text-brand-600 hover:text-brand-700 cursor-pointer">Clear filters</button>';
    }
    html += "</div></td></tr>";
  } else {
    items.forEach(function (item, i) {
      var zebra = i % 2 === 0 ? "bg-white" : "bg-brand-50/50";
      html += '<tr class="' + zebra + ' border-b border-brand-100 hover:bg-brand-50 transition-colors cursor-pointer" data-action="view-detail" data-item-id="' + item.id + '">';
      html += '<td class="px-5 py-3.5"><div class="font-semibold text-brand-800">' + item.name + "</div></td>";
      html += '<td class="px-5 py-3.5 text-sm text-neutral-600">' + item.unit + "</td>";
      html += '<td class="px-5 py-3.5 min-w-[160px]">' + stockBar(item) + "</td>";
      html += '<td class="px-5 py-3.5 text-sm text-neutral-600 text-center">' + item.min_stock + " " + item.unit + "</td>";
      html += '<td class="px-5 py-3.5">' + statusBadge(item) + "</td>";
      html += '<td class="px-5 py-3.5 text-sm text-secondary-500">' + formatDate(item.updated_at) + "</td>";
      html += '<td class="px-5 py-3.5"><div class="flex items-center gap-2">';
      html += '<button data-action="view-detail" data-item-id="' + item.id + '" class="w-7 h-7 inline-flex items-center justify-center rounded-md bg-transparent text-brand-600 hover:bg-brand-100 border-0 cursor-pointer" title="View"><i data-lucide="eye" class="w-4 h-4"></i></button>';
      html += '<button data-action="edit-item" data-item-id="' + item.id + '" class="w-7 h-7 inline-flex items-center justify-center rounded-md bg-transparent text-primary-600 hover:bg-primary-100 border-0 cursor-pointer" title="Edit"><i data-lucide="pencil" class="w-4 h-4"></i></button>';
      html += "</div></td>";
      html += "</tr>";
    });
  }

  html += "</tbody></table></div></div>";
  html += "</div>";

  el.innerHTML = html;
  setupListEvents(el);
  window.createIcons();
}

/* ── Detail View ── */

function renderDetail(el, itemId) {
  var item = getItemById(itemId);
  if (!item) {
    renderList(el);
    return;
  }

  var movements = getMovementsByItem(itemId).sort(function (a, b) {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  var html = '<div class="space-y-5">';

  html += '<div class="flex items-center justify-between">';
  html += '<div class="flex items-center gap-3">';
  html += '<button data-action="back-to-list" class="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 cursor-pointer transition-colors"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>';
  html += '<h2 class="text-xl font-semibold text-brand-900 font-display">' + item.name + "</h2>";
  html += "</div>";
  html += '<div class="flex items-center gap-3">' + statusBadge(item);
  html += "</div></div>";

  html += '<div class="grid grid-cols-2 md:grid-cols-4 gap-4">';
  html += '<div class="bg-white border border-brand-200 rounded-lg p-4 text-center"><div class="text-[11px] font-bold text-secondary-500 uppercase tracking-wider mb-1">Quantity</div><div class="text-2xl font-bold text-brand-900">' + item.quantity + " <span class='text-sm font-normal text-secondary-500'>" + item.unit + "</span></div></div>";
  html += '<div class="bg-white border border-brand-200 rounded-lg p-4 text-center"><div class="text-[11px] font-bold text-secondary-500 uppercase tracking-wider mb-1">Min Stock</div><div class="text-2xl font-bold text-brand-900">' + item.min_stock + " <span class='text-sm font-normal text-secondary-500'>" + item.unit + "</span></div></div>";
  html += '<div class="bg-white border border-brand-200 rounded-lg p-4 text-center"><div class="text-[11px] font-bold text-secondary-500 uppercase tracking-wider mb-1">Unit</div><div class="text-2xl font-bold text-brand-900">' + item.unit + "</div></div>";
  html += '<div class="bg-white border border-brand-200 rounded-lg p-4 text-center"><div class="text-[11px] font-bold text-secondary-500 uppercase tracking-wider mb-1">Status</div><div class="mt-1">' + statusBadge(item) + "</div></div>";
  html += "</div>";

  html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
  html += '<div class="px-5 py-4 border-b border-brand-100 bg-brand-50">';
  html += '<h3 class="text-sm font-bold text-brand-800 uppercase tracking-wider">Stock Level</h3>';
  html += "</div>";
  html += '<div class="p-5">';
  var qty = parseFloat(item.quantity);
  var min = parseFloat(item.min_stock);
  var max = Math.max(qty, min * 2, 1);
  var pct = Math.min((qty / max) * 100, 100);
  var barColor = qty <= min ? "bg-error-500" : "bg-success-500";
  html += '<div class="flex items-center gap-3 mb-2"><span class="text-sm font-semibold text-secondary-600">' + qty + " " + item.unit + "</span><span class='text-xs text-secondary-400'>of max capacity</span></div>";
  html += '<div class="h-4 rounded-full bg-neutral-100 overflow-hidden"><div class="' + barColor + ' h-full rounded-full transition-all" style="width:' + pct + '%"></div></div>';
  html += '<div class="flex justify-between mt-2 text-xs text-secondary-500"><span>0</span><span class="font-semibold text-error-600">Min: ' + min + " " + item.unit + "</span><span>" + max + " " + item.unit + "</span></div>";
  html += "</div></div>";

  html += '<div class="flex gap-3">';
  html += '<button data-action="stock-in" data-item-id="' + item.id + '" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-success-600 hover:bg-success-700 text-white border-0 cursor-pointer transition-colors"><i data-lucide="plus-circle" class="w-4 h-4"></i> Stock In</button>';
  html += '<button data-action="stock-out" data-item-id="' + item.id + '" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-accent-600 hover:bg-accent-700 text-white border-0 cursor-pointer transition-colors"><i data-lucide="minus-circle" class="w-4 h-4"></i> Stock Out</button>';
  html += '<div class="flex-1"></div>';
  html += '<button data-action="edit-item" data-item-id="' + item.id + '" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 cursor-pointer transition-colors"><i data-lucide="pencil" class="w-4 h-4"></i> Edit</button>';
  html += '<button data-action="delete-item" data-item-id="' + item.id + '" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-error-600 hover:bg-error-700 text-white border-0 cursor-pointer transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i> Delete</button>';
  html += "</div>";

  html += '<div id="movement-form"></div>';

  html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
  html += '<div class="px-5 py-4 border-b border-brand-100 bg-brand-50">';
  html += '<h3 class="text-sm font-bold text-brand-800 uppercase tracking-wider">Recent Movements</h3>';
  html += "</div>";

  if (movements.length === 0) {
    html += '<div class="px-5 py-8 text-center text-sm text-secondary-400">No movements recorded yet</div>';
  } else {
    html += '<div class="overflow-x-auto">';
    html += '<table class="w-full">';
    html += '<thead><tr class="border-b border-brand-100">';
    html += '<th class="px-5 py-3 text-left text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50">Type</th>';
    html += '<th class="px-5 py-3 text-left text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50">Quantity</th>';
    html += '<th class="px-5 py-3 text-left text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50">Reason</th>';
    html += '<th class="px-5 py-3 text-left text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50">Date</th>';
    html += "</tr></thead>";
    html += "<tbody>";
    movements.forEach(function (m) {
      var typeColor = m.type === "in" ? "text-success-700" : "text-error-700";
      var typeBg = m.type === "in" ? "bg-success-100" : "bg-error-100";
      var typeIcon = m.type === "in" ? "arrow-down-left" : "arrow-up-right";
      html += '<tr class="border-b border-brand-100">';
      html += '<td class="px-5 py-3"><span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ' + typeBg + " " + typeColor + '"><i data-lucide="' + typeIcon + '" class="w-3 h-3"></i> ' + (m.type === "in" ? "In" : "Out") + "</span></td>";
      html += '<td class="px-5 py-3 font-semibold text-brand-800">' + m.quantity + " " + item.unit + "</td>";
      html += '<td class="px-5 py-3 text-sm text-secondary-500">' + (m.reason || "\u2014") + "</td>";
      html += '<td class="px-5 py-3 text-sm text-secondary-500">' + formatDate(m.created_at) + "</td>";
      html += "</tr>";
    });
    html += "</tbody></table></div>";
  }

  html += "</div></div>";

  el.innerHTML = html;
  setupDetailEvents(el, itemId);
  window.createIcons();
}

function renderMovementForm(el, itemId, type) {
  var form = el.querySelector("#movement-form");
  if (!form) return;

  var title = type === "in" ? "Stock In" : "Stock Out";
  var btnColor = type === "in" ? "bg-success-600 hover:bg-success-700" : "bg-accent-600 hover:bg-accent-700";

  var html = '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden mb-5">';
  html += '<div class="px-5 py-4 border-b border-brand-100 bg-brand-50 flex items-center justify-between">';
  html += '<h3 class="text-sm font-bold text-brand-800 uppercase tracking-wider">' + title + "</h3>";
  html += '<button data-action="cancel-movement" class="text-secondary-400 hover:text-secondary-600 cursor-pointer bg-transparent border-none"><i data-lucide="x" class="w-4 h-4"></i></button>';
  html += "</div>";
  html += '<div class="p-5">';
  html += '<div class="grid grid-cols-2 gap-4 max-w-md">';
  html += '<label class="flex flex-col gap-1 text-xs font-semibold text-secondary-600">Quantity<input type="number" id="movement-qty" min="0.1" step="0.1" placeholder="0.0" class="border border-brand-200 rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" /></label>';
  html += '<label class="flex flex-col gap-1 text-xs font-semibold text-secondary-600">Reason<input type="text" id="movement-reason" placeholder="e.g. Supplier delivery" class="border border-brand-200 rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" /></label>';
  html += "</div>";
  html += '<div class="flex gap-3 mt-4">';
  html += '<button data-action="submit-movement" data-item-id="' + itemId + '" data-movement-type="' + type + '" class="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg text-white border-0 cursor-pointer transition-colors ' + btnColor + '"><i data-lucide="check" class="w-4 h-4"></i> Confirm ' + title + "</button>";
  html += '<button data-action="cancel-movement" class="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 cursor-pointer transition-colors">Cancel</button>';
  html += "</div>";
  html += "</div></div>";

  form.innerHTML = html;
  window.createIcons();
  var qtyInput = document.getElementById("movement-qty");
  if (qtyInput) qtyInput.focus();
}

/* ── Create / Edit Form ── */

function renderForm(el, itemId) {
  var isEdit = !!itemId;
  var item = isEdit ? getItemById(itemId) : null;

  var html = '<div class="space-y-5">';

  html += '<div class="flex items-center justify-between">';
  html += '<button data-action="back-to-list" class="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 cursor-pointer transition-colors"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>';
  html += '<h2 class="text-xl font-semibold text-brand-900 font-display">' + (isEdit ? "Edit Item" : "New Item") + "</h2>";
  html += "</div>";

  html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
  html += '<div class="px-5 py-4 border-b border-brand-100 bg-brand-50">';
  html += '<h3 class="text-sm font-bold text-brand-800 uppercase tracking-wider">Item Information</h3>';
  html += "</div>";
  html += '<div class="p-5">';
  html += '<div class="space-y-4 max-w-md">';

  html += '<div>';
  html += '<label class="block text-sm font-semibold text-secondary-600 mb-1">Name *</label>';
  html += '<input type="text" id="inv-name" value="' + (item ? item.name : "") + '" placeholder="e.g. Extra Virgin Olive Oil" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" />';
  html += "</div>";

  html += '<div>';
  html += '<label class="block text-sm font-semibold text-secondary-600 mb-1">Unit *</label>';
  html += '<select id="inv-unit" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white cursor-pointer outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all">';
  html += '<option value="">Select unit...</option>';
  UNITS.forEach(function (u) {
    html += '<option value="' + u.id + '"' + (item && item.unit === u.id ? " selected" : "") + ">" + u.name + " (" + u.id + ")</option>";
  });
  html += "</select></div>";

  html += '<div class="grid grid-cols-2 gap-4">';
  html += '<div><label class="block text-sm font-semibold text-secondary-600 mb-1">Quantity *</label>';
  html += '<input type="number" id="inv-quantity" step="0.1" min="0" value="' + (item ? item.quantity : "0") + '" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" /></div>';

  html += '<div><label class="block text-sm font-semibold text-secondary-600 mb-1">Minimum Stock *</label>';
  html += '<input type="number" id="inv-min-stock" step="0.1" min="0" value="' + (item ? item.min_stock : "0") + '" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" /></div>';
  html += "</div>";

  html += '<div class="flex items-center gap-3">';
  html += '<input type="checkbox" id="inv-active" class="w-5 h-5 rounded border-brand-300 text-primary-600 focus:ring-primary-500" ' + (!item || item.is_active ? "checked" : "") + " />";
  html += '<label for="inv-active" class="text-sm font-semibold text-secondary-700">Active</label>';
  html += "</div>";

  html += "</div></div></div>";

  html += '<div class="flex items-center gap-3">';
  html += '<button data-action="save-item" data-item-id="' + (itemId || "") + '" class="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer transition-colors"><i data-lucide="check" class="w-4 h-4"></i> ' + (isEdit ? "Save Changes" : "Create Item") + "</button>";
  html += '<button data-action="back-to-list" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 cursor-pointer transition-colors">Cancel</button>';
  html += "</div>";

  html += "</div>";

  el.innerHTML = html;
  setupFormEvents(el);
  window.createIcons();
  var nameInput = document.getElementById("inv-name");
  if (nameInput) nameInput.focus();
}

/* ── Event Setup ── */

function setupListEvents(el) {
  el.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) {
      var filterBtn = e.target.closest("[data-filter]");
      if (filterBtn) {
        activeFilter = filterBtn.getAttribute("data-filter");
        renderList(el);
      }
      return;
    }

    var action = btn.getAttribute("data-action");

    if (action === "create-item") {
      subView = "create";
      selectedId = null;
      renderForm(el, null);
    } else if (action === "view-detail") {
      selectedId = btn.getAttribute("data-item-id");
      subView = "detail";
      renderDetail(el, selectedId);
    } else if (action === "edit-item") {
      selectedId = btn.getAttribute("data-item-id");
      subView = "edit";
      renderForm(el, selectedId);
    } else if (action === "clear-search") {
      searchQuery = "";
      renderList(el);
    } else if (action === "clear-filters") {
      activeFilter = "all";
      searchQuery = "";
      renderList(el);
    }
  });

  var searchInput = el.querySelector("#inv-search");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      searchQuery = e.target.value;
      renderList(el);
    });
  }
}

function setupDetailEvents(el, itemId) {
  el.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;

    var action = btn.getAttribute("data-action");

    if (action === "back-to-list") {
      subView = "list";
      selectedId = null;
      renderList(el);
    } else if (action === "edit-item") {
      subView = "edit";
      renderForm(el, itemId);
    } else if (action === "stock-in") {
      renderMovementForm(el, itemId, "in");
    } else if (action === "stock-out") {
      renderMovementForm(el, itemId, "out");
    } else if (action === "cancel-movement") {
      var form = el.querySelector("#movement-form");
      if (form) form.innerHTML = "";
    } else if (action === "submit-movement") {
      var qtyInput = el.querySelector("#movement-qty");
      var reasonInput = el.querySelector("#movement-reason");
      var qty = parseFloat(qtyInput ? qtyInput.value : 0);
      var reason = reasonInput ? reasonInput.value.trim() : "";
      var type = btn.getAttribute("data-movement-type");

      if (!qty || qty <= 0) {
        alert("Please enter a valid quantity");
        return;
      }

      createMovement({ item_id: itemId, type: type, quantity: qty, reason: reason || null });
      inventoryStore.refreshItems();
      renderDetail(el, itemId);
    } else if (action === "delete-item") {
      if (confirm("Are you sure you want to delete this item?")) {
        deleteItem(itemId);
        inventoryStore.refreshItems();
        subView = "list";
        selectedId = null;
        renderList(el);
      }
    }
  });

  el.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var submitBtn = el.querySelector('[data-action="submit-movement"]');
      if (submitBtn) submitBtn.click();
    }
    if (e.key === "Escape") {
      var form = el.querySelector("#movement-form");
      if (form && form.innerHTML) {
        form.innerHTML = "";
      }
    }
  });
}

function setupFormEvents(el) {
  el.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;

    var action = btn.getAttribute("data-action");

    if (action === "back-to-list") {
      subView = "list";
      selectedId = null;
      renderList(el);
    } else if (action === "save-item") {
      var itemId = btn.getAttribute("data-item-id");
      var name = (document.getElementById("inv-name") || {}).value || "";
      var unit = (document.getElementById("inv-unit") || {}).value || "";
      var quantity = parseFloat((document.getElementById("inv-quantity") || {}).value) || 0;
      var minStock = parseFloat((document.getElementById("inv-min-stock") || {}).value) || 0;
      var active = (document.getElementById("inv-active") || {}).checked;

      if (!name.trim()) {
        alert("Please enter a name");
        return;
      }
      if (!unit) {
        alert("Please select a unit");
        return;
      }

      var data = { name: name.trim(), unit: unit, quantity: quantity, min_stock: minStock, is_active: active };

      if (itemId) {
        updateItem(itemId, data);
      } else {
        createItem(data);
      }

      inventoryStore.refreshItems();
      subView = "list";
      selectedId = null;
      renderList(el);
    }
  });
}

/* ── Export ── */

var InventoryView = {
  render: function (el) {
    inventoryStore.loadItems();

    if (subView === "detail" && selectedId) {
      renderDetail(el, selectedId);
    } else if (subView === "create") {
      renderForm(el, null);
    } else if (subView === "edit" && selectedId) {
      renderForm(el, selectedId);
    } else {
      subView = "list";
      renderList(el);
    }
  },
  init: function () {},
  destroy: function () {
    subView = "list";
    selectedId = null;
    activeFilter = "all";
    searchQuery = "";
  },
};

export default InventoryView;
