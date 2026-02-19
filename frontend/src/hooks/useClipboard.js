// frontend/src/hooks/useClipboard.js
// Clipboard interaction hooks

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Copy text to the clipboard.
 * Returns { copied, copy, error }.
 *
 * @param {number} [resetDelay] - ms before `copied` resets to false
 *
 * @example
 * const { copy, copied } = useClipboard();
 * <button onClick={() => copy('hello')}>
 *   {copied ? 'Copied!' : 'Copy'}
 * </button>
 */
export const useClipboard = (resetDelay = 2000) => {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);
    const timerRef = useRef(null);

    const copy = useCallback(
        async (text) => {
            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(text);
                } else {
                    // Fallback for older browsers
                    const el = document.createElement('textarea');
                    el.value = text;
                    el.setAttribute('readonly', '');
                    el.style.position = 'absolute';
                    el.style.left = '-9999px';
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                }

                setCopied(true);
                setError(null);

                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => setCopied(false), resetDelay);
            } catch (err) {
                setError(err);
                setCopied(false);
            }
        },
        [resetDelay]
    );

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return { copied, copy, error };
};

/**
 * Read text from the clipboard (requires user gesture + permission).
 *
 * @returns {{ read: () => Promise<string>, text: string|null, permission: string }}
 */
export const useClipboardRead = () => {
    const [text, setText] = useState(null);
    const [permission, setPermission] = useState('prompt');

    const read = useCallback(async () => {
        try {
            const content = await navigator.clipboard.readText();
            setText(content);
            setPermission('granted');
            return content;
        } catch {
            setPermission('denied');
            return null;
        }
    }, []);

    return { read, text, permission };
};

export default useClipboard;
