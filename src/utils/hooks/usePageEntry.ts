import { useEffect } from 'react'
import { holdScrollAligned } from 'utils/anim/scroll-hold'
import { getScrollPosition } from 'utils/browser/scroll-util'

const PAGE_TOP = 0

const focusesStageOnEntry = () =>
  document.querySelector('main[data-focus-on-entry]') !== null

const isAtPageTop = () => getScrollPosition() <= 1

const entryTop = () => {
  const entryTargetId = document
    .querySelector('main[data-focus-on-entry]')
    ?.getAttribute('data-focus-on-entry')
  const stage = entryTargetId
    ? document.getElementById(entryTargetId)
    : document.querySelector('main section')
  if (!stage) return PAGE_TOP
  return Math.round(stage.getBoundingClientRect().top + getScrollPosition())
}

export const usePageEntry = () => {
  useEffect(() => {
    let navigated = false
    let traversed = false
    let opened = true
    let release = () => {}

    const markNavigated = () => {
      navigated = true
    }
    const markTraversed = () => {
      traversed = true
    }

    const focusStage = () => {
      const entering = navigated && !traversed
      const opening = opened && !traversed
      navigated = false
      traversed = false
      opened = false
      if (window.location.hash) return
      if (!entering && !(opening && focusesStageOnEntry() && isAtPageTop())) {
        return
      }

      release()
      release = holdScrollAligned(entryTop)
    }

    focusStage()
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
