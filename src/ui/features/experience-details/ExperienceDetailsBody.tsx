import { MediaPreview } from 'ui/common/cyber-kit/MediaPreview'
import { Text } from 'ui/common/typography/Text'
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
    <Text tag={'p'} tone={'primary'}>
      {detail.body}
    </Text>
  )
}
