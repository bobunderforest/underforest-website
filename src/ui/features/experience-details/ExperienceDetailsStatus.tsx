import { EXPERIENCE_STATUS_LABEL } from 'ui/features/experience-data/experience-data'
import type { ExperienceStatus } from 'ui/features/experience-data/types'

export const ExperienceDetailsStatus = ({
  status,
}: {
  status: ExperienceStatus
}) => (
  <div className={'border border-accent/50 bg-accent/[0.06] px-3 py-2'}>
    <div
      className={
        'flex items-center gap-[6px] font-face-regular text-[10px] tracking-[0.16em] text-accent uppercase'
      }
    >
      <span aria-hidden>⊘</span>
      {EXPERIENCE_STATUS_LABEL[status.kind]}
    </div>
    {status.note && (
      <p
        className={'mt-2 font-face-regular text-[13px] leading-[1.5] text-text'}
      >
        {status.note}
      </p>
    )}
  </div>
)
