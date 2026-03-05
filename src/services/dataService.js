/**
 * Data Service — Unified data layer that uses Firebase when configured,
 * falls back to mock data for development.
 *
 * Set VITE_USE_FIREBASE=true in .env to use real Firebase.
 */

import * as productService from './productService';
import * as orderService from './orderService';
import * as categoryService from './categoryService';
import * as configService from './configService';
import { mockProducts, mockCategories, mockOrders, mockConfig } from './mockData';

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

// ===== PRODUCTS =====

export async function getProducts() {
  if (!USE_FIREBASE) return mockProducts;
  return productService.getProducts();
}

export async function getProductsByCategory(category) {
  if (!USE_FIREBASE) return mockProducts.filter(p => p.category === category);
  return productService.getProductsByCategory(category);
}

export async function getAvailableProducts() {
  if (!USE_FIREBASE) return mockProducts.filter(p => p.isAvailable);
  const prods = await productService.getAvailableProducts();
  if (prods.length === 0) return mockProducts.filter(p => p.isAvailable);
  return prods;
}

export async function getProduct(id) {
  if (!USE_FIREBASE) return mockProducts.find(p => p.id === id) || null;
  return productService.getProduct(id);
}

export async function addProduct(data) {
  if (!USE_FIREBASE) {
    const id = 'prod-' + Date.now();
    mockProducts.push({ ...data, id });
    return id;
  }
  return productService.addProduct(data);
}

export async function updateProduct(id, data) {
  if (!USE_FIREBASE) {
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx >= 0) mockProducts[idx] = { ...mockProducts[idx], ...data };
    return;
  }
  return productService.updateProduct(id, data);
}

export async function deleteProduct(id) {
  if (!USE_FIREBASE) {
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx >= 0) mockProducts.splice(idx, 1);
    return;
  }
  return productService.deleteProduct(id);
}

export async function toggleProductAvailability(id, isAvailable) {
  if (!USE_FIREBASE) {
    const p = mockProducts.find(p => p.id === id);
    if (p) p.isAvailable = isAvailable;
    return;
  }
  return productService.toggleProductAvailability(id, isAvailable);
}

// ===== ORDERS =====

export async function createOrder(orderData) {
  if (!USE_FIREBASE) {
    const id = 'ord-' + Date.now();
    const order = {
      ...orderData,
      id,
      orderStatus: 'confirmed',
      statusHistory: [{ status: 'confirmed', timestamp: new Date().toISOString(), note: 'Order placed' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockOrders.unshift(order);
    // Decrement mock stock
    for (const item of orderData.items) {
      const product = mockProducts.find(p => p.id === item.productId);
      if (product) {
        product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
        if (product.stockQuantity === 0) product.isAvailable = false;
      }
    }
    return id;
  }
  return orderService.createOrder(orderData);
}

export async function getOrders(filters = {}) {
  if (!USE_FIREBASE) {
    let orders = [...mockOrders];
    if (filters.status && filters.status !== 'all') {
      orders = orders.filter(o => o.orderStatus === filters.status);
    }
    return orders;
  }
  return orderService.getOrders(filters);
}

export async function updateOrderStatus(id, newStatus, note = '') {
  if (!USE_FIREBASE) {
    const order = mockOrders.find(o => o.id === id);
    if (order) {
      order.orderStatus = newStatus;
      order.statusHistory.push({ status: newStatus, timestamp: new Date().toISOString(), note });
      order.updatedAt = new Date().toISOString();
    }
    return;
  }
  return orderService.updateOrderStatus(id, newStatus, note);
}

export async function getOrdersByUser(uid) {
  if (!USE_FIREBASE) return mockOrders.filter(o => o.userId === uid);
  return orderService.getOrdersByUser(uid);
}

// ===== CATEGORIES =====

export async function getCategories() {
  if (!USE_FIREBASE) return mockCategories;
  return categoryService.getCategories();
}

export async function getActiveCategories() {
  if (!USE_FIREBASE) return mockCategories.filter(c => c.isActive);
  const cats = await categoryService.getActiveCategories();
  if (cats.length === 0) return mockCategories.filter(c => c.isActive);
  return cats;
}

export async function addCategory(data) {
  if (!USE_FIREBASE) {
    const id = 'cat-' + Date.now();
    mockCategories.push({ ...data, id });
    return id;
  }
  return categoryService.addCategory(data);
}

export async function updateCategory(id, data) {
  if (!USE_FIREBASE) {
    const idx = mockCategories.findIndex(c => c.id === id);
    if (idx >= 0) mockCategories[idx] = { ...mockCategories[idx], ...data };
    return;
  }
  return categoryService.updateCategory(id, data);
}

export async function deleteCategory(id) {
  if (!USE_FIREBASE) {
    const idx = mockCategories.findIndex(c => c.id === id);
    if (idx >= 0) mockCategories.splice(idx, 1);
    return;
  }
  return categoryService.deleteCategory(id);
}

// ===== CONFIG =====

export async function getConfig() {
  if (!USE_FIREBASE) return mockConfig;
  return configService.getConfig();
}

export async function updateConfig(data) {
  if (!USE_FIREBASE) {
    Object.assign(mockConfig, data);
    return;
  }
  return configService.updateConfig(data);
}
