var chartInstance = null;

var SalesChart = {
  renderLegend: function () {
    var html = '<div class="flex gap-2 mb-4">';
    html +=
      '<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-100 text-brand-700"><span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span> This Week</span>';
    html +=
      '<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500">Last Week</span>';
    html += "</div>";
    return html;
  },

  init: function () {
    var canvas = document.getElementById("salesChart");
    if (!canvas || !window.Chart) return;

    var ctx = canvas.getContext("2d");
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "This Week",
            data: [2800, 4500, 3600, 5200, 5800, 6200, 4800],
            backgroundColor: "#E57722",
            borderRadius: 6,
            barPercentage: 0.6,
          },
          {
            label: "Last Week",
            data: [2200, 3800, 3100, 4600, 5100, 5500, 4200],
            backgroundColor: "#F2BA7A",
            borderRadius: 6,
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
            backgroundColor: "#1E1B16",
            titleColor: "#FEFAF5",
            bodyColor: "#E8E3DA",
            borderColor: "#3D352A",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) {
                return ctx.dataset.label + ": $" + ctx.parsed.y.toLocaleString();
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#958877", font: { size: 12, weight: 500 } },
            border: { display: false },
          },
          y: {
            grid: { color: "rgba(0,0,0,0.06)", drawBorder: false },
            ticks: {
              color: "#958877",
              font: { size: 11 },
              callback: function (v) {
                return "$" + (v / 1000).toFixed(0) + "k";
              },
            },
            border: { display: false },
          },
        },
      },
    });
  },

  destroy: function () {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  },
};

export default SalesChart;
