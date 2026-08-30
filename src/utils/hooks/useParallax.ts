import { useRef, type RefObject } from 'react'
import { useScroll, useTransform } from 'framer-motion'

type Options = {
  clampToBounds?: boolean
  containerRef?: RefObject<HTMLDivElement | null>
}

export const useParallax = (
  speed = 0.5,
  { clampToBounds = false, containerRef: sharedContainerRef }: Options = {},
) => {
  const ownContainerRef = useRef<HTMLDivElement | null>(null)
  const containerRef = sharedContainerRef ?? ownContainerRef
  const layerRef = useRef<HTMLDivElement | null>(null)

  const { scrollY } = useScroll()

  const y = useTransform(() => {
    scrollY.get()

    const container = containerRef.current
    if (!container) return 0

    const { top } = container.getBoundingClientRect()
    let offset = top * -speed

    const layer = layerRef.current
    if (clampToBounds && layer) {
      const maxDown = -layer.offsetTop
      const maxUp =
        container.offsetHeight - (layer.offsetTop + layer.offsetHeight)
      offset = Math.min(maxDown, Math.max(maxUp, offset))
    }

    return offset
  })

  return { containerRef, layerRef, y }
}
