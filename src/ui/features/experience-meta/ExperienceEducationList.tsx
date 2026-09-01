import { EDUCATION } from 'ui/features/experience-data/experience-data'
import { FieldLabel } from 'ui/sections/FieldLabel'

export const ExperienceEducationList = () => (
  <div>
    <FieldLabel>education</FieldLabel>
    <ul className={'grid gap-4 font-face-regular text-[13px]'}>
      {EDUCATION.map((entry) => (
        <li key={entry.degree}>
          <div className={'text-muted tabular-nums'}>
            {entry.from} — {entry.to}
          </div>
          <div className={'text-text'}>{entry.degree}</div>
          <div className={'text-muted'}>
            {entry.field}
            <br />
            {entry.place}, {entry.location}
          </div>
        </li>
      ))}
    </ul>
  </div>
)
