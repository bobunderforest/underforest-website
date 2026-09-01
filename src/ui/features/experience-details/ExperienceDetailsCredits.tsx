import { Link } from 'ui/common/typography/Link'
import type { Credit } from 'ui/features/experience-data/types'
import { FieldLabel } from 'ui/sections/FieldLabel'

export const ExperienceDetailsCredits = ({
  credits,
}: {
  credits: Credit[]
}) => (
  <div className={'border border-edge px-3 py-2'}>
    <FieldLabel className={'mb-2 text-system'}>credits</FieldLabel>
    <ul className={'font-face-regular text-regular leading-[1.6]'}>
      {credits.map((credit) => (
        <li key={credit.role + credit.name} className={'text-muted'}>
          <span className={'tracking-[0.08em] text-muted/70 uppercase'}>
            {credit.role}
          </span>
          {' — '}
          {credit.href ? (
            <Link
              href={credit.href}
              isExternal
              className={'text-text link-dash'}
            >
              {credit.name}
            </Link>
          ) : (
            <span className={'text-text'}>{credit.name}</span>
          )}
        </li>
      ))}
    </ul>
  </div>
)
