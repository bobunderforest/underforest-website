import { useCallback, useRef } from 'react'
import { jumpLenisTo, scrollLenisTo } from 'utils/anim/lenis'
import { getScrollPosition } from 'utils/browser/scroll-util'
import { clamp } from 'utils/math/clamp'
import { useIsomorphicLayoutEffect } from 'utils/hooks/useIsomorphicLayoutEffect'

type ElementScrollOptions = {
  duration: number
}

type StableCollapseOptions = {
  expanded: boolean
  onCollapseComplete: () => void
}

type HeightValue = {
  height?: string | number
}

const animationHeight = (definition: unknown) =>
  typeof definition === 'object' &&
  definition !== null &&
  'height' in definition
    ? definition.height
    : undefined

export const scrollElementToViewportCenter = (
  element: HTMLElement,
  { duration }: ElementScrollOptions,
) => {
  const bounds = element.getBoundingClientRect()
  const elementCenterY = bounds.top + bounds.height / 2
  const viewportCenterY = window.innerHeight / 2
  scrollLenisTo(getScrollPosition() + elementCenterY - viewportCenterY, {
    duration,
  })
}

export const useStableHeightCollapseScroll = ({
  expanded,
  onCollapseComplete,
}: StableCollapseOptions) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const expandedAtScrollYRef = useRef<number | null>(null)
  const collapseStartRef = useRef<{
    height: number
    scrollY: number
    correction: number
  } | null>(null)

  const captureCollapseStart = useCallback(() => {
    if (collapseStartRef.current) return
    const panel = panelRef.current
    if (!panel) return

    const bounds = panel.getBoundingClientRect()
    const scrollY = getScrollPosition()
    const expandedAtScrollY = expandedAtScrollYRef.current ?? scrollY
    collapseStartRef.current = {
      height: bounds.height,
      scrollY,
      correction: clamp(scrollY - expandedAtScrollY, 0, bounds.height),
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (!expanded) captureCollapseStart()
  }, [expanded, captureCollapseStart])

  const handleAnimationStart = useCallback(
    (definition: unknown) => {
      const height = animationHeight(definition)
      if (height === 0) captureCollapseStart()
      else if (!collapseStartRef.current)
        expandedAtScrollYRef.current = getScrollPosition()
    },
    [captureCollapseStart],
  )

  const handleAnimationUpdate = useCallback((latest: HeightValue) => {
    const collapseStart = collapseStartRef.current
    if (!collapseStart) return

    const currentHeight =
      typeof latest.height === 'number'
        ? latest.height
        : (panelRef.current?.getBoundingClientRect().height ?? 0)
    const collapsedHeight = collapseStart.height - currentHeight
    const collapsedFraction =
      collapseStart.height > 0 ? collapsedHeight / collapseStart.height : 1
    jumpLenisTo(
      collapseStart.scrollY - collapseStart.correction * collapsedFraction,
    )
  }, [])

  const handleAnimationComplete = useCallback(
    (definition: unknown) => {
      const height = animationHeight(definition)
      collapseStartRef.current = null
      if (height !== 0) return
      expandedAtScrollYRef.current = null
      onCollapseComplete()
    },
    [onCollapseComplete],
  )

  return {
    panelRef,
    captureCollapseStart,
    handleAnimationStart,
    handleAnimationUpdate,
    handleAnimationComplete,
  }
}
