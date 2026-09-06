import type { ReactNode } from 'react'
import { Text } from 'ui/common/typography/Text'
import type { TextTone } from 'ui/common/typography/Text'
import { cns } from 'utils/formatters/classnames'

type GapSize = 'none' | 'tight' | 'regular'

const GAP_CLASSES: Record<GapSize, string> = {
  none: '',
  tight: 'mb-2',
  regular: 'mb-5',
}

type Props = {
  children: ReactNode
  readout?: ReactNode
  className?: string
  tone?: TextTone
  gap?: GapSize
  blockComment?: boolean
}

export const FieldLabelHeading = ({
  children,
  readout,
  className,
}: Pick<Props, 'children' | 'readout' | 'className'>) => (
  <div className={cns('mb-8 flex items-center gap-4', className)}>
    <span aria-hidden className={'size-2 shrink-0 rotate-45 bg-accent'} />
    <Text
      tag={'span'}
      size={'caption'}
      face={'title'}
      tone={'primary'}
      uppercase
      className={'shrink-0 tracking-[0.24em]'}
    >
      {children}
    </Text>
    {readout != null && (
      <Text
        tag={'span'}
        size={'hint'}
        tone={'system'}
        uppercase
        className={'shrink-0'}
      >
        {readout}
      </Text>
    )}
  </div>
)

export const FieldLabel = ({
  children,
  readout,
  className,
  tone = 'secondary',
  gap = 'regular',
  blockComment = false,
}: Props) => (
  <Text
    size={'hint'}
    tone={tone}
    uppercase
    className={cns(
      'flex flex-wrap items-baseline gap-x-3 gap-y-1 italic',
      GAP_CLASSES[gap],
      className,
    )}
  >
    <span>{blockComment ? <>/* {children} */</> : <>// {children}</>}</span>
    {readout != null && (
      <Text tag={'span'} size={'hint'} tone={'system'}>
        {readout}
      </Text>
    )}
  </Text>
)
