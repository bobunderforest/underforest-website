import type { Variants, Transition, ViewportOptions } from 'framer-motion'
import { easeOutCubic } from 'utils/anim/easings'

export const revealViewport: ViewportOptions = { once: false, amount: 0.3 }

const revealTransition: Transition = { duration: 0.8, ease: easeOutCubic }
const dividerTransition: Transition = { duration: 0.4, ease: easeOutCubic }

export const revealFromBottom: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
}

export const revealFromTop: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
}

export const revealDivider: Variants = {
  hidden: { opacity: 0, scaleX: 0.6, y: 40 },
  visible: { opacity: 1, scaleX: 1, y: 0, transition: dividerTransition },
}

export const staggerContainer = (
  staggerChildren = 0.12,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
})
