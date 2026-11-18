import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { whenPageSettled } from 'utils/browser/idle'
import { createActivityRamp, stepActivityRamp } from 'utils/anim/activity-ramp'

type Options = { enabled?: boolean; smooth?: boolean }

const MIN_PLAYBACK_RATE = 0.0625
const MAX_DELTA_MS = 50
const PLAY_RETRY_MS = 1000

export const useVideoInView = (
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled = true, smooth = false }: Options = {},
) => {
  const enabledRef = useRef(enabled)
  const isInViewRef = useRef(false)
  const frameRef = useRef(0)
  const activityRef = useRef(createActivityRamp())
  const retryRef = useRef(0)

  const updatePlayback = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const shouldPlay = enabledRef.current && isInViewRef.current
    cancelAnimationFrame(frameRef.current)
    window.clearTimeout(retryRef.current)
    const play = (): void => {
      video.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        if (!enabledRef.current || !isInViewRef.current) return
        retryRef.current = window.setTimeout(play, PLAY_RETRY_MS)
      })
    }
    if (!smooth) {
      if (shouldPlay) play()
      else video.pause()
      return
    }
    if (!shouldPlay && activityRef.current.value === 0) {
      video.pause()
      video.playbackRate = 1
      return
    }
    if (shouldPlay && activityRef.current.value === 0) {
      video.playbackRate = MIN_PLAYBACK_RATE
    }
    play()
    let previous: number | null = null
    const update = (now: number) => {
      const delta =
        previous === null ? 0 : Math.min(now - previous, MAX_DELTA_MS)
      previous = now
      const activity = stepActivityRamp(activityRef.current, shouldPlay, delta)
      video.playbackRate = Math.max(activity, MIN_PLAYBACK_RATE)
      if (!shouldPlay && activity === 0) {
        video.pause()
        video.playbackRate = 1
        return
      }
      frameRef.current = requestAnimationFrame(update)
    }
    frameRef.current = requestAnimationFrame(update)
  }, [smooth, videoRef])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    return whenPageSettled(() => {
      video.preload = 'auto'
      video.load()
    })
  }, [videoRef])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver((entries) => {
      isInViewRef.current = entries[entries.length - 1].isIntersecting
      updatePlayback()
    })
    const onPause = () => {
      if (document.visibilityState !== 'visible') return
      if (enabledRef.current && isInViewRef.current) updatePlayback()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') updatePlayback()
    }
    video.addEventListener('canplay', updatePlayback)
    video.addEventListener('pause', onPause)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', updatePlayback)
    observer.observe(video)
    return () => {
      video.removeEventListener('canplay', updatePlayback)
      video.removeEventListener('pause', onPause)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', updatePlayback)
      observer.disconnect()
      cancelAnimationFrame(frameRef.current)
      window.clearTimeout(retryRef.current)
    }
  }, [videoRef, updatePlayback])

  useEffect(() => {
    enabledRef.current = enabled
    updatePlayback()
  }, [enabled, updatePlayback])
}
