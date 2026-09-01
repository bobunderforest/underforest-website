import type { ReactNode } from 'react'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { EXPERIENCE_STATUS_LABEL } from 'ui/features/experience-data/experience-data'
import type {
  ExperienceEntry,
  ExperienceStatus,
} from 'ui/features/experience-data/types'
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

export const ExperienceTitleRole = ({ role }: { role?: string }) =>
  role ? (
    <Text
      tag={'span'}
      size={'regular'}
      tone={'secondary'}
      weight={'normal'}
      className={'whitespace-nowrap'}
    >
      <span aria-hidden>· </span>
      {role}
    </Text>
  ) : null

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

export const ExperienceTag = ({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) => (
  <Text
    tag={'span'}
    size={'hint'}
    uppercase
    className={cns(
      'inline-flex items-center gap-[6px] border px-[6px] py-[1px]',
      className,
    )}
  >
    {children}
  </Text>
)

export const ExperienceReclassifiedTag = () => (
  <ExperienceTag className={'border-accent text-accent'}>
    Reclassified · web → gamedev
  </ExperienceTag>
)

export const ExperienceStatusTag = ({
  status,
}: {
  status: ExperienceStatus
}) => (
  <ExperienceTag className={'border-muted/60 text-muted'}>
    <span aria-hidden>⊘</span>
    {EXPERIENCE_STATUS_LABEL[status.kind]}
  </ExperienceTag>
)

export const ExperienceEntryTags = ({ entry }: { entry: ExperienceEntry }) =>
  entry.reclassified || entry.status ? (
    <div className={'mb-2 flex flex-wrap gap-2'}>
      {entry.reclassified && <ExperienceReclassifiedTag />}
      {entry.status && <ExperienceStatusTag status={entry.status} />}
    </div>
  ) : null

export const ExperienceStatusNote = ({
  status,
}: {
  status: ExperienceStatus
}) =>
  status.note ? (
    <Text
      tag={'p'}
      size={'hint'}
      tone={'secondary'}
      className={'hidden max-w-[62ch] italic tablet-s:block'}
    >
      {status.note}
    </Text>
  ) : null

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
        {duration && (
          <span className={'text-muted/70 normal-case'}> ({duration})</span>
        )}
      </span>
      {entry.employment && <> · {entry.employment}</>}
    </Text>
  )
}

export const ExperienceSummary = ({
  lines,
  hasStatusNote,
}: {
  lines: string[]
  hasStatusNote: boolean
}) => (
  <Text
    tag={'ul'}
    tone={'secondary'}
    className={cns(
      'max-w-[62ch] transition-colors duration-300 group-data-[active=true]:text-text',
      hasStatusNote && 'tablet-s:mb-3',
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
  dimmed,
}: {
  entry: ExperienceEntry
  dimmed: boolean
}) => (
  <ExperienceTrackNode dimmed={dimmed}>
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
