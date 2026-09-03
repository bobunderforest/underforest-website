import Lenis from 'lenis'
import { getScrollPosition } from 'utils/browser/scroll-util'
import { clamp } from 'utils/math/clamp'

let instance: Lenis | null = null
let pauseCount = 0
const wheelInputLimits = new Map<symbol, number>()

const wheelInputScale = () =>
  wheelInputLimits.size > 0 ? Math.min(...wheelInputLimits.values()) : 1

const stopWithoutLayoutChange = () => {
  instance?.stop()
  document.documentElement.classList.remove('lenis-stopped')
}

export const createLenis = () => {
  instance = new Lenis({
    autoRaf: false,
    overscroll: true,
    wheelMultiplier: 0.85,
    // duration: 0.8,
    lerp: 0.5,
    syncTouch: true,
    // syncTouchLerp: 0.01,
    smoothWheel: true,
    virtualScroll: (data) => {
      if (!('deltaMode' in data.event)) return true
      const scale = wheelInputScale()
      data.deltaX *= scale
      data.deltaY *= scale
      return true
    },
  })
  if (pauseCount > 0) stopWithoutLayoutChange()
  return instance
}

export const destroyLenis = () => {
  instance?.destroy()
  instance = null
}

export const pauseLenis = () => {
  pauseCount += 1
  if (pauseCount === 1) stopWithoutLayoutChange()
}

export const resumeLenis = () => {
  if (pauseCount === 0) return
  pauseCount -= 1
  if (pauseCount === 0) {
    instance?.resize()
    instance?.start()
  }
}

export const limitLenisWheelInput = (scale: number) => {
  const token = Symbol()
  wheelInputLimits.set(token, clamp(scale, 0, 1))
  return () => {
    wheelInputLimits.delete(token)
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
    instance.resize()
    instance.scrollTo(scrollY, { immediate: true, force: true })
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
