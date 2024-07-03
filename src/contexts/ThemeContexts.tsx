import React, { createContext, useState, ReactNode } from 'react';

export interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState('theme-dark');

    const toggleTheme = () => {
        const newTheme = theme === 'theme-light' ? 'theme-dark' : 'theme-light';
        setTheme(newTheme);

        const link = document.getElementById('app-theme') as HTMLLinkElement;
        if (link) {
            link.href = newTheme === 'theme-light'
                ? '/themes/lara-light-blue/theme.css'
                : '/themes/lara-dark-blue/theme.css';
        }

        const body = document.getElementById("body") as HTMLBodyElement;
        if(body) {
            body.classList.add(newTheme === 'theme-light' ? 'bg-gray-100' : 'bg-gray-900');
            body.classList.remove(newTheme === 'theme-light' ? 'bg-gray-900' : 'bg-gray-100');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
