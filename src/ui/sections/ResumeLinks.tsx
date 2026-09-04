import { ChannelLink } from 'ui/common/cyber-kit/ChannelLink'
import { DisketteIcon } from 'ui/common/cyber-kit/DisketteIcon'
import { resumeFileHref } from 'ui/features/experience-data/experience-data'
import type { Domain } from 'ui/features/experience-data/types'
import { cns } from 'utils/formatters/classnames'
import { FieldLabel } from './FieldLabel'

const resumeVariants: { variant: Domain; label: string }[] = [
  { variant: 'game', label: 'gamedev' },
  { variant: 'web', label: 'frontend' },
]

export const ResumeLinks = ({ className }: { className?: string }) => (
  <div className={className}>
    <FieldLabel readout={`${resumeVariants.length} files`}>resume</FieldLabel>
    <div
      className={cns(
        'flex max-w-column-width flex-wrap items-center gap-[8px]',
        'mobile-m:gap-[6px]',
      )}
    >
      {resumeVariants.map(({ variant, label }) => (
        <ChannelLink
          key={variant}
          href={resumeFileHref(variant)}
          label={label}
          tone={variant === 'game' ? 'atomic' : 'system'}
          trailingIcon={
            <DisketteIcon className={'my-[-0.4em] size-[1.5em] shrink-0'} />
          }
        />
      ))}
    </div>
  </div>
)
