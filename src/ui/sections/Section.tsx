import { SectionContent } from 'ui/common/SectionContent'
import { SectionShell } from './SectionShell'
import { StageIndex } from 'ui/sections/StageIndex'
import { ClampDivider } from 'ui/common/cyber-kit/ClampDivider'
import { StageHeader, type StageHeaderContent } from './StageHeader'

type Props = React.BaseProps & {
  id: string
  index: string
  stage: string
  stageAlias?: string
  header?: StageHeaderContent
  hideBorder?: boolean
  decoration?: React.ReactNode
}

export const Section = ({
  id,
  index,
  stage,
  stageAlias,
  header,
  hideBorder,
  decoration,
  className,
  children,
}: Props) => (
  <SectionShell id={id} stage={stage} hideSignal={hideBorder}>
    {decoration}
    {header && (
      <StageHeader index={index} stage={stage} alias={stageAlias} {...header} />
    )}
    <ClampDivider className={'relative z-10'} />
    <SectionContent
      isPadded
      className={className}
      classNameWrap={decoration ? 'relative z-10' : undefined}
    >
      {!header && <StageIndex index={index} stage={stage} alias={stageAlias} />}
      {children}
    </SectionContent>
  </SectionShell>
)
