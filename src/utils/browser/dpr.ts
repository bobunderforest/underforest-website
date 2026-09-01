export const getDpr = (max = Infinity) =>
  Math.min(Math.max(Number(window.devicePixelRatio) || 1, 1), max)
