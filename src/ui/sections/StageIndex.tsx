import type { ReactNode } from 'react'
import { cns } from 'utils/formatters/classnames'

type Props = {
  index: string
  stage: string
  readout?: ReactNode
  className?: string
}

export const StageIndex = ({ index, stage, readout, className }: Props) => {
  return (
    <div
      className={cns(
        'mb-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 tablet-s:mb-8',
        className,
      )}
    >
      <span className={'font-face-title text-hint font-bold text-accent'}>
        {index}
      </span>
      <p
        className={
          'leading-title-3 font-face-title text-title-3 font-bold tracking-[0.04em] text-balance uppercase'
        }
      >
        {stage}
      </p>
      {readout != null && (
        <span
          className={
            'ml-auto text-hint tracking-[0.08em] text-system tablet-s:ml-0'
          }
        >
          {readout}
        </span>
      )}
    </div>
  )
}
