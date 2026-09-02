import { useState } from 'react'
import { prefersReducedMotion } from 'utils/browser/prefers-reduced-motion'
import { cns } from 'utils/formatters/classnames'

type Props = {
  className?: string
  diagonal?: boolean
  dashed?: boolean
  muted?: boolean
  blinkKey?: string | number
}

const CORNERS = {
  topLeft: 'top-[-2px] left-[-2px] border-t-2 border-l-2',
  topRight: 'top-[-2px] right-[-2px] border-t-2 border-r-2',
  bottomLeft: 'bottom-[-2px] left-[-2px] border-b-2 border-l-2',
  bottomRight: 'right-[-2px] bottom-[-2px] border-r-2 border-b-2',
}

const DIAGONAL_CORNERS = ['topLeft', 'bottomRight'] as const
const ALL_CORNERS = [
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
] as const

export const DataCaptureBorder = ({
  className,
  diagonal = false,
  dashed = false,
  muted = false,
  blinkKey,
}: Props) => {
  const [reduced] = useState(prefersReducedMotion)
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
          className={cns(
            'pointer-events-none absolute size-[7px]',
            blinkKey && !reduced && 'animate-data-capture-blink',
            colorClassName,
            className,
            CORNERS[corner],
          )}
        />
      ))}
    </>
  )
}
