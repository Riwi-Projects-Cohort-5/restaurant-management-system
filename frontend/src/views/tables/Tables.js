import { tables, areas, allOrders } from "../../store/posData.js";
import InputField from "../../components/forms/InputField.js";
import { withLoading, renderWithSkeleton, Skeletons } from "../../utils/withLoading.js";

let subView = "main";
let currentAreaFilter = "all";
let selectedTableId = null;
let expandedAreaId = null;
let editingAreaId = null;
let editingAreaIcon = null;
let openPickerAreaId = null;

const ICON_LIST = [
  "home",
  "sun",
  "waves",
  "trees",
  "umbrella",
  "coffee",
  "wine",
  "flame",
  "star",
  "building",
];

function getActiveOrderForTable(tableId) {
  return allOrders.find(function (o) {
    return o.table === tableId && o.status !== "completed" && o.status !== "cancelled";
  });
}

/* ── Render Main ── */

function renderMain(el) {
  let html = '<div class="space-y-6">';

  html += '<div class="flex items-center justify-between">';
  html += '<h2 class="text-xl font-semibold text-brand-900 font-display">Table Management</h2>';
  html += '<div class="flex gap-2">';
  html +=
    '<button data-action="manage-areas" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 cursor-pointer transition-colors"><i data-lucide="settings" class="w-4 h-4"></i> Manage Areas</button>';
  html += "</div></div>";

  html += renderAreaFilters();

  html += '<div class="flex gap-3 text-xs text-brand-600">';
  let availCount = 0,
    occupiedCount = 0,
    reservedCount = 0;
  tables.forEach(function (t) {
    if (t.status === "available") availCount++;
    else if (t.status === "occupied") occupiedCount++;
    else if (t.status === "reserved") reservedCount++;
  });
  html +=
    '<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-success-500"></span> Available (' +
    availCount +
    ")</span>";
  html +=
    '<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-brand-500"></span> Occupied (' +
    occupiedCount +
    ")</span>";
  html +=
    '<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-accent-500"></span> Reserved (' +
    reservedCount +
    ")</span>";
  html += "</div>";

  html += "</div>";

  const areasToShow =
    currentAreaFilter === "all"
      ? areas
      : areas.filter(function (a) {
          return a.id === parseInt(currentAreaFilter);
        });
  areasToShow.forEach(function (area) {
    html += renderAreaSection(area);
  });

  html += "</div>";
  el.innerHTML = html;
  window.createIcons();
}

function renderAreaFilters() {
  const counts = { all: tables.length };
  areas.forEach(function (a) {
    counts[a.id] = tables.filter(function (t) {
      return t.area === a.id;
    }).length;
  });

  let html = '<div class="flex flex-wrap gap-2 mb-4">';
  html +=
    '<button data-area-filter="all" class="px-4 py-2 rounded-full text-sm font-semibold border cursor-pointer transition-colors ' +
    (currentAreaFilter === "all"
      ? "bg-brand-500 text-white border-brand-500"
      : "bg-white text-brand-600 border-brand-300 hover:bg-brand-50") +
    '">';
  html +=
    '<span class="flex items-center gap-2">All <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-200 text-brand-700 text-[10px] font-bold">' +
    counts.all +
    "</span></span></button>";

  areas.forEach(function (area) {
    const isActive = currentAreaFilter === String(area.id);
    html += '<span class="inline-flex items-center gap-0">';
    html +=
      '<button data-area-filter="' +
      area.id +
      '" class="px-4 py-2 rounded-full text-sm font-semibold border cursor-pointer transition-colors rounded-r-none ' +
      (isActive
        ? "bg-brand-500 text-white border-brand-500"
        : "bg-white text-brand-600 border-brand-300 hover:bg-brand-50") +
      '">';
    html +=
      '<span class="flex items-center gap-2"><i data-lucide="' +
      area.icon +
      '" class="w-4 h-4"></i> ' +
      area.name +
      ' <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-200 text-brand-700 text-[10px] font-bold">' +
      (counts[area.id] || 0) +
      "</span></span>";
    html += "</button>";
    if (isActive && currentAreaFilter !== "all") {
      html +=
        '<button data-action="edit-area-inline" data-area-id="' +
        area.id +
        '" class="px-2 py-2 rounded-full rounded-l-none border border-l-0 border-brand-300 bg-brand-500 text-white hover:bg-brand-600 cursor-pointer transition-colors" title="Edit ' +
        area.name +
        '"><i data-lucide="pencil" class="w-3 h-3"></i></button>';
    }
    html += "</span>";
  });

  html += "</div>";
  html += '<div id="inline-area-form"></div>';
  return html;
}

function renderAreaSection(area) {
  const areaTables = tables.filter(function (t) {
    return t.area === area.id;
  });
  const isExpanded = expandedAreaId === area.id;

  let html = '<div class="bg-white border border-brand-200 rounded-xl mb-5 overflow-hidden">';
  html +=
    '<div class="flex items-center justify-between px-5 py-4 bg-brand-50 border-b border-brand-200 cursor-pointer transition-colors hover:bg-brand-100" data-action="toggle-area" data-area-id="' +
    area.id +
    '">';
  html +=
    '<div class="flex items-center gap-3 text-[15px] font-bold text-brand-900"><i data-lucide="' +
    area.icon +
    '" class="w-5 h-5 text-brand-500"></i> ' +
    area.name +
    "</div>";
  html += '<div class="flex items-center gap-3">';
  html +=
    '<span class="text-xs font-bold px-3 py-0.5 rounded-full bg-brand-100 text-brand-700">' +
    areaTables.length +
    " table" +
    (areaTables.length !== 1 ? "s" : "") +
    "</span>";
  html +=
    '<i data-lucide="chevron-down" class="w-5 h-5 text-brand-400 transition-transform ' +
    (isExpanded ? "" : "-rotate-90") +
    '"></i>';
  html += "</div></div>";

  if (isExpanded) {
    html += '<div class="p-5">';
    if (areaTables.length === 0) {
      html += '<p class="text-center text-neutral-400 text-sm py-5">No tables in this area</p>';
    } else {
      html += '<div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-5">';
      areaTables.forEach(function (t) {
        html += renderTableShape(t);
      });
      html += "</div>";
    }
    html += "</div>";
  }
  html += "</div>";
  return html;
}

function renderTableShape(table) {
  const statusStyles = {
    available: "border-success-300 bg-success-50 text-success-700",
    occupied: "border-brand-300 bg-brand-50 text-brand-700",
    reserved: "border-accent-300 bg-accent-50 text-accent-700",
  };
  const baseClasses =
    "aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-100 relative hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]";
  let html =
    '<div data-table-id="' +
    table.id +
    '" class="' +
    baseClasses +
    " " +
    (statusStyles[table.status] || "") +
    '">';
  html += '<span class="font-display text-2xl font-bold">' + table.id + "</span>";
  html += '<span class="text-xs font-semibold">' + table.info + "</span>";
  html += '<span class="text-[11px] opacity-70">' + table.seats + " seats</span>";
  if (table.timer) {
    html +=
      '<span class="absolute bottom-3 text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/5">' +
      table.timer +
      "</span>";
  }
  html += "</div>";
  return html;
}

/* ── Table Detail Sub-view ── */

function renderDetail(el, tableId) {
  const t = tables.find(function (x) {
    return x.id === tableId;
  });
  if (!t) {
    subView = "main";
    selectedTableId = null;
    renderMain(el);
    return;
  }

  const order = getActiveOrderForTable(t.id);

  let html = '<div class="space-y-5">';

  html += '<div class="flex items-center justify-between">';
  html += '<div class="flex items-center gap-3">';
  html +=
    '<button data-action="back" class="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>';
  html += '<h2 class="text-xl font-semibold text-primary-700 font-display">Table ' + t.id + "</h2>";
  html += "</div>";
  html += renderBadge(t.status);
  html += "</div>";

  html += '<div class="grid grid-cols-3 gap-3">';
  html +=
    '<div class="bg-brand-50 rounded-lg p-3 text-center"><span class="block text-[10px] font-bold text-brand-500 uppercase">Seats</span><span class="text-lg font-bold text-primary-800">' +
    t.seats +
    "</span></div>";
  html +=
    '<div class="bg-brand-50 rounded-lg p-3 text-center"><span class="block text-[10px] font-bold text-brand-500 uppercase">Status</span><span class="text-lg font-bold text-primary-800 capitalize">' +
    t.status +
    "</span></div>";
  html +=
    '<div class="bg-brand-50 rounded-lg p-3 text-center"><span class="block text-[10px] font-bold text-brand-500 uppercase">Info</span><span class="text-sm font-bold text-primary-800">' +
    t.info +
    "</span></div>";
  html += "</div>";

  if (t.status === "available") {
    html += '<div class="text-center py-10">';
    html +=
      '<div class="w-16 h-16 rounded-full bg-success-100 text-success-600 inline-flex items-center justify-center mb-4"><i data-lucide="check-circle" class="w-8 h-8"></i></div>';
    html += '<h3 class="text-lg text-neutral-800 mb-2">Table is free</h3>';
    html += '<p class="text-neutral-500 mb-6">Ready for new guests</p>';
    html += '<div class="flex justify-center gap-3">';
    html +=
      '<button data-action="open-order" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer"><i data-lucide="plus" class="w-4 h-4"></i> Open Order</button>';
    html +=
      '<button class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-accent-400 hover:bg-accent-500 text-white border-0 cursor-pointer">Reserve</button>';
    html += "</div></div>";
  } else if (t.status === "occupied" && order) {
    html +=
      '<div class="bg-white border border-brand-300 rounded-xl shadow-[0_2px_6px_rgba(114,49,23,0.08)] overflow-hidden">';
    html +=
      '<div class="flex items-center justify-between px-5 py-4 border-b border-brand-100 bg-brand-50">';
    html += '<h3 class="text-sm font-bold text-brand-800">Active Order #' + order.id + "</h3>";
    html += renderBadge(order.status);
    html += "</div>";
    html += '<div class="px-5 py-4">';
    html += '<div class="grid grid-cols-3 gap-4 mb-5">';
    html +=
      '<div class="text-center"><div class="text-[11px] font-bold uppercase text-secondary-500 mb-1">Items</div><div class="text-xl font-bold text-brand-900">' +
      order.items.length +
      "</div></div>";
    html +=
      '<div class="text-center"><div class="text-[11px] font-bold uppercase text-secondary-500 mb-1">Total</div><div class="text-xl font-bold text-brand-900">$' +
      order.total.toFixed(2) +
      "</div></div>";
    html +=
      '<div class="text-center"><div class="text-[11px] font-bold uppercase text-secondary-500 mb-1">Time</div><div class="text-xl font-bold text-brand-900">' +
      (order.time || "\u2014") +
      "</div></div>";
    html += "</div>";
    html += '<table class="w-full border-collapse">';
    html += "<thead><tr>";
    html +=
      '<th class="px-4 py-3 text-left text-xs font-bold text-brand-700 uppercase tracking-wider border-b-2 border-brand-200 bg-brand-50">Item</th>';
    html +=
      '<th class="px-4 py-3 text-center text-xs font-bold text-brand-700 uppercase tracking-wider border-b-2 border-brand-200 bg-brand-50">Qty</th>';
    html +=
      '<th class="px-4 py-3 text-right text-xs font-bold text-brand-700 uppercase tracking-wider border-b-2 border-brand-200 bg-brand-50">Subtotal</th>';
    html += "</tr></thead>";
    html += "<tbody>";
    order.items.forEach(function (i) {
      html +=
        '<tr><td class="px-4 py-3 text-sm text-neutral-700 border-b border-brand-100 align-middle">' +
        i.name +
        '</td><td class="px-4 py-3 text-sm text-neutral-700 border-b border-brand-100 align-middle text-center">' +
        i.qty +
        '</td><td class="px-4 py-3 text-sm text-neutral-700 border-b border-brand-100 align-middle text-right">$' +
        ((i.price || 0) * i.qty).toFixed(2) +
        "</td></tr>";
    });
    html += "</tbody></table>";
    html += '<div class="flex gap-2 mt-4">';
    html +=
      '<button data-action="view-order" data-order-id="' +
      order.id +
      '" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer"><i data-lucide="eye" class="w-4 h-4"></i> View Order</button>';
    html +=
      '<button class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer">Seat New</button>';
    html += "</div>";
    html += "</div></div>";
  } else if (t.status === "occupied") {
    html +=
      '<div class="text-center py-10 text-neutral-500"><p>No active order found for this table.</p></div>';
  } else if (t.status === "reserved") {
    html += '<div class="text-center py-10">';
    html +=
      '<div class="w-16 h-16 rounded-full bg-accent-100 text-accent-600 inline-flex items-center justify-center mb-4"><i data-lucide="clock" class="w-8 h-8"></i></div>';
    html += '<h3 class="text-lg text-neutral-800 mb-2">Reservation at ' + t.info + "</h3>";
    html += '<p class="text-neutral-500 mb-6">' + t.seats + " seats reserved</p>";
    html += '<div class="flex justify-center gap-3">';
    html +=
      '<button class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer">Seat Now</button>';
    html +=
      '<button class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-transparent text-error-600 hover:bg-error-50 border border-error-300 cursor-pointer">Cancel</button>';
    html += "</div></div>";
  }

  html += "</div>";
  el.innerHTML = html;
  window.createIcons();
}

function renderBadge(status) {
  let cls = "bg-secondary-100 text-secondary-700";
  let dotCls = "bg-secondary-500";
  let label = status;
  if (status === "available") {
    cls = "bg-success-100 text-success-700";
    dotCls = "bg-success-500";
    label = "Free";
  } else if (status === "occupied") {
    cls = "bg-brand-100 text-brand-700";
    dotCls = "bg-brand-500";
    label = "Occupied";
  } else if (status === "reserved") {
    cls = "bg-accent-100 text-accent-700";
    dotCls = "bg-accent-500";
    label = "Reserved";
  }
  return (
    '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ' +
    cls +
    '"><span class="w-1.5 h-1.5 rounded-full ' +
    dotCls +
    '"></span> ' +
    label +
    "</span>"
  );
}

/* ── Manage Areas Sub-view ── */

function renderManageAreas(el) {
  let html = "";

  html += '<div class="flex items-center justify-between mb-5">';
  html += '<div class="flex items-center gap-3">';
  html +=
    '<button data-action="back" class="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>';
  html += '<h2 class="text-xl font-semibold text-primary-700 font-display">Manage Areas</h2>';
  html += "</div></div>";

  html += '<div class="flex gap-6 items-start">';

  html += '<div class="flex-1 min-w-0">';

  areas.forEach(function (area) {
    const areaTables = tables.filter(function (t) {
      return t.area === area.id;
    });
    const isExpanded = expandedAreaId === area.id;
    const isEditing = editingAreaId === area.id;
    const icon = editingAreaIcon || area.icon || "home";

    html += '<div class="relative mb-4">';
    html += '<div class="bg-white border border-brand-200 rounded-xl">';
    html +=
      '<div class="flex items-center justify-between px-5 py-4 cursor-pointer transition-colors hover:bg-brand-50" data-action="toggle-manage-area" data-area-id="' +
      area.id +
      '">';
    html += '<div class="flex items-center gap-3 text-[15px] font-bold text-brand-900">';
    html +=
      '<button class="p-1 cursor-pointer bg-transparent border-0"><i data-lucide="chevron-down" class="w-5 h-5 text-brand-400 transition-transform ' +
      (isExpanded ? "" : "-rotate-90") +
      '"></i></button>';
    html +=
      '<span data-action="change-area-icon" data-area-id="' +
      area.id +
      '" class="cursor-pointer p-1 rounded-md hover:bg-brand-50 inline-flex items-center" title="Change icon"><i data-lucide="' +
      icon +
      '" class="w-5 h-5 text-brand-500"></i></span>';

    if (isEditing) {
      html +=
        '<input id="area-name-input" value="' +
        area.name +
        '" class="border border-brand-400 rounded px-1.5 py-0.5 text-sm font-bold font-display w-[140px]" />';
      html +=
        '<button data-action="save-area-name" data-area-id="' +
        area.id +
        '" class="h-7 px-2 text-[11px] font-semibold rounded bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer">Save</button>';
    } else {
      html +=
        '<span data-action="rename-area" data-area-id="' +
        area.id +
        '" class="cursor-text px-1 py-0.5 rounded hover:bg-neutral-100 text-sm font-bold font-display text-brand-900">' +
        area.name +
        "</span>";
    }

    html +=
      '<span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-secondary-600"><i data-lucide="table-2" class="w-3 h-3"></i> ' +
      areaTables.length +
      "</span>";
    html += "</div>";

    html += '<div class="flex items-center gap-2">';
    html +=
      '<button data-action="delete-area" data-area-id="' +
      area.id +
      '" class="p-2 rounded hover:bg-error-50 cursor-pointer bg-transparent border-0 text-error-600 ' +
      (areaTables.length > 0 ? "opacity-40 cursor-not-allowed" : "") +
      '" ' +
      (areaTables.length > 0 ? 'disabled title="Reassign tables first"' : "") +
      '><i data-lucide="trash-2" class="w-4 h-4"></i></button>';
    html += "</div></div>";

    if (isExpanded) {
      html += '<div class="px-5 pb-5">';
      if (areaTables.length === 0) {
        html += '<p class="text-neutral-400 text-xs py-2">No tables assigned</p>';
      } else {
        areaTables.forEach(function (t) {
          html +=
            '<div class="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-b-0">';
          html +=
            '<span class="inline-flex items-center justify-center w-9 h-9 rounded-md text-[13px] font-bold cursor-default border-2 border-solid ' +
            getTableStatusClasses(t.status) +
            '">' +
            t.id +
            "</span>";
          html +=
            '<span class="flex-1 text-sm font-medium text-neutral-700">' +
            t.seats +
            " seats \u2014 " +
            t.info +
            "</span>";
          html +=
            '<select data-action="reassign-table" data-table-id="' +
            t.id +
            '" class="border border-brand-200 rounded-md px-2 py-1 text-xs">';
          areas.forEach(function (a) {
            html +=
              '<option value="' +
              a.id +
              '"' +
              (a.id === area.id ? " selected" : "") +
              ">" +
              a.name +
              "</option>";
          });
          html += "</select>";
          html +=
            '<button data-action="delete-table" data-table-id="' +
            t.id +
            '" class="p-1.5 rounded hover:bg-error-50 cursor-pointer bg-transparent border-0 text-error-500" title="Delete table"><i data-lucide="trash-2" class="w-4 h-4"></i></button>';
          html += "</div>";
        });
      }
      html += "</div>";
    }

    html += "</div></div>";
  });

  html += "</div>";

  html += '<div class="w-72 shrink-0 space-y-4 sticky top-0">';
  html += '<div class="bg-white border border-brand-200 rounded-xl overflow-hidden">';
  html +=
    '<div class="px-4 py-3 bg-neutral-50 border-b border-brand-100"><span class="text-xs font-bold text-secondary-600">Add New Table</span></div>';
  html += '<div class="flex flex-col gap-3 p-4">';
  html +=
    '<label class="flex flex-col gap-1 text-xs font-semibold text-secondary-600">Area<select id="new-table-area" class="border border-brand-200 rounded-md px-3 py-2 text-sm bg-white">';
  areas.forEach(function (a) {
    html += '<option value="' + a.id + '">' + a.name + "</option>";
  });
  html += "</select></label>";
  html += InputField({ id: "new-table-seats", label: "Seats", type: "number", value: "4", min: "1", max: "20" });
  html +=
    '<button data-action="create-table" class="flex items-center justify-center gap-1 h-9 px-3 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer"><i data-lucide="plus" class="w-4 h-4"></i> Add Table</button>';
  html += "</div></div>";

  html += '<div class="bg-white border border-brand-200 rounded-xl overflow-hidden">';
  html +=
    '<div class="px-4 py-3 bg-neutral-50 border-b border-brand-100"><span class="text-xs font-bold text-secondary-600">Add New Area</span></div>';
  html += '<div class="flex flex-col gap-3 p-4">';
  html += InputField({ id: "new-area-name", label: "Area Name", placeholder: "e.g. Rooftop" });
  html +=
    '<label class="flex flex-col gap-1 text-xs font-semibold text-secondary-600">Icon<button type="button" data-action="open-new-area-icon-picker" class="w-10 h-10 rounded-lg border border-brand-200 flex items-center justify-center cursor-pointer bg-white hover:bg-brand-50"><i data-lucide="' +
    (editingAreaIcon || "home") +
    '" class="w-5 h-5 text-brand-500"></i></button></label>';
  html +=
    '<button data-action="save-new-area" class="flex items-center justify-center gap-1 h-9 px-3 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer"><i data-lucide="plus" class="w-4 h-4"></i> Create Area</button>';
  html += "</div></div>";
  html += "</div>";

  html += "</div>";

  el.innerHTML = html;
  window.createIcons();
  if (editingAreaId !== null) {
    const input = document.getElementById("area-name-input");
    if (input) {
      input.focus();
      input.select();
    }
  }
  if (openPickerAreaId !== null) {
    const pickerWrapper = document.querySelector(
      '[data-action="change-area-icon"][data-area-id="' + openPickerAreaId + '"]'
    );
    const pickerArea = areas.find(function (a) {
      return a.id === openPickerAreaId;
    });
    if (pickerWrapper && pickerArea) {
      renderIconPickerPopup(pickerWrapper, pickerArea.icon, "area", openPickerAreaId);
    }
  }
}

function getTableStatusClasses(status) {
  if (status === "available") return "border-success-300 bg-success-50 text-success-700";
  if (status === "occupied") return "border-brand-300 bg-brand-50 text-brand-700";
  if (status === "reserved") return "border-accent-300 bg-accent-50 text-accent-700";
  return "border-neutral-300 bg-neutral-50 text-neutral-700";
}

/* ── Icon Picker Popup ── */

function renderIconPickerPopup(targetEl, iconName, context, areaId) {
  if (!targetEl || !iconName) return;

  const rect = targetEl.getBoundingClientRect();
  const popup = document.createElement("div");
  popup.className =
    "fixed z-100 bg-white border border-brand-200 rounded-lg p-3 shadow-[0_10px_25px_rgba(0,0,0,0.15)] grid grid-cols-5 gap-2";
  popup.style.top = rect.bottom + 4 + "px";
  popup.style.left = rect.left + "px";
  popup.setAttribute("data-icon-picker-context", context || "area");
  if (areaId) popup.setAttribute("data-icon-picker-area-id", areaId);
  popup.innerHTML = ICON_LIST.map(function (icon) {
    return (
      '<button data-icon-pick="' +
      icon +
      '" data-picker-context="' +
      (context || "area") +
      '" data-area-id="' +
      (areaId || "") +
      '" class="inline-flex items-center justify-center p-2 border border-brand-100 rounded-md bg-white cursor-pointer transition-colors hover:bg-brand-50 hover:border-brand-300 ' +
      (icon === iconName ? "border-brand-400 bg-brand-50" : "") +
      '"><i data-lucide="' +
      icon +
      '" class="w-[18px] h-[18px]"></i></button>'
    );
  }).join("");
  document.body.appendChild(popup);
  window.createIcons();

  setTimeout(function () {
    document.addEventListener("click", function closeHandler(e) {
      if (!popup.contains(e.target)) {
        popup.remove();
        openPickerAreaId = null;
        document.removeEventListener("click", closeHandler);
      }
    });
  }, 0);
}

/* ── Inline Area Form ── */

function renderInlineAreaForm(areaId, mode) {
  const form = document.getElementById("inline-area-form");
  if (!form) return;
  if (!areaId) {
    form.innerHTML = "";
    return;
  }

  const area = areas.find(function (a) {
    return a.id === areaId;
  });
  if (!area) {
    form.innerHTML = "";
    return;
  }

  let html =
    '<div class="flex gap-3 items-end bg-white border border-brand-300 rounded-xl p-4 shadow-sm mb-4">';
  html += InputField({ id: "inline-area-name", label: "Name", value: area.name });
  html +=
    '<label class="flex flex-col gap-1 text-xs font-semibold text-secondary-600">Icon<button type="button" data-action="open-inline-icon-picker" data-area-id="' +
    areaId +
    '" class="w-10 h-10 rounded-lg border border-brand-200 flex items-center justify-center cursor-pointer bg-white hover:bg-brand-50"><i data-lucide="' +
    area.icon +
    '" class="w-5 h-5 text-brand-500"></i></button></label>';
  if (mode === "edit") {
    html +=
      '<button data-action="save-inline-area" data-area-id="' +
      areaId +
      '" class="flex items-center gap-1 h-9 px-3 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer"><i data-lucide="check" class="w-4 h-4"></i> Save</button>';
  }
  html +=
    '<button data-action="cancel-inline-area" class="h-9 px-3 text-xs font-semibold rounded-lg bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer">Cancel</button>';
  html += "</div>";
  form.innerHTML = html;
  window.createIcons();
  const nameInput = document.getElementById("inline-area-name");
  if (nameInput) nameInput.focus();
}

/* ── Event Handling ── */

let eventsAttached = false;

function setupEvents(el) {
  if (eventsAttached) return;
  eventsAttached = true;
  el.addEventListener("click", function (e) {
    const target = e.target;

    const areaFilter = target.closest("[data-area-filter]");
    if (areaFilter) {
      e.stopPropagation();
      currentAreaFilter = areaFilter.getAttribute("data-area-filter");
      selectedTableId = null;
      expandedAreaId = null;
      subView = "main";
      renderMain(el);
      return;
    }

    const tableEl = target.closest("[data-table-id]");
    if (tableEl && !target.closest('[class*="px-5 pb-5"]')) {
      e.stopPropagation();
      const tid = parseInt(tableEl.getAttribute("data-table-id"));
      selectedTableId = tid;
      expandedAreaId = null;
      subView = "detail";
      renderWithSkeleton(el, Skeletons.tablesDetail(), function () {
        renderDetail(el, selectedTableId);
      }, 400);
      return;
    }

    const backBtn = target.closest('[data-action="back"]');
    if (backBtn) {
      e.stopPropagation();
      subView = "main";
      selectedTableId = null;
      expandedAreaId = null;
      editingAreaId = null;
      editingAreaIcon = null;
      openPickerAreaId = null;
      document.querySelectorAll(".fixed.z-100").forEach(function (p) {
        p.remove();
      });
      renderMain(el);
      return;
    }

    const toggleArea = target.closest('[data-action="toggle-area"]');
    if (toggleArea) {
      e.stopPropagation();
      const aid = parseInt(toggleArea.getAttribute("data-area-id"));
      expandedAreaId = expandedAreaId === aid ? null : aid;
      renderMain(el);
      return;
    }

    const editInline = target.closest('[data-action="edit-area-inline"]');
    if (editInline) {
      e.stopPropagation();
      const eaid = parseInt(editInline.getAttribute("data-area-id"));
      renderInlineAreaForm(eaid, "edit");
      return;
    }

    const saveInline = target.closest('[data-action="save-inline-area"]');
    if (saveInline) {
      e.stopPropagation();
      const said = parseInt(saveInline.getAttribute("data-area-id"));
      const sa = areas.find(function (a) {
        return a.id === said;
      });
      const nameInp = document.getElementById("inline-area-name");
      if (sa && nameInp) {
        const newName = nameInp.value.trim();
        if (newName) {
          sa.name = newName;
        }
      }
      renderInlineAreaForm(null);
      renderMain(el);
      return;
    }

    const cancelInline = target.closest('[data-action="cancel-inline-area"]');
    if (cancelInline) {
      e.stopPropagation();
      renderInlineAreaForm(null);
      return;
    }

    const deleteAreaBtn = target.closest('[data-action="delete-area"]');
    if (deleteAreaBtn) {
      e.stopPropagation();
      const daid = parseInt(deleteAreaBtn.getAttribute("data-area-id"));
      const daTables = tables.filter(function (t) {
        return t.area === daid;
      });
      if (daTables.length > 0) return;
      const daidx = areas.findIndex(function (a) {
        return a.id === daid;
      });
      if (daidx > -1) {
        areas.splice(daidx, 1);
        currentAreaFilter = "all";
        expandedAreaId = null;
        editingAreaId = null;
        editingAreaIcon = null;
        openPickerAreaId = null;
        document.querySelectorAll(".fixed.z-100").forEach(function (p) {
          p.remove();
        });
        renderManageAreas(el);
      }
      return;
    }

    const deleteTable = target.closest('[data-action="delete-table"]');
    if (deleteTable) {
      e.stopPropagation();
      const dtid = parseInt(deleteTable.getAttribute("data-table-id"));
      const dtidx = tables.findIndex(function (t) {
        return t.id === dtid;
      });
      if (dtidx > -1) {
        tables.splice(dtidx, 1);
        renderManageAreas(el);
      }
      return;
    }

    const manageAreas = target.closest('[data-action="manage-areas"]');
    if (manageAreas) {
      e.stopPropagation();
      subView = "manage-areas";
      expandedAreaId = null;
      editingAreaId = null;
      editingAreaIcon = null;
      openPickerAreaId = null;
      document.querySelectorAll(".fixed.z-100").forEach(function (p) {
        p.remove();
      });
      renderWithSkeleton(el, Skeletons.tablesManageAreas(), function () { renderManageAreas(el); }, 400);
      return;
    }

    const viewOrder = target.closest('[data-action="view-order"]');
    if (viewOrder) {
      e.stopPropagation();
      document.querySelector('[data-view="pos"]');
      return;
    }

    const renameArea = target.closest('[data-action="rename-area"]');
    if (renameArea) {
      e.stopPropagation();
      const raid = parseInt(renameArea.getAttribute("data-area-id"));
      editingAreaId = raid;
      openPickerAreaId = null;
      document.querySelectorAll(".fixed.z-100").forEach(function (p) {
        p.remove();
      });
      renderManageAreas(el);
      return;
    }

    const changeIcon = target.closest('[data-action="change-area-icon"]');
    if (changeIcon) {
      e.stopPropagation();
      const ciid = parseInt(changeIcon.getAttribute("data-area-id"));
      const cia = areas.find(function (a) {
        return a.id === ciid;
      });
      if (openPickerAreaId === ciid) {
        openPickerAreaId = null;
        document.querySelectorAll(".fixed.z-100").forEach(function (p) {
          p.remove();
        });
        return;
      }
      openPickerAreaId = ciid;
      editingAreaId = null;
      document.querySelectorAll(".fixed.z-100").forEach(function (p) {
        p.remove();
      });
      renderIconPickerPopup(changeIcon, cia ? cia.icon : "home", "area", ciid);
      return;
    }

    const saveAreaName = target.closest('[data-action="save-area-name"]');
    if (saveAreaName) {
      e.stopPropagation();
      const said2 = parseInt(saveAreaName.getAttribute("data-area-id"));
      const sa2 = areas.find(function (a) {
        return a.id === said2;
      });
      const inp = document.getElementById("area-name-input");
      if (sa2 && inp) {
        const n = inp.value.trim();
        if (n) sa2.name = n;
      }
      editingAreaId = null;
      renderManageAreas(el);
      return;
    }

    const toggleManageArea = target.closest('[data-action="toggle-manage-area"]');
    if (toggleManageArea) {
      if (
        target.id === "area-name-input" ||
        target.closest('[data-action="rename-area"]') ||
        target.closest('[data-action="change-area-icon"]')
      ) {
        return;
      }
      e.stopPropagation();
      const maid = parseInt(toggleManageArea.getAttribute("data-area-id"));
      expandedAreaId = expandedAreaId === maid ? null : maid;
      editingAreaId = null;
      editingAreaIcon = null;
      openPickerAreaId = null;
      document.querySelectorAll(".fixed.z-100").forEach(function (p) {
        p.remove();
      });
      renderManageAreas(el);
      return;
    }

    const openInlineIconPicker = target.closest('[data-action="open-inline-icon-picker"]');
    if (openInlineIconPicker) {
      e.stopPropagation();
      const iiaid = parseInt(openInlineIconPicker.getAttribute("data-area-id"));
      const iia = areas.find(function (a) {
        return a.id === iiaid;
      });
      document.querySelectorAll(".fixed.z-100").forEach(function (p) {
        p.remove();
      });
      renderIconPickerPopup(openInlineIconPicker, iia ? iia.icon : "home", "inline", iiaid);
      return;
    }

    const openNewAreaIconPicker = target.closest('[data-action="open-new-area-icon-picker"]');
    if (openNewAreaIconPicker) {
      e.stopPropagation();
      document.querySelectorAll(".fixed.z-100").forEach(function (p) {
        p.remove();
      });
      renderIconPickerPopup(openNewAreaIconPicker, editingAreaIcon || "home", "new-area", null);
      return;
    }

    const iconPick = target.closest("[data-icon-pick]");
    if (iconPick) {
      e.stopPropagation();
      const iconName = iconPick.getAttribute("data-icon-pick");
      const pickerContext = iconPick.getAttribute("data-picker-context");
      const ipaid = parseInt(iconPick.getAttribute("data-area-id"));

      document.querySelectorAll(".fixed.z-100").forEach(function (p) {
        p.remove();
      });
      openPickerAreaId = null;

      if (pickerContext === "area" && ipaid) {
        const ipa = areas.find(function (a) {
          return a.id === ipaid;
        });
        if (ipa) ipa.icon = iconName;
        editingAreaIcon = iconName;
        renderManageAreas(el);
      } else if (pickerContext === "inline" && ipaid) {
        const ipa2 = areas.find(function (a) {
          return a.id === ipaid;
        });
        if (ipa2) ipa2.icon = iconName;
        renderInlineAreaForm(ipaid, "edit");
      } else if (pickerContext === "new-area") {
        editingAreaIcon = iconName;
        renderManageAreas(el);
      }
      return;
    }

    const addTableBtn = target.closest('[data-action="add-table-to-area"]');
    if (addTableBtn) {
      e.stopPropagation();
      const ataid = parseInt(addTableBtn.getAttribute("data-area-id"));
      const maxTableId = tables.reduce(function (m, t) {
        return Math.max(m, t.id);
      }, 0);
      tables.push({
        id: maxTableId + 1,
        seats: 4,
        area: ataid,
        status: "available",
        info: "Free",
        timer: null,
      });
      renderManageAreas(el);
      return;
    }

    const createTable = target.closest('[data-action="create-table"]');
    if (createTable) {
      e.stopPropagation();
      const areaSelect = document.getElementById("new-table-area");
      const seatsInput = document.getElementById("new-table-seats");
      const newAreaId = parseInt(areaSelect.value);
      const newSeats = parseInt(seatsInput.value) || 4;
      const maxId = tables.reduce(function (m, t) {
        return Math.max(m, t.id);
      }, 0);
      tables.push({
        id: maxId + 1,
        seats: newSeats,
        area: newAreaId,
        status: "available",
        info: "Free",
        timer: null,
      });
      renderManageAreas(el);
      return;
    }

    const saveNewArea = target.closest('[data-action="save-new-area"]');
    if (saveNewArea) {
      e.stopPropagation();
      const nameEl = document.getElementById("new-area-name");
      const name = nameEl ? nameEl.value.trim() : "";
      if (!name) {
        if (nameEl) nameEl.focus();
        return;
      }
      const maxAreaId = areas.reduce(function (m, a) {
        return Math.max(m, a.id);
      }, 0);
      areas.push({ id: maxAreaId + 1, name: name, icon: editingAreaIcon || "home" });
      editingAreaIcon = null;
      renderManageAreas(el);
      return;
    }
  });

  el.addEventListener("change", function (e) {
    const target = e.target;
    if (target.matches('[data-action="reassign-table"]')) {
      const tid = parseInt(target.getAttribute("data-table-id"));
      const newAreaId = parseInt(target.value);
      const table = tables.find(function (t) {
        return t.id === tid;
      });
      if (table) {
        table.area = newAreaId;
        renderManageAreas(el);
      }
    }
  });

  el.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.id === "area-name-input") {
      const saveBtn = el.querySelector('[data-action="save-area-name"]');
      if (saveBtn) saveBtn.click();
    }
    if (e.key === "Escape") {
      editingAreaId = null;
      openPickerAreaId = null;
      document.querySelectorAll(".fixed.z-100").forEach(function (p) {
        p.remove();
      });
      renderManageAreas(el);
    }
  });
}

/* ── Export ── */

const TablesView = {
  render: function (el) {
    setupEvents(el);
    if (subView === "detail" && selectedTableId) {
      renderWithSkeleton(el, Skeletons.tablesDetail(), function () { renderDetail(el, selectedTableId); }, 400);
    } else if (subView === "manage-areas") {
      renderWithSkeleton(el, Skeletons.tablesManageAreas(), function () { renderManageAreas(el); }, 400);
    } else {
      renderMain(el);
    }
  },
  init: function () {
    window.createIcons();
  },
  destroy: function () {
    subView = "main";
    selectedTableId = null;
    expandedAreaId = null;
    editingAreaId = null;
    editingAreaIcon = null;
    openPickerAreaId = null;
    eventsAttached = false;
  },
};

export default withLoading(TablesView, Skeletons.tables(), 800);
