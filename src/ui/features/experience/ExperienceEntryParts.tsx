import type { ReactNode } from 'react'
import { Link } from 'ui/common/typography/Link'
import { EXPERIENCE_STATUS_LABEL } from 'ui/features/experience-data/experience-data'
import type {
  ExperienceEntry,
  ExperienceStatus,
} from 'ui/features/experience-data/types'
import { cns } from 'utils/formatters/classnames'
import { formatDateRange } from 'utils/formatters/dates'
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

export const ExperienceTag = ({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) => (
  <span
    className={cns(
      'inline-flex items-center gap-[6px] border px-[6px] py-[1px] font-face-regular text-[11px] tracking-[0.14em] uppercase',
      className,
    )}
  >
    {children}
  </span>
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
    <p
      className={
        'hidden max-w-[62ch] font-face-regular text-[13px] leading-[1.5] text-muted italic desktop-s:block'
      }
    >
      {status.note}
    </p>
  ) : null

export const ExperienceMeta = ({ entry }: { entry: ExperienceEntry }) => (
  <div
    className={cns(
      'font-face-regular text-[12px] tracking-[0.08em] text-muted uppercase transition-colors duration-300 group-data-[active=true]:text-text',
      entry.links && entry.links.length > 0 ? 'mb-1.5' : 'mb-3',
    )}
  >
    <span className={'tabular-nums'}>
      {formatDateRange(entry.from, entry.to, 'short')}
    </span>
    {entry.role && <> · {entry.role}</>}
    {entry.employment && <> · {entry.employment}</>}
  </div>
)

export const ExperienceSummary = ({
  lines,
  hasStatusNote,
}: {
  lines: string[]
  hasStatusNote: boolean
}) => (
  <ul
    className={cns(
      'max-w-[62ch] font-face-regular text-[14px] text-muted transition-colors duration-300 group-data-[active=true]:text-text',
      hasStatusNote && 'desktop-s:mb-3',
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
  </ul>
)

export const ExperienceLinkRow = ({ entry }: { entry: ExperienceEntry }) =>
  entry.links && entry.links.length > 0 ? (
    <div
      className={
        'mb-3 flex flex-wrap gap-x-4 gap-y-1 font-face-regular text-[12px] tracking-[0.06em]'
      }
    >
      {entry.links.map((link) => (
        <ExperienceInnerLink key={link.label} href={link.href}>
          {link.label}
        </ExperienceInnerLink>
      ))}
    </div>
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
      <div
        className={
          'font-face-regular text-[12px] tracking-[0.08em] text-muted/70 uppercase'
        }
      >
        <span className={'tabular-nums'}>
          {formatDateRange(entry.from, entry.to, 'short')}
        </span>{' '}
        · signal gap
      </div>
    </ExperienceAnchor>
    <p className={'text-[14px] text-muted/70 italic'}>
      {entry.summary.join(' ')}
    </p>
  </ExperienceTrackNode>
)
