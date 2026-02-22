import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logoutUser,
    subscribeToAuthChanges,
    resetPassword,
    resendVerificationEmail
} from '../auth';
import { formatErrorMessage } from '../ui';
import { getUserProfile } from '../lib/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    const isOnboarded = !!(userProfile && userProfile.roleType);

    // Fetch Firestore profile for a given Firebase user
    const fetchProfile = async (firebaseUser) => {
        if (!firebaseUser) {
            setUserProfile(null);
            return null;
        }
        try {
            const profile = await getUserProfile(firebaseUser.uid);
            setUserProfile(profile);
            return profile;
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setUserProfile(null);
            return null;
        }
    };

    // Allow components (e.g. Onboarding) to refresh the profile after saving
    const refreshProfile = async () => {
        if (user) {
            return await fetchProfile(user);
        }
        return null;
    };

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile(currentUser);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        setAuthError(null);
        const { user: u, error } = await loginWithEmail(email, password);
        if (error) {
            const msg = formatErrorMessage(error.code);
            setAuthError(msg);
            return { success: false, message: msg };
        }
        // Block unverified email/password users
        if (!u.emailVerified) {
            const msg = 'Please verify your email before logging in. Check your inbox for the verification link.';
            setAuthError(msg);
            return { success: false, message: msg, needsVerification: true };
        }
        await fetchProfile(u);
        return { success: true };
    };

    const register = async (userData) => {
        setAuthError(null);
        const { user: u, error } = await registerWithEmail(userData);
        if (error) {
            const msg = formatErrorMessage(error.code);
            setAuthError(msg);
            return { success: false, message: msg };
        }
        // New user — profile won't exist yet, verification email sent
        setUserProfile(null);
        return { success: true, user: u, needsVerification: true };
    };

    const resendVerification = async () => {
        const result = await resendVerificationEmail();
        if (result.success) {
            return { success: true };
        }
        return { success: false, message: formatErrorMessage(result.error?.code) || 'Failed to resend verification email' };
    };

    const loginGoogle = async () => {
        setAuthError(null);
        const { user: u, error } = await loginWithGoogle();
        if (error) {
            const msg = formatErrorMessage(error.code);
            setAuthError(msg);
            return { success: false, message: msg };
        }
        await fetchProfile(u);
        return { success: true };
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
        setUserProfile(null);
        // Redirect to login; use replace+push so back from login goes to landing in 1 step (not 2)
        if (typeof window !== 'undefined') {
            const base = window.location.pathname + window.location.search;
            const landingUrl = base + '#/';
            const loginUrl = base + '#/login';
            window.history.replaceState(null, '', landingUrl);
            window.history.pushState(null, '', loginUrl);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
    };

    const forgotPassword = async (email) => {
        setAuthError(null);
        const { error } = await resetPassword(email);
        if (error) {
            const msg = formatErrorMessage(error.code);
            setAuthError(msg);
            return { success: false, message: msg };
        }
        return { success: true };
    };

    const value = {
        user,
        userProfile,
        isOnboarded,
        loading,
        authError,
        login,
        register,
        loginGoogle,
        logout,
        forgotPassword,
        refreshProfile,
        resendVerification
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 text-sm">Loading...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
