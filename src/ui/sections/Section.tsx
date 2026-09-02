import type { ReactNode } from 'react'
import { SectionContent } from 'ui/common/SectionContent'
import { StageIndex } from 'ui/sections/StageIndex'
import { SignalBorder } from 'ui/fx/SignalBorder'
import { useSectionAnchor } from 'utils/hooks/useSectionAnchor'

type Props = React.BaseProps & {
  id: string
  index: string
  stage: string
  stageAlias?: string
  hideBorder?: boolean
  restOffsetTimeline?: number
  enterOffsetTimeline?: number
}

export const Section = ({
  id,
  index,
  stage,
  stageAlias,
  hideBorder,
  restOffsetTimeline = 0.28,
  enterOffsetTimeline,
  className,
  children,
}: Props) => {
  useSectionAnchor({ id, restOffsetTimeline, enterOffsetTimeline })

  return (
    <section id={id} data-stage={stage} className={'relative'}>
      {!hideBorder && <SignalBorder />}
      <SectionContent isPadded className={className}>
        <StageIndex index={index} stage={stage} alias={stageAlias} />
        {children}
      </SectionContent>
    </section>
  )
}
