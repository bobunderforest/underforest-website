import { Text } from 'ui/common/typography/Text'
import { FieldLabel } from 'ui/sections/FieldLabel'
import { RulerDivider } from 'ui/fx/RulerDivider'
import { cns } from 'utils/formatters/classnames'
import { padCount } from 'utils/formatters/numerals'
import type { ProjectEntry } from 'ui/features/experience-data/types'
import { useProjectFrame } from './project-frame-context'
import { ProjectStoryBeat } from './ProjectStoryBeat'

export const ProjectStoryTrack = ({ entry }: { entry: ProjectEntry }) => {
  const { frameProgress } = useProjectFrame()
  if (entry.story.length === 0) return null

  return (
    <div className={'pt-8'}>
      <RulerDivider
        progress={frameProgress}
        label={`${entry.story.length} beats`}
        className={'mb-6'}
      />
      <FieldLabel>storyline</FieldLabel>

      <ol className={'grid'}>
        {entry.story.map((block, i) => (
          <li
            key={i}
            className={cns(
              'relative grid py-3 pl-[26px] last:pb-0',
              'before:absolute before:top-0 before:bottom-0 before:left-[3px] before:w-px before:bg-edge',
              'last:before:bottom-auto last:before:h-[21px]',
            )}
          >
            <Text
              size={'hint'}
              tone={'system'}
              uppercase
              className={cns(
                'relative mb-2 flex gap-2',
                'before:absolute before:top-[9px] before:left-[-23px] before:h-px before:w-[14px] before:bg-edge',
              )}
            >
              <span className={'tabular-nums'}>{padCount(i)}</span>
              {block.caption && (
                <span className={'text-muted'}>{block.caption}</span>
              )}
            </Text>
            <ProjectStoryBeat block={block} />
          </li>
        ))}
      </ol>
    </div>
  )
}
