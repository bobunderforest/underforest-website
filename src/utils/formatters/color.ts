export const toRgbTriple = (
  ctx: CanvasRenderingContext2D,
  value: string,
): [number, number, number] => {
  ctx.fillStyle = value
  const hex = ctx.fillStyle as string
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}
