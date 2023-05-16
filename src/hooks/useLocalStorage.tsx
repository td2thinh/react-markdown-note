import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
    const [value, setValue] = useState<T>(() => {
        const valueInLocalStorage = localStorage.getItem(key)
        if (valueInLocalStorage) {
            return JSON.parse(valueInLocalStorage)
        }
        else {
            if (typeof initialValue === 'function') {
                return (initialValue as () => T)();
            }
            else {
                return initialValue
            }
        }
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue] as [T, typeof setValue]
}

