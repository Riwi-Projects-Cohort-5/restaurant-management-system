import {
  getMockPayments,
  addMockPayment,
  updateMockPayment,
  deleteMockPayment,
} from "./mockPayments.js";

export function getAllPayments() {
  return getMockPayments();
}

export function getPaymentById(id) {
  return getMockPayments().find((p) => p.id === id) || null;
}

export function getPaymentsByOrderId(orderId) {
  return getMockPayments().filter((p) => p.order_id === orderId);
}

export function getPaymentsByCashierId(cashierId) {
  return getMockPayments().filter((p) => p.cashier_id === cashierId);
}

export function getPaymentsByStatus(status) {
  return getMockPayments().filter((p) => p.status === status);
}

export function filterPayments({ status, search, date }) {
  let results = getMockPayments();

  if (status) {
    results = results.filter((p) => p.status === status);
  }

  if (search) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        String(p.order_id).includes(q) ||
        (p.reference_number && p.reference_number.toLowerCase().includes(q))
    );
  }

  if (date) {
    results = results.filter((p) => p.payment_date.startsWith(date));
  }

  return results;
}

export function createPayment(data) {
  const payments = getMockPayments();

  const newPayment = {
    id: 'pay-' + String(payments.length + 1).padStart(3, '0'),
    order_id: data.order_id,
    cashier_id: data.cashier_id,
    payment_method: data.payment_method,
    amount: data.amount,
    payment_date: new Date().toISOString(),
    status: 'pending',
    reference_number: data.reference_number || null,
  };

  addMockPayment(newPayment);

  return { success: true, payment: newPayment };
}

export function updatePaymentStatus(id, newStatus) {
  const payment = updateMockPayment(id, { status: newStatus });

  if (!payment) {
    return { success: false, error: 'Payment not found' };
  }

  return { success: true, payment };
}

export function refundPayment(id) {
  return updatePaymentStatus(id, 'refunded');
}

export function deletePayment(id) {
  const success = deleteMockPayment(id);

  if (!success) {
    return { success: false, error: 'Payment not found' };
  }

  return { success: true };
}
