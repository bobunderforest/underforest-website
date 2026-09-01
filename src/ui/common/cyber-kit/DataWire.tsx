import { motion, useTransform, type MotionValue } from 'framer-motion'
import { motionEase } from 'utils/anim/motion-ease'
import { clamp } from 'utils/math/clamp'

type DataWireProps = {
  reduced: boolean
  scrollY: MotionValue<number>
  sourceDocumentY: number
  lockedSourceY: number | null
  sourceX: number
  targetX: number
  targetY: number
  viewportWidth: number
  viewportHeight: number
}

export const DataWire = ({
  reduced,
  scrollY,
  sourceDocumentY,
  lockedSourceY,
  sourceX,
  targetX,
  targetY,
  viewportWidth,
  viewportHeight,
}: DataWireProps) => {
  const sourceY = useTransform(scrollY, (value) =>
    lockedSourceY === null ? sourceDocumentY - value : lockedSourceY,
  )
  const sourceMarkerY = useTransform(sourceY, (value) => value - 2.5)
  const turnX = sourceX + Math.max((targetX - sourceX) * 0.48, 18)
  const diagonalX = clamp(targetX - turnX, 0, 10)
  const path = useTransform(sourceY, (value) => {
    const direction = Math.sign(targetY - value) || 1
    const diagonalY = Math.min(Math.abs(targetY - value) / 2, diagonalX)
    const firstDiagonalStartX = turnX - diagonalY
    const firstDiagonalEndY = value + direction * diagonalY
    const diagonalStartY = targetY - direction * diagonalY
    return `M ${sourceX} ${value} H ${firstDiagonalStartX} L ${turnX} ${firstDiagonalEndY} V ${diagonalStartY} L ${turnX + diagonalY} ${targetY} H ${targetX}`
  })
  const transition = {
    duration: reduced ? 0 : 0.32,
    ease: motionEase.enter,
  }

  return (
    <motion.svg
      aria-hidden
      className={
        'pointer-events-none fixed inset-0 z-[52] size-full tablet-s:hidden'
      }
      viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
      preserveAspectRatio={'none'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <motion.path
        d={path}
        fill={'none'}
        stroke={'var(--color-accent)'}
        strokeDasharray={'5 5'}
        strokeWidth={1}
        opacity={0.7}
      />
      <motion.rect
        width={5}
        height={5}
        x={sourceX - 2.5}
        y={sourceMarkerY}
        fill={'var(--color-base)'}
        stroke={'var(--color-accent)'}
      />
      <rect
        width={5}
        height={5}
        x={targetX - 2.5}
        y={targetY - 2.5}
        fill={'var(--color-base)'}
        stroke={'var(--color-accent)'}
        transform={`rotate(45 ${targetX} ${targetY})`}
      />
    </motion.svg>
  )
}
