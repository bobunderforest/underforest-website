import { type CSSProperties } from 'react'
import { cns } from 'utils/formatters/classnames'

type Props = {
  className?: string
  diagonal?: boolean
  dashed?: boolean
  muted?: boolean
  blinkKey?: string | number
  offset?: number
  size?: number
}

const CORNERS = {
  topLeft: 'border-t-2 border-l-2',
  topRight: 'border-t-2 border-r-2',
  bottomLeft: 'border-b-2 border-l-2',
  bottomRight: 'border-r-2 border-b-2',
}

const DIAGONAL_CORNERS = ['topLeft', 'bottomRight'] as const
const ALL_CORNERS = [
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
] as const

type Corner = (typeof ALL_CORNERS)[number]

const cornerStyle = ({
  corner,
  offset,
  size,
}: {
  corner: Corner
  offset: number
  size: number
}): CSSProperties => ({
  width: size,
  height: size,
  ...(corner.startsWith('top') ? { top: -offset } : { bottom: -offset }),
  ...(corner.endsWith('Left') ? { left: -offset } : { right: -offset }),
})

export const DataCaptureBorder = ({
  className,
  diagonal = false,
  dashed = false,
  muted = false,
  blinkKey,
  offset = 2,
  size = 7,
}: Props) => {
  const colorClassName = muted ? 'border-muted/60' : 'border-accent'
  const corners = diagonal ? DIAGONAL_CORNERS : ALL_CORNERS

  return (
    <>
      {dashed && (
        <span
          aria-hidden
          className={cns(
            'pointer-events-none absolute inset-0 border border-dashed',
            colorClassName,
            className,
          )}
        />
      )}
      {corners.map((corner) => (
        <span
          key={`${corner}-${blinkKey ?? 'idle'}`}
          aria-hidden
          style={cornerStyle({ corner, offset, size })}
          className={cns(
            'pointer-events-none absolute',
            blinkKey && 'animate-data-capture-blink',
            colorClassName,
            className,
            CORNERS[corner],
          )}
        />
      ))}
    </>
  )
}
