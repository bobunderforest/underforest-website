import { motion, useTransform, type MotionValue } from 'framer-motion'
import { motionEase } from 'utils/anim/motion-ease'
import { clamp } from 'utils/math/clamp'

export const DATA_WIRE_DRAW_DURATION = 0.48

type DataWireTarget =
  | { targetY: number; targetRange?: never }
  | {
      targetY?: never
      targetRange: { documentY: number; minY: number; maxDocumentY: number }
    }

type DataWireProps = DataWireTarget & {
  bendFromTargetX?: number
  scrollY: MotionValue<number>
  sourceDocumentY: number
  lockedSourceY: number | null
  sourceX: number
  targetX: number
  viewportWidth: number
  viewportHeight: number
}

export const DataWire = ({
  bendFromTargetX,
  scrollY,
  sourceDocumentY,
  lockedSourceY,
  sourceX,
  targetX,
  targetY,
  targetRange,
  viewportWidth,
  viewportHeight,
}: DataWireProps) => {
  const sourceY = useTransform(scrollY, (value) =>
    lockedSourceY === null ? sourceDocumentY - value : lockedSourceY,
  )
  const sourceMarkerY = useTransform(sourceY, (value) => value - 2.5)
  const resolvedTargetY = useTransform(scrollY, (value): number => {
    if (!targetRange) return targetY ?? 0
    return Math.min(
      Math.max(targetRange.documentY - value, targetRange.minY),
      targetRange.maxDocumentY - value,
    )
  })
  const targetMarkerY = useTransform(resolvedTargetY, (value) => value - 2.5)
  const targetMarkerTransform = useTransform(
    resolvedTargetY,
    (value) => `rotate(45 ${targetX} ${value})`,
  )
  const defaultTurnX = sourceX + Math.max((targetX - sourceX) * 0.48, 18)
  const configuredTurnX =
    bendFromTargetX === undefined ? defaultTurnX : targetX - bendFromTargetX
  const turnX = clamp(configuredTurnX, sourceX + 18, targetX)
  const diagonalX = clamp(targetX - turnX, 0, 10)
  const path = useTransform<number, string>(
    [sourceY, resolvedTargetY],
    ([source, target]) => {
      const direction = Math.sign(target - source) || 1
      const diagonalY = Math.min(Math.abs(target - source) / 2, diagonalX)
      const firstDiagonalStartX = turnX - diagonalY
      const firstDiagonalEndY = source + direction * diagonalY
      const diagonalStartY = target - direction * diagonalY
      return `M ${sourceX} ${source} H ${firstDiagonalStartX} L ${turnX} ${firstDiagonalEndY} V ${diagonalStartY} L ${turnX + diagonalY} ${target} H ${targetX}`
    },
  )
  const transition = {
    duration: DATA_WIRE_DRAW_DURATION,
    ease: motionEase.enter,
  }
  const pinTransition = {
    duration: 0.12,
    delay: 0.36,
    ease: motionEase.enter,
  }

  return (
    <motion.svg
      aria-hidden
      className={
        'pointer-events-none fixed inset-0 z-[52] h-full w-[100vw] tablet-s:hidden'
      }
      viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
      preserveAspectRatio={'none'}
    >
      <motion.path
        d={path}
        initial={{ pathLength: 0, pathOffset: 0 }}
        animate={{ pathLength: 1, pathOffset: 0 }}
        exit={{ pathLength: 0, pathOffset: 1 }}
        transition={transition}
        fill={'none'}
        stroke={'var(--color-accent)'}
        strokeDasharray={'5 5'}
        strokeWidth={1}
        opacity={0.7}
      />
      <motion.rect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          transition: { duration: 0.1 },
        }}
        transition={{ duration: 0.1 }}
        width={5}
        height={5}
        x={sourceX - 2.5}
        y={sourceMarkerY}
        fill={'var(--color-base)'}
        stroke={'var(--color-accent)'}
      />
      <motion.rect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: pinTransition }}
        transition={pinTransition}
        width={5}
        height={5}
        x={targetX - 2.5}
        y={targetMarkerY}
        fill={'var(--color-base)'}
        stroke={'var(--color-accent)'}
        transform={targetMarkerTransform}
      />
    </motion.svg>
  )
}
