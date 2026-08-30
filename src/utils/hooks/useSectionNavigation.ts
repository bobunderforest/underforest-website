import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { scrollLenisTo } from 'utils/anim/lenis'
import {
  sectionAnchorsChanged,
  sectionIdAtScrollY,
  sectionPositions,
  sectionRestScrollY,
  sectionSpanBetween,
  type SectionPosition,
} from 'utils/anim/section-anchors'
import { jumpReleaseSeconds, sectionJump } from 'utils/anim/section-jump'
import { debounce } from 'utils/primitives/debounce'

const SCROLL_DURATION = 3
const PIN_RELEASE_MARGIN = 0.25
const ARRIVAL_TOLERANCE_PX = 2
const UNLOCK_DISTANCE_FRACTION = 0.15
const INTERRUPT_SLACK_PX = 8
const REMEASURE_DELAY = 200

type PinnedTarget = {
  scrollY: number
  distance: number
  unlockDistance: number
}

export const useSectionNavigation = () => {
  const { scrollY } = useScroll()
  const positionsRef = useRef<SectionPosition[]>([])
  const jumpTimeoutRef = useRef(0)
  const pinTimeoutRef = useRef(0)
  const pinnedRef = useRef<PinnedTarget | null>(null)
  const activeIdRef = useRef<string | null>(null)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)

  const publishActiveSectionId = useCallback((sectionId: string | null) => {
    if (sectionId === activeIdRef.current) return
    activeIdRef.current = sectionId
    setActiveSectionId(sectionId)
  }, [])

  const releasePin = useCallback(() => {
    window.clearTimeout(pinTimeoutRef.current)
    pinnedRef.current = null
    publishActiveSectionId(
      sectionIdAtScrollY(positionsRef.current, scrollY.get()),
    )
  }, [publishActiveSectionId, scrollY])

  useEffect(() => {
    const measure = () => {
      positionsRef.current = sectionPositions()
      if (pinnedRef.current) return
      publishActiveSectionId(
        sectionIdAtScrollY(positionsRef.current, scrollY.get()),
      )
    }
    const remeasure = debounce(measure, REMEASURE_DELAY)

    measure()
    window.addEventListener('resize', remeasure)
    const unsubscribe = sectionAnchorsChanged.on(remeasure)
    return () => {
      window.removeEventListener('resize', remeasure)
      unsubscribe()
    }
  }, [publishActiveSectionId, scrollY])

  useMotionValueEvent(scrollY, 'change', (value) => {
    const pinned = pinnedRef.current
    if (!pinned) {
      publishActiveSectionId(sectionIdAtScrollY(positionsRef.current, value))
      return
    }
    const distance = Math.abs(value - pinned.scrollY)
    const hasArrived = distance <= ARRIVAL_TOLERANCE_PX
    const wasInterrupted = distance > pinned.distance + INTERRUPT_SLACK_PX
    if (hasArrived || wasInterrupted) {
      releasePin()
      return
    }
    pinned.distance = distance
  })

  const endJump = useCallback(() => {
    window.clearTimeout(jumpTimeoutRef.current)
    sectionJump.set(null)
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(pinTimeoutRef.current)
      endJump()
    }
  }, [endJump])

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const pinned = pinnedRef.current
      if (pinned && pinned.distance > pinned.unlockDistance) return
      const restScrollY = sectionRestScrollY(sectionId)
      if (restScrollY === null) return
      const positions = positionsRef.current
      const fromScrollY = scrollY.get()
      const distanceY = Math.abs(restScrollY - fromScrollY)
      if (distanceY <= ARRIVAL_TOLERANCE_PX) {
        publishActiveSectionId(sectionId)
        return
      }
      const jump = {
        span: sectionSpanBetween(
          positions,
          sectionIdAtScrollY(positions, fromScrollY),
          sectionId,
        ),
        sectionCount: positions.length,
        distanceY,
        durationS: SCROLL_DURATION,
      }
      window.clearTimeout(jumpTimeoutRef.current)
      sectionJump.set(jump)
      jumpTimeoutRef.current = window.setTimeout(
        endJump,
        jumpReleaseSeconds(jump) * 1000,
      )

      window.clearTimeout(pinTimeoutRef.current)
      pinnedRef.current = {
        scrollY: restScrollY,
        distance: Number.POSITIVE_INFINITY,
        unlockDistance: distanceY * UNLOCK_DISTANCE_FRACTION,
      }
      publishActiveSectionId(sectionId)
      pinTimeoutRef.current = window.setTimeout(
        releasePin,
        (SCROLL_DURATION + PIN_RELEASE_MARGIN) * 1000,
      )

      scrollLenisTo(restScrollY, { duration: SCROLL_DURATION })
    },
    [endJump, publishActiveSectionId, releasePin, scrollY],
  )

  return { activeSectionId, scrollToSection }
}
