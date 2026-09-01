import { Text } from 'ui/common/typography/Text'

const ExperienceDetailsSkillTag = ({ skill }: { skill: string }) => (
  <Text
    tag={'li'}
    size={'hint'}
    tone={'system'}
    className={
      'border border-system/55 bg-system/[0.07] px-[7px] py-[3px] whitespace-nowrap'
    }
  >
    {skill}
  </Text>
)

export const ExperienceDetailsSkills = ({ skills }: { skills: string[] }) => (
  <div className={'flex flex-col gap-1'}>
    <Text size={'hint'} tone={'secondary'} uppercase>
      skills
    </Text>
    <Text
      tag={'ul'}
      size={'inherit'}
      className={'flex flex-wrap gap-1'}
    >
      {skills.map((skill) => (
        <ExperienceDetailsSkillTag key={skill} skill={skill} />
      ))}
    </Text>
  </div>
)
