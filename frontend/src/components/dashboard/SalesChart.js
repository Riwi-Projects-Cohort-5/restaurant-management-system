var chartInstance = null;

var SalesChart = {
  init: function () {
    var canvas = document.getElementById('salesChart');
    if (!canvas || !window.Chart) return;

    var ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Sales',
          data: [2800, 4500, 3600, 5200, 5800, 6200, 4800],
          backgroundColor: '#E57722',
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#F9FAFB',
            bodyColor: '#D1D5DB',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: function (ctx) { return '$' + ctx.parsed.y.toLocaleString(); }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6B7280', font: { size: 11, weight: 500 } },
            border: { display: false },
          },
          y: {
            grid: { color: '#E5E7EB' },
            ticks: {
              color: '#6B7280',
              font: { size: 11, weight: 500 },
              callback: function (v) { return '$' + (v / 1000).toFixed(1) + 'k'; }
            },
            border: { display: false },
          }
        }
      }
    });
  },

  destroy: function () {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }
};

export default SalesChart;
