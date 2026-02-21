/**
 * Cloudinary Upload Helper
 * Uses unsigned upload preset for PDF uploads.
 *
 * Cloud Name: dkppiv7ix
 * Upload Preset: learngrid_notes (Unsigned)
 *
 * IMPORTANT: In Cloudinary Security Settings, enable "PDF and ZIP files delivery"
 */

const CLOUD_NAME = 'dkppiv7lx';
const UPLOAD_PRESET = 'learngrid_notes';
/** Create in Cloudinary: Settings → Upload → Add upload preset → Unsigned, name: learngrid_profilepicture */
const UPLOAD_PRESET_PROFILE = 'learngrid_profilepicture';

/**
 * Uploads a file to Cloudinary using unsigned upload.
 *
 * @param {File} file - The file to upload
 * @param {string} userId - Used as folder context
 * @returns {Promise<{ url: string, publicId: string, downloadUrl: string }>}
 */
export async function uploadToCloudinary(file, userId) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `learngrid/notes/${userId}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Cloudinary upload failed: ${response.status} - ${errBody}`);
        }

        const result = await response.json();

        return {
            url: result.secure_url,
            publicId: result.public_id,
            downloadUrl: result.secure_url,
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

/**
 * Uploads a user profile picture to Cloudinary in folder: learngrid/profilepicture
 * Uses a separate upload preset so uploads do not go to the notes folder.
 *
 * @param {File} file - Image file (e.g. from input type="file", accept="image/*")
 * @param {string} userId - User ID (for unique public_id)
 * @returns {Promise<string>} Secure URL of the uploaded image
 */
export async function uploadProfilePictureToCloudinary(file, userId) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET_PROFILE);
    formData.append('folder', 'learngrid/profilepicture');
    formData.append('public_id', `user_${userId}_${Date.now()}`);

    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Cloudinary upload failed: ${response.status} - ${errBody}`);
    }

    const result = await response.json();
    return result.secure_url;
}

/**
 * Delete a file from Cloudinary (requires signed request — skipped for unsigned preset).
 * For cleanup, use Cloudinary dashboard or Admin API from a backend.
 */
export async function deleteFromCloudinary(publicId) {
    if (!publicId) return;
    // Unsigned uploads cannot delete via client-side API.
    // Use Cloudinary dashboard for manual cleanup.
    console.log('[Cloudinary] Delete requires Admin API. Use dashboard to remove:', publicId);
}

