function delay(ms = 100) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getOrders() {
  return JSON.parse(localStorage.getItem("rms_orders") || "[]");
}

function getTables() {
  return JSON.parse(localStorage.getItem("rms_tables") || "[]");
}

function getReservations() {
  return JSON.parse(localStorage.getItem("rms_reservations") || "[]");
}

export async function fetchDashboardStats() {
  await delay();

  const orders = getOrders();
  const tables = getTables();
  const reservations = getReservations();

  const completedOrders = orders.filter((o) => o.status === "completed");
  const revenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

  const occupiedTables = tables.filter((t) => t.status !== "available").length;
  const totalTables = tables.length;

  const today = new Date().toISOString().split("T")[0];
  const todayReservations = reservations.filter(
    (r) => r.date === today && r.status !== "cancelled"
  );

  return {
    ok: true,
    data: {
      revenue: `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ordersToday: orders.length,
      activeTables: `${occupiedTables}/${totalTables}`,
      reservations: todayReservations.length,
    },
  };
}

export async function fetchSalesChart() {
  await delay();

  const orders = getOrders();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const salesByDay = new Array(7).fill(0);
  const lastWeekByDay = new Array(7).fill(0);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  orders.forEach((o) => {
    if (o.status === "cancelled") return;
    const orderDate = new Date(now);
    const match = o.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      orderDate.setHours(hours, minutes, 0, 0);
    } else {
      orderDate.setHours(12, 0, 0, 0);
    }

    const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      const idx = (dayOfWeek - diffDays + 7) % 7;
      salesByDay[idx] += o.total;
    }
  });

  const labels = [];
  const thisWeek = [];
  const lastWeek = [];
  for (let i = 0; i < 7; i++) {
    labels.push(dayNames[(dayOfWeek - 6 + i + 7) % 7]);
    thisWeek.push(Math.round(salesByDay[(dayOfWeek - 6 + i + 7) % 7] * 100) / 100);
    lastWeekByDay[i] = Math.round((Math.random() * 800 + 400) * 100) / 100;
    lastWeek.push(lastWeekByDay[i]);
  }

  const hasRealSales = thisWeek.some((v) => v > 0);
  if (!hasRealSales) {
    return {
      ok: true,
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        thisWeek: [1200, 1900, 1500, 2100, 1800, 2400, 1600],
        lastWeek: [1100, 1700, 1400, 1900, 1600, 2200, 1500],
      },
    };
  }

  return {
    ok: true,
    data: { labels, thisWeek, lastWeek },
  };
}

export async function fetchRecentOrders() {
  await delay();

  const orders = getOrders();
  const recent = orders.slice(0, 5).map((o) => ({
    id: o.id,
    table: o.table,
    items: Array.isArray(o.items) ? o.items.length : 0,
    total: `$${(typeof o.total === 'number' ? o.total : parseFloat(o.total) || 0).toFixed(2)}`,
    status: o.status,
    time: o.time,
  }));

  if (recent.length === 0) {
    return {
      ok: true,
      data: [
        { id: 1043, table: 3, items: 3, total: "$38.50", status: "new", time: "1 min ago" },
        { id: 1042, table: 7, items: 3, total: "$60.00", status: "preparing", time: "5 min ago" },
        { id: 1041, table: 1, items: 4, total: "$35.00", status: "ready", time: "12 min ago" },
        { id: 1040, table: 5, items: 3, total: "$21.00", status: "served", time: "18 min ago" },
        { id: 1039, table: 10, items: 2, total: "$53.00", status: "completed", time: "25 min ago" },
      ],
    };
  }

  return { ok: true, data: recent };
}

export async function fetchTableStatusSummary() {
  await delay();

  const tables = getTables();
  const summary = { available: 0, occupied: 0, reserved: 0 };

  tables.forEach((t) => {
    if (summary[t.status] !== undefined) {
      summary[t.status]++;
    } else {
      summary.available++;
    }
  });

  if (Object.values(summary).every((v) => v === 0)) {
    return {
      ok: true,
      data: { available: 5, occupied: 5, reserved: 2 },
    };
  }

  return { ok: true, data: summary };
}
