import { SKILLS } from 'ui/features/experience-data/experience-data'
import type { Skill } from 'ui/features/experience-data/types'

export type SkillArea = {
  name: string
  skills: Skill[]
}

const UNGROUPED_AREA = 'Other'

const groupSkillsByArea = (skills: Skill[]) =>
  skills.reduce<SkillArea[]>((areas, skill) => {
    const name = skill.area ?? UNGROUPED_AREA
    const area = areas.find((candidate) => candidate.name === name)
    if (area) area.skills.push(skill)
    else areas.push({ name, skills: [skill] })
    return areas
  }, [])

export const SKILL_AREAS = groupSkillsByArea(SKILLS)
