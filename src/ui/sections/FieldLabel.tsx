import type { ReactNode } from 'react'
import { cns } from 'utils/formatters/classnames'

type Props = {
  children: ReactNode
  readout?: ReactNode
  className?: string
}

export const FieldLabel = ({ children, readout, className }: Props) => {
  return (
    <div
      className={cns(
        'flex flex-wrap items-baseline gap-x-3 gap-y-1 font-face-regular text-[13px] tracking-[0.12em] text-muted lowercase',
        className,
      )}
    >
      <span>// {children}</span>
      {readout != null && <span className={'text-system'}>{readout}</span>}
    </div>
  )
}
