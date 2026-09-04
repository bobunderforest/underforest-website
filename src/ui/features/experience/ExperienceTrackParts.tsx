import { forwardRef, type ReactNode } from 'react'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { cns } from 'utils/formatters/classnames'
import type { ExperienceEntry } from 'ui/features/experience-data/types'

type ExperienceTrackNodeProps = {
  active?: boolean
  children: ReactNode
  dimmed: boolean
}

export const ExperienceTrackNode = forwardRef<
  HTMLLIElement,
  ExperienceTrackNodeProps
>(({ active = false, children, dimmed }, ref) => (
  <li
    ref={ref}
    className={cns(
      'relative py-8 pl-16 transition-opacity duration-300 mobile-m:py-12 mobile-m:pl-0',
      dimmed && 'opacity-30',
      active && 'z-[1]',
    )}
  >
    {children}
  </li>
))

export const ExperienceDetectionFrame = ({
  blinkKey,
}: {
  blinkKey?: string
}) => (
  <span
    aria-hidden
    className={
      'pointer-events-none absolute -top-[20px] -right-[26px] -bottom-[20px] -left-[26px] -z-10'
    }
  >
    <span
      className={cns(
        'absolute inset-0 border border-accent/40 bg-accent/[0.06] opacity-0 transition-[opacity,border-color,background-color] duration-300 group-data-[active=true]:opacity-100',
        'group-data-[lit=true]:border-accent/65 group-data-[lit=true]:bg-accent/[0.09]',
        'mobile-m:bg-base/10 mobile-m:opacity-0 mobile-m:backdrop-blur-[2px] mobile-m:group-data-[active=true]:opacity-0 mobile-m:group-data-[expanded=true]:opacity-100',
      )}
    />
    <DataCaptureBorder
      blinkKey={blinkKey}
      className={
        'opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100 mobile-m:group-data-[active=true]:opacity-0 mobile-m:group-data-[expanded=true]:opacity-100'
      }
    />
  </span>
)

export const ExperienceAnchor = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => (
  <div
    className={cns(
      'relative before:absolute before:top-[10px] before:left-[-64px] before:h-px before:w-[58px] before:bg-edge mobile-m:before:hidden',
      className,
    )}
  >
    {children}
  </div>
)

export const ExperienceMarker = ({ entry }: { entry: ExperienceEntry }) => (
  <span
    aria-hidden
    data-experience-track-marker={entry.id}
    className={cns(
      'absolute z-[1] border-2 bg-base transition-[transform,background-color,border-color] duration-300 ease-out mobile-m:hidden',
      'group-data-[reached=true]:scale-150 group-data-[reached=true]:border-accent group-data-[reached=true]:bg-accent',
      entry.break
        ? 'top-[7px] left-[-67px] size-[6px] border-muted'
        : 'top-[5px] left-[-69px] size-[10px]',
      !entry.break && 'border-system',
    )}
  />
)
