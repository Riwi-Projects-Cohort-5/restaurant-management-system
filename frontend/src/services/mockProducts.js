let mockProducts = [];

export function initMockProducts() {
  if (mockProducts.length > 0) return mockProducts;

  const now = new Date().toISOString();

  mockProducts = [
    {
      id: 1,
      category_id: 1,
      name: "French Fries",
      description: "Crispy golden fries served with ketchup",
      price: 5.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      category_id: 1,
      name: "Onion Rings",
      description: "Battered and fried onion rings with dipping sauce",
      price: 6.5,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 3,
      category_id: 1,
      name: "Bruschetta",
      description: "Toasted bread topped with fresh tomatoes, garlic, and basil",
      price: 8.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 4,
      category_id: 1,
      name: "Garlic Bread",
      description: "Warm bread with garlic butter and herbs",
      price: 6.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 5,
      category_id: 2,
      name: "Grilled Chicken",
      description: "Grilled chicken breast with herbs and lemon",
      price: 18.5,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 6,
      category_id: 2,
      name: "Ribeye Steak",
      description: "Premium ribeye steak cooked to your preference",
      price: 32.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 7,
      category_id: 2,
      name: "Pasta Carbonara",
      description: "Creamy pasta with bacon, egg, and parmesan",
      price: 16.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 8,
      category_id: 2,
      name: "Classic Burger",
      description: "Beef patty with lettuce, tomato, and special sauce",
      price: 15.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 9,
      category_id: 2,
      name: "Fish Tacos",
      description: "Grilled fish tacos with cabbage slaw and lime",
      price: 13.5,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 10,
      category_id: 3,
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with lemon dill sauce",
      price: 24.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 11,
      category_id: 3,
      name: "Shrimp Scampi",
      description: "Garlic butter shrimp over linguine",
      price: 22.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 12,
      category_id: 3,
      name: "Lobster Tail",
      description: "Grilled lobster tail with drawn butter",
      price: 45.0,
      available: false,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 13,
      category_id: 4,
      name: "Tiramisu",
      description: "Classic Italian dessert with mascarpone and espresso",
      price: 9.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 14,
      category_id: 4,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center",
      price: 10.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 15,
      category_id: 4,
      name: "Cheesecake",
      description: "New York style cheesecake with berry compote",
      price: 8.5,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 16,
      category_id: 5,
      name: "Sparkling Water",
      description: "Premium sparkling mineral water",
      price: 3.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 17,
      category_id: 5,
      name: "Iced Tea",
      description: "Fresh brewed iced tea with lemon",
      price: 4.0,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 18,
      category_id: 5,
      name: "Lemonade",
      description: "Fresh squeezed lemonade",
      price: 4.5,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 19,
      category_id: 6,
      name: "Espresso",
      description: "Single shot of espresso",
      price: 3.5,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 20,
      category_id: 6,
      name: "Cappuccino",
      description: "Espresso with steamed milk foam",
      price: 4.5,
      available: true,
      image_url: null,
      created_at: now,
      updated_at: now,
    },
  ];

  return mockProducts;
}

export function getMockProducts() {
  return mockProducts;
}

export function getProductById(id) {
  return (
    mockProducts.find(function (p) {
      return p.id === id;
    }) || null
  );
}

export function addMockProduct(product) {
  const maxId = mockProducts.reduce(function (max, p) {
    return Math.max(max, p.id);
  }, 0);
  product.id = maxId + 1;
  const now = new Date().toISOString();
  product.created_at = now;
  product.updated_at = now;
  mockProducts.push(product);
  return product;
}

export function updateMockProduct(id, updates) {
  const idx = mockProducts.findIndex(function (p) {
    return p.id === id;
  });
  if (idx !== -1) {
    mockProducts[idx] = { ...mockProducts[idx], ...updates, updated_at: new Date().toISOString() };
    return mockProducts[idx];
  }
  return null;
}

export function deleteMockProduct(id) {
  const idx = mockProducts.findIndex(function (p) {
    return p.id === id;
  });
  if (idx !== -1) {
    mockProducts.splice(idx, 1);
    return true;
  }
  return false;
}
