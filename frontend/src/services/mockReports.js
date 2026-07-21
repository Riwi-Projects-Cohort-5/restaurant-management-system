import { allOrders } from "../store/posData.js";

export function initMockReports() {
  // Reports are computed from existing order data, no localStorage needed
}

export function getSalesReport(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const filteredOrders = allOrders.filter(function (_o) {
    const orderDate = new Date("2026-07-15T20:00:00Z");
    return orderDate >= start && orderDate <= end;
  });

  const totalRevenue = filteredOrders.reduce(function (sum, o) {
    return sum + (o.status !== "cancelled" ? o.total : 0);
  }, 0);

  const totalOrders = filteredOrders.filter(function (o) {
    return o.status !== "cancelled";
  }).length;

  return {
    total_revenue: Math.round(totalRevenue * 100) / 100,
    total_orders: totalOrders,
    start_date: start.toISOString(),
    end_date: end.toISOString(),
  };
}

export function getTopProducts(startDate, endDate, limit) {
  const productMap = {};
  const items = allOrders.filter(function (o) {
    return o.status !== "cancelled";
  });

  items.forEach(function (order) {
    order.items.forEach(function (item) {
      if (!productMap[item.name]) {
        productMap[item.name] = {
          menu_item_name: item.name,
          total_quantity: 0,
          total_revenue: 0,
        };
      }
      productMap[item.name].total_quantity += item.qty;
      productMap[item.name].total_revenue += (item.price || 0) * item.qty;
    });
  });

  let products = Object.values(productMap).sort(function (a, b) {
    return b.total_revenue - a.total_revenue;
  });

  if (limit) {
    products = products.slice(0, limit);
  }

  return products.map(function (p) {
    p.total_revenue = Math.round(p.total_revenue * 100) / 100;
    return p;
  });
}

export function getDailySales() {
  const days = [];
  const now = new Date("2026-07-15T20:00:00Z");

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });

    let dayRevenue = 0;
    allOrders.forEach(function (o) {
      if (o.status !== "cancelled") {
        const variance = Math.sin(i * 1.3 + 2) * 0.3 + 1;
        dayRevenue += o.total * (variance / 3);
      }
    });

    days.push({
      label: label,
      date: d.toISOString().split("T")[0],
      revenue: Math.round(Math.max(dayRevenue, 200 + i * 50) * 100) / 100,
      orders: Math.floor(10 + Math.sin(i * 1.7) * 5 + i * 2),
    });
  }

  return days;
}
