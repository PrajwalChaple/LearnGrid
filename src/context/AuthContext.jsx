import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logoutUser,
    subscribeToAuthChanges,
    resetPassword
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
        // New user — profile won't exist yet
        setUserProfile(null);
        return { success: true, user: u };
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
    };

    const forgotPassword = async (email) => {
        setAuthError(null);
        const { success, error } = await resetPassword(email);
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
        refreshProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
