import { FieldLabel } from 'ui/sections/FieldLabel'
import { LANGUAGES } from 'ui/features/experience-data/experience-data'

export const ExperienceLanguageList = () => (
  <div>
    <FieldLabel>languages</FieldLabel>
    <dl className={'grid gap-1 font-face-regular text-regular'}>
      {LANGUAGES.map((line) => (
        <div key={line.term} className={'flex justify-between gap-4'}>
          {line.term}
        </div>
      ))}
    </dl>
  </div>
)
