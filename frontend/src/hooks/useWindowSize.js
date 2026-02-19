// frontend/src/hooks/useWindowSize.js
// Window dimension and responsive breakpoint hooks

import { useState, useEffect, useCallback } from 'react';

const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

/**
 * Returns the current window dimensions.
 * Updates on window resize with a debounced handler.
 *
 * @returns {{ width: number, height: number }}
 */
export const useWindowSize = () => {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        let timer;
        const handleResize = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                setSize({ width: window.innerWidth, height: window.innerHeight });
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);

    return size;
};

/**
 * Returns an object of Tailwind-like breakpoint booleans.
 *
 * @returns {{ isSm: boolean, isMd: boolean, isLg: boolean, isXl: boolean, is2xl: boolean, isMobile: boolean, isTablet: boolean, isDesktop: boolean }}
 */
export const useBreakpoint = () => {
    const { width } = useWindowSize();

    return {
        isSm: width >= BREAKPOINTS.sm,
        isMd: width >= BREAKPOINTS.md,
        isLg: width >= BREAKPOINTS.lg,
        isXl: width >= BREAKPOINTS.xl,
        is2xl: width >= BREAKPOINTS['2xl'],
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg,
        width,
    };
};

/**
 * Returns true if the viewport matches a CSS media query.
 * @param {string} query - e.g. "(min-width: 768px)"
 * @returns {boolean}
 */
export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        const mql = window.matchMedia(query);
        const handleChange = (e) => setMatches(e.matches);

        mql.addEventListener('change', handleChange);
        return () => mql.removeEventListener('change', handleChange);
    }, [query]);

    return matches;
};

/**
 * Returns the current active Tailwind-like breakpoint name.
 * @returns {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'}
 */
export const useActiveBreakpoint = () => {
    const { width } = useWindowSize();

    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
};

/**
 * Returns true when the viewport is portrait orientation.
 */
export const useIsPortrait = () => {
    const { width, height } = useWindowSize();
    return height >= width;
};

export default useWindowSize;
