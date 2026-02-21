import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

/** Always use light theme; dark mode is disabled. */
function applyLightTheme() {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
}

export function ThemeProvider({ children }) {
    useEffect(() => {
        applyLightTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {}, resolvedTheme: 'light' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) return { theme: 'light', setTheme: () => {}, resolvedTheme: 'light' };
    return ctx;
}
