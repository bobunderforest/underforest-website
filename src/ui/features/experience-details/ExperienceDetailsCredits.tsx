import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import type { Credit } from 'ui/features/experience-data/types'
import { FieldLabel } from 'ui/sections/FieldLabel'

export const ExperienceDetailsCredits = ({
  credits,
}: {
  credits: Credit[]
}) => (
  <div className={'border border-edge px-3 py-2'}>
    <FieldLabel tone={'system'} className={'mb-2'}>
      credits
    </FieldLabel>
    <Text tag={'ul'}>
      {credits.map((credit) => (
        <Text tag={'li'} tone={'secondary'} key={credit.role + credit.name}>
          <Text tag={'span'} tone={'dimmed'} uppercase>
            {credit.role}
          </Text>
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
            <Text tag={'span'} tone={'primary'}>
              {credit.name}
            </Text>
          )}
        </Text>
      ))}
    </Text>
  </div>
)
