import type { ReactNode } from 'react'
import { Text } from 'ui/common/typography/Text'
import { TextTitle } from 'ui/common/typography/TextTitle'
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
      <Text
        tag={'span'}
        size={'hint'}
        face={'title'}
        tone={'accent'}
        className={'font-bold'}
      >
        {index}
      </Text>
      <TextTitle size={3} uppercase className={'font-bold'}>
        {stage}
      </TextTitle>
      {readout != null && (
        <Text
          tag={'span'}
          size={'hint'}
          tone={'system'}
          className={'ml-auto tablet-s:ml-0'}
        >
          {readout}
        </Text>
      )}
    </div>
  )
}
