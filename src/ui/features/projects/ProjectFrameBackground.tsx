import { lazy, Suspense, useCallback, useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { useVideoInView } from 'utils/hooks/useVideoInView'
import {
  ProjectBackground,
  type ProjectCover,
} from 'ui/features/experience-data/types'
import { useProjectFrame } from './project-frame-context'
import { timeline } from './project-timeline'

const MEDIA_CLASS =
  'absolute inset-0 size-full object-cover grayscale-[0.35] contrast-110 brightness-[0.85]'

const DITHER_STYLE: React.CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-base) 0.7px, transparent 1.1px)',
  backgroundSize: '6px 6px',
  imageRendering: 'pixelated',
}

const PsySky = lazy(() => import('ui/fx/FXPsySky'))
const Kaleidoscope = lazy(() => import('ui/fx/FXKaleidoscope'))

const CUSTOM_COVERS: Record<
  ProjectBackground,
  React.ComponentType<{ active: boolean }>
> = {
  [ProjectBackground.PsySky]: PsySky,
  [ProjectBackground.Kaleidoscope]: Kaleidoscope,
}

type ProjectMediaCover = Extract<ProjectCover, { src: string }>

const isCustomCover = (
  cover: ProjectCover,
): cover is { kind: ProjectBackground } => cover.kind in CUSTOM_COVERS

const CoverMedia = ({
  cover,
  active,
  startVideoAtMiddle,
}: {
  cover: ProjectMediaCover
  active: boolean
  startVideoAtMiddle: boolean
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const handleLoadedMetadata = useCallback(
    (event: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = event.currentTarget
      if (startVideoAtMiddle && Number.isFinite(video.duration)) {
        video.currentTime = video.duration / 2
      }
    },
    [startVideoAtMiddle],
  )

  useVideoInView(videoRef, {
    enabled: active && cover.kind === 'video',
    smooth: true,
  })

  if (cover.kind === 'image') {
    return (
      <img
        src={cover.src}
        alt={''}
        aria-hidden
        loading={'lazy'}
        decoding={'async'}
        className={MEDIA_CLASS}
      />
    )
  }

  return (
    <video
      ref={videoRef}
      src={cover.src}
      poster={cover.poster}
      loop
      playsInline
      preload={'none'}
      onLoadedMetadata={handleLoadedMetadata}
      className={MEDIA_CLASS}
    />
  )
}

export const ProjectFrameBackground = ({
  cover,
  active,
  startVideoAtMiddle,
}: {
  cover?: ProjectCover
  active: boolean
  startVideoAtMiddle: boolean
}) => {
  const { frameProgress } = useProjectFrame()
  const ditherOpacity = useTransform(
    frameProgress,
    [timeline.ditherFadeStart, timeline.ditherFadeEnd],
    [timeline.ditherOpacityAtStart, timeline.ditherOpacityAtEnd],
  )
  const CustomCover =
    cover && isCustomCover(cover) ? CUSTOM_COVERS[cover.kind] : undefined
  const mediaCover = cover && !isCustomCover(cover) ? cover : undefined

  return (
    <div
      aria-hidden
      className={'pointer-events-none absolute inset-0 -z-[1] bg-surface'}
    >
      {CustomCover && (
        <Suspense fallback={null}>
          <CustomCover active={active} />
        </Suspense>
      )}
      {mediaCover && (
        <CoverMedia
          cover={mediaCover}
          active={active}
          startVideoAtMiddle={startVideoAtMiddle}
        />
      )}
      <motion.div
        className={'absolute inset-0'}
        style={{ ...DITHER_STYLE, opacity: ditherOpacity }}
      />
      <div
        className={
          'absolute inset-0 bg-gradient-to-t from-base via-base/70 to-base/50'
        }
      />
      <div
        className={
          'absolute inset-0 bg-gradient-to-r from-base/90 via-base/40 to-transparent'
        }
      />
    </div>
  )
}
