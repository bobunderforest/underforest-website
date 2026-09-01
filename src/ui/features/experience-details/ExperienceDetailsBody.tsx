import { MediaPreview } from 'ui/common/cyber-kit/MediaPreview'
import type { ExperienceDetail } from 'ui/features/experience-data/types'

export const ExperienceDetailsBody = ({
  detail,
}: {
  detail: ExperienceDetail
}) => {
  if (detail.kind === 'image') {
    return <MediaPreview kind={'image'} src={detail.src} />
  }

  if (detail.kind === 'video') {
    return (
      <MediaPreview kind={'video'} src={detail.src} poster={detail.poster} />
    )
  }

  return (
    <p className={'font-face-regular text-[14px] leading-[1.55] text-text'}>
      {detail.body}
    </p>
  )
}
