import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Compress an image file client-side before upload.
 * Max width 800px, quality ~0.7, output as JPEG.
 */
export function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                type: 'image/jpeg'
              }));
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image to Firebase Storage with compression.
 * Returns the download URL.
 */
export async function uploadImage(file, path) {
  const compressed = await compressImage(file);
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, compressed, {
    contentType: 'image/jpeg'
  });
  return getDownloadURL(snapshot.ref);
}

/**
 * Upload a product image.
 * Path: products/{productId}/{filename}
 */
export async function uploadProductImage(file, productId) {
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const path = `products/${productId}/${filename}`;
  return uploadImage(file, path);
}

/**
 * Upload a category image.
 */
export async function uploadCategoryImage(file, categoryId) {
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const path = `categories/${categoryId}/${filename}`;
  return uploadImage(file, path);
}

/**
 * Delete an image from Firebase Storage by URL.
 */
export async function deleteImage(url) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('Failed to delete image:', err);
  }
}
