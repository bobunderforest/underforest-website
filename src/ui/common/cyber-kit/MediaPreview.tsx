import { ImageOpenable } from 'ui/common/image-openable-modal/ImageOpenable'
import type { ImageModalPaging } from 'ui/common/image-openable-modal/ImageModalPaging'
import { VideoOpenable } from 'ui/common/video-openable-modal/VideoOpenable'

type MediaPreviewProps =
  | {
      kind: 'image'
      src: string
      alt?: string
      paging?: ImageModalPaging
      index?: number
      aspectRatio?: number
    }
  | { kind: 'video'; src: string; poster?: string; aspectRatio?: number }
  | { kind: 'embed'; provider: 'youtube'; embedId: string }

export const MediaPreview = (props: MediaPreviewProps) => (
  <div
    style={
      props.kind !== 'embed' && props.aspectRatio
        ? { aspectRatio: props.aspectRatio }
        : undefined
    }
    className={'aspect-video w-full overflow-hidden border border-edge'}
  >
    {props.kind === 'image' && (
      <ImageOpenable
        src={props.src}
        alt={props.alt}
        paging={props.paging}
        index={props.index}
        className={'size-full object-cover'}
      />
    )}
    {props.kind === 'video' && (
      <VideoOpenable
        src={props.src}
        poster={props.poster}
        className={'size-full'}
      />
    )}
    {props.kind === 'embed' && (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${props.embedId}`}
        title={'Embedded video'}
        loading={'lazy'}
        allow={
          'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        }
        allowFullScreen
        className={'size-full border-0'}
      />
    )}
  </div>
)
