import resume from 'app-data/resume.json'

export type Domain = 'web' | 'game'

export type Model = Domain | 'unified'

export type LinkRef = { label: string; href: string }

export type ExperienceDetail =
  | { kind: 'image'; src: string; alt?: string; caption?: string }
  | { kind: 'video'; src: string; poster?: string; caption?: string }
  | { kind: 'text'; body: string; caption?: string }

export type ExperienceStatusKind = 'discontinued' | 'unavailable' | 'suspended'

export type ExperienceStatus = {
  kind: ExperienceStatusKind
  note?: string
}

export type Credit = {
  role: string
  name: string
  href?: string
}

export type Skill = {
  label: string
  domains: Domain[]
  primary?: boolean
  rising?: boolean
}

export type ExperienceEntry = {
  id: string
  from: string
  to: string
  role?: string
  employment?: string
  place?: string
  href?: string
  summary: string[]
  links?: LinkRef[]
  domains: Domain[]
  reclassified?: boolean
  break?: boolean
  details?: ExperienceDetail[]
  status?: ExperienceStatus
  credits?: Credit[]
}

export type ProjectRef = {
  label: string
  href: string
  period: string
  links: LinkRef[]
}

export type MetaLine = { term: string; value: string }

export type EducationEntry = {
  degree: string
  field: string
  place: string
  location: string
  from: string
  to: string
}

export type SocialLink = { label: string; href: string }

export const SKILLS = resume.skills as Skill[]
export const EXPERIENCE = resume.experience as ExperienceEntry[]
export const PROJECTS = resume.projects as ProjectRef[]
export const LANGUAGES = resume.languages as MetaLine[]
export const EDUCATION = resume.education as EducationEntry[]
export const SOCIALS = resume.socials as SocialLink[]

export const isDimmed = (model: Model, domains: Domain[]) =>
  model !== 'unified' && !domains.includes(model)

export const EXPERIENCE_STATUS_LABEL: Record<ExperienceStatusKind, string> = {
  discontinued: 'Discontinued',
  unavailable: 'Unavailable',
  suspended: 'Suspended',
}
