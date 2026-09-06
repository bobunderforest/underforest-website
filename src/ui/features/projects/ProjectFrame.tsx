import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { SectionContent } from 'ui/common/SectionContent'
import { FieldLabelHeading } from 'ui/sections/FieldLabel'
import { DataWire } from 'ui/common/cyber-kit/DataWire'
import { ExperienceDetailsCredits } from 'ui/features/experience-details/ExperienceDetailsCredits'
import { ExperienceDetailsStatus } from 'ui/features/experience-details/ExperienceDetailsStatus'
import { getScrollPosition } from 'utils/browser/scroll-util'
import { useCenterActivationObserver } from 'utils/hooks/useCenterActivationObserver'
import { useResizeObserver } from 'utils/hooks/useResizeObserver'
import { useSettledMeasure } from 'utils/hooks/useSettledMeasure'
import { useWindowSize } from 'utils/hooks/useWindowSize'
import type { ProjectEntry } from 'ui/features/experience-data/types'
import { ProjectFrameContext } from './project-frame-context'
import { ProjectFrameBackground } from './ProjectFrameBackground'
import { ProjectFrameHud } from './ProjectFrameHud'
import { ProjectLinkRow } from './ProjectLinkRow'
import { ProjectMetaReadout } from './ProjectMetaReadout'
import { ProjectTitleBlock } from './ProjectTitleBlock'
import { ProjectStoryTrack } from './ProjectStoryTrack'
import { ProjectShareButton } from './ProjectShareButton'

const STICKY_RAIL_TOP = 148
const WIRE_BEND_FROM_TARGET_X = 25

export const ProjectFrame = ({
  entry,
  slot,
}: {
  entry: ProjectEntry
  slot: string
}) => {
  const frameRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const stickyRailRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const primaryActionRef = useRef<HTMLDivElement>(null)
  const [locked, setLocked] = useState(false)
  const [wireGeometry, setWireGeometry] = useState({
    sourceDocumentY: 0,
    sourceX: 0,
    targetDocumentY: 0,
    targetMaxDocumentY: 0,
    targetMinY: 0,
    targetX: 0,
  })
  const { width: viewportWidth, height: viewportHeight } = useWindowSize()

  const { scrollY, scrollYProgress: frameProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  })
  const confidenceLabel = useTransform(frameProgress, (progress) => {
    const centered = 1 - Math.min(Math.abs(progress - 0.5) * 2, 1)
    return (0.9 + centered * 0.095).toFixed(2)
  })

  const handleActivation = useCallback(
    (inView: boolean) => setLocked(inView),
    [],
  )
  useCenterActivationObserver(frameRef, handleActivation)

  const measureWire = useCallback(() => {
    const title = titleRef.current
    const primaryAction = primaryActionRef.current
    const grid = gridRef.current
    const stickyRail = stickyRailRef.current
    if (!title || !primaryAction || !grid || !stickyRail) return
    const titleRect = title.getBoundingClientRect()
    const primaryActionRect = primaryAction.getBoundingClientRect()
    const gridRect = grid.getBoundingClientRect()
    const stickyRailRect = stickyRail.getBoundingClientRect()
    const scrollTop = getScrollPosition()
    const targetOffsetY =
      primaryActionRect.top + primaryActionRect.height / 2 - stickyRailRect.top
    setWireGeometry({
      sourceDocumentY: titleRect.top + scrollTop + titleRect.height / 2,
      sourceX: titleRect.right,
      targetDocumentY: gridRect.top + scrollTop + targetOffsetY,
      targetMaxDocumentY:
        gridRect.bottom + scrollTop - stickyRailRect.height + targetOffsetY,
      targetMinY: STICKY_RAIL_TOP + targetOffsetY,
      targetX: primaryActionRect.left,
    })
  }, [])

  useResizeObserver(titleRef, measureWire)
  useResizeObserver(primaryActionRef, measureWire, { initCall: false })
  useResizeObserver(gridRef, measureWire, { initCall: false })
  useResizeObserver(stickyRailRef, measureWire, { initCall: false })
  useSettledMeasure(measureWire)
  useEffect(measureWire, [locked, measureWire, viewportWidth, viewportHeight])

  const coverVideoSrc =
    entry.cover?.kind === 'video' ? entry.cover.src : undefined
  const coverVideoAppearsInStory =
    coverVideoSrc !== undefined &&
    entry.story.some(
      (block) => block.kind === 'video' && block.src === coverVideoSrc,
    )

  const value = useMemo(
    () => ({
      slot,
      locked,
      confidence: confidenceLabel,
      frameProgress,
    }),
    [slot, locked, confidenceLabel, frameProgress],
  )

  return (
    <ProjectFrameContext.Provider value={value}>
      <article
        ref={frameRef}
        data-locked={locked}
        className={
          'relative isolate flex min-h-[var(--viewport-height)] w-full flex-col justify-end overflow-clip'
        }
      >
        <AnimatePresence>
          {locked && entry.href && wireGeometry.targetX > 0 && (
            <DataWire
              key={'project-data-wire'}
              bendFromTargetX={WIRE_BEND_FROM_TARGET_X}
              scrollY={scrollY}
              sourceDocumentY={wireGeometry.sourceDocumentY}
              lockedSourceY={null}
              sourceX={wireGeometry.sourceX}
              targetX={wireGeometry.targetX}
              targetRange={{
                documentY: wireGeometry.targetDocumentY,
                minY: wireGeometry.targetMinY,
                maxDocumentY: wireGeometry.targetMaxDocumentY,
              }}
              viewportWidth={viewportWidth}
              viewportHeight={viewportHeight}
            />
          )}
        </AnimatePresence>
        <ProjectFrameBackground
          cover={entry.cover}
          active={locked}
          startVideoAtMiddle={coverVideoAppearsInStory}
        />
        <ProjectFrameHud />

        <SectionContent isPadded>
          <FieldLabelHeading>project record</FieldLabelHeading>
          <div
            ref={gridRef}
            className={
              'grid grid-cols-[minmax(0,1fr)_minmax(19rem,26rem)] items-start gap-x-12 gap-y-10 tablet-s:grid-cols-1 tablet-s:gap-x-0 tablet-s:gap-y-8 [&>*]:min-w-0'
            }
          >
            <div className={'tablet-s:contents'}>
              <div className={'tablet-s:order-1'}>
                <ProjectTitleBlock entry={entry} titleRef={titleRef} />
              </div>
              <div className={'tablet-s:order-4'}>
                <ProjectStoryTrack entry={entry} />
              </div>
            </div>

            <div
              ref={stickyRailRef}
              style={{ top: STICKY_RAIL_TOP }}
              className={
                'sticky flex flex-col gap-4 tablet-s:static tablet-s:contents'
              }
            >
              <div className={'flex flex-col gap-4 tablet-s:order-2'}>
                {entry.status && (
                  <ExperienceDetailsStatus status={entry.status} />
                )}
                <ProjectMetaReadout entry={entry} />
              </div>
              {entry.credits && entry.credits.length > 0 && (
                <div className={'tablet-s:order-5'}>
                  <ExperienceDetailsCredits
                    credits={entry.credits}
                    className={'bg-base/50 backdrop-blur-md'}
                  />
                </div>
              )}
              {(entry.href || entry.links?.length) && (
                <div className={'tablet-s:order-3'}>
                  <ProjectLinkRow entry={entry} primaryRef={primaryActionRef} />
                </div>
              )}
              <div className={'tablet-s:order-3'}>
                <ProjectShareButton entry={entry} />
              </div>
            </div>
          </div>
        </SectionContent>
      </article>
    </ProjectFrameContext.Provider>
  )
}
