/**
 * Pinata IPFS Upload Helper
 * Replaces Cloudinary/Firebase with decentralized IPFS storage via Pinata.
 *
 * Benefits:
 * - Free 1GB storage
 * - No user login required (uses API Key)
 * - Public Gateway access
 *
 * Keys provided by user on 2026-02-20
 */

const PINATA_API_KEY = '758d05ae5329dc613cfa';
const PINATA_SECRET_KEY = '1289f97c1df5bfb4892658887e5197f58ca45edb0391fd6e4c2f6f93e6fef41b';

/**
 * Uploads a file to Pinata (IPFS).
 * Kept function name 'uploadToCloudinary' for compatibility with existing code.
 *
 * @param {File} file - The file to upload
 * @param {string} userId - (Unused in IPFS, but kept for signature)
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(file, userId) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    // Create FormData for Pinata
    const formData = new FormData();
    formData.append('file', file);

    // Optional metadata
    const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
            userId: userId,
            type: 'note'
        }
    });
    formData.append('pinataMetadata', metadata);

    // Optional options
    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Pinata upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        const ipfsHash = result.IpfsHash;

        // Construct Public Gateway URL
        // Using standard gateway.pinata.cloud
        const fileUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

        return {
            url: fileUrl,
            publicId: ipfsHash,
            downloadUrl: fileUrl // IPFS URLs are direct downloads essentially
        };
    } catch (error) {
        console.error('Error uploading to Pinata:', error);
        throw error;
    }
}

/**
 * Unpin (Delete) a file from Pinata.
 */
export async function deleteFromCloudinary(publicId) {
    if (!publicId) return;

    try {
        const url = `https://api.pinata.cloud/pinning/unpin/${publicId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY,
            },
        });
        console.log('[Pinata] File unpinned (deleted):', publicId);
    } catch (err) {
        console.error('[Pinata] Delete failed:', err);
    }
}
