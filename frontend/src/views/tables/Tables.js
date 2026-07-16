/**
 * Tables View
 * @route /tables
 *
 * Sub-views: grid (default), detail, manage, add
 * Composes: PageHeader, AreaFilters, TablesLegend, AreaSection, TableShape,
 *           AreaManageCard, IconPickerPopup, Badge, Button, DetailGrid
 *
 * State:
 * - activeAreaFilter: 'all' | number
 * - expandedAreaId: number | null
 * - editingAreaId: number | null
 * - openPickerAreaId: number | null
 * - areas: []
 * - tables: []
 */

import { render as PageHeader } from '../../components/common/PageHeader.js';
import { render as AreaFilters } from '../../components/tables/AreaFilters.js';
import { render as TablesLegend } from '../../components/tables/TablesLegend.js';
import { render as AreaSection } from '../../components/tables/AreaSection.js';
import { render as AreaManageCard } from '../../components/tables/AreaManageCard.js';
import { render as IconPickerPopup } from '../../components/tables/IconPickerPopup.js';
import { render as DetailGrid } from '../../components/common/DetailGrid.js';
import { render as Card } from '../../components/ui/Card.js';

const areas = [
  { id: 1, name: 'Main Hall', icon: 'home' },
  { id: 2, name: 'Terrace', icon: 'sun' },
  { id: 3, name: 'Seaside Pier', icon: 'waves' },
];

const tables = [
  { id: 1, seats: 4, area: 1, status: 'available', info: 'Free', timer: null },
  { id: 2, seats: 6, area: 1, status: 'occupied', info: 'Order #1041', timer: '24 min' },
  { id: 3, seats: 2, area: 1, status: 'occupied', info: 'Order #1043', timer: '0 min' },
  { id: 4, seats: 4, area: 1, status: 'available', info: 'Free', timer: null },
  { id: 5, seats: 4, area: 2, status: 'occupied', info: 'Order #1042', timer: '6 min' },
  { id: 6, seats: 8, area: 2, status: 'occupied', info: 'Order #1037', timer: '32 min' },
  { id: 7, seats: 2, area: 2, status: 'reserved', info: '7:30 PM', timer: null },
  { id: 8, seats: 4, area: 3, status: 'occupied', info: 'Order #1040', timer: '12 min' },
  { id: 9, seats: 6, area: 3, status: 'available', info: 'Free', timer: null },
  { id: 10, seats: 4, area: 3, status: 'reserved', info: '8:00 PM', timer: null },
  { id: 11, seats: 2, area: 1, status: 'available', info: 'Free', timer: null },
  { id: 12, seats: 6, area: 2, status: 'available', info: 'Free', timer: null },
];

let _state = {
  activeAreaFilter: 'all',
  expandedAreaId: null,
  editingAreaId: null,
  openPickerAreaId: null,
  currentSubView: 'grid',
  selectedTableId: null,
};

function getTablesForArea(areaId) {
  return tables.filter(function (t) { return t.area === areaId; });
}

function getAreaCounts() {
  var counts = {};
  areas.forEach(function (a) {
    counts[a.id] = 0;
  });
  tables.forEach(function (t) {
    if (counts[t.area] !== undefined) {
      counts[t.area] += 1;
    }
  });
  return counts;
}

function getStatusCounts() {
  var available = 0;
  var occupied = 0;
  var reserved = 0;
  tables.forEach(function (t) {
    if (t.status === 'available') available++;
    else if (t.status === 'occupied') occupied++;
    else if (t.status === 'reserved') reserved++;
  });
  return { available: available, occupied: occupied, reserved: reserved };
}

function renderGridView() {
  var counts = getAreaCounts();
  var statusCounts = getStatusCounts();

  var headerActions = '';
  headerActions += '<button type="button" data-onclick="tablesManageAreas" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md border border-brand-300 bg-white text-brand-700 hover:bg-brand-50 transition-colors"><i data-lucide="settings" class="w-4 h-4"></i> Manage Areas</button>';
  headerActions += '<button type="button" data-onclick="tablesAddArea" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md border border-primary-600 bg-primary-600 text-white hover:bg-primary-700 transition-colors"><i data-lucide="plus" class="w-4 h-4"></i> Add Area</button>';

  var headerHtml = PageHeader({
    title: 'Table Management',
    actions: headerActions,
  });

  var areasWithCounts = areas.map(function (a) {
    return { id: a.id, name: a.name, icon: a.icon, count: counts[a.id] || 0 };
  });

  var filtersHtml = AreaFilters({
    areas: areasWithCounts,
    activeFilter: _state.activeAreaFilter,
    onFilter: 'tablesFilterArea',
    onEdit: 'tablesEditArea',
    isAdmin: true,
  });

  var legendHtml = TablesLegend({
    available: statusCounts.available,
    occupied: statusCounts.occupied,
    reserved: statusCounts.reserved,
  });

  var filteredAreas = _state.activeAreaFilter === 'all'
    ? areas
    : areas.filter(function (a) { return String(a.id) === String(_state.activeAreaFilter); });

  var sectionsHtml = filteredAreas.map(function (area) {
    var areaTables = getTablesForArea(area.id);
    return AreaSection({
      area: area,
      tables: areaTables,
      tableCount: areaTables.length,
      onTableClick: 'tablesClickTable',
    });
  }).join('');

  return `
    <div>
      ${headerHtml}
      ${filtersHtml}
      ${legendHtml}
      <div class="space-y-6">
        ${sectionsHtml}
      </div>
    </div>
  `;
}

function renderManageView() {
  var headerHtml = PageHeader({
    title: 'Manage Areas',
    backButton: { label: 'Back', onClick: 'tablesBackToGrid' },
    actions: '<button type="button" data-onclick="tablesAddArea" class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md border border-primary-600 bg-primary-600 text-white hover:bg-primary-700 transition-colors"><i data-lucide="plus" class="w-4 h-4"></i> Add Area</button>',
  });

  var cardsHtml = areas.map(function (area) {
    var areaTables = getTablesForArea(area.id);
    return AreaManageCard({
      area: area,
      tables: areaTables,
      allAreas: areas,
      isExpanded: _state.expandedAreaId === area.id,
      isEditing: _state.editingAreaId === area.id,
      onToggle: 'tablesToggleArea',
      onIconClick: 'tablesOpenIconPicker',
      onNameClick: 'tablesEditAreaName',
      onDelete: 'tablesDeleteArea',
      onReassignTable: 'tablesReassignTable',
      onAddTable: 'tablesAddTable',
    });
  }).join('');

  var pickerHtml = '';
  if (_state.openPickerAreaId) {
    var pickerArea = areas.find(function (a) { return a.id === _state.openPickerAreaId; });
    if (pickerArea) {
      pickerHtml = IconPickerPopup({
        selectedIcon: pickerArea.icon,
        onSelect: 'tablesPickIcon',
        position: { top: 200, left: 400 },
      });
    }
  }

  return `
    <div>
      ${headerHtml}
      <div class="space-y-4">
        ${cardsHtml}
      </div>
      ${pickerHtml}
    </div>
  `;
}

function renderDetailView() {
  var table = tables.find(function (t) { return t.id === _state.selectedTableId; });
  if (!table) return '';

  var area = areas.find(function (a) { return a.id === table.area; });
  var headerHtml = PageHeader({
    title: 'Table ' + table.id,
    backButton: { label: 'Back', onClick: 'tablesBackToGrid' },
  });

  var cells = [
    { label: 'Table ID', value: '#' + table.id },
    { label: 'Seats', value: table.seats },
    { label: 'Area', value: area ? area.name : 'Unknown' },
    { label: 'Status', value: table.status.charAt(0).toUpperCase() + table.status.slice(1) },
    { label: 'Info', value: table.info || '—' },
    { label: 'Timer', value: table.timer || '—' },
  ];

  return `
    <div>
      ${headerHtml}
      ${Card({ children: DetailGrid({ cells: cells }) })}
    </div>
  `;
}

function renderInnerHtml() {
  if (_state.currentSubView === 'manage') {
    return renderManageView();
  } else if (_state.currentSubView === 'detail') {
    return renderDetailView();
  }
  return renderGridView();
}

/**
 * Render the Tables view
 * @returns {string} HTML string
 */
export function render() {
  return `
    <div id="view-tables" class="p-6">
      ${renderInnerHtml()}
    </div>
  `;
}

/**
 * Initialize Tables view interactivity
 * Binds event handlers for table management actions
 */
export function init() {
  window.tablesFilterArea = function (e) {
    var btn = e.currentTarget || e.target;
    var filter = btn.getAttribute('data-filter');
    if (filter) {
      _state.activeAreaFilter = filter;
      rerender();
    }
  };

  window.tablesClickTable = function (tableId) {
    _state.selectedTableId = parseInt(tableId, 10);
    _state.currentSubView = 'detail';
    rerender();
  };

  window.tablesManageAreas = function () {
    _state.currentSubView = 'manage';
    _state.expandedAreaId = null;
    rerender();
  };

  window.tablesBackToGrid = function () {
    _state.currentSubView = 'grid';
    _state.openPickerAreaId = null;
    rerender();
  };

  window.tablesAddArea = function () {
    var newName = 'New Area';
    var newId = Math.max.apply(null, areas.map(function (a) { return a.id; })) + 1;
    areas.push({ id: newId, name: newName, icon: 'grid-3x3' });
    _state.currentSubView = 'manage';
    _state.expandedAreaId = newId;
    _state.editingAreaId = newId;
    rerender();
  };

  window.tablesToggleArea = function (areaId) {
    var id = parseInt(areaId, 10);
    _state.expandedAreaId = _state.expandedAreaId === id ? null : id;
    rerender();
  };

  window.tablesEditArea = function (areaId) {
    _state.currentSubView = 'manage';
    _state.editingAreaId = parseInt(areaId, 10);
    _state.expandedAreaId = parseInt(areaId, 10);
    rerender();
  };

  window.tablesEditAreaName = function (areaId) {
    _state.editingAreaId = parseInt(areaId, 10);
    rerender();

    var input = document.querySelector('[data-area-name-input="' + areaId + '"]');
    if (input) {
      input.focus();
      input.select();
      input.addEventListener('blur', function () {
        var val = input.value.trim();
        if (val) {
          var area = areas.find(function (a) { return String(a.id) === String(areaId); });
          if (area) area.name = val;
        }
        _state.editingAreaId = null;
        rerender();
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') {
          _state.editingAreaId = null;
          rerender();
        }
      });
    }
  };

  window.tablesOpenIconPicker = function (areaId) {
    var id = parseInt(areaId, 10);
    _state.openPickerAreaId = _state.openPickerAreaId === id ? null : id;
    rerender();
  };

  window.tablesPickIcon = function (iconName) {
    if (_state.openPickerAreaId) {
      var area = areas.find(function (a) { return a.id === _state.openPickerAreaId; });
      if (area) area.icon = iconName;
    }
    _state.openPickerAreaId = null;
    rerender();
  };

  window.tablesDeleteArea = function (areaId) {
    var id = parseInt(areaId, 10);
    var areaTables = getTablesForArea(id);
    if (areaTables.length > 0) return;
    var idx = areas.findIndex(function (a) { return a.id === id; });
    if (idx !== -1) {
      areas.splice(idx, 1);
    }
    _state.expandedAreaId = null;
    rerender();
  };

  window.tablesReassignTable = function (tableId, newAreaId) {
    var tId = parseInt(tableId, 10);
    var aId = parseInt(newAreaId, 10);
    var table = tables.find(function (t) { return t.id === tId; });
    if (table) {
      table.area = aId;
    }
    rerender();
  };

  window.tablesAddTable = function (areaId) {
    var id = parseInt(areaId, 10);
    var seatsInput = document.querySelector('[data-add-table-seats="' + areaId + '"]');
    var seats = seatsInput ? parseInt(seatsInput.value, 10) || 4 : 4;
    var newTableId = Math.max.apply(null, tables.map(function (t) { return t.id; })) + 1;
    tables.push({
      id: newTableId,
      seats: seats,
      area: id,
      status: 'available',
      info: 'Free',
      timer: null,
    });
    rerender();
  };

  bindDataOnclcikListeners();
}

function rerender() {
  var container = document.getElementById('view-tables');
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
 * Cleanup Tables view
 */
export function destroy() {
  var handlers = [
    'tablesFilterArea', 'tablesClickTable', 'tablesManageAreas',
    'tablesBackToGrid', 'tablesAddArea', 'tablesToggleArea',
    'tablesEditArea', 'tablesEditAreaName', 'tablesOpenIconPicker',
    'tablesPickIcon', 'tablesDeleteArea', 'tablesReassignTable',
    'tablesAddTable',
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
