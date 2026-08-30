import { useState } from 'react'
import { useInView } from 'framer-motion'

export const useIsVisible = <E extends HTMLElement>(
  ref: React.RefObject<E | null>,
) => {
  const [hasIntersected, setHasIntersected] = useState(false)
  const inView = useInView(ref)

  if (inView && !hasIntersected) setHasIntersected(true)

  return inView || !hasIntersected
}
