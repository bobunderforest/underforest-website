import { Text } from 'ui/common/typography/Text'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import type { ProjectEntry } from 'ui/features/experience-data/types'
import { useProjectFrame } from './project-frame-context'
import { ContourField } from 'ui/common/cyber-kit/ContourField'
import { ProjectShareButton } from './ProjectShareButton'

export const ProjectTitleBlock = ({
  entry,
  titleRef,
}: {
  entry: ProjectEntry
  titleRef?: React.RefObject<HTMLDivElement | null>
}) => {
  const { locked } = useProjectFrame()

  return (
    <div className={'flex flex-col items-start'}>
      <div
        ref={titleRef}
        className={
          'relative w-fit max-w-full border border-edge bg-text px-4 pt-3 pb-2.5 tablet-s:px-3'
        }
      >
        <ContourField animate={locked} />
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
          className={'mt-10 max-w-prose-measure whitespace-pre-line'}
        >
          {entry.description}
        </Text>
      )}
    </div>
  )
}
