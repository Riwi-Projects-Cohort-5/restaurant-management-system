import { render as WelcomeBanner } from '../../components/common/WelcomeBanner.js';
import { render as PageHeader } from '../../components/common/PageHeader.js';
import { render as StatCard } from '../../components/ui/StatCard.js';
import { render as SalesChart } from '../../components/dashboard/SalesChart.js';
import { render as TableStatusCard } from '../../components/dashboard/TableStatusCard.js';
import { render as Card } from '../../components/ui/Card.js';
import { render as DataTable } from '../../components/ui/DataTable.js';
import { render as Badge } from '../../components/ui/Badge.js';
import { fetchDashboardStats, fetchSalesChart, fetchRecentOrders, fetchTableStatusSummary } from '../../api/dashboard.js';
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

const columns = [
  { key: 'id', label: 'Order', primary: true },
  { key: 'table', label: 'Table' },
  { key: 'items', label: 'Items' },
  { key: 'total', label: 'Total' },
  {
    key: 'status',
    label: 'Status',
    render: function (value) {
      var b = statusBadgeMap[value] || statusBadgeMap.new;
      return Badge({ variant: b.variant, showDot: true, children: b.label });
    },
  },
  { key: 'time', label: 'Time' },
];

let _state = {
  stats: null,
  sales: null,
  recentOrders: [],
  tableStatus: null,
  loaded: false,
};

function getGreeting() {
  var hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function handleExportOrders() {
  var rows = _state.recentOrders.map(function (o) {
    return {
      'Order ID': o.id,
      'Table': o.table,
      'Items': o.items,
      'Total': o.total,
      'Status': o.status,
      'Time': o.time,
    };
  });
  exportToCsv('dashboard-recent-orders', ['Order ID', 'Table', 'Items', 'Total', 'Status', 'Time'], rows, { includeBOM: true });
}

function handleExportSales() {
  if (!_state.sales) return;
  var rows = _state.sales.labels.map(function (label, i) {
    return {
      'Day': label,
      'This Week ($)': _state.sales.thisWeek[i],
      'Last Week ($)': _state.sales.lastWeek[i],
    };
  });
  exportToCsv('dashboard-weekly-sales', ['Day', 'This Week ($)', 'Last Week ($)'], rows, { includeBOM: true });
}

function renderInnerHtml() {
  var user = currentUser();
  var userName = user ? user.username : 'User';

  if (!_state.loaded) return '<div class="text-center py-12 text-gray-500">Loading dashboard...</div>';

  var statsHtml = [
    StatCard({
      label: 'Total Revenue',
      value: _state.stats.revenue,
      icon: 'dollar-sign',
      iconColor: 'success',
      change: { value: '+12%', direction: 'up' },
      changeText: 'vs last month',
    }),
    StatCard({
      label: 'Orders Today',
      value: String(_state.stats.ordersToday),
      icon: 'receipt',
      iconColor: 'brand',
      change: { value: '+8%', direction: 'up' },
      changeText: 'vs yesterday',
    }),
    StatCard({
      label: 'Active Tables',
      value: _state.stats.activeTables,
      icon: 'table',
      iconColor: 'primary',
    }),
    StatCard({
      label: 'Reservations',
      value: String(_state.stats.reservations),
      icon: 'calendar',
      iconColor: 'accent',
      change: { value: '+3', direction: 'up' },
      changeText: 'vs last week',
    }),
  ].join('');

  var recentOrdersTable = DataTable({
    columns: columns,
    data: _state.recentOrders,
  });

  var recentOrdersCard = Card({
    title: 'Recent Orders',
    headerRight: '<a href="#/orders" class="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">View All</a>',
    children: recentOrdersTable,
  });

  var chartGrid = '';
  if (_state.sales) {
    var ts = _state.tableStatus || { available: 0, occupied: 0, reserved: 0 };
    var total = ts.available + ts.occupied + ts.reserved;
    chartGrid = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="lg:col-span-2">
          ${SalesChart({ labels: _state.sales.labels, thisWeek: _state.sales.thisWeek, lastWeek: _state.sales.lastWeek })}
        </div>
        <div class="lg:col-span-1">
          ${TableStatusCard({ available: ts.available, occupied: ts.occupied, reserved: ts.reserved, total: total })}
        </div>
      </div>
    `;
  }

  return `
    <div id="view-dashboard" class="p-6">
      ${WelcomeBanner({
        userName: getGreeting() + ', ' + userName,
        userInitials: userName.substring(0, 2).toUpperCase(),
        subtitle: "Here's what's happening at El Fogon today.",
      })}

      <div class="mt-6">
        ${PageHeader({
          title: 'Overview',
          actions: `
            <button type="button" data-onclick="handleExportOrders"
                    class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md
                           border border-brand-300 bg-white text-brand-700 hover:bg-brand-50
                           transition-colors duration-fast">
              <i data-lucide="download" class="w-4 h-4"></i>
              Export Orders
            </button>
            <button type="button" data-onclick="handleExportSales"
                    class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md
                           border border-brand-300 bg-white text-brand-700 hover:bg-brand-50
                           transition-colors duration-fast">
              <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
              Export Sales
            </button>
          `,
        })}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        ${statsHtml}
      </div>

      ${chartGrid}

      ${recentOrdersCard}
    </div>
  `;
}

export function render() {
  return '<div id="view-dashboard" class="p-6">' + renderInnerHtml() + '</div>';
}

export function init() {
  _state.loaded = false;
  _state.recentOrders = [];
  _state.stats = null;
  _state.sales = null;
  _state.tableStatus = null;

  Promise.all([
    fetchDashboardStats(),
    fetchSalesChart(),
    fetchRecentOrders(),
    fetchTableStatusSummary(),
  ]).then(function (results) {
    _state.stats = results[0].data;
    _state.sales = results[1].data;
    _state.recentOrders = results[2].data;
    _state.tableStatus = results[3].data;
    _state.loaded = true;
    rerender();
  }).catch(function (err) {
    console.error('[Dashboard] Error loading data:', err);
    _state.loaded = true;
    rerender();
  });

  window.handleExportOrders = handleExportOrders;
  window.handleExportSales = handleExportSales;

  bindDataOnclickListeners();
}

function rerender() {
  var container = document.getElementById('view-dashboard');
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
  if (typeof window.createIcons === 'function') {
    window.createIcons();
  }
}

export function destroy() {
  delete window.handleExportOrders;
  delete window.handleExportSales;
  document.querySelectorAll('[data-onclick]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.removeEventListener('click', window[handlerName]);
    }
  });
}

export default { render, init, destroy };
