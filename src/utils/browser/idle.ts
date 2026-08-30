const IDLE_TIMEOUT_MS = 1500
const IDLE_FALLBACK_MS = 200

const SETTLE_FRAME_BUDGET_MS = 24
const SETTLE_CALM_FRAMES = 8
const SETTLE_TIMEOUT_MS = 4000

const supportsIdleCallback = () =>
  typeof window !== 'undefined' &&
  typeof window.requestIdleCallback === 'function'

export const requestIdle = (callback: () => void) =>
  supportsIdleCallback()
    ? window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS })
    : window.setTimeout(callback, IDLE_FALLBACK_MS)

export const cancelIdle = (handle: number) => {
  if (supportsIdleCallback()) window.cancelIdleCallback(handle)
  else window.clearTimeout(handle)
}

const settleListeners = new Set<() => void>()
let hasSettled = false
let isWatching = false

const notifySettled = () => {
  hasSettled = true
  const listeners = [...settleListeners]
  settleListeners.clear()
  listeners.forEach((listener) => listener())
}

const whenVisible = (start: () => void) => {
  if (document.visibilityState === 'visible') {
    start()
    return
  }
  const onVisibility = () => {
    if (document.visibilityState !== 'visible') return
    document.removeEventListener('visibilitychange', onVisibility)
    start()
  }
  document.addEventListener('visibilitychange', onVisibility)
}

const watchFrameRate = () => {
  let calmFrames = 0
  let previousTime = performance.now()
  let frame = 0
  let timeout = 0

  const finish = () => {
    cancelAnimationFrame(frame)
    window.clearTimeout(timeout)
    if (document.visibilityState === 'visible') notifySettled()
    else whenVisible(watchFrameRate)
  }

  const tick = (now: number) => {
    const delta = now - previousTime
    previousTime = now
    calmFrames = delta <= SETTLE_FRAME_BUDGET_MS ? calmFrames + 1 : 0
    if (calmFrames >= SETTLE_CALM_FRAMES) finish()
    else frame = requestAnimationFrame(tick)
  }

  frame = requestAnimationFrame(tick)
  timeout = window.setTimeout(finish, SETTLE_TIMEOUT_MS)
}

const startSettleWatch = () => {
  if (isWatching) return
  isWatching = true
  const watchWhenVisible = () => whenVisible(watchFrameRate)
  if (document.readyState === 'complete') watchWhenVisible()
  else window.addEventListener('load', watchWhenVisible, { once: true })
}

export const whenPageSettled = (onSettled: () => void) => {
  if (hasSettled) {
    onSettled()
    return () => {}
  }
  settleListeners.add(onSettled)
  startSettleWatch()
  return () => {
    settleListeners.delete(onSettled)
  }
}
