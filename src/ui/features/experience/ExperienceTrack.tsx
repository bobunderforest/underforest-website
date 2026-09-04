import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  EXPERIENCE,
  hasExperienceDetails,
} from 'ui/features/experience-data/experience-data'
import { ExperienceDetails } from 'ui/features/experience-details/ExperienceDetails'
import { TRACK_MARKER_SIZE, TRACK_TICK_STYLE } from 'ui/fx/track-rail'
import { scrollElementToViewportCenter } from 'utils/anim/collapsible-scroll'
import { motionEase } from 'utils/anim/motion-ease'
import {
  useCenterActivationEnabled,
  useCenterActivationObserver,
} from 'utils/hooks/useCenterActivationObserver'
import { useResizeObserver } from 'utils/hooks/useResizeObserver'
import { clamp } from 'utils/math/clamp'
import { ExperienceEntry } from './ExperienceEntry'

const ENTRY_SCROLL_DURATION = 0.7
const TRACK_START_EXTENSION = 50

const ExperienceTrackProgress = ({
  height,
  onSettled,
  onTravelStart,
  progress,
  top,
}: {
  height: number
  onSettled: (progress: number) => void
  onTravelStart: (progress: number) => void
  progress: number
  top: number
}) => {
  const markerY = clamp(
    progress * height - TRACK_MARKER_SIZE / 2,
    0,
    Math.max(height - TRACK_MARKER_SIZE, 0),
  )
  const transition = { duration: 0.45, ease: motionEase.travel }

  return (
    <div
      aria-hidden
      style={{ top, height }}
      className={'pointer-events-none absolute left-0 w-[6px] mobile-m:hidden'}
    >
      <span style={TRACK_TICK_STYLE} className={'absolute inset-0 w-[6px]'} />
      <span className={'absolute inset-y-0 left-0 w-px bg-edge'} />
      <motion.span
        initial={false}
        animate={{ scaleY: progress }}
        transition={transition}
        className={'absolute inset-y-0 left-0 w-px origin-top bg-accent/70'}
      />
      <motion.span
        initial={false}
        animate={{ y: markerY }}
        transition={transition}
        onAnimationStart={() => onTravelStart(progress)}
        onAnimationComplete={() => onSettled(progress)}
        className={'absolute top-0 left-[-3px] size-[7px] bg-accent'}
      />
    </div>
  )
}

export const ExperienceTrack = () => {
  const trackRef = useRef<HTMLOListElement>(null)
  const [trackProgressBounds, setTrackProgressBounds] = useState({
    height: 0,
    progressById: {} as Record<string, number>,
    top: 0,
  })
  const entryNodeRefs = useMemo(
    () =>
      new Map(
        EXPERIENCE.map((entry) => [
          entry.id,
          {
            entry: createRef<HTMLLIElement>(),
            body: createRef<HTMLDivElement>(),
          },
        ]),
      ),
    [],
  )
  const inViewIds = useRef(new Set<string>())
  const activeIdRef = useRef<string | null>(null)
  const expandedIdRef = useRef<string | null>(null)
  const collapsingIdRef = useRef<string | null>(null)
  const pendingExpandedIdRef = useRef<string | null>(null)
  const pendingExpandedNodeRef = useRef<HTMLElement | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [boundaryProgress, setBoundaryProgress] = useState(0)
  const [settledProgress, setSettledProgress] = useState(0)
  const activeEntry = EXPERIENCE.find((entry) => entry.id === activeId)
  const activeRefs = activeId ? entryNodeRefs.get(activeId) : undefined
  const showDetailFeed = Boolean(
    activeEntry && activeRefs && hasExperienceDetails(activeEntry),
  )
  const handleTrackInView = useCallback((inView: boolean) => {
    if (inView) return
    inViewIds.current.clear()
    activeIdRef.current = null
    setActiveId(null)
    const track = trackRef.current
    if (!track) return
    const viewportCenter = window.innerHeight / 2
    const nextBoundaryProgress =
      track.getBoundingClientRect().bottom <= viewportCenter ? 1 : 0
    setBoundaryProgress(nextBoundaryProgress)
    if (nextBoundaryProgress === 0) setSettledProgress(0)
  }, [])

  const measureTrackProgress = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const markers = track.querySelectorAll<HTMLElement>(
      '[data-experience-track-marker]',
    )
    const firstMarker = markers.item(0)
    const lastMarker = markers.item(markers.length - 1)
    if (!firstMarker || !lastMarker) return

    const trackRect = track.getBoundingClientRect()
    const firstRect = firstMarker.getBoundingClientRect()
    const lastRect = lastMarker.getBoundingClientRect()
    const top =
      firstRect.top +
      firstRect.height / 2 -
      trackRect.top -
      TRACK_START_EXTENSION
    const end = lastRect.top + lastRect.height / 2 - trackRect.top
    const height = Math.max(end - top, 0)
    const progressById = Object.fromEntries(
      Array.from(markers, (marker) => {
        const markerRect = marker.getBoundingClientRect()
        const markerCenter =
          markerRect.top + markerRect.height / 2 - trackRect.top
        return [
          marker.dataset.experienceTrackMarker ?? '',
          height > 0 ? (markerCenter - top) / height : 0,
        ]
      }),
    )
    setTrackProgressBounds({ top, height, progressById })
  }, [])

  useResizeObserver(trackRef, measureTrackProgress)
  useEffect(() => {
    document.fonts?.ready.then(measureTrackProgress)
  }, [measureTrackProgress])

  const trackScrollActivationEnabled = useCenterActivationEnabled()
  useCenterActivationObserver(trackRef, handleTrackInView)

  const scrollPendingEntryToActivation = useCallback(() => {
    const node = pendingExpandedNodeRef.current
    if (!node) return

    scrollElementToViewportCenter(node, {
      duration: ENTRY_SCROLL_DURATION,
    })
  }, [])

  const handleInViewChange = useCallback((id: string, inView: boolean) => {
    const set = inViewIds.current
    if (inView) set.add(id)
    else set.delete(id)

    const current = activeIdRef.current
    const next =
      current && set.has(current)
        ? current
        : (EXPERIENCE.find((entry) => set.has(entry.id))?.id ?? null)

    if (next === current) return

    activeIdRef.current = next
    setActiveId(next)
    if (next && pendingExpandedIdRef.current === next) {
      pendingExpandedIdRef.current = null
      pendingExpandedNodeRef.current = null
      expandedIdRef.current = next
      setExpandedId(next)
    }
  }, [])

  const handleDetailsExpandedChange = useCallback(
    (id: string, expanded: boolean, node: HTMLElement | null) => {
      if (!expanded) {
        if (pendingExpandedIdRef.current === id) {
          pendingExpandedIdRef.current = null
          pendingExpandedNodeRef.current = null
        }
        if (expandedIdRef.current === id) {
          expandedIdRef.current = null
          collapsingIdRef.current = id
          setExpandedId(null)
        }
        return
      }

      if (activeIdRef.current === id || !trackScrollActivationEnabled) {
        pendingExpandedIdRef.current = null
        pendingExpandedNodeRef.current = null
        expandedIdRef.current = id
        setExpandedId(id)
        return
      }

      if (!node) return

      pendingExpandedIdRef.current = id
      pendingExpandedNodeRef.current = node
      if (expandedIdRef.current) {
        collapsingIdRef.current = expandedIdRef.current
        expandedIdRef.current = null
        setExpandedId(null)
        return
      }
      if (!collapsingIdRef.current) scrollPendingEntryToActivation()
    },
    [scrollPendingEntryToActivation, trackScrollActivationEnabled],
  )

  const handleDetailsCollapseComplete = useCallback(
    (id: string) => {
      if (collapsingIdRef.current !== id) return
      collapsingIdRef.current = null
      scrollPendingEntryToActivation()
    },
    [scrollPendingEntryToActivation],
  )

  const targetProgress = activeId
    ? (trackProgressBounds.progressById[activeId] ?? boundaryProgress)
    : boundaryProgress
  const handleTrackTravelStart = useCallback((progress: number) => {
    setSettledProgress((current) => (progress < current ? progress : current))
  }, [])

  return (
    <>
      <div className={'relative max-w-[880px]'}>
        {trackProgressBounds.height > 0 && (
          <ExperienceTrackProgress
            height={trackProgressBounds.height}
            top={trackProgressBounds.top}
            progress={targetProgress}
            onTravelStart={handleTrackTravelStart}
            onSettled={setSettledProgress}
          />
        )}
        <ol ref={trackRef} className={'grid'}>
          {EXPERIENCE.map((entry) => (
            <ExperienceEntry
              key={entry.id}
              entry={entry}
              entryRef={entryNodeRefs.get(entry.id)!.entry}
              bodyRef={entryNodeRefs.get(entry.id)!.body}
              active={entry.id === activeId}
              reached={
                (trackProgressBounds.progressById[entry.id] ?? 1) <=
                settledProgress
              }
              detailsExpanded={entry.id === expandedId}
              onInViewChange={handleInViewChange}
              onDetailsExpandedChange={handleDetailsExpandedChange}
              onDetailsCollapseComplete={handleDetailsCollapseComplete}
            />
          ))}
        </ol>
      </div>
      <AnimatePresence>
        {activeEntry && activeRefs && showDetailFeed && (
          <ExperienceDetails
            key={'desktop-detail-feed'}
            entry={activeEntry}
            entryRef={activeRefs.entry}
            sourceRef={activeRefs.body}
          />
        )}
      </AnimatePresence>
    </>
  )
}
