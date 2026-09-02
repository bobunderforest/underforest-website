import { Text } from 'ui/common/typography/Text'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import type { ProjectEntry } from 'ui/features/experience-data/types'
import { useProjectFrame } from './project-frame-context'
import { ProjectTitleChart } from './ProjectTitleChart'
import { ProjectLinkRow } from './ProjectLinkRow'

export const ProjectTitleBlock = ({ entry }: { entry: ProjectEntry }) => {
  const { slot, locked } = useProjectFrame()

  return (
    <div className={'flex flex-col'}>
      <Text
        size={'hint'}
        uppercase
        tone={locked ? 'accent' : 'dimmed'}
        className={'mb-5 flex items-center transition-colors duration-300'}
      >
        <span className={'tabular-nums'}>subject {slot}</span>
      </Text>

      <div
        className={
          'relative mb-15 w-fit max-w-full border border-edge bg-text px-4 pt-3 pb-2.5 tablet-s:px-3'
        }
      >
        <ProjectTitleChart animate={locked} />
        <DataCaptureBorder />
        <h3
          className={
            'relative font-face-title text-display leading-[0.8] font-bold [hyphens:none] whitespace-pre-line text-black uppercase'
          }
        >
          {entry.title}
        </h3>
      </div>

      {entry.description && (
        <Text
          tag={'p'}
          size={'lead'}
          tone={'primary'}
          className={'mb-5 max-w-[62ch] whitespace-pre-line'}
        >
          {entry.description}
        </Text>
      )}

      <ProjectLinkRow entry={entry} />
    </div>
  )
}
