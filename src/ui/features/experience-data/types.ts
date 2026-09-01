export type Domain = 'web' | 'game'

export type ExperienceDomainFilter = Domain | 'unified'

export type LinkRef = { label: string; href: string }

export type ExperienceDetail =
  | { kind: 'image'; src: string; alt?: string; caption?: string }
  | { kind: 'video'; src: string; poster?: string; caption?: string }
  | { kind: 'embed'; provider: 'youtube'; embedId: string; caption?: string }
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
  skills?: string[]
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

export enum ProjectBackground {
  PsySky = 'psy-sky',
}

export type ProjectCover =
  | { kind: 'video'; src: string; poster?: string }
  | { kind: 'image'; src: string }
  | { kind: ProjectBackground }

export type ProjectStoryBlock =
  | ExperienceDetail
  | {
      kind: 'gallery'
      items: { src: string; alt?: string }[]
      caption?: string
    }
  | { kind: 'link'; href: string; label: string; caption?: string }

export type ProjectRef = {
  id: string
  description?: string
  dataFromExperience?: boolean
  from?: string
  to?: string
  period?: string
  role?: string
  employment?: string
  place?: string
  label?: string
  skills?: string[]
  href?: string
  summary?: string[]
  links?: LinkRef[]
  domains?: Domain[]
  reclassified?: boolean
  break?: boolean
  details?: ExperienceDetail[]
  status?: ExperienceStatus
  credits?: Credit[]
  cover?: ProjectCover
  story?: ProjectStoryBlock[]
}

export type ProjectEntry = Omit<ProjectRef, 'story'> & {
  title: string
  description?: string
  periodLabel: string
  story: ProjectStoryBlock[]
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
