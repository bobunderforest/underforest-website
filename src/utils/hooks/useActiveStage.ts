import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { sectionAnchorsChanged } from 'utils/anim/section-anchors'
import { getScrollPosition } from 'utils/browser/scroll-util'
import { debounce } from 'utils/primitives/debounce'

const REMEASURE_DELAY = 150
const FOCUS_RATIO = 0.5

type StageRange = { stage: string; top: number; bottom: number }

type StageFrame = { ranges: StageRange[]; focusOffset: number }

const EMPTY_FRAME: StageFrame = { ranges: [], focusOffset: 0 }

const measureStages = (): StageFrame => {
  const scroll = getScrollPosition()
  const ranges = [
    ...document.querySelectorAll<HTMLElement>('section[data-stage]'),
  ]
    .flatMap((element) => {
      const stage = element.dataset.stage
      if (!stage) return []
      const rect = element.getBoundingClientRect()
      return [{ stage, top: rect.top + scroll, bottom: rect.bottom + scroll }]
    })
    .sort((a, b) => a.top - b.top)

  return { ranges, focusOffset: window.innerHeight * FOCUS_RATIO }
}

const stageAtScrollY = (
  { ranges, focusOffset }: StageFrame,
  scrollY: number,
) => {
  if (!ranges.length) return null

  const focus = scrollY + focusOffset
  const framed = ranges.find(
    (range) => focus >= range.top && focus < range.bottom,
  )
  if (framed) return framed.stage

  return focus < ranges[0].top
    ? ranges[0].stage
    : ranges[ranges.length - 1].stage
}

export const useActiveStage = () => {
  const { scrollY } = useScroll()
  const frameRef = useRef<StageFrame>(EMPTY_FRAME)
  const [stage, setStage] = useState<string | null>(null)

  useEffect(() => {
    const measure = () => {
      frameRef.current = measureStages()
      setStage(stageAtScrollY(frameRef.current, scrollY.get()))
    }
    const remeasure = debounce(measure, REMEASURE_DELAY)

    measure()

    const resizeObserver = new ResizeObserver(remeasure)
    resizeObserver.observe(document.body)
    const unsubscribe = sectionAnchorsChanged.on(remeasure)
    document.fonts?.ready.then(remeasure)

    return () => {
      resizeObserver.disconnect()
      unsubscribe()
    }
  }, [scrollY])

  useMotionValueEvent(scrollY, 'change', (value) => {
    setStage(stageAtScrollY(frameRef.current, value))
  })

  return stage
}
