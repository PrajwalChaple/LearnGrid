import { auth } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    reauthenticateWithPopup,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    unlink,
    deleteUser
} from 'firebase/auth';

// --- Authentication Logic ---

const actionCodeSettings = {
    // Redirect to onboarding page after verification
    url: `${window.location.origin}/onboarding`,
};

export const registerWithEmail = async ({ email, password, name }) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // Send verification email with redirect URL
        await sendEmailVerification(userCredential.user, actionCodeSettings);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error };
    }
};

export const resendVerificationEmail = async () => {
    try {
        if (auth.currentUser && !auth.currentUser.emailVerified) {
            await sendEmailVerification(auth.currentUser, actionCodeSettings);
            return { success: true, error: null };
        }
        return { success: false, error: { message: 'No user or already verified' } };
    } catch (error) {
        return { success: false, error };
    }
};

export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error };
    }
};

export const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/calendar.events');
        provider.setCustomParameters({ prompt: 'consent' }); // Force permission prompt

        const result = await signInWithPopup(auth, provider);

        // Save access token ONLY if calendar scope is actually granted
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        if (accessToken) {
            // Verify scopes via Google API
            try {
                const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
                const data = await response.json();

                if (data.scope && data.scope.includes('calendar')) {
                    sessionStorage.setItem('gcal_token', accessToken);
                    if (typeof window !== 'undefined') window.dispatchEvent(new Event('calendarConnectionChanged'));
                } else {
                    console.warn('[Auth] Calendar scope denied by user.');
                    sessionStorage.removeItem('gcal_token');
                    if (typeof window !== 'undefined') window.dispatchEvent(new Event('calendarConnectionChanged'));
                }
            } catch (err) {
                console.error('[Auth] Token verification failed:', err);
                // Fail safe: don't save token if verify fails
            }
        }

        return { user: result.user, accessToken, error: null };
    } catch (error) {
        return { user: null, error };
    }
};

export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
};

export const logoutUser = async () => {
    await signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};

/** Update Firebase Auth profile (e.g. displayName). Use for profile edit. */
export const updateAuthProfile = async (updates) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, updates);
};

/** Whether the current user has Google as a linked provider. */
export const isGoogleLinked = (user) => {
    if (!user || !user.providerData) return false;
    return user.providerData.some((p) => p.providerId === 'google.com');
};

/** Whether the current user has email/password (so they can change password or stay logged in after unlinking Google). */
export const hasEmailProvider = (user) => {
    if (!user || !user.providerData) return false;
    return user.providerData.some((p) => p.providerId === 'password');
};

/** Reauthenticate with email and password (required before sensitive actions). */
export const reauthenticateWithEmail = async (email, password) => {
    if (!auth.currentUser) return { success: false, error: { message: 'Not signed in' } };
    try {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
};

/** Change password (email users only). Requires current password. */
export const changePassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser) return { success: false, error: { message: 'Not signed in' } };
    if (!hasEmailProvider(auth.currentUser)) {
        return { success: false, error: { message: 'Password change is only for email accounts' } };
    }
    try {
        const email = auth.currentUser.email;
        const reauth = await reauthenticateWithEmail(email, currentPassword);
        if (!reauth.success) return reauth;
        await updatePassword(auth.currentUser, newPassword);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
};

/** Disconnect Google from account. User must have email/password to stay signed in. */
export const unlinkGoogle = async () => {
    if (!auth.currentUser) return { success: false, error: { message: 'Not signed in' } };
    if (!hasEmailProvider(auth.currentUser)) {
        return { success: false, error: { message: 'Add email/password in Account settings before disconnecting Google' } };
    }
    try {
        await unlink(auth.currentUser, 'google.com');
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('gcal_token');
            if (typeof window !== 'undefined') window.dispatchEvent(new Event('calendarConnectionChanged'));
        }
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
};

/** Permanently delete the current user's Firebase Auth account. Reauth required. */
export const deleteUserAccount = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, error: { message: 'Not signed in' } };
    try {
        // Handle Google users requiring popup reauth
        if (isGoogleLinked(user)) {
            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(user, provider);
        }
        await deleteUser(user);
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('gcal_token');
            if (typeof window !== 'undefined') window.dispatchEvent(new Event('calendarConnectionChanged'));
        }
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
};
