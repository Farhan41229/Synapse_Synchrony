// frontend/src/hooks/useLocalStorage.js
// Local storage hooks with JSON serialization and cross-tab sync

import { useState, useEffect, useCallback } from 'react';

/**
 * A useState-like hook that persists state in localStorage.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if nothing is stored
 * @returns {[*, Function, Function]} [value, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme, clearTheme] = useLocalStorage('theme', 'dark');
 */
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item !== null ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (err) {
                console.error(`[useLocalStorage] Failed to set key "${key}":`, err);
            }
        },
        [key, storedValue]
    );

    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            window.localStorage.removeItem(key);
        } catch {
            // Ignore
        }
    }, [key, initialValue]);

    // Sync across tabs using the storage event
    useEffect(() => {
        const handleStorageEvent = (event) => {
            if (event.key !== key || event.storageArea !== window.localStorage) return;
            try {
                const newVal = event.newValue != null ? JSON.parse(event.newValue) : initialValue;
                setStoredValue(newVal);
            } catch {
                setStoredValue(initialValue);
            }
        };

        window.addEventListener('storage', handleStorageEvent);
        return () => window.removeEventListener('storage', handleStorageEvent);
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};

/**
 * Session storage hook — same API as useLocalStorage but uses sessionStorage.
 *
 * @param {string} key
 * @param {*} initialValue
 * @returns {[*, Function, Function]}
 */
export const useSessionStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item !== null ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            } catch {
                // Ignore
            }
        },
        [key, storedValue]
    );

    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            window.sessionStorage.removeItem(key);
        } catch {
            // Ignore
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};

/**
 * Read-only hook to check if a localStorage key exists.
 * @param {string} key
 */
export const useLocalStorageExists = (key) => {
    const [exists, setExists] = useState(() =>
        window.localStorage.getItem(key) !== null
    );

    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === key) setExists(e.newValue !== null);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [key]);

    return exists;
};

export default useLocalStorage;
