var mockCategories = [];

export function initMockCategories() {
  if (mockCategories.length > 0) return mockCategories;

  mockCategories = [
    { id: 1, name: "Appetizers", description: "Starters and small plates" },
    { id: 2, name: "Main Courses", description: "Primary dishes and entrees" },
    { id: 3, name: "Seafood", description: "Fresh fish and shellfish dishes" },
    { id: 4, name: "Desserts", description: "Sweet treats and pastries" },
    { id: 5, name: "Soft Drinks", description: "Non-alcoholic beverages" },
    { id: 6, name: "Coffee", description: "Coffee and espresso drinks" },
    { id: 7, name: "Cocktails", description: "Mixed alcoholic drinks" },
    { id: 8, name: "Beer", description: "Draft and bottled beers" },
  ];

  return mockCategories;
}

export function getMockCategories() {
  return mockCategories;
}

export function getCategoryById(id) {
  return (
    mockCategories.find(function (c) {
      return c.id === id;
    }) || null
  );
}

export function addMockCategory(category) {
  var maxId = mockCategories.reduce(function (max, c) {
    return Math.max(max, c.id);
  }, 0);
  category.id = maxId + 1;
  mockCategories.push(category);
  return category;
}
