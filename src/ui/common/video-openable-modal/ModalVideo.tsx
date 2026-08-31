import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { useKeyPress } from 'utils/hooks/useKeyPress'
import { useModalActions } from 'modules/modal/modalStore'
import { cns } from 'utils/formatters/classnames'
import { drawVideoFrame } from './frame-grab'

const TIME_MORPH = 300

const formatClock = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00'
  const total = Math.max(0, Math.floor(seconds))
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

type Box = { x: number; y: number; width: number; height: number }

const viewportSize = () => {
  if (typeof window === 'undefined') return { width: 1, height: 1 }
  const declared = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--viewport-height',
    ),
  )
  return {
    width: window.innerWidth,
    height: declared > 0 ? declared : window.innerHeight,
  }
}

const containedBox = (
  viewW: number,
  viewH: number,
  mediaW: number,
  mediaH: number,
): Box => {
  const scale = Math.min(viewW / mediaW, viewH / mediaH)
  const width = mediaW * scale
  const height = mediaH * scale
  return { x: (viewW - width) / 2, y: (viewH - height) / 2, width, height }
}

type FrameCallbackVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    cb: (now: number, metadata: { mediaTime: number }) => void,
  ) => number
}

const Trackbar = ({
  videoRef,
}: {
  videoRef: RefObject<HTMLVideoElement | null>
}) => {
  const barRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const sync = () => {
      setCurrent(video.currentTime)
      setDuration(video.duration || 0)
    }
    sync()
    video.addEventListener('timeupdate', sync)
    video.addEventListener('durationchange', sync)
    return () => {
      video.removeEventListener('timeupdate', sync)
      video.removeEventListener('durationchange', sync)
    }
  }, [videoRef])

  const seekToClientX = useCallback(
    (clientX: number) => {
      const bar = barRef.current
      const video = videoRef.current
      if (!bar || !video || !video.duration) return
      const bounds = bar.getBoundingClientRect()
      const ratio = Math.min(
        Math.max((clientX - bounds.left) / bounds.width, 0),
        1,
      )
      video.currentTime = ratio * video.duration
      setCurrent(video.currentTime)
    },
    [videoRef],
  )

  const progress = duration ? (current / duration) * 100 : 0

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={
        'pointer-events-auto absolute right-0 bottom-0 left-0 flex items-center gap-4 bg-gradient-to-t from-black/80 to-transparent px-[40px] pt-12 pb-0 font-face-regular text-[11px] tracking-[0.08em] text-muted tabular-nums mobile-m:gap-3 mobile-m:px-[16px]'
      }
    >
      <span className={'text-text'}>{formatClock(current)}</span>
      <div
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          seekToClientX(e.clientX)
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) seekToClientX(e.clientX)
        }}
        className={'flex h-[44px] flex-1 cursor-pointer items-center'}
      >
        <div ref={barRef} className={'relative h-[12px] w-full'}>
          <div
            className={
              'absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-edge'
            }
          />
          <div
            className={'absolute top-1/2 left-0 h-px -translate-y-1/2 bg-accent'}
            style={{ width: `${progress}%` }}
          />
          <div
            className={
              'absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 border border-accent bg-base'
            }
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>
      <span>{formatClock(duration)}</span>
    </div>
  )
}

type Props = {
  src: string
  poster?: string
  still?: string
  rect: DOMRect
  startTime: number
  naturalWidth: number
  naturalHeight: number
  onOpen: () => void
  onClose: (endTime?: number, endFrame?: HTMLCanvasElement) => void
}

type Phase = 'entering' | 'open' | 'exiting'

export const ModalVideo = ({
  src,
  poster,
  still,
  rect,
  startTime,
  naturalWidth,
  naturalHeight,
  onOpen,
  onClose,
}: Props) => {
  const { closeModal } = useModalActions()
  const videoRef = useRef<HTMLVideoElement>(null)
  const aliveRef = useRef(true)
  useEffect(
    () => () => {
      aliveRef.current = false
    },
    [],
  )

  const [view, setView] = useState(viewportSize)
  const [phase, setPhase] = useState<Phase>('entering')
  const [collapsed, setCollapsed] = useState(true)
  const [videoReady, setVideoReady] = useState(false)

  const target = containedBox(
    view.width,
    view.height,
    naturalWidth,
    naturalHeight,
  )
  const collapsedTransform = `translate(${rect.x - target.x}px, ${
    rect.y - target.y
  }px) scale(${rect.width / target.width}, ${rect.height / target.height})`

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      onOpen()
      setCollapsed(false)
    })
    const timer = window.setTimeout(() => {
      setPhase((p) => (p === 'entering' ? 'open' : p))
    }, TIME_MORPH + 60)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [onOpen])

  useEffect(() => {
    if (phase !== 'open') return
    const onResize = () => setView(viewportSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [phase])

  const playVideo = useCallback(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  const handleMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (startTime > 0.1 && Number.isFinite(video.duration)) {
      video.currentTime = Math.min(startTime, video.duration - 0.1)
    } else {
      playVideo()
    }
  }, [startTime, playVideo])

  const revealWhenPainted = useCallback(() => {
    const video = videoRef.current as FrameCallbackVideo | null
    if (!video) return
    const request = video.requestVideoFrameCallback?.bind(video)
    if (!request) {
      setVideoReady(true)
      return
    }
    const check = (_now: number, meta: { mediaTime: number }) => {
      if (!aliveRef.current) return
      if (!startTime || meta.mediaTime >= startTime - 0.3) setVideoReady(true)
      else request(check)
    }
    request(check)
  }, [startTime])

  const handleClose = useCallback(() => {
    if (phase === 'exiting') return
    const video = videoRef.current
    const endTime = video ? video.currentTime : undefined
    const endFrame = video ? drawVideoFrame(video) : undefined
    setPhase('exiting')
    setCollapsed(true)
    onClose(endTime, endFrame)
    window.setTimeout(closeModal, TIME_MORPH + 40)
  }, [phase, closeModal, onClose])

  useKeyPress('Escape', handleClose)

  return (
    <div
      onClick={handleClose}
      className={'fixed top-0 left-0 z-[999] h-full w-full cursor-zoom-out'}
    >
      <div
        className={cns(
          'absolute top-0 left-0 h-full w-full bg-black transition-opacity duration-300 ease-in-out-sine',
          phase === 'open' ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        onTransitionEnd={(e) => {
          if (
            e.propertyName === 'transform' &&
            e.target === e.currentTarget &&
            !collapsed
          ) {
            setPhase((p) => (p === 'entering' ? 'open' : p))
          }
        }}
        style={{
          position: 'absolute',
          left: target.x,
          top: target.y,
          width: target.width,
          height: target.height,
          transformOrigin: '0 0',
          transform: collapsed ? collapsedTransform : 'none',
          transition: `transform ${TIME_MORPH}ms var(--ease-in-out-sine)`,
          willChange: phase === 'open' ? 'auto' : 'transform',
        }}
        className={'overflow-hidden'}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster ?? still}
          muted
          loop
          playsInline
          onLoadedMetadata={handleMetadata}
          onSeeked={playVideo}
          onPlaying={revealWhenPainted}
          className={
            'pointer-events-none absolute top-0 left-0 h-full w-full object-contain'
          }
        />
        {still && !videoReady && (
          <img
            src={still}
            alt={''}
            aria-hidden
            className={
              'pointer-events-none absolute top-0 left-0 h-full w-full object-contain'
            }
          />
        )}
      </div>

      {phase === 'open' && videoReady && <Trackbar videoRef={videoRef} />}
    </div>
  )
}
