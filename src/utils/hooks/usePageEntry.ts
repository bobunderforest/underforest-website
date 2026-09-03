import { useEffect } from 'react'
import { holdScrollAligned } from 'utils/anim/scroll-hold'
import { getScrollPosition } from 'utils/browser/scroll-util'

const PAGE_TOP = 0

const entryTop = () => {
  const stage = document.querySelector('main section')
  if (!stage) return PAGE_TOP
  return Math.round(stage.getBoundingClientRect().top + getScrollPosition())
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
      release = holdScrollAligned(entryTop)
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
