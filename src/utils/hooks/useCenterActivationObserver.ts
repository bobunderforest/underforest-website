import { useEffect } from 'react'
import { useResponsiveValue } from 'utils/hooks/useResponsiveValue'
import { useWindowSize } from 'utils/hooks/useWindowSize'

const centerActivationEnabled = {
  desktop: true,
  'mobile-m': false,
}

export const useCenterActivationEnabled = () =>
  useResponsiveValue(centerActivationEnabled)

export const useCenterActivationObserver = <E extends HTMLElement>(
  ref: React.RefObject<E | null>,
  onChange: (inView: boolean) => void,
) => {
  const { height: viewportHeight } = useWindowSize()
  const enabled = useCenterActivationEnabled()

  useEffect(() => {
    if (!enabled) return
    const node = ref.current
    if (!node) return

    const activationAreaHeight = Math.max(viewportHeight * 0.04, 1)
    const verticalMargin = Math.max(
      (viewportHeight - activationAreaHeight) / 2,
      0,
    )
    const observer = new IntersectionObserver(
      ([intersection]) => onChange(intersection.isIntersecting),
      { rootMargin: `-${verticalMargin}px 0px` },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [onChange, ref, viewportHeight, enabled])
}
