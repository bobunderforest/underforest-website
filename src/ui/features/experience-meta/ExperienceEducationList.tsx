import { EDUCATION } from 'ui/features/experience-data/experience-data'
import { FieldLabel } from 'ui/sections/FieldLabel'

export const ExperienceEducationList = () => (
  <div>
    <FieldLabel>education</FieldLabel>
    <ul className={'mt-2 grid gap-3 font-face-regular text-[13px]'}>
      {EDUCATION.map((entry) => (
        <li key={entry.degree}>
          <div className={'flex justify-between gap-4'}>
            <span className={'text-text'}>{entry.degree}</span>
            <span className={'text-muted tabular-nums'}>
              {entry.from} — {entry.to}
            </span>
          </div>
          <div className={'text-muted'}>
            {entry.field} · {entry.place}, {entry.location}
          </div>
        </li>
      ))}
    </ul>
  </div>
)
