var STORAGE_KEY = "inventory_items";
var MOVEMENTS_KEY = "inventory_movements";

var defaultItems = [
  {
    id: "inv-001",
    name: "Extra Virgin Olive Oil",
    unit: "L",
    quantity: 24.5,
    min_stock: 10,
    is_active: true,
    created_at: "2026-07-01T10:00:00Z",
    updated_at: "2026-07-15T08:30:00Z",
  },
  {
    id: "inv-002",
    name: "All-Purpose Flour",
    unit: "kg",
    quantity: 45.0,
    min_stock: 20,
    is_active: true,
    created_at: "2026-07-01T10:00:00Z",
    updated_at: "2026-07-14T14:00:00Z",
  },
  {
    id: "inv-003",
    name: "Fresh Tomatoes",
    unit: "kg",
    quantity: 3.2,
    min_stock: 5,
    is_active: true,
    created_at: "2026-07-05T09:00:00Z",
    updated_at: "2026-07-15T07:00:00Z",
  },
  {
    id: "inv-004",
    name: "Mozzarella Cheese",
    unit: "kg",
    quantity: 8.0,
    min_stock: 5,
    is_active: true,
    created_at: "2026-07-02T11:00:00Z",
    updated_at: "2026-07-15T06:00:00Z",
  },
  {
    id: "inv-005",
    name: "Chicken Breast",
    unit: "kg",
    quantity: 12.5,
    min_stock: 8,
    is_active: true,
    created_at: "2026-07-03T10:00:00Z",
    updated_at: "2026-07-14T18:00:00Z",
  },
  {
    id: "inv-006",
    name: "Salmon Fillet",
    unit: "kg",
    quantity: 2.0,
    min_stock: 4,
    is_active: true,
    created_at: "2026-07-06T09:00:00Z",
    updated_at: "2026-07-15T05:00:00Z",
  },
  {
    id: "inv-007",
    name: "Ribeye Steak",
    unit: "kg",
    quantity: 6.5,
    min_stock: 5,
    is_active: true,
    created_at: "2026-07-01T10:00:00Z",
    updated_at: "2026-07-14T20:00:00Z",
  },
  {
    id: "inv-008",
    name: "Sparkling Water",
    unit: "L",
    quantity: 48.0,
    min_stock: 20,
    is_active: true,
    created_at: "2026-07-01T10:00:00Z",
    updated_at: "2026-07-13T12:00:00Z",
  },
  {
    id: "inv-009",
    name: "House Wine (Red)",
    unit: "L",
    quantity: 12.0,
    min_stock: 10,
    is_active: true,
    created_at: "2026-07-01T10:00:00Z",
    updated_at: "2026-07-15T09:00:00Z",
  },
  {
    id: "inv-010",
    name: "Iced Tea Mix",
    unit: "kg",
    quantity: 1.5,
    min_stock: 2,
    is_active: true,
    created_at: "2026-07-10T10:00:00Z",
    updated_at: "2026-07-15T08:00:00Z",
  },
  {
    id: "inv-011",
    name: "Heavy Cream",
    unit: "L",
    quantity: 4.0,
    min_stock: 3,
    is_active: true,
    created_at: "2026-07-08T10:00:00Z",
    updated_at: "2026-07-14T16:00:00Z",
  },
  {
    id: "inv-012",
    name: "Fresh Basil",
    unit: "bunch",
    quantity: 6,
    min_stock: 4,
    is_active: true,
    created_at: "2026-07-12T09:00:00Z",
    updated_at: "2026-07-15T07:30:00Z",
  },
];

var defaultMovements = [
  {
    id: "mov-001",
    item_id: "inv-003",
    type: "out",
    quantity: 2.8,
    reason: "Daily prep",
    created_at: "2026-07-15T07:00:00Z",
  },
  {
    id: "mov-002",
    item_id: "inv-006",
    type: "out",
    quantity: 1.5,
    reason: "Dinner service",
    created_at: "2026-07-15T05:00:00Z",
  },
  {
    id: "mov-003",
    item_id: "inv-001",
    type: "in",
    quantity: 10,
    reason: "Weekly delivery",
    created_at: "2026-07-14T08:30:00Z",
  },
  {
    id: "mov-004",
    item_id: "inv-010",
    type: "out",
    quantity: 0.5,
    reason: "Service prep",
    created_at: "2026-07-15T08:00:00Z",
  },
  {
    id: "mov-005",
    item_id: "inv-004",
    type: "in",
    quantity: 5,
    reason: "Supplier restock",
    created_at: "2026-07-13T10:00:00Z",
  },
  {
    id: "mov-006",
    item_id: "inv-008",
    type: "in",
    quantity: 24,
    reason: "Bulk order delivery",
    created_at: "2026-07-12T12:00:00Z",
  },
  {
    id: "mov-007",
    item_id: "inv-005",
    type: "out",
    quantity: 3,
    reason: "Grilled chicken orders",
    created_at: "2026-07-14T18:00:00Z",
  },
  {
    id: "mov-008",
    item_id: "inv-009",
    type: "out",
    quantity: 4,
    reason: "Evening service",
    created_at: "2026-07-15T09:00:00Z",
  },
];

export function initMockInventory() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
  }
  if (!localStorage.getItem(MOVEMENTS_KEY)) {
    localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(defaultMovements));
  }
}

export function getAllItems() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getItemById(id) {
  var items = getAllItems();
  return (
    items.find(function (i) {
      return i.id === id;
    }) || null
  );
}

export function createItem(data) {
  var items = getAllItems();
  var now = new Date().toISOString();
  var id = "inv-" + String(items.length + 1).padStart(3, "0");
  var item = {
    id: id,
    name: data.name,
    unit: data.unit,
    quantity: parseFloat(data.quantity) || 0,
    min_stock: parseFloat(data.min_stock) || 0,
    is_active: data.is_active !== false,
    created_at: now,
    updated_at: now,
  };
  items.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return item;
}

export function updateItem(id, data) {
  var items = getAllItems();
  var idx = items.findIndex(function (i) {
    return i.id === id;
  });
  if (idx === -1) return null;
  var item = items[idx];
  Object.keys(data).forEach(function (key) {
    if (data[key] !== undefined && data[key] !== null) {
      item[key] = data[key];
    }
  });
  item.updated_at = new Date().toISOString();
  items[idx] = item;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return item;
}

export function deleteItem(id) {
  var items = getAllItems();
  items = items.filter(function (i) {
    return i.id !== id;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getAllMovements() {
  return JSON.parse(localStorage.getItem(MOVEMENTS_KEY) || "[]");
}

export function getMovementsByItem(itemId) {
  var movements = getAllMovements();
  return movements.filter(function (m) {
    return m.item_id === itemId;
  });
}

export function createMovement(data) {
  var movements = getAllMovements();
  var now = new Date().toISOString();
  var id = "mov-" + String(movements.length + 1).padStart(3, "0");
  var movement = {
    id: id,
    item_id: data.item_id,
    type: data.type,
    quantity: parseFloat(data.quantity),
    reason: data.reason || null,
    created_at: now,
  };
  movements.push(movement);
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));

  var item = getItemById(data.item_id);
  if (item) {
    if (data.type === "in") {
      item.quantity = parseFloat(item.quantity) + parseFloat(data.quantity);
    } else {
      item.quantity = parseFloat(item.quantity) - parseFloat(data.quantity);
    }
    item.updated_at = now;
    var items = getAllItems();
    var idx = items.findIndex(function (i) {
      return i.id === data.item_id;
    });
    if (idx > -1) {
      items[idx] = item;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }

  return movement;
}

export var UNITS = [
  { id: "kg", name: "Kilograms" },
  { id: "L", name: "Liters" },
  { id: "bunch", name: "Bunches" },
  { id: "unit", name: "Units" },
  { id: "g", name: "Grams" },
  { id: "ml", name: "Milliliters" },
  { id: "oz", name: "Ounces" },
  { id: "lb", name: "Pounds" },
];

export var STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  low_stock: "Low Stock",
};

export var STATUS_COLORS = {
  active: { bg: "bg-success-100", text: "text-success-700", dot: "bg-success-500" },
  inactive: { bg: "bg-neutral-100", text: "text-neutral-600", dot: "bg-neutral-500" },
  low_stock: { bg: "bg-error-100", text: "text-error-700", dot: "bg-error-500" },
};
