import { useSyncExternalStore } from 'react'

type Size = { width: number; height: number }

const SERVER_SIZE: Size = { width: 0, height: 0 }

const readWindow = (): Size => ({
  width: window.innerWidth,
  height: window.innerHeight,
})

let snapshot: Size = typeof window === 'undefined' ? SERVER_SIZE : readWindow()
let frame = 0
const listeners = new Set<() => void>()

const publish = () => {
  frame = 0
  const next = readWindow()
  if (next.width === snapshot.width && next.height === snapshot.height) return
  snapshot = next
  listeners.forEach((notify) => notify())
}

const onResize = () => {
  if (frame) return
  frame = requestAnimationFrame(publish)
}

const subscribe = (notify: () => void) => {
  if (listeners.size === 0) window.addEventListener('resize', onResize)
  listeners.add(notify)
  return () => {
    listeners.delete(notify)
    if (listeners.size === 0) {
      window.removeEventListener('resize', onResize)
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }
  }
}

export const useWindowSize = () =>
  useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => SERVER_SIZE,
  )
