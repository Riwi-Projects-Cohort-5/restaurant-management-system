/**
 * Dashboard View
 * @route /dashboard
 *
 * Composes: WelcomeBanner, PageHeader, StatCard, SalesChart, TableStatusCard,
 *           Card, DataTable, Badge
 *
 * State needed:
 * - User name/initials (from auth store)
 * - Orders data (for recent orders table)
 * - Table stats (available/occupied/reserved counts)
 * - Sales data (for chart)
 */

import { render as WelcomeBanner } from '../../components/common/WelcomeBanner.js';
import { render as PageHeader } from '../../components/common/PageHeader.js';
import { render as StatCard } from '../../components/ui/StatCard.js';
import { render as SalesChart } from '../../components/dashboard/SalesChart.js';
import { render as TableStatusCard } from '../../components/dashboard/TableStatusCard.js';
import { render as Card } from '../../components/ui/Card.js';
import { render as DataTable } from '../../components/ui/DataTable.js';
import { render as Badge } from '../../components/ui/Badge.js';

const statusBadgeMap = {
  new:        { variant: 'info',    label: 'New' },
  preparing:  { variant: 'warning', label: 'Preparing' },
  ready:      { variant: 'success', label: 'Ready' },
  served:     { variant: 'accent',  label: 'Served' },
  completed:  { variant: 'neutral', label: 'Completed' },
  cancelled:  { variant: 'error',   label: 'Cancelled' },
};

const recentOrders = [
  { id: 1043, table: 3, items: 3, total: '$38.50', status: 'new', time: '1 min ago' },
  { id: 1042, table: 5, items: 2, total: '$42.00', status: 'preparing', time: '5 min ago' },
  { id: 1041, table: 2, items: 4, total: '$65.50', status: 'ready', time: '12 min ago' },
  { id: 1040, table: 8, items: 2, total: '$27.00', status: 'served', time: '18 min ago' },
  { id: 1039, table: 1, items: 2, total: '$37.40', status: 'completed', time: '18 min ago' },
];

const columns = [
  { key: 'id', label: 'Order', primary: true },
  { key: 'table', label: 'Table' },
  { key: 'items', label: 'Items' },
  { key: 'total', label: 'Total' },
  {
    key: 'status',
    label: 'Status',
    render: function (value) {
      const b = statusBadgeMap[value] || statusBadgeMap.new;
      return Badge({ variant: b.variant, showDot: true, children: b.label });
    },
  },
  { key: 'time', label: 'Time' },
];

const salesLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const salesThisWeek = [1200, 1900, 1500, 2100, 1800, 2400, 1600];
const salesLastWeek = [1100, 1700, 1400, 1900, 1600, 2200, 1500];

/**
 * Render the Dashboard view
 * @returns {string} HTML string
 */
export function render() {
  const statsHtml = [
    StatCard({
      label: 'Total Revenue',
      value: '$12,450',
      icon: 'dollar-sign',
      iconColor: 'success',
      change: { value: '+12%', direction: 'up' },
      changeText: 'vs last month',
    }),
    StatCard({
      label: 'Orders Today',
      value: '156',
      icon: 'receipt',
      iconColor: 'brand',
      change: { value: '+8%', direction: 'up' },
      changeText: 'vs yesterday',
    }),
    StatCard({
      label: 'Active Tables',
      value: '8 / 12',
      icon: 'table',
      iconColor: 'primary',
    }),
    StatCard({
      label: 'Reservations',
      value: '24',
      icon: 'calendar',
      iconColor: 'accent',
      change: { value: '+3', direction: 'up' },
      changeText: 'vs last week',
    }),
  ].join('');

  const recentOrdersTable = DataTable({
    columns: columns,
    data: recentOrders,
  });

  const recentOrdersCard = Card({
    title: 'Recent Orders',
    headerRight: '<a href="#/pos" class="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">View All</a>',
    children: recentOrdersTable,
  });

  const chartGrid = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="lg:col-span-2">
        ${SalesChart({ labels: salesLabels, thisWeek: salesThisWeek, lastWeek: salesLastWeek })}
      </div>
      <div class="lg:col-span-1">
        ${TableStatusCard({ available: 4, occupied: 6, reserved: 2, total: 12 })}
      </div>
    </div>
  `;

  return `
    <div id="view-dashboard" class="p-6">
      ${WelcomeBanner({
        userName: 'Good Evening, Maria',
        userInitials: 'MC',
        subtitle: "Here's what's happening at El Fogon today.",
      })}

      <div class="mt-6">
        ${PageHeader({
          title: 'Overview',
          actions: `
            <button type="button" data-onclick="handleExport"
                    class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md
                           border border-brand-300 bg-white text-brand-700 hover:bg-brand-50
                           transition-colors duration-fast">
              <i data-lucide="download" class="w-4 h-4"></i>
              Export
            </button>
            <a href="#/pos" data-onclick="handleNewOrder"
               class="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-md
                      border border-primary-600 bg-primary-600 text-white hover:bg-primary-700
                      transition-colors duration-fast no-underline">
              <i data-lucide="plus" class="w-4 h-4"></i>
              New Order
            </a>
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

/**
 * Initialize Dashboard view interactivity
 * Binds event handlers for data-onclick attributes
 */
export function init() {
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
 * Cleanup Dashboard view listeners
 */
export function destroy() {
  document.querySelectorAll('[data-onclick]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.removeEventListener('click', window[handlerName]);
    }
  });
}

export default { render, init, destroy };
