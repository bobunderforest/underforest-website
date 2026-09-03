export type WirePoint = { x: number; y: number }

export const WIRE_MARKER_SIZE = 5

export const wireMarkerOffset = WIRE_MARKER_SIZE / 2

export const wireElbowPath = (
  source: WirePoint,
  target: WirePoint,
  { turnX, maxChamfer }: { turnX: number; maxChamfer: number },
) => {
  const direction = Math.sign(target.y - source.y) || 1
  const chamfer = Math.min(Math.abs(target.y - source.y) / 2, maxChamfer)
  return [
    `M ${source.x} ${source.y}`,
    `H ${turnX - chamfer}`,
    `L ${turnX} ${source.y + direction * chamfer}`,
    `V ${target.y - direction * chamfer}`,
    `L ${turnX + chamfer} ${target.y}`,
    `H ${target.x}`,
  ].join(' ')
}
