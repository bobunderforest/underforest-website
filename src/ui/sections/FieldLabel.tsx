import type { ReactNode } from 'react'
import { Text } from 'ui/common/typography/Text'
import type { TextTone } from 'ui/common/typography/Text'
import { cns } from 'utils/formatters/classnames'

type Props = {
  children: ReactNode
  readout?: ReactNode
  className?: string
  tone?: TextTone
  blockComment?: boolean
}

export const FieldLabel = ({
  children,
  readout,
  className,
  tone = 'secondary',
  blockComment = false,
}: Props) => {
  return (
    <Text
      size={'hint'}
      tone={tone}
      uppercase
      className={cns(
        'mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 italic',
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
