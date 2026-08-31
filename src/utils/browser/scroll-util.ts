import { isBrowser } from './is-browser'

// export const SCROLL_STORAGE_PREFIX = 'saved-scroll-'
export const HTML_LOCK_CLASS = 'html-scroll-lock'
export const BODY_LOCK_CLASS = 'body-scroll-lock'

let lockersStack = 0
let scrollPosition = 0
let isScrollLocked = false
// let preventScrollRestoring = false

let body: any
let html: any

if (isBrowser) {
  body = document.body
  html = document.documentElement
}

export const getScrollPosition = () => {
  if (!isScrollLocked) {
    scrollPosition = window.pageYOffset || html.scrollTop || body.scrollTop || 0
  }
  return scrollPosition
}

export const setScrollPosition = (scroll: number) => {
  if (isScrollLocked) {
    scrollPosition = scroll
    body.style.top = `-${scroll}px`
  } else {
    window.scrollTo(0, scroll)
  }
}

// Scroll Locker
export const lockScroll = () => {
  if (!isBrowser || ++lockersStack > 1) return
  const scroll = getScrollPosition()
  isScrollLocked = true
  html.classList.add(HTML_LOCK_CLASS)
  body.classList.add(BODY_LOCK_CLASS)
  body.style.top = `-${scroll}px`
}

// Scroll Unlocker
export const unlockScroll = () => {
  if (!isBrowser || lockersStack === 0) return
  lockersStack -= 1
  if (lockersStack > 0) return
  html.classList.remove(HTML_LOCK_CLASS)
  body.classList.remove(BODY_LOCK_CLASS)
  body.style.top = ''
  const scroll = getScrollPosition()
  window.scrollTo(0, scroll)
  isScrollLocked = false
}

// Animate Scroll
let animateRafId: number | undefined
export const animateScroll = (
  to: number,
  duration = 350,
  easingFunction: (t: number) => number,
) => {
  return new Promise<void>((resolve) => {
    if (animateRafId) {
      window.cancelAnimationFrame(animateRafId)
      animateRafId = undefined
    }

    const start = getScrollPosition()
    const distance = to - start
    let startTime: number

    if (distance === 0 || isScrollLocked) {
      if (isScrollLocked) setScrollPosition(start + distance)
      resolve()
      return
    }

    const doAnimation = (time: number) => {
      if (!startTime) startTime = time
      const currentTime = time - startTime
      const prog = easingFunction(currentTime / duration)
      window.scrollTo(0, start + prog * distance)
      if (prog <= 1) {
        animateRafId = window.requestAnimationFrame(doAnimation)
      } else {
        animateRafId = undefined
        resolve()
      }
    }

    animateRafId = window.requestAnimationFrame(doAnimation)
  })
}

// export const saveScrollHistory = (key: string) => {
//   sessionStorage.setItem(
//     SCROLL_STORAGE_PREFIX + key,
//     String(getScrollPosition()),
//   )
// }

// export const preventNextScrollRestoring = () => (preventScrollRestoring = true)

// export const restoreScrollHistory = (key: string) => {
//   if (preventScrollRestoring) {
//     preventScrollRestoring = false
//     return
//   }
//   const top = Number(sessionStorage.getItem(SCROLL_STORAGE_PREFIX + key) || 0)
//   setScrollPosition(top)
// }

export const getScrollbarSize = (): number => {
  const tempDiv = document.createElement('div')

  Object.assign(tempDiv.style, {
    position: 'absolute',
    left: '-9000px',
    width: '100px',
    height: '100px',
    overflow: 'scroll',
  })

  document.body.appendChild(tempDiv)
  const scrollbarSize = tempDiv.offsetWidth - tempDiv.clientWidth
  document.body.removeChild(tempDiv)

  return scrollbarSize
}
