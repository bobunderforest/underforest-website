import { useEffect, useRef, type RefObject } from 'react'
import { whenPageSettled } from 'utils/browser/idle'

type Options = { enabled?: boolean }

export const useVideoInView = (
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled = true }: Options = {},
) => {
  const enabledRef = useRef(enabled)
  const isInViewRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    return whenPageSettled(() => {
      video.preload = 'auto'
      video.load()
    })
  }, [videoRef])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver((entries) => {
      isInViewRef.current = entries.some((entry) => entry.isIntersecting)
      if (isInViewRef.current && enabledRef.current) video.play().catch(() => {})
      else video.pause()
    })
    observer.observe(video)
    return () => observer.disconnect()
  }, [videoRef])

  useEffect(() => {
    enabledRef.current = enabled
    const video = videoRef.current
    if (!video) return
    if (enabled && isInViewRef.current) video.play().catch(() => {})
    else if (!enabled) video.pause()
  }, [videoRef, enabled])
}
