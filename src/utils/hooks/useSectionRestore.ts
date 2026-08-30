import { useEffect } from 'react'
import { jumpLenisTo } from 'utils/anim/lenis'
import {
  rememberCurrentSection,
  rememberedSectionScrollY,
} from 'utils/anim/section-anchors'

export const useSectionRestore = () => {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    const restoredScrollY = rememberedSectionScrollY()
    if (restoredScrollY !== null) jumpLenisTo(restoredScrollY)

    const rememberOnHide = () => {
      if (document.visibilityState === 'hidden') rememberCurrentSection()
    }
    window.addEventListener('pagehide', rememberCurrentSection)
    document.addEventListener('visibilitychange', rememberOnHide)
    return () => {
      window.removeEventListener('pagehide', rememberCurrentSection)
      document.removeEventListener('visibilitychange', rememberOnHide)
    }
  }, [])
}
