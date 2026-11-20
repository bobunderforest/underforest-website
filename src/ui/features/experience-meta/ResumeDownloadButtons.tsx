import { Button } from 'ui/controls/Button'
import { DisketteIcon } from 'ui/common/cyber-kit/DisketteIcon'
import {
  RESUME_VARIANTS,
  resumeFileHref,
} from 'ui/features/experience-data/experience-data'
import type { Domain } from 'ui/features/experience-data/types'
import { cns } from 'utils/formatters/classnames'

export const RESUME_DOWNLOADS: { variant: Domain; label: string }[] = [
  { variant: 'web', label: 'Resume_Frontend.PDF' },
  { variant: 'gamedev', label: 'Resume_Gamedev.PDF' },
]

export const ResumeDownloadButtons = ({
  className,
}: {
  className?: string
}) => (
  <div
    className={cns(
      `
        grid grid-cols-2 gap-3
        tablet-s:grid-cols-1
      `,
      className,
    )}
  >
    {RESUME_DOWNLOADS.map(({ variant, label }) => (
      <div key={variant}>
        <Button
          dither
          wide
          icon={<DisketteIcon className={'size-[25px]'} />}
          href={resumeFileHref(variant)}
          isExternal
          accent={'neutral'}
          aria-label={`Open ${RESUME_VARIANTS[variant].title} resume PDF`}
        >
          {label}
        </Button>
      </div>
    ))}
  </div>
)
