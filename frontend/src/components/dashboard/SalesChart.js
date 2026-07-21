import { getDailySales } from "../../services/reportService.js";

let chartInstance = null;

const SalesChart = {
  renderLegend: function () {
    let html = '<div class="flex gap-2 mb-4">';
    html += '<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-100 text-brand-700"><span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span> This Week</span>';
    html += '<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500">Last Week</span>';
    html += "</div>";
    return html;
  },

  init: async function () {
    const canvas = document.getElementById("salesChart");
    if (!canvas || !window.Chart) return;

    const now = new Date();
    const thisWeekStart = new Date();
    thisWeekStart.setDate(now.getDate() - 6);
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
    lastWeekEnd.setHours(23, 59, 59, 999);
    const lastWeekStart = new Date(lastWeekEnd);
    lastWeekStart.setDate(lastWeekStart.getDate() - 6);
    lastWeekStart.setHours(0, 0, 0, 0);

    let thisWeekData = [];
    let lastWeekData = [];

    try {
      thisWeekData = await getDailySales(thisWeekStart.toISOString(), now.toISOString());
    } catch {}

    try {
      lastWeekData = await getDailySales(lastWeekStart.toISOString(), lastWeekEnd.toISOString());
    } catch {}

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const thisWeekRevenue = thisWeekData.map((d) => d.revenue || 0);
    const lastWeekRevenue = lastWeekData.map((d) => d.revenue || 0);

    while (thisWeekRevenue.length < 7) thisWeekRevenue.push(0);
    while (lastWeekRevenue.length < 7) lastWeekRevenue.push(0);

    const ctx = canvas.getContext("2d");
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "This Week",
            data: thisWeekRevenue.slice(0, 7),
            backgroundColor: "#E57722",
            borderRadius: 6,
            barPercentage: 0.6,
          },
          {
            label: "Last Week",
            data: lastWeekRevenue.slice(0, 7),
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
