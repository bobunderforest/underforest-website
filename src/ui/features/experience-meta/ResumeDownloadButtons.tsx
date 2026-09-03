import { Button } from 'ui/controls/Button'
import { DisketteIcon } from 'ui/common/cyber-kit/DisketteIcon'
import {
  RESUME_VARIANTS,
  resumeFileHref,
} from 'ui/features/experience-data/experience-data'
import type { Domain } from 'ui/features/experience-data/types'
import { cns } from 'utils/formatters/classnames'
import { useDossierWire } from './dossier-wire-context'

export const RESUME_DOWNLOADS: { variant: Domain; label: string }[] = [
  { variant: 'web', label: 'Resume_Frontend.PDF' },
  { variant: 'game', label: 'Resume_Gamedev.PDF' },
]

export const ResumeDownloadButtons = ({
  className,
}: {
  className?: string
}) => {
  const { registerTarget } = useDossierWire()

  return (
    <div className={cns('flex flex-col gap-3', className)}>
      {RESUME_DOWNLOADS.map(({ variant, label }) => (
        <div key={variant} ref={registerTarget(variant)}>
          <Button
            dither
            wide
            icon={<DisketteIcon className={'size-[25px]'} />}
            href={resumeFileHref(variant)}
            isExternal
            accent={variant === 'game' ? 'blue' : 'brand'}
            aria-label={`Open ${RESUME_VARIANTS[variant].title} resume PDF`}
          >
            {label}
          </Button>
        </div>
      ))}
    </div>
  )
}
