import { jumpLenisTo } from 'utils/anim/lenis'
import { whenPageSettled } from 'utils/browser/idle'
import {
  isScrollLockActive,
  subscribeScrollLockChange,
} from 'utils/browser/scroll-util'

const MIN_HOLD_MS = 900
const MAX_HOLD_MS = 6000
const INTENT_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const

export const holdScrollAligned = (resolveTop: () => number | null) => {
  let held = true
  let settled = false
  let minHoldElapsed = false
  let stopSettleWatch = () => {}
  let stopScrollLockWatch = () => {}

  const align = () => {
    if (!held || isScrollLockActive()) return
    const top = resolveTop()
    if (top === null) return
    jumpLenisTo(top)
  }

  const release = () => {
    held = false
    observer.disconnect()
    stopSettleWatch()
    stopScrollLockWatch()
    clearTimeout(minHoldTimer)
    clearTimeout(maxHoldTimer)
    INTENT_EVENTS.forEach((name) =>
      window.removeEventListener(name, release, { capture: true }),
    )
  }

  const releaseWhenAligned = () => {
    align()
    if (!held || !settled || !minHoldElapsed || isScrollLockActive()) return
    release()
  }

  const observer = new ResizeObserver(align)
  const minHoldTimer = setTimeout(() => {
    minHoldElapsed = true
    releaseWhenAligned()
  }, MIN_HOLD_MS)
  const maxHoldTimer = setTimeout(release, MAX_HOLD_MS)

  stopSettleWatch = whenPageSettled(() => {
    settled = true
    releaseWhenAligned()
  })
  stopScrollLockWatch = subscribeScrollLockChange((locked) => {
    if (!locked) releaseWhenAligned()
  })

  align()
  observer.observe(document.body)
  document.fonts?.ready.then(align)
  INTENT_EVENTS.forEach((name) =>
    window.addEventListener(name, release, { capture: true, passive: true }),
  )

  return release
}
