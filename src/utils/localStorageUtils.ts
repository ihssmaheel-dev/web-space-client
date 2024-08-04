export function getLocalStorageValue<T>(key: string): T | null {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.warn('Error getting value from localStorage key “' + key + '”: ', error);
        return null;
    }
}