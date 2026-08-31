import { WatchedValue } from 'utils/primitives/watched-value'
import { narrow } from 'utils/math/math-narrow'
import { clamp } from 'utils/math/clamp'

export type SectionJump = {
  span: number
  sectionCount: number
  distanceY: number
  durationS: number
}

export const sectionJump = new WatchedValue<SectionJump | null>(null)

export const JUMP_RELEASE_VELOCITY_FRACTION = 0.8

const REFERENCE_VELOCITY_FLOOR_PX = 1200
const LENIS_VELOCITY_DECAY = 10 * Math.LN2

export const jumpSpanFraction = ({ span, sectionCount }: SectionJump) =>
  narrow(span, 1, sectionCount)

const jumpReferenceVelocityPx = ({ distanceY, durationS }: SectionJump) =>
  (Math.PI / 2) * (distanceY / durationS)

export const jumpNormalizeVelocityPx = (jump: SectionJump) =>
  Math.max(jumpReferenceVelocityPx(jump), REFERENCE_VELOCITY_FLOOR_PX)

export const jumpReleaseSeconds = (jump: SectionJump) => {
  const startRatio =
    (LENIS_VELOCITY_DECAY * (jump.distanceY / jump.durationS)) /
    jumpNormalizeVelocityPx(jump)
  if (startRatio <= JUMP_RELEASE_VELOCITY_FRACTION) return 0
  return clamp(
    (jump.durationS * Math.log(startRatio / JUMP_RELEASE_VELOCITY_FRACTION)) /
      LENIS_VELOCITY_DECAY,
    0,
    jump.durationS,
  )
}
