export function getLocalStorageValue<T>(key: string): T | null {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.warn('Error getting value from localStorage key “' + key + '”: ', error);
        return null;
    }
}

export function setLocalStorageValue(key: string, value: any) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('Error setting value in localStorage key “' + key + '”: ', error);
    }
}