import { Fragment } from 'react'
import { SectionShell } from './SectionShell'
import { ClampDivider } from 'ui/common/cyber-kit/ClampDivider'
import { padCount } from 'utils/formatters/numerals'
import { usePageDataMain } from 'modules/page-data/page-data-hooks'
import { ProjectFrame } from 'ui/features/projects/ProjectFrame'
import { StageHeader } from './StageHeader'

export const SectionProjects = () => {
  const projects = usePageDataMain('projects')

  return (
    <SectionShell withEdge id={'projects'} stage={'Projects'}>
      <StageHeader
        index={'01'}
        stage={'Projects'}
        alias={'portfolio'}
        label={'featured'}
        readout={`${projects.length} subjects locked`}
      />

      <div className={'flex flex-col'}>
        {projects.map((entry, i) => (
          <Fragment key={entry.id}>
            <ClampDivider className={'relative z-10'} />
            <ProjectFrame entry={entry} slot={padCount(i)} />
          </Fragment>
        ))}
      </div>
    </SectionShell>
  )
}
