import { FieldLabel } from 'ui/sections/FieldLabel'
import { LANGUAGES } from 'ui/features/experience-data/experience-data'
import { Text } from 'ui/common/typography/Text'

export const ExperienceLanguageList = () => (
  <div>
    <FieldLabel>languages</FieldLabel>
    <Text tag={'dl'} className={'grid gap-1'}>
      {LANGUAGES.map((line) => (
        <div key={line.term} className={'flex justify-between gap-4'}>
          {line.term}
        </div>
      ))}
    </Text>
  </div>
)
