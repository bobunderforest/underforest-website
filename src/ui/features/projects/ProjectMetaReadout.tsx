import { Text } from 'ui/common/typography/Text'
import { formatDateDuration } from 'utils/formatters/dates'
import type { ProjectEntry } from 'ui/features/experience-data/types'

const Row = ({ term, value }: { term: string; value: string }) => (
  <Text
    tag={'div'}
    size={'hint'}
    uppercase
    className={'group/row grid grid-cols-[auto_1fr_auto] items-baseline gap-2'}
  >
    <Text
      tag={'span'}
      tone={'dimmed'}
      className={'transition-colors duration-200 group-hover/row:text-system'}
    >
      {term}
    </Text>
    <span
      aria-hidden
      className={
        'border-b border-dotted border-muted/45 transition-colors duration-200 group-hover/row:border-system/75'
      }
    />
    <Text
      tag={'span'}
      tone={'primary'}
      className={'text-right whitespace-nowrap tabular-nums'}
    >
      {value}
    </Text>
  </Text>
)

export const ProjectMetaReadout = ({ entry }: { entry: ProjectEntry }) => {
  const duration =
    entry.from && entry.to ? formatDateDuration(entry.from, entry.to) : null

  return (
    <div
      className={
        'flex flex-col gap-1 border border-edge bg-base/50 px-3 py-2.5 backdrop-blur-md'
      }
    >
      {entry.periodLabel && (
        <Row
          term={'period'}
          value={
            duration ? `${entry.periodLabel} · ${duration}` : entry.periodLabel
          }
        />
      )}
      {entry.role && <Row term={'role'} value={entry.role} />}
      {entry.employment && <Row term={'employ'} value={entry.employment} />}
      {entry.domains && entry.domains.length > 0 && (
        <Row term={'domain'} value={entry.domains.join(' · ')} />
      )}
    </div>
  )
}
