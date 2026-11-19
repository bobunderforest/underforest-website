import type { ReactNode } from 'react'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { webEmploymentLabel } from 'ui/features/experience-data/experience-data'
import type { ExperienceEntry } from 'ui/features/experience-data/types'
import { cns } from 'utils/formatters/classnames'
import { formatDateDuration, formatDateRange } from 'utils/formatters/dates'
import {
  ExperienceAnchor,
  ExperienceMarker,
  ExperienceTrackNode,
} from './ExperienceTrackParts'

export const ExperienceTitleLink = ({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) => (
  <Link
    href={href}
    isExternal
    className={'text-accent link-dash group-data-[lit=true]:decoration-current'}
  >
    {children}
  </Link>
)

export const ExperienceInnerLink = ({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) => (
  <Link
    href={href}
    isExternal
    data-inner
    className={'-m-1 p-1 text-accent link-dash'}
  >
    {children}
  </Link>
)

export const ExperienceMeta = ({ entry }: { entry: ExperienceEntry }) => {
  const duration = formatDateDuration(entry.from, entry.to)

  return (
    <Text
      size={'regular'}
      tone={'secondary'}
      uppercase
      className={'mb-1.5 transition-colors duration-300'}
    >
      <span className={'tabular-nums'}>
        {formatDateRange(entry.from, entry.to, 'short')}
      </span>
      {duration && (
        <span className={'text-muted/70 normal-case mobile-m:block'}>
          <span className={'mobile-m:hidden'}>{' ('}</span>
          {duration}
          <span className={'mobile-m:hidden'}>{')'}</span>
        </span>
      )}
    </Text>
  )
}

export const ExperienceEngagement = ({ entry }: { entry: ExperienceEntry }) => {
  const engagement = [entry.role, webEmploymentLabel(entry)]
    .filter(Boolean)
    .join(' · ')

  return engagement ? (
    <Text
      tag={'span'}
      size={'hint'}
      uppercase
      className={'whitespace-nowrap text-muted/70'}
    >
      {engagement}
    </Text>
  ) : null
}

export const ExperienceSummary = ({ lines }: { lines: string[] }) => (
  <Text
    tag={'ul'}
    tone={'secondary'}
    className={cns(
      'max-w-prose-measure transition-colors duration-300 group-data-[active=true]:text-text',
      'mobile-m:text-text',
    )}
  >
    {lines.map((line) => (
      <li
        key={line}
        className={cns(
          'relative py-[3px] pl-[22px]',
          'before:absolute before:top-0 before:bottom-0 before:left-[3px] before:w-px before:bg-edge',
          'last:before:bottom-auto last:before:h-[13px]',
          'after:absolute after:top-[13px] after:left-[3px] after:h-px after:w-[13px] after:bg-edge',
        )}
      >
        {line}
      </li>
    ))}
  </Text>
)

export const ExperienceLinkRow = ({ entry }: { entry: ExperienceEntry }) =>
  entry.links && entry.links.length > 0 ? (
    <Text className={'mb-2 flex flex-wrap gap-x-4 gap-y-1'}>
      {entry.links.map((link) => (
        <ExperienceInnerLink key={link.label} href={link.href}>
          {link.label}
        </ExperienceInnerLink>
      ))}
    </Text>
  ) : null

export const ExperienceBreakNode = ({
  entry,
  entryRef,
}: {
  entry: ExperienceEntry
  entryRef: React.RefObject<HTMLLIElement | null>
}) => (
  <ExperienceTrackNode ref={entryRef}>
    <ExperienceAnchor className={'mb-1.5'}>
      <ExperienceMarker entry={entry} />
      <Text size={'hint'} tone={'dimmed'} uppercase>
        <span className={'tabular-nums'}>
          {formatDateRange(entry.from, entry.to, 'short')}
        </span>{' '}
        · signal gap
      </Text>
    </ExperienceAnchor>
    <Text tag={'p'} tone={'dimmed'} className={'text-[14px] italic'}>
      {entry.summary.join(' ')}
    </Text>
  </ExperienceTrackNode>
)
