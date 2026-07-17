import {
  getMockProducts,
  addMockProduct,
  updateMockProduct,
  deleteMockProduct,
} from "./mockProducts.js";
import {
  getMockCategories,
} from "./mockCategories.js";

export { initMockProducts } from "./mockProducts.js";
export { initMockCategories } from "./mockCategories.js";

export function getCategoryById(id) {
  return getMockCategories().find((c) => c.id === id) || null;
}

export function getAllProducts() {
  return getMockProducts();
}

export function getProductById(id) {
  return getMockProducts().find((p) => p.id === id) || null;
}

export function getProductsByCategory(categoryId) {
  return getMockProducts().filter((p) => p.category_id === categoryId);
}

export function getAvailableProducts() {
  return getMockProducts().filter((p) => p.available);
}

export function getAllCategories() {
  return getMockCategories();
}

export function filterProducts({ category, available, search }) {
  let results = getMockProducts();

  if (category) {
    results = results.filter((p) => p.category_id === parseInt(category));
  }

  if (available !== "") {
    const isAvailable = available === "available";
    results = results.filter((p) => p.available === isAvailable);
  }

  if (search) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  return results;
}

export function createProduct(data) {
  const newProduct = {
    category_id: data.category_id,
    name: data.name,
    description: data.description || "",
    price: data.price,
    available: data.available !== undefined ? data.available : true,
    image_url: data.image_url || null,
  };

  const product = addMockProduct(newProduct);

  return { success: true, product };
}

export function updateProduct(id, data) {
  const updates = {
    category_id: data.category_id,
    name: data.name,
    description: data.description,
    price: data.price,
    available: data.available,
    image_url: data.image_url,
  };

  const product = updateMockProduct(id, updates);

  if (!product) {
    return { success: false, error: "Product not found" };
  }

  return { success: true, product };
}

export function toggleProductAvailability(id) {
  const product = getProductById(id);
  if (!product) {
    return { success: false, error: "Product not found" };
  }

  return updateProduct(id, { ...product, available: !product.available });
}

export function deleteProduct(id) {
  const success = deleteMockProduct(id);

  if (!success) {
    return { success: false, error: "Product not found" };
  }

  return { success: true };
}
