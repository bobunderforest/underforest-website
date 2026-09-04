import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { TRACK_MARKER_SIZE, TRACK_TICK_STYLE } from 'ui/fx/track-rail'
import { FieldLabel } from 'ui/sections/FieldLabel'
import { cns } from 'utils/formatters/classnames'
import { padIndex } from 'utils/formatters/numerals'
import { useElementHeight } from 'utils/hooks/useElementHeight'
import type {
  ProjectEntry,
  ProjectStoryBlock,
} from 'ui/features/experience-data/types'
import { ProjectStoryBlockContent } from './ProjectStoryBlockContent'

const FINAL_BEAT_TRACK_HEIGHT = 21

const ProjectStoryTrackItem = ({
  block,
  index,
  isTrackEnd,
  itemEnd,
  itemStart,
  onHeightChange,
  trackProgress,
}: {
  block: ProjectStoryBlock
  index: number
  isTrackEnd: boolean
  itemEnd: number
  itemStart: number
  onHeightChange: (index: number, height: number) => void
  trackProgress: MotionValue<number>
}) => {
  const { ref, height } = useElementHeight<HTMLLIElement>()
  useEffect(() => {
    onHeightChange(index, height)
  }, [height, index, onHeightChange])
  const itemProgress = useTransform(trackProgress, [itemStart, itemEnd], [0, 1])
  const isFinalBeat = block.kind === 'end'
  const trackHeight = isFinalBeat ? FINAL_BEAT_TRACK_HEIGHT : height
  const markerTravel = isTrackEnd
    ? Math.max(trackHeight - TRACK_MARKER_SIZE, 0)
    : height
  const markerY = useTransform(
    itemProgress,
    (progress) => progress * markerTravel,
  )
  const markerOpacity = useTransform(trackProgress, (progress) =>
    progress >= itemStart && (isFinalBeat || progress < itemEnd) ? 1 : 0,
  )
  const trackExtentClassName = 'absolute top-0 left-[3px]'
  const trackExtentStyle: React.CSSProperties = isFinalBeat
    ? { height: trackHeight }
    : { bottom: 0 }

  return (
    <li
      ref={ref}
      className={cns(
        'relative grid py-3 pl-[26px] last:pb-0 mobile-m:pl-0',
        isFinalBeat && 'mobile-m:hidden',
      )}
    >
      <span
        aria-hidden
        style={trackExtentStyle}
        className={cns(trackExtentClassName, 'w-px bg-edge mobile-m:hidden')}
      />
      <motion.span
        aria-hidden
        style={{ ...trackExtentStyle, scaleY: itemProgress }}
        className={cns(
          trackExtentClassName,
          'w-px origin-top bg-accent/70 mobile-m:hidden',
        )}
      />
      <motion.span
        aria-hidden
        style={{ opacity: markerOpacity, y: markerY }}
        className={'absolute top-0 left-0 size-[7px] bg-accent mobile-m:hidden'}
      />
      <FieldLabel tone={'system'} gap={'tight'} className={'relative'}>
        <span
          className={
            'absolute top-[9px] left-[-23px] h-px w-[14px] bg-edge mobile-m:hidden'
          }
        />
        <span className={'tabular-nums'}>{padIndex(index)}</span>
        {block.caption && (
          <span className={'ml-2 text-muted'}>{block.caption}</span>
        )}
      </FieldLabel>
      <ProjectStoryBlockContent block={block} />
    </li>
  )
}

export const ProjectStoryTrack = ({ entry }: { entry: ProjectEntry }) => {
  const storyRef = useRef<HTMLOListElement>(null)
  const [itemHeights, setItemHeights] = useState<number[]>([])
  const setItemHeight = useCallback((index: number, height: number) => {
    setItemHeights((current) => {
      if (current[index] === height) return current
      const next = [...current]
      next[index] = height
      return next
    })
  }, [])
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ['start center', 'end center'],
  })
  if (entry.story.length === 0) return null

  const hasMeasurements = entry.story.every(
    (_, index) => (itemHeights[index] ?? 0) > 0,
  )
  const totalHeight = itemHeights.reduce((sum, height) => sum + height, 0)
  const precedingHeights = entry.story.map((_, index) =>
    itemHeights.slice(0, index).reduce((sum, height) => sum + (height ?? 0), 0),
  )
  const finalBeatHeight =
    entry.story[entry.story.length - 1]?.kind === 'end'
      ? (itemHeights[entry.story.length - 1] ?? 0)
      : 0
  const tickTrackHeight = hasMeasurements
    ? totalHeight -
      finalBeatHeight +
      (finalBeatHeight > 0 ? FINAL_BEAT_TRACK_HEIGHT : 0)
    : '100%'

  return (
    <div className={'pt-8'}>
      <FieldLabel
        className={'mobile-m:hidden'}
        readout={`${entry.story.length} checkpoints`}
      >
        storyline
      </FieldLabel>

      <ol ref={storyRef} className={'relative grid'}>
        <span
          aria-hidden
          style={{ ...TRACK_TICK_STYLE, height: tickTrackHeight }}
          className={'absolute top-0 left-[3px] w-[6px] mobile-m:hidden'}
        />

        {entry.story.map((block, i) => {
          const itemHeight = itemHeights[i] ?? 0
          const precedingHeight = precedingHeights[i]
          const itemStart = hasMeasurements
            ? precedingHeight / totalHeight
            : i / entry.story.length
          const trackHeight =
            block.kind === 'end' ? FINAL_BEAT_TRACK_HEIGHT : itemHeight
          const itemEnd = hasMeasurements
            ? (precedingHeight + trackHeight) / totalHeight
            : (i + 1) / entry.story.length

          return (
            <ProjectStoryTrackItem
              key={i}
              block={block}
              index={i}
              isTrackEnd={i === entry.story.length - 1}
              itemEnd={itemEnd}
              itemStart={itemStart}
              onHeightChange={setItemHeight}
              trackProgress={storyProgress}
            />
          )
        })}
      </ol>
    </div>
  )
}
