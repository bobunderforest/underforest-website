import { Text } from 'ui/common/typography/Text'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import type { ProjectEntry } from 'ui/features/experience-data/types'
import { cns } from 'utils/formatters/classnames'
import { useProjectFrame } from './project-frame-context'
import { ProjectTitleChart } from './ProjectTitleChart'

export const ProjectTitleBlock = ({
  entry,
  titleRef,
}: {
  entry: ProjectEntry
  titleRef?: React.RefObject<HTMLDivElement | null>
}) => {
  const { subjectHash, locked } = useProjectFrame()

  return (
    <div className={'flex flex-col'}>
      <Text
        size={'hint'}
        uppercase
        tone={locked ? 'accent' : 'dimmed'}
        className={
          'mb-5 flex items-center italic transition-colors duration-300'
        }
      >
        <span>subject</span>
        <span className={'mx-2 inline-block h-px w-5 bg-current'} />
        <span className={'tabular-nums'}>#{subjectHash}</span>
      </Text>

      <div
        ref={titleRef}
        className={cns(
          'relative w-fit max-w-full border border-edge bg-text px-4 pt-3 pb-2.5 tablet-s:px-3',
          entry.description && 'mb-15',
        )}
      >
        <ProjectTitleChart animate={locked} />
        <DataCaptureBorder blinkKey={locked ? entry.id : undefined} />
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
    </div>
  )
}
