import { SKILLS } from 'ui/features/experience-data/experience-data'
import { SkillTag } from './SkillTag'

const ordered = [...SKILLS].sort(
  (a, b) => Number(Boolean(b.primary)) - Number(Boolean(a.primary)),
)

export const SkillTagsContainer = () => (
  <ul className={'flex max-w-[740px] flex-wrap gap-[8px]'}>
    {ordered.map((skill) => (
      <SkillTag key={skill.label} skill={skill} />
    ))}
  </ul>
)
