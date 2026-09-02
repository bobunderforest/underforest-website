import { resolveProjectMediaGeometry } from './project-media-geometry'
import { getProjects } from 'ui/features/projects/projects-data'

export const getPageDataMain = async () => ({
  projects: await resolveProjectMediaGeometry(getProjects()),
})

export type PageDataMain = Awaited<ReturnType<typeof getPageDataMain>>
