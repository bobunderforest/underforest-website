import resume from 'app-data/resume.json'
import type {
  Domain,
  EducationEntry,
  ExperienceDomainFilter,
  ExperienceEntry,
  ExperienceStatusKind,
  MetaLine,
  ProjectRef,
  Skill,
  SocialLink,
} from './types'

export const SKILLS = resume.skills as Skill[]
export const EXPERIENCE = resume.experience as ExperienceEntry[]
export const PROJECTS = resume.projects as ProjectRef[]
export const LANGUAGES = resume.languages as MetaLine[]
export const EDUCATION = resume.education as EducationEntry[]
export const SOCIALS = resume.socials as SocialLink[]

export const isDimmed = (
  domainFilter: ExperienceDomainFilter,
  domains: Domain[],
) => domainFilter !== 'unified' && !domains.includes(domainFilter)

export const EXPERIENCE_STATUS_LABEL: Record<ExperienceStatusKind, string> = {
  discontinued: 'Discontinued',
  unavailable: 'Unavailable',
  suspended: 'Suspended',
}
