import { MediaPreview } from 'ui/common/cyber-kit/MediaPreview'
import { Link } from 'ui/common/typography/Link'
import type { ProjectStoryBlock } from 'ui/features/experience-data/types'
import type { ResponsiveValue } from 'utils/browser/breakpoints'
import { useResponsiveValue } from 'utils/hooks/useResponsiveValue'
import { ProjectStoryGallery } from './ProjectStoryGallery'
import { ProjectStoryText } from './ProjectStoryText'

const storyMediaMaxHeight: ResponsiveValue<number> = {
  desktop: 650,
  'desktop-s': 550,
  'tablet-s': 400,
  'mobile-m': 320,
}

const ProjectStoryMedia = ({
  aspectRatio = 16 / 9,
  children,
}: {
  aspectRatio?: number
  children: React.ReactNode
}) => {
  const maxHeight = useResponsiveValue(storyMediaMaxHeight)

  return (
    <div
      className={
        'w-full max-w-[750px] desktop-s:max-w-[650px] tablet-s:max-w-[450px]'
      }
    >
      <div
        style={{
          width: `min(100%, ${maxHeight * aspectRatio}px)`,
          maxHeight,
        }}
      >
        {children}
      </div>
    </div>
  )
}

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
        <ProjectStoryMedia aspectRatio={block.aspectRatio}>
          <MediaPreview
            kind={'image'}
            src={block.src}
            alt={block.alt}
            aspectRatio={block.aspectRatio}
          />
        </ProjectStoryMedia>
      )
    case 'video':
      return (
        <ProjectStoryMedia aspectRatio={block.aspectRatio}>
          <MediaPreview
            kind={'video'}
            src={block.src}
            poster={block.poster}
            aspectRatio={block.aspectRatio}
          />
        </ProjectStoryMedia>
      )
    case 'embed':
      return (
        <ProjectStoryMedia>
          <MediaPreview
            kind={'embed'}
            provider={block.provider}
            embedId={block.embedId}
          />
        </ProjectStoryMedia>
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
