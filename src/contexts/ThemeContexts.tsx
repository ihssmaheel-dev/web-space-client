import React, { createContext, useState, ReactNode } from 'react';

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState('theme-dark');

    const toggleTheme = () => {
        const newTheme = theme === 'theme-light' ? 'theme-dark' : 'theme-light';
        console.log(newTheme);
        
        setTheme(newTheme);

        const link = document.getElementById('app-theme') as HTMLLinkElement;
        if (link) {
            link.href = newTheme === 'theme-light'
                ? '/themes/lara-light-blue/theme.css'
                : '/themes/lara-dark-blue/theme.css';
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
