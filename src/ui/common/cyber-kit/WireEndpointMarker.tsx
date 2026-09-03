import {
  WIRE_MARKER_SIZE,
  wireMarkerOffset,
  type WirePoint,
} from './wire-geometry'

export const WireEndpointMarker = ({ x, y }: WirePoint) => (
  <rect
    x={x - wireMarkerOffset}
    y={y - wireMarkerOffset}
    width={WIRE_MARKER_SIZE}
    height={WIRE_MARKER_SIZE}
    fill={'var(--color-base)'}
    stroke={'var(--color-accent)'}
  />
)
