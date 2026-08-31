import Lenis from 'lenis'
import { getScrollPosition } from 'utils/browser/scroll-util'

let instance: Lenis | null = null
let pauseCount = 0

export const createLenis = () => {
  instance = new Lenis({
    autoRaf: false,
    overscroll: true,
    lerp: 0.2,
    wheelMultiplier: 0.85,
    duration: 1.4,
    syncTouch: true,
    // syncTouchLerp: 0.01,
    smoothWheel: true,
  })
  if (pauseCount > 0) instance.stop()
  return instance
}

export const destroyLenis = () => {
  instance?.destroy()
  instance = null
}

export const pauseLenis = () => {
  pauseCount += 1
  if (pauseCount === 1) instance?.stop()
}

export const resumeLenis = () => {
  if (pauseCount === 0) return
  pauseCount -= 1
  if (pauseCount === 0) {
    instance?.resize()
    instance?.start()
  }
}

export type ScrollLenisTarget = string | HTMLElement | number

export type ScrollLenisOptions =
  { duration: number; speed?: never } | { speed: number; duration?: never }

const resolveElement = (target: string | HTMLElement) =>
  typeof target === 'string' ? document.querySelector(target) : target

const distanceTo = (target: ScrollLenisTarget) => {
  if (typeof target === 'number') {
    return Math.abs(target - getScrollPosition())
  }
  const element = resolveElement(target)
  if (!element) return 0
  return Math.abs(element.getBoundingClientRect().top)
}

const durationFor = (
  target: ScrollLenisTarget,
  options: ScrollLenisOptions,
) => {
  if (options.duration !== undefined) return options.duration
  return distanceTo(target) / options.speed
}

export const jumpLenisTo = (scrollY: number) => {
  if (instance) {
    instance.scrollTo(scrollY, { immediate: true })
    return
  }
  window.scrollTo(0, scrollY)
}

export const scrollLenisTo = (
  target: ScrollLenisTarget,
  options: ScrollLenisOptions,
) => {
  if (instance) {
    instance.scrollTo(target, { duration: durationFor(target, options) })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
    return
  }
  resolveElement(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
