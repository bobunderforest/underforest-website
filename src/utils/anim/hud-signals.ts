import { useEffect, useRef } from 'react'
import { useMotionValue } from 'framer-motion'
import { whenPageSettled } from 'utils/browser/idle'
import { formatClock, formatCursor } from 'utils/formatters/hud-readouts'
import { lerp } from 'utils/math/lerp'

const MAX_FRAME_DELTA_MS = 100
const FRAME_RATE_SMOOTHING = 0.12
const POINTER_DECAY_PER_S = 6

type FrameListener = (deltaMs: number) => void

const frameListeners = new Set<FrameListener>()
let frameHandle = 0
let previousTime = 0
let cancelSettle: (() => void) | null = null

const emitFrame = (deltaMs: number) => {
  frameListeners.forEach((listener) => listener(deltaMs))
}

const tick = (now: number) => {
  const delta = previousTime
    ? Math.min(now - previousTime, MAX_FRAME_DELTA_MS)
    : 0
  previousTime = now
  emitFrame(delta)
  frameHandle = requestAnimationFrame(tick)
}

const startFrames = () => {
  if (frameHandle) return
  previousTime = 0
  frameHandle = requestAnimationFrame(tick)
}

const stopFrames = () => {
  cancelAnimationFrame(frameHandle)
  frameHandle = 0
}

const onVisibility = () => {
  if (document.visibilityState === 'visible') startFrames()
  else stopFrames()
}

const subscribeHudFrames = (listener: FrameListener) => {
  frameListeners.add(listener)

  if (frameListeners.size === 1) {
    cancelSettle = whenPageSettled(startFrames)
    document.addEventListener('visibilitychange', onVisibility)
  }

  return () => {
    frameListeners.delete(listener)
    if (frameListeners.size > 0) return
    cancelSettle?.()
    cancelSettle = null
    document.removeEventListener('visibilitychange', onVisibility)
    stopFrames()
  }
}

export const useHudFrames = (listener: FrameListener) => {
  const listenerRef = useRef(listener)

  useEffect(() => {
    listenerRef.current = listener
  })

  useEffect(
    () => subscribeHudFrames((deltaMs) => listenerRef.current(deltaMs)),
    [],
  )
}

export const useHudClock = () => {
  const clock = useMotionValue(formatClock(new Date()))

  useEffect(() => {
    const publish = () => clock.set(formatClock(new Date()))
    publish()
    const interval = window.setInterval(publish, 1000)
    return () => window.clearInterval(interval)
  }, [clock])

  return clock
}

export const useHudPointer = () => {
  const cursor = useMotionValue(formatCursor(0, 0))
  const velocity = useMotionValue(0)

  useEffect(() => {
    const previous = { x: 0, y: 0, time: 0 }

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now()
      const deltaMs = now - previous.time
      const distance = Math.hypot(
        event.clientX - previous.x,
        event.clientY - previous.y,
      )

      if (previous.time && deltaMs > 0) {
        velocity.set(Math.max(velocity.get(), (distance / deltaMs) * 1000))
      }

      previous.x = event.clientX
      previous.y = event.clientY
      previous.time = now
      cursor.set(formatCursor(event.clientX, event.clientY))
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [cursor, velocity])

  useHudFrames((deltaMs) =>
    velocity.set(
      velocity.get() * Math.exp((-POINTER_DECAY_PER_S * deltaMs) / 1000),
    ),
  )

  return { cursor, velocity }
}

export const useHudFrameRate = () => {
  const frameRate = useMotionValue(60)

  useHudFrames((deltaMs) => {
    if (deltaMs <= 0) return
    frameRate.set(lerp(frameRate.get(), 1000 / deltaMs, FRAME_RATE_SMOOTHING))
  })

  return frameRate
}
