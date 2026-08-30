import { useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { linear } from 'utils/anim/easings'
import type { Easing } from 'utils/anim/easings'
import type { SettleStops } from 'utils/anim/scroll-timeline'

type SettleParallaxArgs = {
  scrollYProgress: MotionValue<number>
  baseY?: MotionValue<number>
  stops: SettleStops
  enterOffset: number
  exitOffset: number
  enterEase?: Easing
  exitEase?: Easing
}

export const useSettleParallax = ({
  scrollYProgress,
  baseY,
  stops,
  enterOffset,
  exitOffset,
  enterEase = linear,
  exitEase = linear,
}: SettleParallaxArgs) => {
  const settleY = useTransform(
    scrollYProgress,
    [...stops],
    [enterOffset, 0, 0, -exitOffset],
    { ease: [enterEase, linear, exitEase] },
  )
  const zeroY = useMotionValue(0)
  const combinedY = useTransform(
    [baseY ?? zeroY, settleY],
    ([base, offset]) => (base as number) + (offset as number),
  )
  return baseY ? combinedY : settleY
}
