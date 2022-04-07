import { useState } from 'react'

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setLocalStorage = (value: T | ((oldValue: T) => void)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore as T)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (exception) {
      console.error(exception)
    }
  }

  return [storedValue, setLocalStorage] as const
}
