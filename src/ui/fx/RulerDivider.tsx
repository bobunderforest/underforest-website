import { motion, useTransform, type MotionValue } from 'framer-motion'
import { TRACK_MARKER_SIZE, TRACK_TICK_PERIOD } from 'ui/fx/track-rail'
import { Text } from 'ui/common/typography/Text'
import { useElementSize } from 'utils/hooks/useElementSize'
import { cns } from 'utils/formatters/classnames'

const MAJOR_TICK_PERIOD = 48

const TICK_STYLE: React.CSSProperties = {
  backgroundImage:
    `repeating-linear-gradient(90deg, var(--color-edge) 0 1px, transparent 1px ${MAJOR_TICK_PERIOD}px),` +
    `repeating-linear-gradient(90deg, var(--color-edge) 0 1px, transparent 1px ${TRACK_TICK_PERIOD}px)`,
  backgroundRepeat: 'no-repeat, no-repeat',
  backgroundSize: '100% 9px, 100% 5px',
  backgroundPosition: 'left top, left top',
}

type Props = {
  label?: React.ReactNode
  progress: MotionValue<number>
  className?: string
}

export const RulerDivider = ({ label, progress, className }: Props) => {
  const { ref, width } = useElementSize<HTMLDivElement>()
  const markerX = useTransform(
    progress,
    [0, 1],
    [0, Math.max(width - TRACK_MARKER_SIZE, 0)],
  )

  return (
    <div aria-hidden className={cns('relative w-full select-none', className)}>
      <div ref={ref} className={'relative h-px w-full bg-edge'}>
        <motion.span
          style={{ scaleX: progress }}
          className={'absolute inset-0 origin-left bg-accent/70'}
        />
        <motion.span
          style={{ x: markerX, y: '-50%' }}
          className={'absolute top-1/2 left-0 size-[7px] bg-accent'}
        />
      </div>

      <div className={'h-[9px] w-full'} style={TICK_STYLE} />

      {label != null && (
        <Text
          tag={'span'}
          size={'hint'}
          tone={'system'}
          uppercase
          className={
            'absolute -top-1 right-0 -translate-y-full bg-base px-1 tabular-nums'
          }
        >
          {label}
        </Text>
      )}
    </div>
  )
}
