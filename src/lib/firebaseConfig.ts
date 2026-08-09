import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyCOk3__UnHjvGFGx43oHKULxQXPpnQ2NyE",
  authDomain: "krishisetu-a42bb.firebaseapp.com",
  projectId: "krishisetu-a42bb",
  storageBucket: "krishisetu-a42bb.firebasestorage.app",
  messagingSenderId: "106050532437",
  appId: "1:106050532437:web:a4d9676c7aaf14b4a3d0dc",
  measurementId: "G-SH6CR13JQT"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export type StorageFolder = 'farmers' | 'sellers' | 'products' | 'documents';

/**
 * Uploads a base64 or data-URL encoded file to Firebase Storage
 * and returns the public download URL.
 */
export async function uploadFileToFirebase(
  base64DataUrl: string,
  folder: StorageFolder,
  fileName?: string
): Promise<string> {
  const timestamp = Date.now();
  const safeName = fileName ? fileName.replace(/[^a-zA-Z0-9.-]/g, '_') : `file_${timestamp}.jpg`;
  const storagePath = `${folder}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, storagePath);

  // Upload as data_url
  await uploadString(storageRef, base64DataUrl, 'data_url');
  
  // Get public download URL
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

/**
 * Deletes a file from Firebase Storage given its full URL or path
 */
export async function deleteFileFromFirebase(fileUrlOrPath: string): Promise<boolean> {
  try {
    const fileRef = ref(storage, fileUrlOrPath);
    await deleteObject(fileRef);
    return true;
  } catch (err) {
    console.error("Firebase Storage delete error:", err);
    return false;
  }
}
