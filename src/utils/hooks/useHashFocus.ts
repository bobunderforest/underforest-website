import { useEffect } from 'react'
import { holdScrollAligned } from 'utils/anim/scroll-hold'
import { getScrollPosition } from 'utils/browser/scroll-util'

const hashTargetTop = () => {
  const id = window.location.hash.slice(1)
  if (!id) return null

  const target = document.getElementById(id)
  if (!target) return null

  const rect = target.getBoundingClientRect()
  const centeringOffset = Math.max((window.innerHeight - rect.height) / 2, 0)
  return Math.round(rect.top + getScrollPosition() - centeringOffset)
}

export const useHashFocus = () => {
  useEffect(() => {
    let release = () => {}

    const focusHash = () => {
      if (!window.location.hash) return
      release()
      release = holdScrollAligned(hashTargetTop)
    }

    focusHash()
    window.addEventListener('hashchange', focusHash)
    document.addEventListener('astro:page-load', focusHash)
    return () => {
      release()
      window.removeEventListener('hashchange', focusHash)
      document.removeEventListener('astro:page-load', focusHash)
    }
  }, [])
}
