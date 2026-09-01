import { MediaPreview } from 'ui/common/cyber-kit/MediaPreview'
import { Text } from 'ui/common/typography/Text'
import { Link } from 'ui/common/typography/Link'
import type { ProjectStoryBlock } from 'ui/features/experience-data/types'

export const ProjectStoryBeat = ({ block }: { block: ProjectStoryBlock }) => {
  switch (block.kind) {
    case 'text':
      return (
        <Text
          tag={'p'}
          tone={'primary'}
          className={'max-w-[62ch] whitespace-pre-line'}
        >
          {block.body}
        </Text>
      )
    case 'image':
      return (
        <div className={'max-w-[750px]'}>
          <MediaPreview kind={'image'} src={block.src} />
        </div>
      )
    case 'video':
      return (
        <div className={'max-w-[750px]'}>
          <MediaPreview kind={'video'} src={block.src} poster={block.poster} />
        </div>
      )
    case 'embed':
      return (
        <MediaPreview
          kind={'embed'}
          provider={block.provider}
          embedId={block.embedId}
        />
      )
    case 'gallery':
      return (
        <div className={'grid grid-cols-2 gap-2 tablet-s:grid-cols-1'}>
          {block.items.map((item) => (
            <MediaPreview key={item.src} kind={'image'} src={item.src} />
          ))}
        </div>
      )
    case 'link':
      return (
        <Link
          href={block.href}
          isExternal
          className={'w-fit text-accent link-dash'}
        >
          {block.label} ↗
        </Link>
      )
  }
}
