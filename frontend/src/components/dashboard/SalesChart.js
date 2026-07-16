/**
 * SalesChart Component
 * @module components/dashboard/SalesChart
 *
 * Bar chart rendered via Chart.js showing weekly sales with "this week" and
 * "last week" overlay. Requires Chart.js to be loaded globally.
 *
 * @param {Object} props
 * @param {Array<string>} props.labels - X-axis labels, e.g. ['Mon','Tue',…]
 * @param {Array<number>} props.thisWeek - This week's sales values
 * @param {Array<number>} props.lastWeek - Last week's sales values
 */

let _chart = null;

export function render(props = {}) {
  const { labels = [], thisWeek = [], lastWeek = [] } = props;

  return `
    <div class="bg-white rounded-xl p-5 border border-brand-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-base font-bold text-brand-900">Weekly Sales</h3>
        <div class="flex items-center gap-4 text-xs text-secondary-500">
          <span class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
            This Week
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
            Last Week
          </span>
        </div>
      </div>
      <canvas id="sales-chart-canvas" class="h-64" data-labels='${JSON.stringify(labels)}' data-this-week='${JSON.stringify(thisWeek)}' data-last-week='${JSON.stringify(lastWeek)}'></canvas>
    </div>
  `;
}

export function init() {
  if (typeof Chart === 'undefined') {
    console.warn('[SalesChart] Chart.js is not loaded.');
    return;
  }

  const canvas = document.getElementById('sales-chart-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const labels = JSON.parse(canvas.dataset.labels || '[]');
  const thisWeek = JSON.parse(canvas.dataset.thisWeek || '[]');
  const lastWeek = JSON.parse(canvas.dataset.lastWeek || '[]');

  _chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'This Week',
          data: thisWeek,
          backgroundColor: 'rgba(79, 70, 229, 0.85)',
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.6,
        },
        {
          label: 'Last Week',
          data: lastWeek,
          backgroundColor: 'rgba(229, 231, 235, 1)',
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#9ca3af', font: { size: 12 } },
        },
        y: {
          grid: { color: 'rgba(79, 70, 229, 0.08)' },
          ticks: {
            color: '#9ca3af',
            font: { size: 12 },
            callback: (v) => `$${v.toLocaleString()}`,
          },
          beginAtZero: true,
        },
      },
    },
  });
}

export function destroy() {
  if (_chart) {
    _chart.destroy();
    _chart = null;
  }
}
