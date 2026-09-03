import experience from 'app-data/experience.json'
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
} from './types'

export const SKILLS = experience.skills as Skill[]
export const EXPERIENCE = (experience.experience as ExperienceEntry[]).filter(
  (entry) => !entry.break && !entry.resumeVariants,
)
export const LANGUAGES = experience.languages as MetaLine[]
export const EDUCATION = experience.education as EducationEntry[]

export const RESUME_VARIANTS = resume.variants as Record<
  Domain,
  { file: string; title: string; summary: string[] }
>

export const resumeVariantFor = (domainFilter: ExperienceDomainFilter) =>
  domainFilter === 'unified'
    ? RESUME_VARIANTS.web
    : RESUME_VARIANTS[domainFilter]

export const resumeFileHref = (domainFilter: ExperienceDomainFilter) =>
  `/resume/${resumeVariantFor(domainFilter).file}`

export const isDimmed = (
  domainFilter: ExperienceDomainFilter,
  domains: Domain[],
) => domainFilter !== 'unified' && !domains.includes(domainFilter)

export const hasExperienceDetails = (entry: ExperienceEntry) =>
  Boolean(
    entry.details?.length ||
    entry.status ||
    entry.credits?.length ||
    entry.skills?.length ||
    entry.href ||
    entry.links?.length,
  )

export const EXPERIENCE_STATUS_LABEL: Record<ExperienceStatusKind, string> = {
  discontinued: 'Discontinued',
  unavailable: 'Unavailable',
  suspended: 'Suspended',
}
