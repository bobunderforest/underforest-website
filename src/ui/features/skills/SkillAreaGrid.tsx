import type { Skill } from 'ui/features/experience-data/types'
import { Text } from 'ui/common/typography/Text'
import { cns } from 'utils/formatters/classnames'
import { SKILL_AREAS, type SkillArea } from './skill-areas'

const SkillItem = ({ skill }: { skill: Skill }) => (
  <Text
    tag={'li'}
    tone={'primary'}
    className={cns(
      'flex items-center gap-[9px] py-[3px]',
      !skill.primary && 'italic',
    )}
  >
    <span
      aria-hidden
      className={cns(
        'size-[6px] shrink-0',
        skill.primary ? 'bg-accent' : 'border border-edge',
      )}
    />
    {skill.label}
  </Text>
)

const SkillAreaColumn = ({ area }: { area: SkillArea }) => (
  <div>
    <div
      className={`
        mb-[8px] flex items-baseline justify-between gap-3 border-b border-edge
        pb-[6px]
      `}
    >
      <Text
        tag={'h3'}
        size={'hint'}
        tone={'dimmed'}
        uppercase
        className={'tracking-[0.14em]'}
      >
        {area.name}
      </Text>
    </div>
    <ul>
      {area.skills.map((skill) => (
        <SkillItem key={skill.label} skill={skill} />
      ))}
    </ul>
  </div>
)

export const SkillAreaGrid = () => (
  <div
    className={`
      grid max-w-[740px] grid-cols-3 gap-x-[26px] gap-y-[22px]
      tablet-s:grid-cols-2
      mobile-m:grid-cols-1
    `}
  >
    {SKILL_AREAS.map((area) => (
      <SkillAreaColumn key={area.name} area={area} />
    ))}
  </div>
)
