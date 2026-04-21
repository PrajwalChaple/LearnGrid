// ============================================================
// 🔒 FIREBASE AUTH VERIFICATION — Server-Side Helper
// ============================================================
// Shared utility for API routes to verify Firebase ID tokens.
// This ensures only authenticated LearnGrid users can call
// the AI proxy endpoints.
// ============================================================

import admin from 'firebase-admin';

// Initialize Firebase Admin (singleton — safe to call multiple times)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Vercel stores multi-line env vars with escaped newlines
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

/**
 * Verify the Firebase ID token from the Authorization header.
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<{uid: string, email: string}|null>} Decoded token or null
 */
export async function verifyAuth(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) return null;

    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        return { uid: decoded.uid, email: decoded.email || '' };
    } catch (error) {
        console.error('[Auth] Token verification failed:', error.message);
        return null;
    }
}
