import type { RefObject } from 'react'
import { motion, type MotionValue } from 'framer-motion'
import { useScrollStageActive } from 'ui/fx/scroll-stage-context'
import { cns } from 'utils/formatters/classnames'

type Props = React.BaseProps & {
  transform?: MotionValue<string>
  y?: MotionValue<number>
  active?: boolean
  interactive?: boolean
  layerRef?: RefObject<HTMLDivElement | null>
  style?: React.CSSProperties
}

export const ScrollLayer = ({
  transform,
  y,
  active,
  interactive = true,
  layerRef,
  className,
  style,
  children,
}: Props) => {
  const stageActive = useScrollStageActive()
  const isActive = active ?? stageActive
  const {
    transform: _ignoredTransform,
    y: _ignoredY,
    ...restStyle
  } = style ?? {}
  return (
    <motion.div
      ref={layerRef}
      style={{ ...restStyle, ...(y ? { y } : { transform }) }}
      className={cns(
        interactive ? 'pointer-events-auto' : 'pointer-events-none',
        isActive && 'will-change-transform',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
