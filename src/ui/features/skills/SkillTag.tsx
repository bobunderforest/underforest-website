import type { Skill } from 'ui/features/experience-data/types'
import { cns } from 'utils/formatters/classnames'

export const SkillTag = ({
  skill,
  dimmed,
}: {
  skill: Skill
  dimmed: boolean
}) => {
  return (
    <li
      className={cns(
        'relative inline-flex items-center gap-[8px] border px-[11px] py-[6px]',
        'font-face-regular text-hint tracking-[0.1em] uppercase',
        'transition-opacity duration-300',
        skill.primary
          ? 'border-accent/70 bg-accent/[0.08] text-text'
          : 'border-muted/55 text-text',
        skill.rising && 'border-dashed',
        dimmed && 'opacity-30',
      )}
    >
      <span
        aria-hidden
        className={cns(
          'size-[6px] shrink-0',
          skill.primary ? 'bg-accent' : 'border border-muted/80',
        )}
      />
      {skill.label}
      {skill.rising && (
        <span aria-hidden className={'text-accent'}>
          ↑
        </span>
      )}
      {skill.primary && (
        <>
          <span
            aria-hidden
            className={
              'absolute -top-px -left-px size-[5px] border-t-2 border-l-2 border-accent'
            }
          />
          <span
            aria-hidden
            className={
              'absolute -right-px -bottom-px size-[5px] border-r-2 border-b-2 border-accent'
            }
          />
        </>
      )}
    </li>
  )
}
