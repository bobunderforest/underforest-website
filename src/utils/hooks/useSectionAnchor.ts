import { useEffect } from 'react'
import {
  registerSectionAnchor,
  SECTION_ENTER_TIMELINE,
  sectionTimelineScrollY,
} from 'utils/anim/section-anchors'

type Options = {
  id: string
  restOffsetTimeline: number
  enterOffsetTimeline?: number
  scrollYAt?: (progress: number) => number | null
}

export const useSectionAnchor = ({
  id,
  restOffsetTimeline,
  enterOffsetTimeline = SECTION_ENTER_TIMELINE,
  scrollYAt,
}: Options) => {
  useEffect(() => {
    const timelineScrollY = (progress: number) =>
      scrollYAt?.(progress) ?? sectionTimelineScrollY(id, progress)

    return registerSectionAnchor({
      id,
      enterScrollY: () => timelineScrollY(enterOffsetTimeline),
      restScrollY: () => timelineScrollY(restOffsetTimeline),
    })
  }, [id, restOffsetTimeline, enterOffsetTimeline, scrollYAt])
}
