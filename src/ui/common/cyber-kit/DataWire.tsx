import { motion, useTransform, type MotionValue } from 'framer-motion'
import { motionEase } from 'utils/anim/motion-ease'
import { clamp } from 'utils/math/clamp'
import {
  WIRE_MARKER_SIZE,
  wireElbowPath,
  wireMarkerOffset,
} from './wire-geometry'

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
  const sourceMarkerY = useTransform(
    sourceY,
    (value) => value - wireMarkerOffset,
  )
  const resolvedTargetY = useTransform(scrollY, (value): number => {
    if (!targetRange) return targetY ?? 0
    return Math.min(
      Math.max(targetRange.documentY - value, targetRange.minY),
      targetRange.maxDocumentY - value,
    )
  })
  const targetMarkerY = useTransform(
    resolvedTargetY,
    (value) => value - wireMarkerOffset,
  )
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
    ([source, target]) =>
      wireElbowPath(
        { x: sourceX, y: source },
        { x: targetX, y: target },
        { turnX, maxChamfer: diagonalX },
      ),
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
        width={WIRE_MARKER_SIZE}
        height={WIRE_MARKER_SIZE}
        x={sourceX - wireMarkerOffset}
        y={sourceMarkerY}
        fill={'var(--color-base)'}
        stroke={'var(--color-accent)'}
      />
      <motion.rect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: pinTransition }}
        transition={pinTransition}
        width={WIRE_MARKER_SIZE}
        height={WIRE_MARKER_SIZE}
        x={targetX - wireMarkerOffset}
        y={targetMarkerY}
        fill={'var(--color-base)'}
        stroke={'var(--color-accent)'}
        transform={targetMarkerTransform}
      />
    </motion.svg>
  )
}
