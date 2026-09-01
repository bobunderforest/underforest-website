import type { RefObject } from 'react'
import { cns } from 'utils/formatters/classnames'

type Props = React.BaseProps & {
  stageRef: RefObject<HTMLDivElement | null>
  hidden?: boolean
  inFront?: boolean
}

export const StickyViewportLayer = ({
  stageRef,
  hidden,
  inFront,
  className,
  children,
}: Props) => {
  return (
    <div
      ref={stageRef}
      className={cns(
        'scroll-stage pointer-events-none fixed inset-0 overflow-hidden',
        inFront ? 'z-10' : '-z-10',
        hidden && 'invisible',
        className,
      )}
    >
      {children}
    </div>
  )
}
