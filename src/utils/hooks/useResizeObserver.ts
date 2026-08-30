import { useEffect } from 'react'
import { debounce } from 'utils/primitives/debounce'

export const useResizeObserver = (
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  { initCall = true }: { initCall?: boolean } = {},
) => {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const debounced = debounce(callback, 100)

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(debounced)
    })

    resizeObserver.observe(el)

    if (initCall) callback()

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref, callback, initCall])
}
