import { useCallback, useEffect, useRef, useState } from 'react'
import { cns } from 'utils/formatters/classnames'
import { openModal } from 'modules/modal/modalStore'
import { useVideoInView } from 'utils/hooks/useVideoInView'
import { grabVideoFrame } from './frame-grab'
import { CanvasFrame } from './CanvasFrame'
import { ModalVideo } from './ModalVideo'
import { SensitiveVideoConsent } from './SensitiveVideoConsent'

export const VideoOpenable = ({
  src,
  safeSrc,
  poster,
  className,
}: React.BaseProps & { src: string; safeSrc?: string; poster?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<string | undefined>(undefined)
  const [isOpened, setOpened] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)
  const [restoreCanvas, setRestoreCanvas] = useState<HTMLCanvasElement>()
  const activeSrc = safeSrc && !hasConsented ? safeSrc : src

  useVideoInView(videoRef, { enabled: !isOpened })

  useEffect(
    () => () => {
      if (frameRef.current) URL.revokeObjectURL(frameRef.current)
    },
    [],
  )

  const clearRestore = useCallback(() => setRestoreCanvas(undefined), [])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current
      if (!video) return
      const rect = video.getBoundingClientRect()
      const startTime = video.currentTime
      const naturalWidth = video.videoWidth || 16
      const naturalHeight = video.videoHeight || 9

      if (frameRef.current) URL.revokeObjectURL(frameRef.current)

      void grabVideoFrame(video).then((frame) => {
        frameRef.current = frame
        openModal(ModalVideo, {
          src: activeSrc,
          poster,
          still: frame ?? poster,
          rect,
          startTime,
          naturalWidth,
          naturalHeight,
          onOpen: () => setOpened(true),
          onClose: (endTime, endFrame) => {
            const preview = videoRef.current
            const shouldSeek =
              preview != null &&
              endTime != null &&
              Number.isFinite(endTime) &&
              Math.abs(preview.currentTime - endTime) > 0.05
            if (shouldSeek) {
              if (endFrame) setRestoreCanvas(endFrame)
              window.setTimeout(clearRestore, 2000)
              try {
                preview.currentTime = endTime
              } catch {
                clearRestore()
              }
            }
            setOpened(false)
          },
        })
      })
    },
    [activeSrc, poster, clearRestore],
  )

  const handleConsent = useCallback(() => setHasConsented(true), [])

  return (
    <div
      onClick={handleClick}
      className={cns(
        'relative cursor-zoom-in overflow-hidden transition-opacity',
        className,
        isOpened && 'opacity-0',
      )}
    >
      <video
        ref={videoRef}
        src={activeSrc}
        poster={poster}
        loop
        playsInline
        preload={'none'}
        onSeeked={clearRestore}
        className={'absolute top-0 left-0 h-full w-full object-cover'}
      />
      {safeSrc && !hasConsented && (
        <SensitiveVideoConsent onConsent={handleConsent} />
      )}
      {restoreCanvas && (
        <CanvasFrame
          canvas={restoreCanvas}
          fit={'cover'}
          className={'absolute top-0 left-0 h-full w-full'}
        />
      )}
    </div>
  )
}
