import { EventEmitter } from 'utils/primitives/event-subscription'
import { getScrollPosition } from 'utils/browser/scroll-util'

const STORAGE_KEY = 'underforest:last-section'

export const SECTION_ENTER_TIMELINE = 0.15

export type SectionAnchor = {
  id: string
  enterScrollY: () => number | null
  restScrollY: () => number | null
}

const anchors = new Map<string, SectionAnchor>()

export const sectionAnchorsChanged = new EventEmitter()

export const registerSectionAnchor = (anchor: SectionAnchor) => {
  anchors.set(anchor.id, anchor)
  sectionAnchorsChanged.fire()
  return () => {
    if (anchors.get(anchor.id) !== anchor) return
    anchors.delete(anchor.id)
    sectionAnchorsChanged.fire()
  }
}

export const sectionTimelineScrollY = (id: string, offsetTimeline: number) => {
  const element = document.getElementById(id)
  if (!element) return null
  const sectionTop = element.getBoundingClientRect().top + getScrollPosition()
  return sectionTop + offsetTimeline * element.offsetHeight
}

export type SectionPosition = { id: string; scrollY: number }

export const sectionPositions = (): SectionPosition[] =>
  [...anchors.values()]
    .flatMap((anchor) => {
      const scrollY = anchor.enterScrollY()
      return scrollY === null ? [] : [{ id: anchor.id, scrollY }]
    })
    .sort((a, b) => a.scrollY - b.scrollY)

export const sectionIdAtScrollY = (
  positions: SectionPosition[],
  scrollY: number,
) => {
  if (!positions.length) return null
  const passed = positions.findLast(
    (position) => position.scrollY <= scrollY + 1,
  )
  return (passed ?? positions[0]).id
}

export const sectionSpanBetween = (
  positions: SectionPosition[],
  fromId: string | null,
  toId: string,
) => {
  const fromIndex = positions.findIndex((position) => position.id === fromId)
  const toIndex = positions.findIndex((position) => position.id === toId)
  if (fromIndex === -1 || toIndex === -1) return 0
  return Math.abs(toIndex - fromIndex)
}

export const currentSectionId = () =>
  sectionIdAtScrollY(sectionPositions(), getScrollPosition())

export const sectionRestScrollY = (id: string) => {
  const anchor = anchors.get(id)
  return anchor ? anchor.restScrollY() : null
}

export const readRememberedSection = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const writeRememberedSection = (id: string) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, id)
  } catch {}
}

export const rememberCurrentSection = () => {
  const id = currentSectionId()
  if (id !== null) writeRememberedSection(id)
}

export const rememberedSectionScrollY = () => {
  const id = readRememberedSection()
  return id ? sectionRestScrollY(id) : null
}
