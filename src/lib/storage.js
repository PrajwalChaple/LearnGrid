import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Upload user avatar image to Storage and return the public URL.
 * @param {string} uid - User ID
 * @param {File} file - Image file (e.g. from input type="file")
 * @returns {Promise<string>} Download URL for the uploaded image
 */
export async function uploadUserAvatar(uid, file) {
  const path = `users/${uid}/avatar_${Date.now()}.jpg`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type || 'image/jpeg' });
  return getDownloadURL(storageRef);
}
