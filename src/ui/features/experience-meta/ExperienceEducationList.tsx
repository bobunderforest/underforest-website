import { EDUCATION } from 'ui/features/experience-data/experience-data'
import { FieldLabel } from 'ui/sections/FieldLabel'
import { Text } from 'ui/common/typography/Text'

export const ExperienceEducationList = () => (
  <div>
    <FieldLabel>education</FieldLabel>
    <Text tag={'ul'} className={'grid gap-4'}>
      {EDUCATION.map((entry) => (
        <li key={entry.degree}>
          <Text tone={'secondary'} className={'tabular-nums'}>
            {entry.from} — {entry.to}
          </Text>
          <Text tone={'primary'}>{entry.degree}</Text>
          <Text tone={'secondary'}>
            {entry.field}
            <br />
            {entry.place}, {entry.location}
          </Text>
        </li>
      ))}
    </Text>
  </div>
)
