import type { Skill } from 'ui/features/experience-data/types'
import { cns } from 'utils/formatters/classnames'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { Text } from 'ui/common/typography/Text'

export const SkillTag = ({
  skill,
  dimmed,
}: {
  skill: Skill
  dimmed: boolean
}) => {
  return (
    <Text
      tag={'li'}
      size={'hint'}
      tone={'primary'}
      uppercase
      className={cns(
        'relative inline-flex items-center gap-[8px] border px-[11px] py-[6px]',
        'transition-opacity duration-300',
        skill.primary ? 'border-accent/70 bg-accent/[0.08]' : 'border-muted/55',
        skill.rising && 'border-transparent',
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
        <Text tag={'span'} size={'hint'} tone={'accent'} aria-hidden>
          ↑
        </Text>
      )}
      <DataCaptureBorder
        diagonal
        dashed={skill.rising}
        muted={!skill.primary}
      />
    </Text>
  )
}
