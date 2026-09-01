import { useCallback, useMemo, useRef, useState } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { SectionContent } from 'ui/common/SectionContent'
import { ExperienceDetailsCredits } from 'ui/features/experience-details/ExperienceDetailsCredits'
import { useCenterActivationObserver } from 'utils/hooks/useCenterActivationObserver'
import type { ProjectEntry } from 'ui/features/experience-data/types'
import { ProjectFrameContext } from './project-frame-context'
import { ProjectFrameBackground } from './ProjectFrameBackground'
import { ProjectFrameHud } from './ProjectFrameHud'
import { ProjectMetaReadout } from './ProjectMetaReadout'
import { ProjectTitleBlock } from './ProjectTitleBlock'
import { ProjectStoryTrack } from './ProjectStoryTrack'

export const ProjectFrame = ({
  entry,
  slot,
}: {
  entry: ProjectEntry
  slot: string
}) => {
  const frameRef = useRef<HTMLElement>(null)
  const [locked, setLocked] = useState(false)

  const { scrollYProgress: frameProgress } = useScroll({
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

  const value = useMemo(
    () => ({ slot, locked, confidence: confidenceLabel, frameProgress }),
    [slot, locked, confidenceLabel, frameProgress],
  )

  return (
    <ProjectFrameContext.Provider value={value}>
      <article
        ref={frameRef}
        data-locked={locked}
        className={
          'relative isolate flex min-h-[var(--viewport-height)] w-full flex-col justify-end overflow-hidden'
        }
      >
        <ProjectFrameBackground cover={entry.cover} active={locked} />
        <ProjectFrameHud />

        <SectionContent className={'py-20 tablet-s:py-14'}>
          <div
            className={
              'grid grid-cols-[minmax(0,1fr)_minmax(19rem,26rem)] items-start gap-x-12 gap-y-10 tablet-s:grid-cols-1 tablet-s:gap-x-0 tablet-s:gap-y-8 [&>*]:min-w-0'
            }
          >
            <ProjectTitleBlock entry={entry} />

            <div className={'flex flex-col gap-2'}>
              <ProjectMetaReadout entry={entry} />
              {entry.credits && entry.credits.length > 0 && (
                <ExperienceDetailsCredits
                  credits={entry.credits}
                  className={'bg-base/50 backdrop-blur-md'}
                />
              )}
            </div>

            <ProjectStoryTrack entry={entry} />
          </div>
        </SectionContent>
      </article>
    </ProjectFrameContext.Provider>
  )
}
