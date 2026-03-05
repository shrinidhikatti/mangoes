import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, runTransaction
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'products';

export async function getProducts() {
  const q = query(collection(db, COLLECTION), orderBy('sortOrder', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProductsByCategory(category) {
  const q = query(
    collection(db, COLLECTION),
    where('category', '==', category),
    orderBy('sortOrder', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getAvailableProducts() {
  const q = query(
    collection(db, COLLECTION),
    where('isAvailable', '==', true),
    orderBy('sortOrder', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProduct(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

export async function addProduct(productData) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateProduct(id, productData) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...productData,
    updatedAt: serverTimestamp()
  });
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function toggleProductAvailability(id, isAvailable) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { isAvailable, updatedAt: serverTimestamp() });
}

export async function decrementStock(productId, quantity) {
  const docRef = doc(db, COLLECTION, productId);
  await runTransaction(db, async (transaction) => {
    const productDoc = await transaction.get(docRef);
    if (!productDoc.exists()) {
      throw new Error('Product does not exist');
    }
    const currentStock = productDoc.data().stockQuantity;
    if (currentStock < quantity) {
      throw new Error(`Insufficient stock. Available: ${currentStock}, Requested: ${quantity}`);
    }
    const newStock = currentStock - quantity;
    transaction.update(docRef, {
      stockQuantity: newStock,
      isAvailable: newStock > 0,
      updatedAt: serverTimestamp()
    });
  });
}
