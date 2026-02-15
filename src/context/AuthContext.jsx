import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Initialize user from localStorage if available, or default to null (or a demo user if you prefer)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('learngrid_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('learngrid_users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('learngrid_user', JSON.stringify(foundUser));
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('learngrid_users') || '[]');
        const existingUser = users.find(u => u.email === userData.email);

        if (existingUser) {
            return { success: false, message: 'User already exists' };
        }

        const newUser = { ...userData, id: Date.now() };
        users.push(newUser);
        localStorage.setItem('learngrid_users', JSON.stringify(users));

        setUser(newUser);
        localStorage.setItem('learngrid_user', JSON.stringify(newUser));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('learngrid_user');
    };

    // For demo purposes, we can set a default user if none exists, 
    // but for "Register" to work as expected, we should start empty or respect the registration.
    // However, the prompt implies they want to see the name they registered with.

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
