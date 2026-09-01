import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { Button } from 'ui/controls/Button'
import type { LinkRef, ProjectEntry } from 'ui/features/experience-data/types'
import { channelTag } from 'utils/formatters/links'

const ChannelChip = ({ link }: { link: LinkRef }) => (
  <Link
    href={link.href}
    isExternal
    className={
      'group relative inline-flex items-stretch border border-edge transition-colors duration-150 hover:border-accent'
    }
  >
    <DataCaptureBorder diagonal muted className={'group-hover:border-accent'} />
    <Text
      tag={'span'}
      size={'hint'}
      uppercase
      tone={'system'}
      className={
        'flex items-center bg-system/[0.08] px-1.5 py-1 tabular-nums transition-colors duration-150 group-hover:bg-accent group-hover:text-base'
      }
    >
      {channelTag(link.href)}
    </Text>
    <Text
      tag={'span'}
      size={'hint'}
      uppercase
      tone={'primary'}
      className={'flex items-center gap-1.5 px-2 py-1'}
    >
      {link.label}
      <span aria-hidden className={'text-muted group-hover:text-accent'}>
        ↗
      </span>
    </Text>
  </Link>
)

export const ProjectLinkRow = ({ entry }: { entry: ProjectEntry }) => {
  if (!entry.href && !entry.links?.length) return null

  return (
    <div className={'flex flex-wrap items-center gap-2'}>
      {entry.href && (
        <Button href={entry.href} isExternal compact>
          visit ↗
        </Button>
      )}
      {entry.links?.map((link) => (
        <ChannelChip key={link.href} link={link} />
      ))}
    </div>
  )
}
