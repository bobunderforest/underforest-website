export const getDpr = () =>
  window.devicePixelRatio ? Math.max(Number(window.devicePixelRatio), 1) : 1
