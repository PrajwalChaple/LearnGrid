import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Uploads a PDF file to Firebase Cloud Storage.
 * Path: notes/{userId}/{timestamp}_{filename}
 *
 * @param {File} file - The PDF file object
 * @param {string} userId - The uploader's UID
 * @returns {Promise<string>} - The public download URL
 */
export async function uploadPDF(file, userId) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `notes/${userId}/${Date.now()}_${safeName}`;
    const storageRef = ref(storage, path);

    const snapshot = await uploadBytes(storageRef, file, {
        contentType: 'application/pdf',
    });

    return await getDownloadURL(snapshot.ref);
}

/**
 * Deletes a PDF from Firebase Storage using its download URL.
 *
 * @param {string} url - The download URL of the file
 */
export async function deletePDF(url) {
    if (!url) return;
    try {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
    } catch (err) {
        // File may already be deleted or URL invalid — log but don't throw
        console.warn('Could not delete file from storage:', err.message);
    }
}
