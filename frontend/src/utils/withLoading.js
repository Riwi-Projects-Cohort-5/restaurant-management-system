import Skeleton from "../components/ui/Skeleton.js";

/**
 * withLoading — wraps a view with a skeleton loading state.
 * Shows skeleton immediately, then swaps to real content after delay.
 * Also delays init() to match.
 *
 * Usage:
 *   export default withLoading(DashboardView, Skeletons.dashboard(), 800);
 */
function withLoading(view, skeletonHtml, delay) {
  delay = delay || 800;
  const originalRender = view.render;
  const originalInit = view.init;
  const originalDestroy = view.destroy;
  let _timer = null;

  return {
    render: function (el) {
      el.innerHTML = skeletonHtml;
      _timer = setTimeout(function () {
        originalRender.call(view, el);
        if (typeof window.createIcons === "function") {
          window.createIcons();
        }
        if (originalInit) {
          originalInit.call(view);
        }
      }, delay);
    },
    init: function () {
      // init is handled inside render after delay
    },
    destroy: function () {
      if (_timer) {
        clearTimeout(_timer);
        _timer = null;
      }
      if (originalDestroy) {
        originalDestroy.call(view);
      }
    },
  };
}

function _pill(w) {
  return Skeleton({ variant: "rect", width: w || "70px", height: 30, class: "rounded-full" });
}

function _searchBar() {
  return (
    '<div class="flex items-center gap-2 border border-brand-200 rounded-lg px-3 py-2 bg-white">' +
    Skeleton({ variant: "circle", size: 16, class: "text-brand-400 shrink-0" }) +
    Skeleton({ variant: "text", width: "60%" }) +
    "</div>"
  );
}

function _badge(w) {
  return Skeleton({ variant: "rect", width: w || "72px", height: 20, class: "rounded-full" });
}

function _btn(w) {
  return Skeleton({ variant: "rect", width: w || "100px", height: 36, class: "rounded-lg" });
}

function _inputField(labelW) {
  return (
    '<div class="flex flex-col gap-1">' +
    Skeleton({ variant: "text", width: labelW || "40%" }) +
    Skeleton({ variant: "rect", width: "100%", height: 40, class: "rounded-md" }) +
    "</div>"
  );
}

const Skeletons = {
  dashboard() {
    let html = '<div class="space-y-0">';
    // WelcomeBanner
    html += Skeleton({ variant: "rect", width: "100%", height: 80, class: "rounded-xl mb-6" });
    // Title row: h2 + 2 buttons
    html += '<div class="flex items-center justify-between mb-6">';
    html += Skeleton({ variant: "text", width: "120px" });
    html += '<div class="flex gap-3">' + _btn("100px") + _btn("110px") + "</div>";
    html += "</div>";
    // 4-col stats
    html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">';
    for (let i = 0; i < 4; i++) {
      html +=
        '<div class="bg-white border border-brand-300 rounded-xl p-5 space-y-3">' +
        '<div class="flex items-center gap-3">' +
        Skeleton({ variant: "circle", size: 40, class: "bg-brand-100" }) +
        '<div class="flex-1">' + Skeleton({ variant: "text", width: "60%" }) + "</div>" +
        "</div>" +
        Skeleton({ variant: "text", width: "40%" }) +
        "</div>";
    }
    html += "</div>";
    // 2-col: chart + table status
    html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">';
    // Chart card
    html += '<div class="bg-white border border-brand-300 rounded-xl shadow-sm p-5">';
    html += '<div class="flex items-center justify-between mb-4">';
    html += Skeleton({ variant: "text", width: "100px" });
    html += '<div class="flex gap-2">' + _badge("60px") + _badge("60px") + "</div>";
    html += "</div>";
    html += Skeleton({ variant: "rect", width: "100%", height: 200, class: "rounded" });
    html += "</div>";
    // Table Status card
    html += '<div class="bg-white border border-brand-300 rounded-xl shadow-sm p-5">';
    html += Skeleton({ variant: "text", width: "90px", class: "mb-4" });
    html += '<div class="flex flex-col gap-4">';
    for (let i = 0; i < 3; i++) {
      html += '<div class="flex items-center justify-between">';
      html += '<div class="flex items-center gap-3">' + Skeleton({ variant: "circle", size: 10 }) + Skeleton({ variant: "text", width: "70px" }) + "</div>";
      html += Skeleton({ variant: "text", width: "50px" });
      html += "</div>";
    }
    html += Skeleton({ variant: "rect", width: "100%", height: 8, class: "rounded-full mt-2" });
    html += "</div></div>";
    html += "</div>";
    // Recent Orders table (7 cols)
    html += '<div class="bg-white border border-brand-300 rounded-xl shadow-sm p-0">';
    html += '<div class="flex items-center justify-between px-5 pt-5 pb-4">';
    html += Skeleton({ variant: "text", width: "110px" });
    html += _badge("70px");
    html += "</div>";
    html += '<div class="overflow-x-auto"><table class="w-full text-sm text-left">';
    html += '<thead><tr class="text-xs font-bold text-brand-700 uppercase tracking-wide border-b-2 border-brand-300 bg-brand-50">';
    ["Order", "Table", "Server", "Items", "Total", "Status", "Time"].forEach(function () {
      html += '<th class="px-4 py-3">' + Skeleton({ variant: "text", width: "60%" }) + "</th>";
    });
    html += "</tr></thead><tbody>";
    for (let r = 0; r < 5; r++) {
      const zebra = r % 2 === 0 ? "bg-white" : "bg-brand-50/50";
      html += '<tr class="' + zebra + ' border-b border-brand-100">';
      ["60%", "50%", "40%", "30%", "40%", "60px", "35%"].forEach(function (w) {
        html += '<td class="px-4 py-3">' + Skeleton({ variant: w === "60px" ? "rect" : "text", width: w, height: w === "60px" ? 20 : undefined, class: w === "60px" ? "rounded-full" : "" }) + "</td>";
      });
      html += "</tr>";
    }
    html += "</tbody></table></div></div>";
    html += "</div>";
    return html;
  },

  menuCards(count) {
    count = count || 8;
    let html = '<div class="space-y-5">';
    // Title row
    html += '<div class="flex items-center justify-between">';
    html += '<div class="flex items-center gap-3">' + Skeleton({ variant: "text", width: "160px" }) + Skeleton({ variant: "text", width: "60px" }) + "</div>";
    html += _btn("120px");
    html += "</div>";
    // Filter bar
    html += '<div class="flex flex-wrap gap-3 items-center">';
    html += _searchBar();
    html += Skeleton({ variant: "rect", width: "150px", height: 36, class: "rounded-lg" });
    html += Skeleton({ variant: "rect", width: "130px", height: 36, class: "rounded-lg" });
    html += "</div>";
    // Card grid
    html += '<div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">';
    for (let i = 0; i < count; i++) {
      html +=
        '<div class="bg-white border border-brand-300 rounded-xl p-4 flex flex-col items-center text-center space-y-3">' +
        Skeleton({ variant: "rect", width: "80px", height: 80, class: "rounded-lg" }) +
        Skeleton({ variant: "text", width: "60%" }) +
        Skeleton({ variant: "text", width: "35%" }) +
        Skeleton({ variant: "text", width: "45%" }) +
        _badge("72px") +
        '<div class="flex gap-2 w-full">' +
        Skeleton({ variant: "rect", width: "100%", height: 32, class: "rounded-lg" }) +
        Skeleton({ variant: "rect", width: "100%", height: 32, class: "rounded-lg" }) +
        "</div></div>";
    }
    html += "</div></div>";
    return html;
  },

  inventoryTable() {
    let html = '<div class="space-y-5">';
    // Title row
    html += '<div class="flex items-center justify-between">';
    html += '<div class="flex items-center gap-3">' + Skeleton({ variant: "text", width: "110px" }) + Skeleton({ variant: "text", width: "60px" }) + "</div>";
    html += '<div class="flex gap-2">' + _badge("100px") + _btn("100px") + "</div>";
    html += "</div>";
    // 4 pill tabs
    html += '<div class="flex flex-wrap gap-2">';
    ["70px", "80px", "80px", "70px"].forEach(function (w) { html += _pill(w); });
    html += "</div>";
    // Search bar
    html += _searchBar();
    // Table card
    html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
    html += '<div class="px-5 py-3 border-b border-brand-100">' + _searchBar() + "</div>";
    html += '<div class="overflow-x-auto"><table class="w-full">';
    html += '<thead><tr class="text-xs font-bold text-brand-700 uppercase tracking-wide border-b-2 border-brand-300 bg-brand-50">';
    ["Item", "Unit", "Stock Level", "Min Stock", "Status", "Updated", "Actions"].forEach(function () {
      html += '<th class="px-5 py-3 text-left">' + Skeleton({ variant: "text", width: "60%" }) + "</th>";
    });
    html += "</tr></thead><tbody>";
    for (let r = 0; r < 6; r++) {
      const zebra = r % 2 === 0 ? "bg-white" : "bg-brand-50/50";
      html += '<tr class="' + zebra + ' border-b border-brand-100">';
      html += '<td class="px-5 py-3">' + Skeleton({ variant: "text", width: "80%" }) + "</td>";
      html += '<td class="px-5 py-3">' + Skeleton({ variant: "text", width: "40%" }) + "</td>";
      html += '<td class="px-5 py-3"><div class="flex items-center gap-2">' + Skeleton({ variant: "rect", width: "80px", height: 8, class: "rounded-full" }) + Skeleton({ variant: "text", width: "30px" }) + "</div></td>";
      html += '<td class="px-5 py-3 text-center">' + Skeleton({ variant: "text", width: "40px" }) + "</td>";
      html += '<td class="px-5 py-3">' + _badge("72px") + "</td>";
      html += '<td class="px-5 py-3">' + Skeleton({ variant: "text", width: "70px" }) + "</td>";
      html += '<td class="px-5 py-3"><div class="flex gap-1">' + Skeleton({ variant: "rect", width: 28, height: 28, class: "rounded-md" }) + Skeleton({ variant: "rect", width: 28, height: 28, class: "rounded-md" }) + "</div></td>";
      html += "</tr>";
    }
    html += "</tbody></table></div></div></div>";
    return html;
  },

  ordersTable() {
    let html = '<div class="space-y-5">';
    // Title row
    html += '<div class="flex items-center justify-between mb-1">';
    html += Skeleton({ variant: "text", width: "80px" });
    html += _btn("110px");
    html += "</div>";
    // 3 pill tabs
    html += '<div class="flex gap-2 mb-1">';
    ["50px", "60px", "55px"].forEach(function (w) { html += _pill(w); });
    html += "</div>";
    // Table card
    html += '<div class="bg-white border border-brand-300 rounded-xl shadow-sm overflow-hidden">';
    html += '<div class="overflow-x-auto"><table class="w-full text-sm text-left">';
    html += '<thead><tr class="text-xs font-bold text-brand-700 uppercase tracking-wide border-b-2 border-brand-300 bg-brand-50">';
    ["Order", "Table", "Server", "Items", "Total", "Status", "Time", "Actions"].forEach(function () {
      html += '<th class="px-4 py-3">' + Skeleton({ variant: "text", width: "60%" }) + "</th>";
    });
    html += "</tr></thead><tbody>";
    for (let r = 0; r < 6; r++) {
      const zebra = r % 2 === 0 ? "bg-white" : "bg-brand-50/50";
      html += '<tr class="' + zebra + ' border-b border-brand-100">';
      ["50%", "45%", "40%", "30%", "40%", "60px", "30%", "50px"].forEach(function (w, i) {
        const isBadge = i === 5;
        const isActions = i === 7;
        if (isActions) {
          html += '<td class="px-4 py-3"><div class="flex gap-1">' + Skeleton({ variant: "rect", width: 28, height: 28, class: "rounded-md" }) + "</div></td>";
        } else if (isBadge) {
          html += '<td class="px-4 py-3">' + _badge("65px") + "</td>";
        } else {
          html += '<td class="px-4 py-3">' + Skeleton({ variant: "text", width: w }) + "</td>";
        }
      });
      html += "</tr>";
    }
    html += "</tbody></table></div></div></div>";
    return html;
  },

  paymentsTable() {
    let html = '<div class="space-y-5">';
    // Title row
    html += '<div class="flex items-center justify-between">';
    html += Skeleton({ variant: "text", width: "90px" });
    html += '<div class="flex gap-2">' + _btn("110px") + _btn("90px") + "</div>";
    html += "</div>";
    // 5 pill tabs
    html += '<div class="flex flex-wrap gap-2">';
    ["60px", "75px", "85px", "75px", "55px"].forEach(function (w) { html += _pill(w); });
    html += "</div>";
    // Table card
    html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
    // Search + date header
    html += '<div class="px-5 py-3 border-b border-brand-100"><div class="flex items-center gap-3">';
    html += '<div class="flex-1">' + _searchBar() + "</div>";
    html += Skeleton({ variant: "rect", width: "140px", height: 36, class: "rounded-lg" });
    html += "</div></div>";
    html += '<div class="overflow-x-auto"><table class="w-full">';
    html += '<thead><tr class="text-xs font-bold text-brand-700 uppercase tracking-wide border-b-2 border-brand-100 bg-brand-50">';
    ["Payment ID", "Order", "Table", "Cashier", "Amount", "Method", "Status", "Date", "Actions"].forEach(function () {
      html += '<th class="px-5 py-3 text-left">' + Skeleton({ variant: "text", width: "60%" }) + "</th>";
    });
    html += "</tr></thead><tbody>";
    for (let r = 0; r < 6; r++) {
      const zebra = r % 2 === 0 ? "bg-white" : "bg-brand-50/50";
      html += '<tr class="' + zebra + ' border-b border-brand-100">';
      ["55%", "35%", "40%", "45%", "45%", "50%", "65px", "55%", "60px"].forEach(function (w, i) {
        const isBadge = i === 6;
        const isActions = i === 8;
        const isMethod = i === 5;
        if (isActions) {
          html += '<td class="px-5 py-3"><div class="flex gap-1">' + Skeleton({ variant: "rect", width: 28, height: 28, class: "rounded-md" }) + "</div></td>";
        } else if (isBadge) {
          html += '<td class="px-5 py-3">' + _badge("70px") + "</td>";
        } else if (isMethod) {
          html += '<td class="px-5 py-3"><div class="flex items-center gap-2">' + Skeleton({ variant: "circle", size: 16 }) + Skeleton({ variant: "text", width: "50px" }) + "</div></td>";
        } else {
          html += '<td class="px-5 py-3">' + Skeleton({ variant: "text", width: w }) + "</td>";
        }
      });
      html += "</tr>";
    }
    html += "</tbody></table></div></div></div>";
    return html;
  },

  reservationsTable() {
    let html = '<div class="space-y-5">';
    // Title row
    html += '<div class="flex items-center justify-between">';
    html += Skeleton({ variant: "text", width: "130px" });
    html += _btn("140px");
    html += "</div>";
    // 5 pill tabs
    html += '<div class="flex flex-wrap gap-2">';
    ["60px", "70px", "85px", "80px", "80px"].forEach(function (w) { html += _pill(w); });
    html += "</div>";
    // Table card
    html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
    html += '<div class="px-5 py-3 border-b border-brand-100"><div class="flex items-center gap-3">';
    html += '<div class="flex-1">' + _searchBar() + "</div>";
    html += Skeleton({ variant: "rect", width: "140px", height: 36, class: "rounded-lg" });
    html += "</div></div>";
    html += '<div class="overflow-x-auto"><table class="w-full">';
    html += '<thead><tr class="text-xs font-bold text-brand-700 uppercase tracking-wide border-b-2 border-brand-100 bg-brand-50">';
    ["Code", "Guest", "Date", "Time", "Party", "Table", "Status", "Actions"].forEach(function () {
      html += '<th class="px-5 py-3 text-left">' + Skeleton({ variant: "text", width: "60%" }) + "</th>";
    });
    html += "</tr></thead><tbody>";
    for (let r = 0; r < 6; r++) {
      html += '<tr class="border-b hover:bg-brand-50/50">';
      ["45%", "70%", "50%", "35%", "30px", "30px", "65px", "50px"].forEach(function (w, i) {
        const isBadge = i === 6;
        const isActions = i === 7;
        const isGuest = i === 1;
        if (isActions) {
          html += '<td class="px-5 py-3">' + _btn("50px") + "</td>";
        } else if (isBadge) {
          html += '<td class="px-5 py-3">' + _badge("70px") + "</td>";
        } else if (isGuest) {
          html += '<td class="px-5 py-3"><div>' + Skeleton({ variant: "text", width: "70%" }) + '<div class="mt-1">' + Skeleton({ variant: "text", width: "50%" }) + "</div></div></td>";
        } else {
          html += '<td class="px-5 py-3">' + Skeleton({ variant: "text", width: w }) + "</td>";
        }
      });
      html += "</tr>";
    }
    html += "</tbody></table></div></div></div>";
    return html;
  },

  reports() {
    let html = '<div class="space-y-5 max-w-2xl" style="max-width:100%">';
    // Title
    html += '<div class="flex items-center justify-between">';
    html += '<div>' + Skeleton({ variant: "text", width: "100px" }) + '<div class="mt-1">' + Skeleton({ variant: "text", width: "200px" }) + "</div></div>";
    html += "</div>";
    // Date range picker
    html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
    html += '<div class="px-5 py-4 border-b border-brand-100 bg-brand-50">' + Skeleton({ variant: "text", width: "80px" }) + "</div>";
    html += '<div class="px-5 py-4 flex items-end gap-4">';
    html += _inputField("60px");
    html += _inputField("60px");
    html += _btn("100px");
    html += "</div></div>";
    // 3-col stats
    html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-5">';
    for (let i = 0; i < 3; i++) {
      html += '<div class="bg-white border border-brand-300 rounded-xl p-5 space-y-3">';
      html += '<div class="flex items-center gap-3">';
      html += Skeleton({ variant: "circle", size: 40, class: "bg-brand-100" });
      html += '<div class="flex-1">' + Skeleton({ variant: "text", width: "60%" }) + "</div>";
      html += "</div>" + Skeleton({ variant: "text", width: "40%" }) + "</div>";
    }
    html += "</div>";
    // Bar chart
    html += '<div class="bg-white border border-brand-300 rounded-xl shadow-sm p-5">';
    html += '<div class="flex items-center justify-between mb-4">';
    html += Skeleton({ variant: "text", width: "100px" });
    html += '<div class="flex gap-2">' + _badge("65px") + _badge("90px") + "</div>";
    html += "</div>";
    html += Skeleton({ variant: "rect", width: "100%", height: 240, class: "rounded" });
    html += "</div>";
    // Top Products table (5 cols)
    html += '<div class="bg-white border border-brand-300 rounded-xl shadow-sm p-0">';
    html += '<div class="px-5 pt-5 pb-4">' + Skeleton({ variant: "text", width: "90px" }) + "</div>";
    html += '<div class="overflow-x-auto"><table class="w-full text-sm text-left">';
    html += '<thead><tr class="text-xs font-bold text-brand-700 uppercase tracking-wide border-b-2 border-brand-300 bg-brand-50">';
    ["Rank", "Product", "Quantity Sold", "Revenue", "% of Total"].forEach(function () {
      html += '<th class="px-5 py-3">' + Skeleton({ variant: "text", width: "60%" }) + "</th>";
    });
    html += "</tr></thead><tbody>";
    for (let r = 0; r < 5; r++) {
      const zebra = r % 2 === 0 ? "bg-white" : "bg-brand-50/50";
      html += '<tr class="' + zebra + ' border-b border-brand-100">';
      html += '<td class="px-5 py-3">' + Skeleton({ variant: "circle", size: 28 }) + "</td>";
      ["60%", "50%", "45%", "40%"].forEach(function (w) {
        html += '<td class="px-5 py-3">' + Skeleton({ variant: "text", width: w }) + "</td>";
      });
      html += "</tr>";
    }
    html += "</tbody></table></div></div></div>";
    return html;
  },

  tables() {
    let html = '<div class="space-y-6">';
    // Title row
    html += '<div class="flex items-center justify-between">';
    html += Skeleton({ variant: "text", width: "160px" });
    html += _btn("130px");
    html += "</div>";
    // Area pills
    html += '<div class="flex flex-wrap gap-2">';
    ["50px", "80px", "70px", "65px"].forEach(function (w) { html += _pill(w); });
    html += "</div>";
    // Legend
    html += '<div class="flex gap-3 text-xs">';
    html += '<div class="flex items-center gap-1">' + Skeleton({ variant: "circle", size: 8 }) + Skeleton({ variant: "text", width: "60px" }) + "</div>";
    html += '<div class="flex items-center gap-1">' + Skeleton({ variant: "circle", size: 8 }) + Skeleton({ variant: "text", width: "60px" }) + "</div>";
    html += '<div class="flex items-center gap-1">' + Skeleton({ variant: "circle", size: 8 }) + Skeleton({ variant: "text", width: "60px" }) + "</div>";
    html += "</div>";
    // Accordion section
    html += '<div class="bg-white border border-brand-200 rounded-xl overflow-hidden">';
    html += '<div class="px-5 py-4 flex items-center justify-between">';
    html += '<div class="flex items-center gap-3">' + Skeleton({ variant: "circle", size: 24 }) + Skeleton({ variant: "text", width: "100px" }) + _badge("20px") + "</div>";
    html += Skeleton({ variant: "circle", size: 20 });
    html += "</div>";
    // Card grid
    html += '<div class="p-5"><div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-5">';
    for (let i = 0; i < 6; i++) {
      html += Skeleton({ variant: "rect", width: "100%", height: 140, class: "rounded-2xl" });
    }
    html += "</div></div></div></div>";
    return html;
  },

  kitchen() {
    let html = '<div class="flex flex-col h-full">';
    // Title row
    html += '<div class="flex items-center justify-between mb-5">';
    html += Skeleton({ variant: "text", width: "150px" });
    html += '<div class="flex items-center gap-2">' + Skeleton({ variant: "circle", size: 8 }) + Skeleton({ variant: "text", width: "100px" }) + "</div>";
    html += "</div>";
    // 3-col kanban
    html += '<div class="flex-1 grid grid-cols-3 gap-5 min-h-0">';
    const colColors = ["bg-info-50", "bg-accent-50", "bg-success-50"];
    for (let col = 0; col < 3; col++) {
      html += '<div class="flex flex-col rounded-xl overflow-hidden ' + colColors[col] + '">';
      // Column header
      html += '<div class="px-4 py-3 flex items-center justify-between">';
      html += Skeleton({ variant: "text", width: "90px" });
      html += _badge("20px");
      html += "</div>";
      // Cards
      html += '<div class="flex-1 px-3 pb-3 flex flex-col gap-3">';
      for (let card = 0; card < 3; card++) {
        html += '<div class="bg-white border border-brand-300 rounded-lg p-4 shadow-sm space-y-3">';
        html += '<div class="flex justify-between">' + Skeleton({ variant: "text", width: "50px" }) + Skeleton({ variant: "text", width: "40px" }) + "</div>";
        html += Skeleton({ variant: "text", lines: 2, width: "80%" });
        html += '<div class="flex gap-2">' + Skeleton({ variant: "rect", width: "48%", height: 32, class: "rounded-md" }) + Skeleton({ variant: "rect", width: "48%", height: 32, class: "rounded-md" }) + "</div>";
        html += "</div>";
      }
      html += "</div></div>";
    }
    html += "</div></div>";
    return html;
  },

  settings() {
    let html = '<div class="space-y-5 max-w-2xl">';
    // Title
    html += '<div class="flex items-center justify-between">';
    html += '<div>' + Skeleton({ variant: "text", width: "80px" }) + '<div class="mt-1">' + Skeleton({ variant: "text", width: "200px" }) + "</div></div>";
    html += "</div>";
    // Section 1: Restaurant Profile
    html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
    html += '<div class="px-5 py-4 border-b border-brand-100 bg-brand-50">' + Skeleton({ variant: "text", width: "130px" }) + "</div>";
    html += '<div class="p-5 space-y-4">';
    html += _inputField("100px");
    html += _inputField("60px");
    html += '<div class="grid grid-cols-2 gap-4">' + _inputField("40px") + _inputField("35px") + "</div>";
    html += "</div></div>";
    // Section 2: Tax & Currency
    html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
    html += '<div class="px-5 py-4 border-b border-brand-100 bg-brand-50">' + Skeleton({ variant: "text", width: "100px" }) + "</div>";
    html += '<div class="p-5"><div class="grid grid-cols-3 gap-4">';
    html += _inputField("60px") + _inputField("100px") + _inputField("90px");
    html += "</div></div></div>";
    // Buttons
    html += '<div class="flex items-center gap-3">' + _btn("130px") + _btn("140px") + "</div>";
    html += "</div>";
    return html;
  },
};

window.withLoading = withLoading;

export { withLoading, Skeletons };
