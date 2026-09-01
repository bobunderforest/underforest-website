import type { ReactNode } from 'react'
import { SectionContent } from 'ui/common/SectionContent'
import { StageIndex } from 'ui/sections/StageIndex'
import { TelemetryBorder } from 'ui/fx/TelemetryBorder'
import { useSectionAnchor } from 'utils/hooks/useSectionAnchor'

type Props = React.BaseProps & {
  id: string
  index: string
  stage: string
  restOffsetTimeline?: number
  enterOffsetTimeline?: number
}

export const Section = ({
  id,
  index,
  stage,
  restOffsetTimeline = 0.28,
  enterOffsetTimeline,
  className,
  children,
}: Props) => {
  useSectionAnchor({ id, restOffsetTimeline, enterOffsetTimeline })

  return (
    <section
      id={id}
      data-stage={stage}
      className={'relative'}
    >
      <TelemetryBorder />
      <SectionContent isPadded className={className}>
        <StageIndex index={index} stage={stage} />
        {children}
      </SectionContent>
    </section>
  )
}
