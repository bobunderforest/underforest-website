import { useTransform, type MotionValue } from 'framer-motion'
import type { Easing } from 'utils/anim/easings'

export type Keyframes = {
  stops: number[]
  values: number[]
}

export type SettleStops = readonly [number, number, number, number]

export const keyframes = (stops: number[], values: number[]): Keyframes => ({
  stops,
  values,
})

export const keyframeProgressAt = (
  { stops, values }: Keyframes,
  target: number,
) => {
  const pairCount = Math.min(stops.length, values.length)
  if (pairCount === 0) return 0

  for (let i = 1; i < pairCount; i++) {
    const startValue = values[i - 1]
    const endValue = values[i]
    const targetIsBetween = (target - startValue) * (target - endValue) <= 0

    if (targetIsBetween) {
      const valueSpan = endValue - startValue
      const progress = valueSpan === 0 ? 0 : (target - startValue) / valueSpan
      return stops[i - 1] + (stops[i] - stops[i - 1]) * progress
    }
  }

  const lastIndex = pairCount - 1
  const firstDistance = Math.abs(target - values[0])
  const lastDistance = Math.abs(target - values[lastIndex])
  return firstDistance <= lastDistance ? stops[0] : stops[lastIndex]
}

export const useKeyframes = (
  progress: MotionValue<number>,
  { stops, values }: Keyframes,
  ease?: Easing[],
) => useTransform(progress, stops, values, ease && { ease })

export const scrollFollowAt = (
  at: number,
  from: number,
  rest: number,
  speed: number,
) => (at <= from ? rest : rest - speed * (at - from))

type ScrollFollowArgs = {
  progress: MotionValue<number>
  from: number
  rest: number
  speed: number
  active?: boolean
}

export const useScrollFollow = ({
  progress,
  from,
  rest,
  speed,
  active = true,
}: ScrollFollowArgs) =>
  useTransform(() =>
    active ? scrollFollowAt(progress.get(), from, rest, speed) : rest,
  )

type HoldRevealFollowArgs = {
  progress: MotionValue<number>
  holdUntil: number
  revealUntil: number
  startOffset: number
  rest: number
  followSpeed: number
  active?: boolean
}

export const useHoldRevealFollow = ({
  progress,
  holdUntil,
  revealUntil,
  startOffset,
  rest,
  followSpeed,
  active = true,
}: HoldRevealFollowArgs) =>
  useTransform(() => {
    if (!active) return startOffset
    const current = progress.get()
    if (current <= holdUntil) return startOffset
    if (current >= revealUntil)
      return scrollFollowAt(current, revealUntil, rest, followSpeed)
    const revealSpan = revealUntil - holdUntil
    const revealProgress = (current - holdUntil) / revealSpan
    return startOffset + (rest - startOffset) * revealProgress
  })
