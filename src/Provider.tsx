import React from 'react';
import { ThemeProvider } from './contexts/ThemeContexts';
import { ToastProvider } from './contexts/ToastContexts';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </ThemeProvider>
    );
};

export default Providers;
