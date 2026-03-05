import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DEFAULT_CONFIG } from '../config/constants';

const CONFIG_DOC = doc(db, 'config', 'settings');

export async function getConfig() {
  const docSnap = await getDoc(CONFIG_DOC);
  if (!docSnap.exists()) {
    // Initialize with defaults if not present
    await setDoc(CONFIG_DOC, { ...DEFAULT_CONFIG, updatedAt: serverTimestamp() });
    return DEFAULT_CONFIG;
  }
  return docSnap.data();
}

export async function updateConfig(configData) {
  await setDoc(CONFIG_DOC, {
    ...configData,
    updatedAt: serverTimestamp()
  }, { merge: true });
}
