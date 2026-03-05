import { CURRENCY_SYMBOL } from '../config/constants';

export function formatPrice(amount) {
  return `${CURRENCY_SYMBOL}${Number(amount).toLocaleString('en-IN')}`;
}

export function generateOrderNumber() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${dateStr}-${random}`;
}

export function getEstimatedDeliveryDate(cutoffTime = '20:00') {
  const now = new Date();
  const [cutoffHour, cutoffMin] = cutoffTime.split(':').map(Number);
  const cutoff = new Date(now);
  cutoff.setHours(cutoffHour, cutoffMin, 0, 0);

  const deliveryDate = new Date(now);
  if (now < cutoff) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  } else {
    deliveryDate.setDate(deliveryDate.getDate() + 2);
  }

  return deliveryDate;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateShort(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function calculateDeliveryCharge(subtotal, config) {
  if (subtotal >= config.deliveryCharges.freeAbove) return 0;
  return config.deliveryCharges.flatRate;
}

export function isProductInSeason(product) {
  if (!product.seasonStart || !product.seasonEnd) return true;
  const now = new Date();
  const start = new Date(product.seasonStart);
  const end = new Date(product.seasonEnd);
  return now >= start && now <= end;
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
