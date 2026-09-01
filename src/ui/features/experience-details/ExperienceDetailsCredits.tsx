import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import type { Credit } from 'ui/features/experience-data/types'
import { FieldLabel } from 'ui/sections/FieldLabel'

const ExperienceCreditName = ({ credit }: { credit: Credit }) =>
  credit.href ? (
    <Link
      href={credit.href}
      isExternal
      className={'text-right text-text link-dash'}
    >
      {credit.name}
    </Link>
  ) : (
    <Text tag={'span'} tone={'primary'} className={'text-right'}>
      {credit.name}
    </Text>
  )

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
        <Text
          tag={'li'}
          tone={'secondary'}
          key={credit.role + credit.name}
          className={
            'group/credit grid grid-cols-[auto_1fr_auto] items-baseline gap-2'
          }
        >
          <Text
            tag={'span'}
            tone={'dimmed'}
            uppercase
            className={
              'transition-colors duration-200 group-hover/credit:text-system'
            }
          >
            {credit.role}
          </Text>
          <span
            aria-hidden
            className={
              'border-b border-dotted border-muted/45 transition-colors duration-200 group-hover/credit:border-system/75'
            }
          />
          <ExperienceCreditName credit={credit} />
        </Text>
      ))}
    </Text>
  </div>
)
