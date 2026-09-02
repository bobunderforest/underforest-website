import { useCallback, useEffect, useState } from 'react'
import { prefersReducedMotion } from 'utils/browser/prefers-reduced-motion'

const STORAGE_KEY = 'underforest:booted'
const LINE_INTERVAL_MS = 190
const HOLD_MS = 620
const REDUCED_HOLD_MS = 320

const wasBooted = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return true
  }
}

const rememberBooted = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {}
}

export const useBootSequence = (lineCount: number) => {
  const [reduced] = useState(prefersReducedMotion)
  const [active, setActive] = useState(() => !wasBooted())
  const [revealed, setRevealed] = useState(() => (reduced ? lineCount : 0))

  const finish = useCallback(() => setActive(false), [])

  useEffect(() => {
    if (active) rememberBooted()
  }, [active])

  useEffect(() => {
    if (!active) return

    if (reduced) {
      const timeout = window.setTimeout(finish, REDUCED_HOLD_MS)
      return () => window.clearTimeout(timeout)
    }

    const isComplete = revealed >= lineCount
    const timeout = window.setTimeout(
      () => (isComplete ? finish() : setRevealed((count) => count + 1)),
      isComplete ? HOLD_MS : LINE_INTERVAL_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [active, reduced, revealed, lineCount, finish])

  return { active, revealed, finish }
}
