import experience from 'app-data/experience.json'
import type {
  Domain,
  EducationEntry,
  ExperienceDomainFilter,
  ExperienceEntry,
  ExperienceStatusKind,
  MetaLine,
  ProjectRef,
  Skill,
} from './types'

export const SKILLS = experience.skills as Skill[]
export const EXPERIENCE = experience.experience as ExperienceEntry[]
export const PROJECTS = experience.projects as ProjectRef[]
export const LANGUAGES = experience.languages as MetaLine[]
export const EDUCATION = experience.education as EducationEntry[]

export const isDimmed = (
  domainFilter: ExperienceDomainFilter,
  domains: Domain[],
) => domainFilter !== 'unified' && !domains.includes(domainFilter)

export const EXPERIENCE_STATUS_LABEL: Record<ExperienceStatusKind, string> = {
  discontinued: 'Discontinued',
  unavailable: 'Unavailable',
  suspended: 'Suspended',
}
