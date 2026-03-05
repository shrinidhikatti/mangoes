import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp, limit, startAfter
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { decrementStock } from './productService';

const COLLECTION = 'orders';

export async function createOrder(orderData) {
  // Decrement stock for each item before creating order
  for (const item of orderData.items) {
    await decrementStock(item.productId, item.quantity);
  }

  const docRef = await addDoc(collection(db, COLLECTION), {
    ...orderData,
    statusHistory: [
      { status: 'confirmed', timestamp: new Date().toISOString(), note: 'Order placed' }
    ],
    orderStatus: 'confirmed',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return docRef.id;
}

export async function getOrders(filters = {}) {
  let q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));

  if (filters.status && filters.status !== 'all') {
    q = query(
      collection(db, COLLECTION),
      where('orderStatus', '==', filters.status),
      orderBy('createdAt', 'desc')
    );
  }

  if (filters.limit) {
    q = query(q, limit(filters.limit));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getOrder(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

export async function updateOrderStatus(id, newStatus, note = '') {
  const docRef = doc(db, COLLECTION, id);
  const orderDoc = await getDoc(docRef);

  if (!orderDoc.exists()) throw new Error('Order not found');

  const currentHistory = orderDoc.data().statusHistory || [];

  await updateDoc(docRef, {
    orderStatus: newStatus,
    statusHistory: [
      ...currentHistory,
      { status: newStatus, timestamp: new Date().toISOString(), note }
    ],
    updatedAt: serverTimestamp()
  });
}

export async function getTodayOrders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, COLLECTION),
    where('createdAt', '>=', today),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getOrdersByDateRange(startDate, endDate) {
  const q = query(
    collection(db, COLLECTION),
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
