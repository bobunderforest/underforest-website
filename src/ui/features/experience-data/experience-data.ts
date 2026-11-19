import experience from 'app-data/experience.json'
import resume from 'app-data/resume.json'
import type {
  Domain,
  EducationEntry,
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

export const resumeFileHref = (variant: Domain) =>
  `/resume/${RESUME_VARIANTS[variant].file}`

export const hasExperienceDetails = (entry: ExperienceEntry) =>
  Boolean(
    entry.details?.length ||
    entry.status ||
    entry.credits?.length ||
    entry.skills?.length ||
    entry.href ||
    entry.links?.length,
  )

const WEB_EMPLOYMENT_LABEL: Record<string, string | undefined> = {
  'Full-time': undefined,
  'Personal project': 'Personal',
  'Contest project': 'Contest',
}

const WEB_EMPLOYMENT_LABEL_BY_ENTRY: Record<string, string> = {
  'ocean-threshold': 'Career pivot',
}

export const webEmploymentLabel = ({
  id,
  employment,
}: Pick<ExperienceEntry, 'id' | 'employment'>) => {
  if (id in WEB_EMPLOYMENT_LABEL_BY_ENTRY) {
    return WEB_EMPLOYMENT_LABEL_BY_ENTRY[id]
  }
  return employment && employment in WEB_EMPLOYMENT_LABEL
    ? WEB_EMPLOYMENT_LABEL[employment]
    : employment
}

export const EXPERIENCE_STATUS_LABEL: Record<ExperienceStatusKind, string> = {
  discontinued: 'Discontinued',
  unavailable: 'Unavailable',
  suspended: 'Suspended',
}
