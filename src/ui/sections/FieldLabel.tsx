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

export const FieldLabel = ({
  children,
  readout,
  className,
  tone = 'secondary',
  gap = 'regular',
  blockComment = false,
}: Props) => {
  return (
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
}
