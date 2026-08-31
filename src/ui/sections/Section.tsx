import type { ReactNode } from 'react'
import { SectionContent } from 'ui/common/SectionContent'
import { StageIndex } from 'ui/sections/StageIndex'
import { AsciiBorder } from 'ui/fx/AsciiBorder'
import { useSectionAnchor } from 'utils/hooks/useSectionAnchor'

type Props = React.BaseProps & {
  id: string
  index: string
  stage: string
  readout?: ReactNode
  restOffsetTimeline?: number
  enterOffsetTimeline?: number
}

export const Section = ({
  id,
  index,
  stage,
  readout,
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
      className={'relative border-t border-edge first:border-t-0'}
    >
      <AsciiBorder />
      <SectionContent isPadded className={className}>
        <StageIndex index={index} stage={stage} readout={readout} />
        {children}
      </SectionContent>
    </section>
  )
}
