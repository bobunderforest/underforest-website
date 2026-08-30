import type { MotionValue } from 'framer-motion'
import { useSettleParallax } from 'utils/hooks/useSettleParallax'
import type { Easing } from 'utils/anim/easings'
import type { SettleStops } from 'utils/anim/scroll-timeline'

type StaggerLayerArgs = {
  scrollYProgress: MotionValue<number>
  baseY: MotionValue<number>
  stops: SettleStops
  distance: number
  step: number
  index: number
  count: number
  enterEase?: Easing
  exitEase?: Easing
}

export const useStaggerLayer = ({
  scrollYProgress,
  baseY,
  stops,
  distance,
  step,
  index,
  count,
  enterEase,
  exitEase,
}: StaggerLayerArgs) =>
  useSettleParallax({
    scrollYProgress,
    baseY,
    stops,
    enterOffset: distance + index * step,
    exitOffset: distance + (count - 1 - index) * step,
    enterEase,
    exitEase,
  })
