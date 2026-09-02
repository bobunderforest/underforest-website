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
    <div className={'mt-1 flex flex-col items-start gap-3 tablet-s:mt-0'}>
      {entry.href && (
        <div ref={primaryRef} className={'w-full'}>
          <Button href={entry.href} isExternal large wide className={'w-full'}>
            Visit project ↗
          </Button>
        </div>
      )}
      {!!entry.links?.length && (
        <div className={'flex flex-wrap items-center gap-2'}>
          {entry.links.map((link) => (
            <ChannelLink key={link.href} {...link} />
          ))}
        </div>
      )}
    </div>
  )
}
