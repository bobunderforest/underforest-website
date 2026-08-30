import { useCallback, useEffect, useRef, useState } from 'react'
import { useResizeObserver } from 'utils/hooks/useResizeObserver'

type Size = { width: number; height: number }

const EMPTY_SIZE: Size = { width: 0, height: 0 }

const changedEnough = (a: number, b: number) => Math.abs(a - b) > 0.5

export const useElementSize = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<Size>(EMPTY_SIZE)
  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    setSize((prev) =>
      changedEnough(prev.width, width) || changedEnough(prev.height, height)
        ? { width, height }
        : prev,
    )
  }, [])
  useResizeObserver(ref, measure)
  useEffect(() => {
    document.fonts?.ready.then(measure)
  }, [measure])
  return { ref, ...size }
}
