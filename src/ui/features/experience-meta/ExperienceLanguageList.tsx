import { FieldLabel } from 'ui/sections/FieldLabel'
import type { MetaLine } from 'ui/features/experience-data/types'

export const ExperienceLanguageList = ({ lines }: { lines: MetaLine[] }) => (
  <div>
    <FieldLabel>languages</FieldLabel>
    <dl className={'mt-2 grid gap-1 font-face-regular text-[13px]'}>
      {lines.map((line) => (
        <div key={line.term} className={'flex justify-between gap-4'}>
          <dt className={'text-text'}>{line.term}</dt>
          <dd className={'text-muted tabular-nums'}>{line.value}</dd>
        </div>
      ))}
    </dl>
  </div>
)
