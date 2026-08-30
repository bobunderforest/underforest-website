import { useEffect } from 'react'
import { lockScroll, unlockScroll } from 'utils/browser/scroll-util'
import { pauseLenis, resumeLenis } from 'utils/anim/lenis'

export function useScrollLock(isLocked = true) {
  useEffect(() => {
    if (!isLocked) return
    pauseLenis()
    lockScroll()
    return () => {
      unlockScroll()
      resumeLenis()
    }
  }, [isLocked])
}
