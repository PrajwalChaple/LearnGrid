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

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        setAuthError(null);
        const { user, error } = await loginWithEmail(email, password);
        if (error) {
            const msg = formatErrorMessage(error.code);
            setAuthError(msg);
            return { success: false, message: msg };
        }
        return { success: true };
    };

    const register = async (userData) => {
        setAuthError(null);
        const { user, error } = await registerWithEmail(userData); // expects { email, password, name }
        if (error) {
            const msg = formatErrorMessage(error.code);
            setAuthError(msg);
            return { success: false, message: msg };
        }
        return { success: true, user };
    };

    const loginGoogle = async () => {
        setAuthError(null);
        const { user, error } = await loginWithGoogle();
        if (error) {
            const msg = formatErrorMessage(error.code);
            setAuthError(msg);
            return { success: false, message: msg };
        }
        return { success: true };
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
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
        loading,
        authError,
        login,
        register,
        loginGoogle,
        logout,
        forgotPassword
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
