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

  if (detail.kind === 'embed') {
    return (
      <MediaPreview
        kind={'embed'}
        provider={detail.provider}
        embedId={detail.embedId}
      />
    )
  }

  return (
    <Text tag={'p'} tone={'primary'} className={'whitespace-pre-line'}>
      {detail.body}
    </Text>
  )
}
