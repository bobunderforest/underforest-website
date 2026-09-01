import type { MotionValue } from 'framer-motion'
import { ScrollLayer } from 'ui/fx/ScrollLayer'
import { useStaggerLayer } from 'utils/hooks/useStaggerLayer'
import type { Easing } from 'utils/anim/easings'
import type { SettleStops } from 'utils/anim/scroll-timeline'

type Props = React.BaseProps & {
  scrollYProgress: MotionValue<number>
  baseY: MotionValue<number>
  stops: SettleStops
  distance: number
  step: number
  index: number
  count: number
  enterEase?: Easing
  exitEase?: Easing
  active?: boolean
}

export const StaggerSettleItem = ({
  scrollYProgress,
  baseY,
  stops,
  distance,
  step,
  index,
  count,
  enterEase,
  exitEase,
  active,
  className,
  style,
  children,
}: Props) => {
  const y = useStaggerLayer({
    scrollYProgress,
    baseY,
    stops,
    distance,
    step,
    index,
    count,
    enterEase,
    exitEase,
  })
  return (
    <ScrollLayer
      active={active}
      y={y}
      style={style}
      className={className}
    >
      {children}
    </ScrollLayer>
  )
}
