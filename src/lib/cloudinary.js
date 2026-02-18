/**
 * Cloudinary PDF Upload Helper
 * Uses unsigned upload (no server needed) — free tier: 25 credits/month
 *
 * Setup:
 * 1. Sign up at https://cloudinary.com (free, no credit card)
 * 2. Go to Settings → Upload → Add upload preset
 * 3. Set "Signing Mode" to "Unsigned"
 * 4. Copy the preset name and your cloud name below
 */

const CLOUD_NAME = 'dkppiv7lx';
const UPLOAD_PRESET = 'learngrid_notes';

/**
 * Uploads a PDF to Cloudinary via unsigned upload.
 *
 * @param {File} file - The PDF file
 * @param {string} userId - Uploader's UID (used as folder path)
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(file, userId) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `learngrid/notes/${userId}`);
    formData.append('resource_type', 'raw'); // Required for PDFs

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
        { method: 'POST', body: formData }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `Upload failed (${response.status})`);
    }

    const data = await response.json();
    return {
        url: data.secure_url,
        publicId: data.public_id,
    };
}

/**
 * Deletes a file from Cloudinary.
 * Note: Deletion from client requires signed requests (API secret).
 * For now we skip client-side deletion — files can be cleaned up
 * from the Cloudinary dashboard or via a server function later.
 */
export async function deleteFromCloudinary(publicId) {
    // Client-side deletion requires API secret (not safe to expose)
    // Files will remain in Cloudinary until manually cleaned up
    console.log('[Cloudinary] File deletion requires server-side API. PublicId:', publicId);
}
