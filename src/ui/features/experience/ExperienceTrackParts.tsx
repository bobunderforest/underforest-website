import { forwardRef, type ReactNode } from 'react'
import { CorneredBorder } from 'ui/common/cyber-kit/CorneredBorder'
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
      'relative py-8 pl-16 transition-opacity duration-300',
      'before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px before:bg-edge',
      'first:before:top-8 last:before:bottom-auto last:before:h-[42px]',
      dimmed && 'opacity-30',
      active && 'z-[1]',
    )}
  >
    {children}
  </li>
))

export const ExperienceDetectionFrame = () => (
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
      )}
    />
    <CorneredBorder
      className={
        'opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100'
      }
    />
  </span>
)

export const ExperienceAnchor = ({ children }: { children: ReactNode }) => (
  <div
    className={
      'relative before:absolute before:top-[10px] before:left-[-64px] before:h-px before:w-[58px] before:bg-edge'
    }
  >
    {children}
  </div>
)

export const ExperienceMarker = ({ entry }: { entry: ExperienceEntry }) => (
  <span
    aria-hidden
    className={cns(
      'absolute z-[1] border-2 bg-base',
      entry.break
        ? 'top-[7px] left-[-67px] size-[6px] border-muted'
        : 'top-[5px] left-[-69px] size-[10px]',
      !entry.break && entry.reclassified && 'border-accent bg-accent',
      !entry.break && !entry.reclassified && 'border-system',
    )}
  />
)
