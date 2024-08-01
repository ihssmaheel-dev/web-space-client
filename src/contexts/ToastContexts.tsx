import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

interface ToastContextProps {
    showToast: (severity: 'success' | 'info' | 'warn' | 'error' | undefined, message: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const toastRef = useRef<Toast>(null);

    const showToast = (severity: 'success' | 'info' | 'warn' | 'error' | undefined, message: string) => {
        if (toastRef.current) {
            toastRef.current.show({ severity, detail: message, life: 3000 });
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            <Toast ref={toastRef} />
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextProps => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
