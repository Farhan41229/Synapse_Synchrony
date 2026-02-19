// frontend/src/hooks/useDebounce.js
// Collection of debounce-related custom React hooks

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Returns a debounced version of the given value.
 * Updates only after the value stops changing for `delay` ms.
 *
 * @param {*} value
 * @param {number} [delay]
 * @returns {*} debouncedValue
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 400);
 */
export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Returns a debounced version of a callback function.
 * The function is re-created only when dependencies change.
 *
 * @param {Function} fn
 * @param {number} [delay]
 * @param {Array} [deps]
 * @returns {Function} debouncedCallback
 */
export const useDebouncedCallback = (fn, delay = 300, deps = []) => {
    const timerRef = useRef(null);

    const debounced = useCallback(
        (...args) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                fn(...args);
            }, delay);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [delay, ...deps]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return debounced;
};

/**
 * Throttle a callback: only invoke it at most once per `limit` ms.
 *
 * @param {Function} fn
 * @param {number} [limit]
 * @param {Array} [deps]
 * @returns {Function} throttledCallback
 */
export const useThrottle = (fn, limit = 300, deps = []) => {
    const lastCalledRef = useRef(0);
    const timerRef = useRef(null);

    const throttled = useCallback(
        (...args) => {
            const now = Date.now();
            const remaining = limit - (now - lastCalledRef.current);

            if (remaining <= 0) {
                if (timerRef.current) clearTimeout(timerRef.current);
                lastCalledRef.current = now;
                fn(...args);
            } else if (!timerRef.current) {
                timerRef.current = setTimeout(() => {
                    lastCalledRef.current = Date.now();
                    timerRef.current = null;
                    fn(...args);
                }, remaining);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [limit, ...deps]
    );

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return throttled;
};

/**
 * Debounced search state — combines input state and debounced value.
 *
 * @param {string} [initial]
 * @param {number} [delay]
 * @returns {{ searchTerm: string, debouncedTerm: string, setSearchTerm: Function, clearSearch: Function }}
 */
export const useDebouncedSearch = (initial = '', delay = 400) => {
    const [searchTerm, setSearchTerm] = useState(initial);
    const debouncedTerm = useDebounce(searchTerm, delay);

    const clearSearch = useCallback(() => setSearchTerm(''), []);

    return { searchTerm, debouncedTerm, setSearchTerm, clearSearch };
};

export default useDebounce;
