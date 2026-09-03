import { SectionShell } from './SectionShell'
import { usePageDataProject } from 'modules/page-data/page-data-hooks'
import { ProjectFrame } from 'ui/features/projects/ProjectFrame'

export const SectionProject = () => {
  const project = usePageDataProject('project')

  return (
    <SectionShell withEdge id={'project'} stage={'Subject'}>
      <ProjectFrame entry={project} slot={'00'} />
    </SectionShell>
  )
}
