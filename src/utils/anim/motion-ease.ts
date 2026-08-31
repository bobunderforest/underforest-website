import { ease, type Easing } from 'utils/anim/easings'

export type MotionEase = {
  enter: Easing
  exit: Easing
  travel: Easing
}

const SCHEMES = {
  soft: {
    enter: ease.easeOutSoft,
    exit: ease.easeInSoft,
    travel: ease.easeInOutSoft,
  },
  snug: {
    enter: ease.easeOutSnug,
    exit: ease.easeInSnug,
    travel: ease.easeInOutSnug,
  },
  sine: {
    enter: ease.easeOutSine,
    exit: ease.easeInSine,
    travel: ease.easeInOutSine,
  },
} satisfies Record<string, MotionEase>

export type MotionEaseScheme = keyof typeof SCHEMES

export const MOTION_EASE_SCHEME: MotionEaseScheme = 'sine'

export const motionEase = SCHEMES[MOTION_EASE_SCHEME]
