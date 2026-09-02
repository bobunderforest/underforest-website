import { EXPERIENCE_STATUS_LABEL } from 'ui/features/experience-data/experience-data'
import type { ExperienceStatus } from 'ui/features/experience-data/types'
import { Text } from 'ui/common/typography/Text'

export const ExperienceDetailsStatus = ({
  status,
}: {
  status: ExperienceStatus
}) => (
  <div
    className={
      'border border-accent/50 bg-accent/[0.06] px-3 py-2 backdrop-blur-md'
    }
  >
    <Text
      size={'hint'}
      tone={'accent'}
      uppercase
      className={'mb-2 flex items-center gap-[6px] last:mb-0'}
    >
      <span aria-hidden>⊘</span>
      {EXPERIENCE_STATUS_LABEL[status.kind]}
    </Text>
    {status.note && (
      <Text tag={'p'} tone={'primary'}>
        {status.note}
      </Text>
    )}
  </div>
)
