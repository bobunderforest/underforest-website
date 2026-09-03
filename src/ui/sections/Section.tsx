import { SectionContent } from 'ui/common/SectionContent'
import { SectionShell } from './SectionShell'

type Props = React.BaseProps & {
  id: string
  stage: string
  decoration?: React.ReactNode
}

export const Section = ({
  id,
  stage,
  decoration,
  className,
  children,
}: Props) => (
  <SectionShell id={id} stage={stage}>
    {decoration}
    <SectionContent
      isPadded
      className={className}
      classNameWrap={decoration ? 'relative z-10' : undefined}
    >
      {children}
    </SectionContent>
  </SectionShell>
)
