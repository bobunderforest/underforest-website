import { ChannelLink } from 'ui/common/cyber-kit/ChannelLink'
import { Button } from 'ui/controls/Button'
import type { ProjectEntry } from 'ui/features/experience-data/types'

export const ProjectLinkRow = ({ entry }: { entry: ProjectEntry }) => {
  if (!entry.href && !entry.links?.length) return null

  return (
    <div className={'flex flex-col items-start gap-3'}>
      {entry.href && (
        <Button
          href={entry.href}
          isExternal
          large
          wide
          className={'w-[380px] max-w-full'}
        >
          Visit project ↗
        </Button>
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
