import { auth } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification
} from 'firebase/auth';

// --- Authentication Logic ---

const actionCodeSettings = {
    // Redirect to onboarding page after verification
    url: `${window.location.origin}/#/onboarding`,
    handleCodeInApp: true,
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
        const userCredential = await signInWithPopup(auth, provider);
        return { user: userCredential.user, error: null };
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
