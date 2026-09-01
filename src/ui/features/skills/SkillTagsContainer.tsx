import { useExperienceDomainFilter } from 'ui/features/experience-data/experience-data-context'
import { SKILLS, isDimmed } from 'ui/features/experience-data/experience-data'
import { SkillTag } from './SkillTag'

const ordered = [...SKILLS].sort(
  (a, b) => Number(Boolean(b.primary)) - Number(Boolean(a.primary)),
)

export const SkillTagsContainer = () => {
  const { domainFilter } = useExperienceDomainFilter()

  return (
    <ul className={'mt-4 flex max-w-[760px] flex-wrap gap-[8px]'}>
      {ordered.map((skill) => (
        <SkillTag
          key={skill.label}
          skill={skill}
          dimmed={isDimmed(domainFilter, skill.domains)}
        />
      ))}
    </ul>
  )
}
