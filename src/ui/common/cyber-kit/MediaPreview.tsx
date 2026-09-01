import { ImageOpenable } from 'ui/common/image-openable-modal/ImageOpenable'
import { VideoOpenable } from 'ui/common/video-openable-modal/VideoOpenable'

type MediaPreviewProps =
  | { kind: 'image'; src: string }
  | { kind: 'video'; src: string; poster?: string }

export const MediaPreview = (props: MediaPreviewProps) => (
  <div className={'aspect-video w-full overflow-hidden border border-edge'}>
    {props.kind === 'image' ? (
      <ImageOpenable src={props.src} className={'size-full object-cover'} />
    ) : (
      <VideoOpenable
        src={props.src}
        poster={props.poster}
        className={'size-full'}
      />
    )}
  </div>
)
