import { MediaPreview } from 'ui/common/cyber-kit/MediaPreview'
import { Link } from 'ui/common/typography/Link'
import type { ProjectStoryBlock } from 'ui/features/experience-data/types'
import { ProjectStoryGallery } from './ProjectStoryGallery'
import { ProjectStoryText } from './ProjectStoryText'

export const ProjectStoryBlockContent = ({
  block,
}: {
  block: ProjectStoryBlock
}) => {
  switch (block.kind) {
    case 'end':
      return null
    case 'text':
      return <ProjectStoryText body={block.body} />
    case 'image':
      return (
        <div
          className={
            'max-w-[750px] desktop-s:max-w-[650px] tablet-s:max-w-[450px]'
          }
        >
          <MediaPreview kind={'image'} src={block.src} alt={block.alt} />
        </div>
      )
    case 'video':
      return (
        <div
          className={
            'max-w-[750px] desktop-s:max-w-[650px] tablet-s:max-w-[450px]'
          }
        >
          <MediaPreview kind={'video'} src={block.src} poster={block.poster} />
        </div>
      )
    case 'embed':
      return (
        <div
          className={
            'max-w-[750px] desktop-s:max-w-[650px] tablet-s:max-w-[450px]'
          }
        >
          <MediaPreview
            kind={'embed'}
            provider={block.provider}
            embedId={block.embedId}
          />
        </div>
      )
    case 'gallery':
      return <ProjectStoryGallery items={block.items} />
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
