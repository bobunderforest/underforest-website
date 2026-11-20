import { SectionShell } from './SectionShell'
import { usePageDataMain } from 'modules/page-data/page-data-hooks'
import { ProjectPreview } from 'ui/features/projects/ProjectPreview'
import { SketchPreview } from 'ui/features/projects/SketchPreview'
import { SectionContent } from 'ui/common/SectionContent'
import { SectionTitle } from './SectionTitle'
import { FieldLabelHeading } from './FieldLabel'

export const SectionProjects = () => {
  const projects = usePageDataMain('projects')
  const selected = projects.filter((entry) => entry.tier !== 'sketch')
  const sketches = projects.filter((entry) => entry.tier === 'sketch')
  const leftProjects = selected.filter((_, index) => index % 2 === 0)
  const rightProjects = selected.filter((_, index) => index % 2 === 1)

  return (
    <SectionShell id={'projects'} stage={'Projects'}>
      <SectionContent isPadded>
        <SectionTitle kicker={'selected'}>projects</SectionTitle>
        <div
          className={`
            grid grid-cols-2 gap-grid-gap-regular
            mobile-m:grid-cols-1
          `}
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
          <div
            className={`
              flex flex-col pt-[28.125%]
              mobile-m:pt-0
            `}
          >
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

        {sketches.length > 0 && (
          <section
            aria-label={'Sketches'}
            className={'mt-intersection-padding'}
          >
            <FieldLabelHeading muted>
              {'sketches · small demos'}
            </FieldLabelHeading>
            <div
              className={`
                grid grid-cols-3 gap-grid-gap-regular
                tablet-s:grid-cols-3
                mobile-m:grid-cols-2
                mobile-s:grid-cols-1
              `}
            >
              {sketches.map((entry, index) => (
                <SketchPreview key={entry.id} entry={entry} index={index} />
              ))}
            </div>
          </section>
        )}
      </SectionContent>
    </SectionShell>
  )
}
