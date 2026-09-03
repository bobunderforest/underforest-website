import { useEffect } from 'react'
import 'lenis/dist/lenis.css'
import { createLenis, destroyLenis } from 'utils/anim/lenis'

export const useLenis = () => {
  useEffect(() => {
    const lenis = createLenis()
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      destroyLenis()
    }
  }, [])
}
