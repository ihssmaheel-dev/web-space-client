import { useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
    // Get the initial value from the localstorage or use the provided initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn('Error reading localStorage key “' + key + '”: ', error);
            return initialValue;
        }
    });

    // Function to set the value in localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.warn('Error setting localStorage key “' + key + '”: ', error);
        }
    };

    // Function to remove the value in localStorage
    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.warn('Error removing localStorage key “' + key + '”: ', error);
        }
    };

    // Function to getSize of the stored value
    const getSize = () => {
        try {
            const bytes = JSON.stringify(window.localStorage.getItem(key)).length;
            const sizeInMB = bytes / (1024 * 1024);

            return sizeInMB.toFixed(5);
        } catch (error) {
            console.warn('Error getting size of localStorage key “' + key + '”: ', error);
            return 0;
        }
    }

    return [storedValue, setValue, removeValue, getSize] as const;
}


export default useLocalStorage;