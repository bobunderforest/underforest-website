import { useEffect } from 'react'
import { jumpLenisTo } from 'utils/anim/lenis'
import { getScrollPosition } from 'utils/browser/scroll-util'

const SETTLE_WINDOW_MS = 900
const INTENT_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const

const PAGE_TOP = 0

const entryTop = () => {
  const stage = document.querySelector('main section')
  if (!stage) return PAGE_TOP
  return Math.round(stage.getBoundingClientRect().top + getScrollPosition())
}

const holdEntryAligned = () => {
  let held = true
  const align = () => {
    if (!held) return
    jumpLenisTo(entryTop())
  }

  const release = () => {
    held = false
    observer.disconnect()
    clearTimeout(timer)
    INTENT_EVENTS.forEach((name) =>
      window.removeEventListener(name, release, { capture: true }),
    )
  }

  const observer = new ResizeObserver(align)
  const timer = setTimeout(release, SETTLE_WINDOW_MS)

  align()
  observer.observe(document.body)
  document.fonts?.ready.then(align)
  INTENT_EVENTS.forEach((name) =>
    window.addEventListener(name, release, { capture: true, passive: true }),
  )

  return release
}

export const usePageEntry = () => {
  useEffect(() => {
    let navigated = false
    let traversed = false
    let release = () => {}

    const markNavigated = () => {
      navigated = true
    }
    const markTraversed = () => {
      traversed = true
    }

    const focusStage = () => {
      const entering = navigated && !traversed
      navigated = false
      traversed = false
      if (!entering || window.location.hash) return

      release()
      release = holdEntryAligned()
    }

    window.addEventListener('popstate', markTraversed)
    document.addEventListener('astro:before-preparation', markNavigated)
    document.addEventListener('astro:page-load', focusStage)
    return () => {
      release()
      window.removeEventListener('popstate', markTraversed)
      document.removeEventListener('astro:before-preparation', markNavigated)
      document.removeEventListener('astro:page-load', focusStage)
    }
  }, [])
}
