import { useCallback, useMemo, useRef, useState } from 'react'
import {
  useInView,
  useScroll,
  type useScroll as UseScroll,
} from 'framer-motion'
import { getScrollPosition } from 'utils/browser/scroll-util'
import { useResizeObserver } from 'utils/hooks/useResizeObserver'

type ScrollOffset = Parameters<typeof UseScroll>[0] extends infer O
  ? O extends { offset?: infer F }
    ? F
    : never
  : never

type Options = {
  offset?: ScrollOffset
}

type Edge = 'start' | 'center' | 'end'

const edgeFraction: Record<Edge, number> = { start: 0, center: 0.5, end: 1 }

const edgePairs = (offsetKey: string) =>
  offsetKey.split(',').map((pair) => pair.split(' ') as [Edge, Edge])

export const useStickyScrollLayer = <T extends HTMLElement = HTMLDivElement>({
  offset = ['start end', 'end start'],
}: Options = {}) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<T>(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset })
  const inView = useInView(sectionRef)

  const [
    { viewportWidth, viewportHeight, contentHeight, sectionHeight },
    setSize,
  ] = useState({
    viewportWidth: 0,
    viewportHeight: 0,
    contentHeight: 0,
    sectionHeight: 0,
  })

  const offsetKey = String(offset)
  const edges = useMemo(() => edgePairs(offsetKey), [offsetKey])

  const scrollYAt = useCallback(
    (progress: number) => {
      const section = sectionRef.current
      if (!section) return null
      const sectionTop =
        section.getBoundingClientRect().top + getScrollPosition()
      const height = section.offsetHeight
      const viewport = window.innerHeight
      const [start, end] = edges.map(
        ([targetEdge, containerEdge]) =>
          sectionTop +
          edgeFraction[targetEdge] * height -
          edgeFraction[containerEdge] * viewport,
      )
      return start + progress * (end - start)
    },
    [edges],
  )

  const measure = useCallback(() => {
    setSize({
      viewportWidth: stageRef.current?.offsetWidth ?? 0,
      viewportHeight: stageRef.current?.offsetHeight ?? 0,
      contentHeight: contentRef.current?.offsetHeight ?? 0,
      sectionHeight: sectionRef.current?.offsetHeight ?? 0,
    })
  }, [])

  useResizeObserver(stageRef, measure)
  useResizeObserver(contentRef, measure, { initCall: false })
  useResizeObserver(sectionRef, measure, { initCall: false })

  return {
    sectionRef,
    stageRef,
    contentRef,
    scrollYProgress,
    inView,
    viewportWidth,
    viewportHeight,
    contentHeight,
    sectionHeight,
    measure,
    scrollYAt,
  }
}

export type StickyScrollLayer = ReturnType<typeof useStickyScrollLayer>
