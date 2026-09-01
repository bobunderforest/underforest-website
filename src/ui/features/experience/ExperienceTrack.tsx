import { createRef, useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import {
  EXPERIENCE,
  hasExperienceDetails,
} from 'ui/features/experience-data/experience-data'
import { ExperienceDetails } from 'ui/features/experience-details/ExperienceDetails'
import { scrollElementToViewportCenter } from 'utils/anim/collapsible-scroll'
import { useCenterActivationObserver } from 'utils/hooks/useCenterActivationObserver'
import { ExperienceEntry } from './ExperienceEntry'

const ENTRY_SCROLL_DURATION = 0.7

export const ExperienceTrack = () => {
  const trackRef = useRef<HTMLOListElement>(null)
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
  }, [])

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

      if (activeIdRef.current === id) {
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
    [scrollPendingEntryToActivation],
  )

  const handleDetailsCollapseComplete = useCallback(
    (id: string) => {
      if (collapsingIdRef.current !== id) return
      collapsingIdRef.current = null
      scrollPendingEntryToActivation()
    },
    [scrollPendingEntryToActivation],
  )

  return (
    <>
      <ol ref={trackRef} className={'grid max-w-[880px]'}>
        {EXPERIENCE.map((entry) => (
          <ExperienceEntry
            key={entry.id}
            entry={entry}
            entryRef={entryNodeRefs.get(entry.id)!.entry}
            bodyRef={entryNodeRefs.get(entry.id)!.body}
            active={entry.id === activeId}
            detailsExpanded={entry.id === expandedId}
            onInViewChange={handleInViewChange}
            onDetailsExpandedChange={handleDetailsExpandedChange}
            onDetailsCollapseComplete={handleDetailsCollapseComplete}
          />
        ))}
      </ol>
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
