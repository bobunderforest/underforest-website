import { SectionShell } from './SectionShell'
import { usePageDataMain } from 'modules/page-data/page-data-hooks'
import { ProjectPreview } from 'ui/features/projects/ProjectPreview'
import { SectionContent } from 'ui/common/SectionContent'
import { SectionTitle } from './SectionTitle'

export const SectionProjects = () => {
  const projects = usePageDataMain('projects')
  const leftProjects = projects.filter((_, index) => index % 2 === 0)
  const rightProjects = projects.filter((_, index) => index % 2 === 1)

  return (
    <SectionShell id={'projects'} stage={'Projects'}>
      <SectionContent isPadded>
        <SectionTitle alias={'portfolio'} kicker={'selected'}>
          projects
        </SectionTitle>
        <div
          className={
            'grid grid-cols-2 gap-grid-gap-regular mobile-m:grid-cols-1'
          }
        >
          <div className={'flex flex-col'}>
            {leftProjects.map((entry, index) => (
              <ProjectPreview
                key={entry.id}
                entry={entry}
                className={
                  index < leftProjects.length - 1
                    ? 'mb-grid-gap-regular'
                    : undefined
                }
              />
            ))}
          </div>
          <div className={'flex flex-col pt-[28.125%] mobile-m:pt-0'}>
            {rightProjects.map((entry, index) => (
              <ProjectPreview
                key={entry.id}
                entry={entry}
                className={
                  index < rightProjects.length - 1
                    ? 'mb-grid-gap-regular'
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </SectionContent>
    </SectionShell>
  )
}
