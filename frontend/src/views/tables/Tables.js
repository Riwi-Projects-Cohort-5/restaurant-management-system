import { tables, areas } from '../../store/posData.js';

var currentAreaFilter = 'all';
var selectedTable = null;
var manageArea = null;
var subView = 'main';
var editingAreaName = null;
var editingAreaIcon = null;
var iconPickerOpen = false;
var pendingReassignTable = null;

var ICON_LIST = [
  'home', 'sun', 'waves', 'music', 'coffee', 'utensils', 'star', 'heart',
  'map-pin', 'building', 'trees', 'umbrella', 'ship', 'mountain', 'flower-2', 'flame',
  'wine', 'music-2', 'sparkles', 'zap'
];

function statusColor(status) {
  if (status === 'available') return 'bg-success-400';
  if (status === 'occupied') return 'bg-warning-500';
  if (status === 'reserved') return 'bg-info-500';
  return 'bg-brand-400';
}

function getAreaCounts() {
  var counts = { all: tables.length };
  areas.forEach(function (a) { counts[a.id] = tables.filter(function (t) { return t.area === a.id; }).length; });
  return counts;
}

function renderAreaFilters(container) {
  var counts = getAreaCounts();
  var html = '<div class="flex flex-wrap gap-2 mb-6">';
  html += '<button data-area-filter="all" class="px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ' +
    (currentAreaFilter === 'all' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-brand-600 border-brand-300 hover:bg-brand-50') + '">';
  html += '<span class="flex items-center gap-2">All <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-200 text-brand-700 text-[10px] font-bold">' + counts.all + '</span></span></button>';

  areas.forEach(function (area) {
    var isActive = currentAreaFilter === String(area.id);
    html += '<button data-area-filter="' + area.id + '" class="px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ' +
      (isActive ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-brand-600 border-brand-300 hover:bg-brand-50') + '">';
    html += '<span class="flex items-center gap-2">' + area.name + ' <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-200 text-brand-700 text-[10px] font-bold">' + (counts[area.id] || 0) + '</span></span>';

    if (isActive && currentAreaFilter !== 'all') {
      html += ' <span class="flex gap-1 ml-1">';
      html += '<button data-action="manage-area" data-area-id="' + area.id + '" class="w-5 h-5 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center border-0 cursor-pointer"><i data-lucide="pencil" class="w-3 h-3"></i></button>';
      html += '<button data-action="delete-area" data-area-id="' + area.id + '" class="w-5 h-5 rounded bg-white/20 hover:bg-error-500/50 flex items-center justify-center border-0 cursor-pointer"><i data-lucide="trash-2" class="w-3 h-3"></i></button>';
      html += '</span>';
    }
    html += '</button>';
  });

  html += '<button data-action="add-area" class="px-4 py-2 rounded-full text-sm font-medium bg-primary-600 text-white border-0 hover:bg-primary-700 cursor-pointer transition-colors">+ Add Area</button>';
  html += '</div>';

  html += '<div class="flex gap-3 mb-4 text-xs text-brand-600">';
  html += '<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-success-400"></span> Available</span>';
  html += '<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-warning-500"></span> Occupied</span>';
  html += '<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-info-500"></span> Reserved</span>';
  html += '</div>';

  return html;
}

function renderAreaSection(area) {
  var areaTables = tables.filter(function (t) { return t.area === area.id; });
  var iconEl = area.icon ? '<i data-lucide="' + area.icon + '" class="w-5 h-5 mr-2"></i>' : '';

  var html = '<div class="mb-8">';
  html += '<div class="flex items-center gap-3 mb-4">';
  html += iconEl;
  html += '<h3 class="text-lg font-semibold text-primary-700 font-display">' + area.name + '</h3>';
  html += '</div>';

  html += '<div class="tables-grid grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))">';
  areaTables.forEach(function (table) {
    html += renderTableShape(table);
  });
  html += '</div></div>';

  return html;
}

function renderTableShape(table) {
  var color = statusColor(table.status);
  var selected = selectedTable && selectedTable.id === table.id;
  var border = selected ? 'ring-2 ring-primary-500' : '';

  var html = '<div data-table-id="' + table.id + '" class="table-shape cursor-pointer hover:scale-105 transition-all ' + border + '">';
  html += '<div class="relative w-full pt-[100%] ' + color + ' rounded-xl shadow-sm">';
  html += '<div class="absolute inset-0 flex flex-col items-center justify-center text-white p-2">';
  html += '<span class="text-2xl font-bold font-display">' + table.id + '</span>';
  html += '<span class="text-[10px] font-medium opacity-80">' + table.seats + ' seats</span>';
  html += '</div>';
  if (table.timer) {
    html += '<div class="absolute top-2 right-2 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">' + table.timer + '</div>';
  }
  html += '</div>';
  html += '<p class="text-[11px] text-brand-600 text-center mt-1 truncate">' + table.info + '</p>';
  html += '</div>';

  return html;
}

function renderTableDetail(table) {
  var html = '<div class="bg-white border border-brand-300 rounded-xl p-5 shadow-sm">';
  html += '<div class="flex items-center justify-between mb-4">';
  html += '<h3 class="text-lg font-semibold text-primary-700 font-display">Table ' + table.id + '</h3>';
  html += '<button data-action="close-detail" class="w-8 h-8 border border-brand-300 rounded-lg flex items-center justify-center text-brand-500 hover:bg-brand-50 cursor-pointer bg-white"><i data-lucide="x" class="w-4 h-4"></i></button>';
  html += '</div>';

  html += '<div class="grid grid-cols-3 gap-3 mb-4">';
  html += '<div class="bg-brand-50 rounded-lg p-3 text-center"><span class="block text-[10px] font-bold text-brand-500 uppercase">Seats</span><span class="text-lg font-bold text-primary-800">' + table.seats + '</span></div>';
  html += '<div class="bg-brand-50 rounded-lg p-3 text-center"><span class="block text-[10px] font-bold text-brand-500 uppercase">Status</span><span class="text-lg font-bold text-primary-800 capitalize">' + table.status + '</span></div>';
  html += '<div class="bg-brand-50 rounded-lg p-3 text-center"><span class="block text-[10px] font-bold text-brand-500 uppercase">Info</span><span class="text-sm font-bold text-primary-800">' + table.info + '</span></div>';
  html += '</div>';

  if (table.status === 'occupied') {
    html += '<div class="border-t border-brand-200 pt-4 mt-4">';
    html += '<h4 class="text-sm font-semibold text-primary-700 mb-3">Current Order</h4>';
    html += '<div class="bg-brand-50 rounded-lg p-3 text-sm text-brand-600">' + table.info + '</div>';
    html += '<div class="flex gap-2 mt-3">';
    html += '<button class="flex-1 h-9 px-3 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer">View Order</button>';
    html += '<button class="h-9 px-3 text-xs font-semibold rounded-lg bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer">Seat New</button>';
    html += '</div></div>';
  } else if (table.status === 'reserved') {
    html += '<div class="border-t border-brand-200 pt-4 mt-4">';
    html += '<h4 class="text-sm font-semibold text-primary-700 mb-3">Reservation</h4>';
    html += '<div class="bg-info-50 border border-info-200 rounded-lg p-3 text-sm text-info-700">Reserved for ' + table.info + '</div>';
    html += '<div class="flex gap-2 mt-3">';
    html += '<button class="flex-1 h-9 px-3 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer">Seat Now</button>';
    html += '<button class="h-9 px-3 text-xs font-semibold rounded-lg bg-transparent text-error-600 hover:bg-error-50 border border-error-300 cursor-pointer">Cancel</button>';
    html += '</div></div>';
  } else {
    html += '<div class="border-t border-brand-200 pt-4 mt-4">';
    html += '<h4 class="text-sm font-semibold text-primary-700 mb-3">Quick Actions</h4>';
    html += '<div class="flex gap-2">';
    html += '<button class="flex-1 h-9 px-3 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer">Seat Guests</button>';
    html += '<button class="flex-1 h-9 px-3 text-xs font-semibold rounded-lg bg-accent-400 hover:bg-accent-500 text-white border-0 cursor-pointer">Open Order</button>';
    html += '<button class="h-9 px-3 text-xs font-semibold rounded-lg bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer">Reserve</button>';
    html += '</div></div>';
  }

  html += '</div>';
  return html;
}

function renderAreaManage(area) {
  var areaTables = tables.filter(function (t) { return t.area === area.id; });
  var icon = editingAreaIcon || area.icon || 'home';

  var html = '<div class="bg-white border border-brand-300 rounded-xl p-5 shadow-sm mt-4">';
  html += '<div class="flex items-center justify-between mb-4">';
  html += '<h3 class="text-base font-semibold text-primary-700 font-display">Manage: ' + area.name + '</h3>';
  html += '<button data-action="collapse-manage" class="w-8 h-8 border border-brand-300 rounded-lg flex items-center justify-center text-brand-500 hover:bg-brand-50 cursor-pointer bg-white"><i data-lucide="chevron-up" class="w-4 h-4"></i></button>';
  html += '</div>';

  html += '<div class="space-y-3">';
  html += '<div class="flex items-center gap-2">';
  html += '<label class="text-xs font-semibold text-brand-600">Icon:</label>';
  html += '<button data-action="open-icon-picker" class="flex items-center gap-1 px-3 py-1.5 border border-brand-300 rounded-lg text-sm hover:bg-brand-50 cursor-pointer bg-white">';
  html += '<i data-lucide="' + icon + '" class="w-4 h-4"></i> Change</button>';
  if (iconPickerOpen) {
    html += '<div class="absolute z-10 bg-white border border-brand-300 rounded-xl p-3 shadow-lg grid grid-cols-5 gap-2" style="max-height:200px;overflow-y:auto;">';
    ICON_LIST.forEach(function (ic) {
      html += '<button data-icon-pick="' + ic + '" class="w-8 h-8 rounded-lg border border-brand-200 flex items-center justify-center hover:bg-brand-50 cursor-pointer bg-white"><i data-lucide="' + ic + '" class="w-4 h-4"></i></button>';
    });
    html += '</div>';
  }
  html += '</div>';

  html += '<div class="flex items-center gap-2">';
  html += '<label class="text-xs font-semibold text-brand-600">Name:</label>';
  if (editingAreaName !== null) {
    html += '<input id="area-name-input" value="' + editingAreaName + '" class="flex-1 border border-brand-300 rounded-lg px-3 py-1.5 text-sm" />';
    html += '<button data-action="save-area-name" class="h-8 px-3 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer">Save</button>';
  } else {
    html += '<span class="flex-1 text-sm font-medium text-primary-800">' + area.name + '</span>';
    html += '<button data-action="edit-area-name" class="h-8 px-3 text-xs font-semibold rounded-lg bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer">Rename</button>';
  }
  html += '</div>';

  html += '<div class="flex items-center gap-2">';
  html += '<label class="text-xs font-semibold text-brand-600">Reassign:</label>';
  if (pendingReassignTable) {
    html += '<select id="reassign-select" class="border border-brand-300 rounded-lg px-3 py-1.5 text-sm">';
    html += '<option value="">Table...</option>';
    tables.forEach(function (t) {
      html += '<option value="' + t.id + '">Table ' + t.id + '</option>';
    });
    html += '</select>';
    html += '<button data-action="save-reassign" class="h-8 px-3 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer">Move</button>';
    html += '<button data-action="cancel-reassign" class="h-8 px-3 text-xs font-semibold rounded-lg bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer">Cancel</button>';
  } else {
    html += '<button data-action="start-reassign" class="h-8 px-3 text-xs font-semibold rounded-lg bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer">Reassign Table</button>';
  }
  html += '</div>';

  html += '<div class="border-t border-brand-200 pt-3 mt-3">';
  html += '<h4 class="text-xs font-semibold text-brand-600 mb-2">Tables in ' + area.name + '</h4>';
  html += '<div class="space-y-1">';
  areaTables.forEach(function (t) {
    html += '<div class="flex items-center justify-between text-sm py-1">';
    html += '<span>Table ' + t.id + ' <span class="text-xs text-brand-500">(' + t.seats + ' seats)</span></span>';
    html += '<span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ' + (t.status === 'available' ? 'bg-success-100 text-success-700' : t.status === 'occupied' ? 'bg-warning-100 text-warning-700' : 'bg-info-100 text-info-700') + '">' + t.status + '</span>';
    html += '</div>';
  });
  html += '</div></div>';

  html += '<button data-action="add-table-to-area" data-area-id="' + area.id + '" class="w-full h-9 px-3 text-xs font-semibold rounded-lg bg-success-500 hover:bg-success-600 text-white border-0 cursor-pointer mt-3">+ Add Table</button>';
  html += '</div></div>';

  return html;
}

function renderAddArea(container) {
  var html = '<div class="bg-white border border-brand-300 rounded-xl p-6 shadow-sm max-w-md">';
  html += '<h3 class="text-lg font-semibold text-primary-700 font-display mb-4">Add Area</h3>';
  html += '<div class="space-y-4">';

  html += '<div>';
  html += '<label class="block text-xs font-semibold text-brand-600 mb-1">Area Name</label>';
  html += '<input id="new-area-name" class="w-full border border-brand-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Garden Patio" />';
  html += '</div>';

  html += '<div>';
  html += '<label class="block text-xs font-semibold text-brand-600 mb-2">Icon</label>';
  html += '<div class="grid grid-cols-5 gap-2">';
  ICON_LIST.forEach(function (ic) {
    var isSelected = ic === 'home';
    html += '<button data-new-area-icon="' + ic + '" class="w-10 h-10 rounded-lg border flex items-center justify-center cursor-pointer bg-white ' +
      (isSelected ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-brand-200 hover:bg-brand-50 text-brand-500') + '">';
    html += '<i data-lucide="' + ic + '" class="w-5 h-5"></i></button>';
  });
  html += '</div></div>';

  html += '<div class="flex gap-2 pt-2">';
  html += '<button id="save-new-area" class="flex-1 h-10 px-4 text-sm font-semibold rounded-md bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer">Save Area</button>';
  html += '<button id="cancel-add-area" class="h-10 px-4 text-sm font-semibold rounded-md bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer">Cancel</button>';
  html += '</div></div></div>';

  container.innerHTML = html;
  setupAddAreaEvents(container);
}

function renderMain(container) {
  var filteredTables = currentAreaFilter === 'all' ? tables : tables.filter(function (t) { return t.area === parseInt(currentAreaFilter); });

  var html = '<div class="space-y-6">';
  html += '<div class="flex items-center justify-between">';
  html += '<h2 class="text-xl font-semibold text-primary-700 font-display">Tables</h2>';
  html += '</div>';

  html += renderAreaFilters(container);

  if (selectedTable) {
    html += '<div class="mb-6">' + renderTableDetail(selectedTable) + '</div>';
  }

  var areasToShow = currentAreaFilter === 'all' ? areas : areas.filter(function (a) { return a.id === parseInt(currentAreaFilter); });

  areasToShow.forEach(function (area) {
    html += renderAreaSection(area);
    if (manageArea === area.id) {
      html += renderAreaManage(area);
    }
  });

  html += '</div>';

  container.innerHTML = html;
  setupMainEvents(container);
  window.createIcons();
}

function setupMainEvents(container) {
  container.addEventListener('click', function (e) {
    var areaFilter = e.target.closest('[data-area-filter]');
    if (areaFilter) {
      currentAreaFilter = areaFilter.getAttribute('data-area-filter');
      selectedTable = null;
      manageArea = null;
      renderMain(container);
      return;
    }

    var tableEl = e.target.closest('[data-table-id]');
    if (tableEl) {
      var tid = parseInt(tableEl.getAttribute('data-table-id'));
      selectedTable = tables.find(function (t) { return t.id === tid; }) || null;
      renderMain(container);
      return;
    }

    var closeDetail = e.target.closest('[data-action="close-detail"]');
    if (closeDetail) {
      selectedTable = null;
      renderMain(container);
      return;
    }

    var manageAreaBtn = e.target.closest('[data-action="manage-area"]');
    if (manageAreaBtn) {
      manageArea = parseInt(manageAreaBtn.getAttribute('data-area-id'));
      renderMain(container);
      return;
    }

    var collapseBtn = e.target.closest('[data-action="collapse-manage"]');
    if (collapseBtn) {
      manageArea = null;
      editingAreaName = null;
      editingAreaIcon = null;
      iconPickerOpen = false;
      renderMain(container);
      return;
    }

    var addAreaBtn = e.target.closest('[data-action="add-area"]');
    if (addAreaBtn) {
      subView = 'add-area';
      renderAddArea(container);
      window.createIcons();
      return;
    }

    var deleteAreaBtn = e.target.closest('[data-action="delete-area"]');
    if (deleteAreaBtn) {
      var aid = parseInt(deleteAreaBtn.getAttribute('data-area-id'));
      var aidx = areas.findIndex(function (a) { return a.id === aid; });
      if (aidx > -1) {
        areas.splice(aidx, 1);
        currentAreaFilter = 'all';
        manageArea = null;
        renderMain(container);
      }
      return;
    }

    var editNameBtn = e.target.closest('[data-action="edit-area-name"]');
    if (editNameBtn) {
      var ma = areas.find(function (a) { return a.id === manageArea; });
      if (ma) editingAreaName = ma.name;
      renderMain(container);
      window.createIcons();
      return;
    }

    var saveNameBtn = e.target.closest('[data-action="save-area-name"]');
    if (saveNameBtn) {
      var ma2 = areas.find(function (a) { return a.id === manageArea; });
      var inp = document.getElementById('area-name-input');
      if (ma2 && inp) {
        ma2.name = inp.value;
        editingAreaName = null;
        renderMain(container);
        window.createIcons();
      }
      return;
    }

    var openIconPicker = e.target.closest('[data-action="open-icon-picker"]');
    if (openIconPicker) {
      iconPickerOpen = true;
      renderMain(container);
      window.createIcons();
      return;
    }

    var iconPick = e.target.closest('[data-icon-pick]');
    if (iconPick) {
      var iconName = iconPick.getAttribute('data-icon-pick');
      editingAreaIcon = iconName;
      var ma3 = areas.find(function (a) { return a.id === manageArea; });
      if (ma3) ma3.icon = iconName;
      iconPickerOpen = false;
      renderMain(container);
      window.createIcons();
      return;
    }

    var startReassign = e.target.closest('[data-action="start-reassign"]');
    if (startReassign) {
      pendingReassignTable = true;
      renderMain(container);
      window.createIcons();
      return;
    }

    var cancelReassign = e.target.closest('[data-action="cancel-reassign"]');
    if (cancelReassign) {
      pendingReassignTable = null;
      renderMain(container);
      window.createIcons();
      return;
    }

    var saveReassign = e.target.closest('[data-action="save-reassign"]');
    if (saveReassign) {
      var sel = document.getElementById('reassign-select');
      if (sel && sel.value) {
        var tid2 = parseInt(sel.value);
        var table = tables.find(function (t) { return t.id === tid2; });
        if (table) {
          table.area = manageArea;
          pendingReassignTable = null;
          renderMain(container);
          window.createIcons();
        }
      }
      return;
    }

    var addTableBtn = e.target.closest('[data-action="add-table-to-area"]');
    if (addTableBtn) {
      var targetAreaId = parseInt(addTableBtn.getAttribute('data-area-id'));
      var maxTableId = tables.reduce(function (m, t) { return Math.max(m, t.id); }, 0);
      tables.push({
        id: maxTableId + 1,
        seats: 4,
        area: targetAreaId,
        status: 'available',
        info: 'Free',
        timer: null
      });
      renderMain(container);
      window.createIcons();
      return;
    }
  });
}

function setupAddAreaEvents(container) {
  var selectedIcon = 'home';

  container.addEventListener('click', function (e) {
    var iconBtn = e.target.closest('[data-new-area-icon]');
    if (iconBtn) {
      selectedIcon = iconBtn.getAttribute('data-new-area-icon');
      container.querySelectorAll('[data-new-area-icon]').forEach(function (b) {
        var ic = b.getAttribute('data-new-area-icon');
        b.className = 'w-10 h-10 rounded-lg border flex items-center justify-center cursor-pointer bg-white ' +
          (ic === selectedIcon ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-brand-200 hover:bg-brand-50 text-brand-500');
      });
      return;
    }

    var saveBtn = e.target.closest('#save-new-area');
    if (saveBtn) {
      var nameEl = document.getElementById('new-area-name');
      var name = nameEl ? nameEl.value.trim() : '';
      if (!name) return;
      var maxId = areas.reduce(function (m, a) { return Math.max(m, a.id); }, 0);
      areas.push({ id: maxId + 1, name: name, icon: selectedIcon });
      subView = 'main';
      renderMain(container);
      window.createIcons();
      return;
    }

    var cancelBtn = e.target.closest('#cancel-add-area');
    if (cancelBtn) {
      subView = 'main';
      renderMain(container);
      window.createIcons();
      return;
    }
  });
}

var TablesView = {
  render: function (el) {
    if (subView === 'add-area') {
      renderAddArea(el);
    } else {
      renderMain(el);
    }
  },
  init: function () {
    window.createIcons();
  },
  destroy: function () {
    selectedTable = null;
    manageArea = null;
    subView = 'main';
    editingAreaName = null;
    editingAreaIcon = null;
    iconPickerOpen = false;
    pendingReassignTable = null;
  }
};

export default TablesView;
