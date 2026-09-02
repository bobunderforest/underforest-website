import { Text } from 'ui/common/typography/Text'
import { TextTitle } from 'ui/common/typography/TextTitle'
import { cns } from 'utils/formatters/classnames'

type Props = {
  index: string
  stage: string
  alias?: string
  className?: string
}

const StageAlias = ({ children }: { children: string }) => (
  <div className={'flex items-center gap-3'}>
    <span
      aria-hidden
      className={'size-1.5 border border-system bg-system/20'}
    />
    <Text
      size={'regular'}
      face={'regular'}
      className={'flex items-baseline gap-2 tracking-[0.12em] lowercase'}
    >
      <span className={'text-muted/70 italic'}>aka</span>
      <span className={'font-medium text-system'}>{`"${children}"`}</span>
    </Text>
    <span aria-hidden className={'h-px w-16 bg-system/40 mobile-m:w-10'} />
  </div>
)

export const StageIndex = ({ index, stage, alias, className }: Props) => {
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
        className={cns(
          'relative left-[-0.05em] leading-[1] font-bold',
          alias && 'mb-3',
        )}
      >
        {stage}
      </TextTitle>
      {alias && <StageAlias>{alias}</StageAlias>}
    </div>
  )
}
