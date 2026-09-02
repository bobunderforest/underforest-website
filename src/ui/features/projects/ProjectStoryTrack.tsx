import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Text } from 'ui/common/typography/Text'
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
  itemEnd,
  itemStart,
  onHeightChange,
  trackProgress,
}: {
  block: ProjectStoryBlock
  index: number
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
  const markerY = useTransform(itemProgress, (progress) => {
    const trackHeight = isFinalBeat ? FINAL_BEAT_TRACK_HEIGHT : height
    return progress * Math.max(trackHeight - TRACK_MARKER_SIZE, 0)
  })
  const markerOpacity = useTransform(trackProgress, (progress) =>
    progress >= itemStart && (isFinalBeat || progress < itemEnd) ? 1 : 0,
  )
  const trackExtentClassName = 'absolute top-0 left-[3px]'
  const trackExtentStyle: React.CSSProperties = isFinalBeat
    ? { height: FINAL_BEAT_TRACK_HEIGHT }
    : { bottom: 0 }

  return (
    <li ref={ref} className={'relative grid py-3 pl-[26px] last:pb-0'}>
      <span
        aria-hidden
        style={{ ...trackExtentStyle, ...TRACK_TICK_STYLE }}
        className={cns(trackExtentClassName, 'w-[6px]')}
      />
      <span
        aria-hidden
        style={trackExtentStyle}
        className={cns(trackExtentClassName, 'w-px bg-edge')}
      />
      <motion.span
        aria-hidden
        style={{ ...trackExtentStyle, scaleY: itemProgress }}
        className={cns(trackExtentClassName, 'w-px origin-top bg-accent/70')}
      />
      <motion.span
        aria-hidden
        style={{ opacity: markerOpacity, y: markerY }}
        className={'absolute top-0 left-0 size-[7px] bg-accent'}
      />
      <Text
        size={'hint'}
        tone={'system'}
        uppercase
        className={'relative mb-2 flex gap-2'}
      >
        <span
          className={'absolute top-[9px] left-[-23px] h-px w-[14px] bg-edge'}
        />
        <span className={'tabular-nums'}>{padIndex(index)}</span>
        {block.caption && <span className={'text-muted'}>{block.caption}</span>}
      </Text>
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
  let precedingHeight = 0

  return (
    <div className={'pt-8'}>
      <FieldLabel readout={`${entry.story.length} checkpoints`}>
        storyline
      </FieldLabel>

      <ol ref={storyRef} className={'grid'}>
        {entry.story.map((block, i) => {
          const itemHeight = itemHeights[i] ?? 0
          const itemStart = hasMeasurements
            ? precedingHeight / totalHeight
            : i / entry.story.length
          const trackHeight =
            block.kind === 'end' ? FINAL_BEAT_TRACK_HEIGHT : itemHeight
          const itemEnd = hasMeasurements
            ? (precedingHeight + trackHeight) / totalHeight
            : (i + 1) / entry.story.length
          precedingHeight += itemHeight

          return (
            <ProjectStoryTrackItem
              key={i}
              block={block}
              index={i}
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
