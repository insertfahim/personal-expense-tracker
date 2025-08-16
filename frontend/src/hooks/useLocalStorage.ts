import { useState, useEffect } from "react";

interface UseLocalStorageReturn<T> {
    value: T;
    setValue: (value: T) => void;
    removeValue: () => void;
}

function useLocalStorage<T>(
    key: string,
    initialValue: T
): UseLocalStorageReturn<T> {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = (value: T) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    const removeValue = () => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== "undefined") {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    };

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            const parsedItem = item ? JSON.parse(item) : initialValue;
            setStoredValue(parsedItem);
        } catch (error) {
            // If error also return initialValue
            console.error(`Error reading localStorage key "${key}":`, error);
            setStoredValue(initialValue);
        }
    }, [key, initialValue]);

    return { value: storedValue, setValue, removeValue };
}

export default useLocalStorage;
