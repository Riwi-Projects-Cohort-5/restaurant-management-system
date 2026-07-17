import WelcomeBanner from '../../components/ui/WelcomeBanner.js';
import StatCard from '../../components/ui/StatCard.js';
import Card from '../../components/ui/Card.js';
import TableStatusCard from '../../components/dashboard/TableStatusCard.js';
import SalesChart from '../../components/dashboard/SalesChart.js';
import DataTable from '../../components/ui/DataTable.js';
import { allOrders } from '../../store/posData.js';

var Dashboard = {
  render: function (el) {
    var user = window.userData || { name: 'Admin', initials: 'MC' };
    var recentOrders = allOrders.slice(0, 5);

    var cols = [
      { key: 'id', label: 'Order', primary: true, render: function (r) { return '#' + r.id; } },
      { key: 'table', label: 'Table', render: function (r) { return 'Table ' + r.table; } },
      { key: 'server', label: 'Server' },
      { key: 'total', label: 'Total', render: function (r) { return '$' + r.total.toFixed(2); } },
      { key: 'status', label: 'Status', render: function (r) {
        var colors = {
          completed: 'success',
          preparing: 'warning',
          new: 'info',
          draft: 'brand',
          cancelled: 'error',
        };
        return '<span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-' + (colors[r.status] || 'brand') + '-100 text-' + (colors[r.status] || 'brand') + '-700"><span class="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>' + r.status + '</span>';
      }},
      { key: 'actions', label: '', render: function () {
        return '<button class="text-primary-600 hover:text-primary-800 text-sm font-semibold bg-transparent border-0 cursor-pointer">View Details</button>';
      }},
    ];

    var html = '<div class="space-y-6">';
    html += WelcomeBanner({ user: user, time: 'morning' });

    html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">';
    html += StatCard({ label: 'Total Sales', value: '$12,845', change: '+12.5%', icon: 'dollar-sign', iconBg: 'bg-primary-100 text-primary-600' });
    html += StatCard({ label: 'Active Orders', value: '3', change: '+2', icon: 'shopping-cart', iconBg: 'bg-accent-100 text-accent-600' });
    html += StatCard({ label: 'Tables Occupied', value: '5/12', change: '-1', icon: 'grid-3x3', iconBg: 'bg-info-100 text-info-600' });
    html += StatCard({ label: 'Avg. Service Time', value: '18 min', change: '-3 min', icon: 'clock', iconBg: 'bg-success-100 text-success-600' });
    html += '</div>';

    html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">';
    html += '<div class="bg-white border border-brand-300 rounded-xl shadow-sm p-5">';
    html += '<h3 class="text-base font-semibold text-primary-700 font-display mb-4">Sales Overview</h3>';
    html += '<div class="relative h-[260px]"><canvas id="salesChart"></canvas></div>';
    html += '</div>';
    html += '<div>' + TableStatusCard() + '</div>';
    html += '</div>';

    html += '<div>';
    html += '<div class="flex items-center justify-between mb-3">';
    html += '<h3 class="text-base font-semibold text-primary-700 font-display">Recent Orders</h3>';
    html += '<a href="#/pos" class="text-sm font-semibold text-primary-600 hover:text-primary-800 bg-transparent border-0 cursor-pointer">View All</a>';
    html += '</div>';
    html += DataTable({ columns: cols, rows: recentOrders });
    html += '</div>';

    html += '</div>';

    el.innerHTML = html;
  },

  init: function () {
    SalesChart.init();
  },

  destroy: function () {
    SalesChart.destroy();
  }
};

export default Dashboard;
