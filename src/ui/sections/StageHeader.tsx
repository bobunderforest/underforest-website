import type { ReactNode } from 'react'
import { ContourField } from 'ui/common/cyber-kit/ContourField'
import { SectionContent } from 'ui/common/SectionContent'
import { StageIndex } from 'ui/sections/StageIndex'
import { FieldLabel } from './FieldLabel'

export type StageHeaderContent = {
  label?: ReactNode
  readout?: ReactNode
  control?: ReactNode
}

type Props = StageHeaderContent & {
  index: string
  stage: string
  alias?: string
}

export const StageHeader = ({
  index,
  stage,
  alias,
  label,
  readout,
  control,
}: Props) => (
  <div className={'relative overflow-hidden bg-base'}>
    <ContourField animate inverted />
    <SectionContent isPadded className={'relative'}>
      <StageIndex index={index} stage={stage} alias={alias} />
      {label != null && <FieldLabel readout={readout}>{label}</FieldLabel>}
      {control && (
        <div className={'relative mt-intersection-padding'}>{control}</div>
      )}
    </SectionContent>
  </div>
)
