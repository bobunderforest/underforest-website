import { Fragment } from 'react'
import { TelemetryBorder } from 'ui/fx/TelemetryBorder'
import { BusDivider } from 'ui/fx/BusDivider'
import { SectionContent } from 'ui/common/SectionContent'
import { StageIndex } from 'ui/sections/StageIndex'
import { useSectionAnchor } from 'utils/hooks/useSectionAnchor'
import { cns } from 'utils/formatters/classnames'
import { padCount } from 'utils/formatters/numerals'
import { PROJECTS } from 'ui/features/projects/projects-data'
import { ProjectFrame } from 'ui/features/projects/ProjectFrame'
import { ProjectTitleChart } from 'ui/features/projects/ProjectTitleChart'
import { FieldLabel } from './FieldLabel'

export const SectionProjects = () => {
  useSectionAnchor({ id: 'projects', restOffsetTimeline: 0.28 })

  return (
    <section
      id={'projects'}
      data-stage={'Projects'}
      className={'relative border-b border-edge'}
    >
      <TelemetryBorder className={'z-20'} />

      <div className={'relative -mb-10 overflow-hidden bg-base'}>
        <ProjectTitleChart animate inverted />
        <SectionContent
          isPadded
          className={'relative pb-16 tablet-s:pb-12'}
        >
          <StageIndex index={'03'} stage={'Projects'} />
          <FieldLabel readout={`${PROJECTS.length} subjects locked`}>
            featured
          </FieldLabel>
        </SectionContent>
      </div>

      <div className={'flex flex-col'}>
        {PROJECTS.map((entry, i) => (
          <Fragment key={entry.id}>
            <BusDivider
              className={cns('relative z-10 -mb-10', i > 0 && '-mt-10')}
            />
            <ProjectFrame entry={entry} slot={padCount(i)} />
          </Fragment>
        ))}
      </div>
    </section>
  )
}
