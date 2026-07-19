let mockPayments = [];

export const STATUS_LABELS = {
  pending: "Pending",
  completed: "Completed",
  refunded: "Refunded",
  failed: "Failed",
};

export const STATUS_COLORS = {
  pending: { bg: "bg-info-100", text: "text-info-700", dot: "bg-info-500" },
  completed: { bg: "bg-success-100", text: "text-success-700", dot: "bg-success-500" },
  refunded: { bg: "bg-accent-100", text: "text-accent-700", dot: "bg-accent-500" },
  failed: { bg: "bg-error-100", text: "text-error-700", dot: "bg-error-500" },
};

export const PAYMENT_METHODS = [
  { id: "cash", name: "Cash", icon: "banknote" },
  { id: "credit_card", name: "Credit Card", icon: "credit-card" },
  { id: "debit_card", name: "Debit Card", icon: "credit-card" },
  { id: "mobile", name: "Mobile Payment", icon: "smartphone" },
];

export function initMockPayments() {
  if (mockPayments.length > 0) return mockPayments;

  mockPayments = [
    {
      id: "pay-001",
      order_id: 1043,
      cashier_id: "admin",
      payment_method: "credit_card",
      amount: 38.5,
      payment_date: "2024-01-15T14:30:00",
      status: "completed",
      reference_number: "TXN-84729103",
    },
    {
      id: "pay-002",
      order_id: 1042,
      cashier_id: "waiter",
      payment_method: "cash",
      amount: 49.3,
      payment_date: "2024-01-15T14:25:00",
      status: "completed",
      reference_number: "CASH-001",
    },
    {
      id: "pay-003",
      order_id: 1041,
      cashier_id: "admin",
      payment_method: "credit_card",
      amount: 79.2,
      payment_date: "2024-01-15T14:20:00",
      status: "completed",
      reference_number: "TXN-84729102",
    },
    {
      id: "pay-004",
      order_id: 1040,
      cashier_id: "waiter",
      payment_method: "debit_card",
      amount: 22.0,
      payment_date: "2024-01-15T14:15:00",
      status: "completed",
      reference_number: "TXN-84729101",
    },
    {
      id: "pay-005",
      order_id: 1039,
      cashier_id: "admin",
      payment_method: "mobile",
      amount: 37.4,
      payment_date: "2024-01-15T14:10:00",
      status: "refunded",
      reference_number: "MOB-84729100",
    },
    {
      id: "pay-006",
      order_id: 1037,
      cashier_id: "waiter",
      payment_method: "cash",
      amount: 37.4,
      payment_date: "2024-01-15T14:05:00",
      status: "completed",
      reference_number: "CASH-002",
    },
    {
      id: "pay-007",
      order_id: 1036,
      cashier_id: "admin",
      payment_method: "credit_card",
      amount: 23.65,
      payment_date: "2024-01-15T14:00:00",
      status: "completed",
      reference_number: "TXN-84729099",
    },
    {
      id: "pay-008",
      order_id: 1035,
      cashier_id: "waiter",
      payment_method: "credit_card",
      amount: 118.8,
      payment_date: "2024-01-15T13:55:00",
      status: "completed",
      reference_number: "TXN-84729098",
    },
    {
      id: "pay-009",
      order_id: 1034,
      cashier_id: "admin",
      payment_method: "debit_card",
      amount: 64.9,
      payment_date: "2024-01-15T13:50:00",
      status: "pending",
      reference_number: "TXN-84729097",
    },
    {
      id: "pay-010",
      order_id: 1033,
      cashier_id: "waiter",
      payment_method: "cash",
      amount: 45.0,
      payment_date: "2024-01-15T13:45:00",
      status: "completed",
      reference_number: "CASH-003",
    },
    {
      id: "pay-011",
      order_id: 1032,
      cashier_id: "admin",
      payment_method: "mobile",
      amount: 52.3,
      payment_date: "2024-01-15T13:40:00",
      status: "failed",
      reference_number: "MOB-84729096",
    },
    {
      id: "pay-012",
      order_id: 1031,
      cashier_id: "waiter",
      payment_method: "credit_card",
      amount: 33.5,
      payment_date: "2024-01-15T13:35:00",
      status: "completed",
      reference_number: "TXN-84729095",
    },
    {
      id: "pay-013",
      order_id: 1030,
      cashier_id: "admin",
      payment_method: "cash",
      amount: 28.9,
      payment_date: "2024-01-15T13:30:00",
      status: "refunded",
      reference_number: "CASH-004",
    },
    {
      id: "pay-014",
      order_id: 1029,
      cashier_id: "waiter",
      payment_method: "debit_card",
      amount: 41.2,
      payment_date: "2024-01-15T13:25:00",
      status: "completed",
      reference_number: "TXN-84729094",
    },
    {
      id: "pay-015",
      order_id: 1028,
      cashier_id: "admin",
      payment_method: "credit_card",
      amount: 76.8,
      payment_date: "2024-01-15T13:20:00",
      status: "pending",
      reference_number: "TXN-84729093",
    },
    {
      id: "pay-016",
      order_id: 1027,
      cashier_id: "waiter",
      payment_method: "mobile",
      amount: 19.5,
      payment_date: "2024-01-15T13:15:00",
      status: "completed",
      reference_number: "MOB-84729092",
    },
    {
      id: "pay-017",
      order_id: 1026,
      cashier_id: "admin",
      payment_method: "cash",
      amount: 55.6,
      payment_date: "2024-01-15T13:10:00",
      status: "completed",
      reference_number: "CASH-005",
    },
    {
      id: "pay-018",
      order_id: 1025,
      cashier_id: "waiter",
      payment_method: "credit_card",
      amount: 82.4,
      payment_date: "2024-01-15T13:05:00",
      status: "failed",
      reference_number: "TXN-84729091",
    },
    {
      id: "pay-019",
      order_id: 1024,
      cashier_id: "admin",
      payment_method: "debit_card",
      amount: 36.7,
      payment_date: "2024-01-15T13:00:00",
      status: "completed",
      reference_number: "TXN-84729090",
    },
    {
      id: "pay-020",
      order_id: 1023,
      cashier_id: "waiter",
      payment_method: "cash",
      amount: 48.3,
      payment_date: "2024-01-15T12:55:00",
      status: "pending",
      reference_number: "CASH-006",
    },
  ];

  return mockPayments;
}

export function getMockPayments() {
  return mockPayments;
}

export function addMockPayment(payment) {
  mockPayments.unshift(payment);
  return payment;
}

export function updateMockPayment(id, updates) {
  const idx = mockPayments.findIndex(function (p) {
    return p.id === id;
  });
  if (idx !== -1) {
    mockPayments[idx] = { ...mockPayments[idx], ...updates };
    return mockPayments[idx];
  }
  return null;
}

export function deleteMockPayment(id) {
  const idx = mockPayments.findIndex(function (p) {
    return p.id === id;
  });
  if (idx !== -1) {
    mockPayments.splice(idx, 1);
    return true;
  }
  return false;
}
