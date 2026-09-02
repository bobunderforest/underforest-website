import projects from 'app-data/projects.json'
import { EXPERIENCE } from 'ui/features/experience-data/experience-data'
import type {
  ProjectEntry,
  ProjectRef,
} from 'ui/features/experience-data/types'
import { formatDateRange } from 'utils/formatters/dates'

const experienceById = new Map(EXPERIENCE.map((entry) => [entry.id, entry]))

const resolveProject = (raw: ProjectRef): ProjectEntry => {
  const base = raw.dataFromExperience ? experienceById.get(raw.id) : undefined
  const merged: ProjectRef = { ...base, ...raw }

  const periodLabel =
    merged.period ??
    (merged.from && merged.to
      ? formatDateRange(merged.from, merged.to, 'short')
      : '')

  return {
    ...merged,
    title: merged.label || merged.place || merged.id,
    periodLabel,
    story: merged.story ?? merged.details ?? [],
  }
}

export const getProjects = (): ProjectEntry[] =>
  (projects.projects as ProjectRef[]).map(resolveProject)
