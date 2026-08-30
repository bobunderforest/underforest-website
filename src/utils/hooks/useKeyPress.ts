import { useEffect, useRef } from 'react'

export const useKeyPress = (
  key: string,
  callback: (e: KeyboardEvent) => void,
) => {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === key) callbackRef.current(e)
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
    }
  }, [key])
}
