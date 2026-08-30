import { cubicBezier } from 'framer-motion'

export type Easing = (t: number) => number

export const linear = (t: number) => t
export const easeInSine = (x: number) => 1 - Math.cos((x * Math.PI) / 2)
export const easeOutSine = (x: number) => Math.sin((x * Math.PI) / 2)
export const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2
export const easeInQuad = (t: number) => t * t
export const easeOutQuad = (t: number) => t * (2 - t)
export const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
export const easeInCubic = (t: number) => t * t * t
export const easeOutCubic = (t: number) => --t * t * t + 1
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
export const easeInQuart = (t: number) => t * t * t * t
export const easeOutQuart = (t: number) => 1 - --t * t * t * t
export const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
export const easeInQuint = (t: number) => t * t * t * t * t
export const easeOutQuint = (t: number) => 1 + --t * t * t * t * t
export const easeInOutQuint = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t

export const easeInSoft: Easing = cubicBezier(0.3, 0.1, 0.7, 0.6)
export const easeOutSoft: Easing = cubicBezier(0.3, 0.4, 0.7, 0.9)
export const easeInOutSoft: Easing = cubicBezier(0.4, 0.1, 0.6, 0.9)

export const easeInSnug: Easing = cubicBezier(0.25, 0.05, 0.67, 0.45)
export const easeOutSnug: Easing = cubicBezier(0.33, 0.55, 0.75, 0.95)
export const easeInOutSnug: Easing = cubicBezier(0.38, 0.05, 0.62, 0.95)

export const ease = {
  linear,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSoft,
  easeOutSoft,
  easeInOutSoft,
  easeInSnug,
  easeOutSnug,
  easeInOutSnug,
}
