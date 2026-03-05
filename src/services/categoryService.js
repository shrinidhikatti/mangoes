import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'categories';

export async function getCategories() {
  const q = query(collection(db, COLLECTION), orderBy('sortOrder', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getActiveCategories() {
  const q = query(collection(db, COLLECTION), orderBy('sortOrder', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(cat => cat.isActive);
}

export async function addCategory(categoryData) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...categoryData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateCategory(id, categoryData) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, categoryData);
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
