import { resolveProjectMediaGeometry } from './project-media-geometry'
import { getProjects } from 'ui/features/projects/projects-data'

export const getPageDataProject = async (id: string) => {
  const project = getProjects().find((entry) => entry.id === id)
  if (!project) throw new Error(`Unknown project: ${id}`)
  const [resolved] = await resolveProjectMediaGeometry([project])
  return { project: resolved }
}

export type PageDataProject = Awaited<ReturnType<typeof getPageDataProject>>
