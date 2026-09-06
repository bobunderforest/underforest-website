import { ChannelLink } from 'ui/common/cyber-kit/ChannelLink'
import { Button } from 'ui/controls/Button'
import type { ProjectEntry } from 'ui/features/experience-data/types'

export const ProjectLinkRow = ({
  entry,
  primaryRef,
}: {
  entry: ProjectEntry
  primaryRef?: React.RefObject<HTMLDivElement | null>
}) => {
  if (!entry.href && !entry.links?.length) return null

  return (
    <div className={'flex flex-col items-start gap-4'}>
      {entry.href && (
        <div ref={primaryRef} className={'w-full'}>
          <Button
            href={entry.href}
            isExternal
            large
            wide
            field
            className={'w-full'}
          >
            Visit project ↗
          </Button>
        </div>
      )}
      {!!entry.links?.length && (
        <div className={'flex flex-wrap items-center gap-4'}>
          {entry.links.map((link) => (
            <ChannelLink key={link.href} {...link} />
          ))}
        </div>
      )}
    </div>
  )
}
