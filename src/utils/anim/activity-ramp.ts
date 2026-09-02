import { easeInOutSine } from 'utils/anim/easings'

const ACTIVITY_RAMP_MS = 320

export type ActivityRamp = {
  value: number
  target: number
  start: number
  elapsed: number
}

export const createActivityRamp = (active = false): ActivityRamp => {
  const value = active ? 1 : 0
  return { value, target: value, start: value, elapsed: ACTIVITY_RAMP_MS }
}

export const stepActivityRamp = (
  ramp: ActivityRamp,
  active: boolean,
  deltaMs: number,
): number => {
  const target = active ? 1 : 0
  if (ramp.target !== target) {
    ramp.target = target
    ramp.start = ramp.value
    ramp.elapsed = 0
  }

  ramp.elapsed = Math.min(ramp.elapsed + deltaMs, ACTIVITY_RAMP_MS)
  const progress = easeInOutSine(ramp.elapsed / ACTIVITY_RAMP_MS)
  ramp.value = ramp.start + (ramp.target - ramp.start) * progress
  return ramp.value
}
