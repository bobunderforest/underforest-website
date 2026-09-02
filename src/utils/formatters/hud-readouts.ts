import { clamp } from 'utils/math/clamp'

const pad = (value: number, length: number) =>
  Math.abs(Math.trunc(value)).toString().padStart(length, '0')

export const formatClock = (date: Date) =>
  [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => pad(part, 2))
    .join(':')

export const formatProgress = (ratio: number) => {
  const bounded = clamp(ratio, 0, 1)
  return `${pad(bounded * 100, 3)}.${pad(bounded * 1000, 1).slice(-1)}%`
}

export const formatVelocity = (pxPerSecond: number) =>
  pad(Math.min(Math.abs(pxPerSecond), 9999), 4)

export const formatViewport = (width: number, height: number) =>
  `${pad(width, 4)}×${pad(height, 4)}`

export const formatDpr = (dpr: number) => `x${dpr.toFixed(2)}`

export const formatCursor = (x: number, y: number) =>
  `${pad(x, 4)},${pad(y, 4)}`

export const formatFrameRate = (fps: number) => pad(fps, 2)
