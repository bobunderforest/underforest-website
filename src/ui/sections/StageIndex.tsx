import { Text } from 'ui/common/typography/Text'
import { TextTitle } from 'ui/common/typography/TextTitle'
import { cns } from 'utils/formatters/classnames'

type Props = {
  index: string
  stage: string
  className?: string
}

export const StageIndex = ({ index, stage, className }: Props) => {
  return (
    <div
      className={cns('relative mb-25 items-baseline tablet-s:mb-15', className)}
    >
      <Text
        tag={'div'}
        size={'inherit'}
        face={'title'}
        tone={'accent'}
        className={'text-[40px] leading-[1] font-light italic'}
      >
        {index}
      </Text>
      <TextTitle
        size={1}
        uppercase
        className={'relative left-[-0.05em] leading-[1] font-bold'}
      >
        {stage}
      </TextTitle>
    </div>
  )
}
