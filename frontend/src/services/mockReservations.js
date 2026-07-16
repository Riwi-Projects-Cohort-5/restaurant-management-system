const STORAGE_KEY = "rms_reservations";

const DEFAULT_RESERVATIONS = [
  {
    id: "res_001",
    code: "RES-001",
    guestName: "Juan Pérez",
    guestPhone: "+52 55 1234 5678",
    userId: "usr_002",
    date: "2026-07-15",
    time: "19:00",
    partySize: 4,
    tableNumber: 5,
    status: "confirmed",
    notes: "Mesa junto a la ventana",
    createdAt: "2026-07-10T10:30:00.000Z",
  },
  {
    id: "res_002",
    code: "RES-002",
    guestName: "María López",
    guestPhone: "+52 55 9876 5432",
    userId: "usr_002",
    date: "2026-07-15",
    time: "20:00",
    partySize: 2,
    tableNumber: 3,
    status: "pending",
    notes: "",
    createdAt: "2026-07-11T08:15:00.000Z",
  },
  {
    id: "res_003",
    code: "RES-003",
    guestName: "Carlos García",
    guestPhone: "+52 55 5555 1234",
    userId: "usr_003",
    date: "2026-07-16",
    time: "13:00",
    partySize: 6,
    tableNumber: 10,
    status: "confirmed",
    notes: "Celebración de cumpleaños",
    createdAt: "2026-07-09T14:00:00.000Z",
  },
  {
    id: "res_004",
    code: "RES-004",
    guestName: "Ana Martínez",
    guestPhone: "+52 55 4444 8888",
    userId: "usr_002",
    date: "2026-07-14",
    time: "18:30",
    partySize: 3,
    tableNumber: 7,
    status: "cancelled",
    notes: "Cambio de planes",
    createdAt: "2026-07-08T09:00:00.000Z",
  },
  {
    id: "res_005",
    code: "RES-005",
    guestName: "Pedro Sánchez",
    guestPhone: "+52 55 7777 3333",
    userId: "usr_004",
    date: "2026-07-13",
    time: "21:00",
    partySize: 8,
    tableNumber: 12,
    status: "completed",
    notes: "Mesa en terraza",
    createdAt: "2026-07-07T16:45:00.000Z",
  },
  {
    id: "res_006",
    code: "RES-006",
    guestName: "Laura Díaz",
    guestPhone: "+52 55 2222 6666",
    userId: "usr_002",
    date: "2026-07-17",
    time: "14:00",
    partySize: 5,
    tableNumber: 8,
    status: "pending",
    notes: "Almerno de negocios",
    createdAt: "2026-07-12T11:20:00.000Z",
  },
  {
    id: "res_007",
    code: "RES-007",
    guestName: "Roberto Hernández",
    guestPhone: "+52 55 3333 9999",
    userId: "usr_005",
    date: "2026-07-18",
    time: "19:30",
    partySize: 2,
    tableNumber: 2,
    status: "confirmed",
    notes: "Aniversario",
    createdAt: "2026-07-12T13:00:00.000Z",
  },
];

export const RESERVATION_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export const STATUS_LABELS = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
};

export const STATUS_COLORS = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
  confirmed: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
  cancelled: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
  completed: { bg: "bg-gray-100", text: "text-gray-800", dot: "bg-gray-500" },
};

export function initMockReservations() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RESERVATIONS));
  }
}

export function getReservations() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveReservations(reservations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}

export function generateReservationId() {
  return "res_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function generateReservationCode() {
  const reservations = getReservations();
  const maxNum = reservations.reduce((max, r) => {
    const num = parseInt(r.code.replace("RES-", ""), 10);
    return num > max ? num : max;
  }, 0);
  return "RES-" + String(maxNum + 1).padStart(3, "0");
}
