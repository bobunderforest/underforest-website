import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import { prefersReducedMotion } from 'utils/browser/prefers-reduced-motion'
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

const CUSTOM_COVERS: Record<
  ProjectBackground,
  React.ComponentType<{ active: boolean }>
> = {
  [ProjectBackground.PsySky]: PsySky,
}

type ProjectMediaCover = Extract<ProjectCover, { src: string }>

const isCustomCover = (
  cover: ProjectCover,
): cover is { kind: ProjectBackground } => cover.kind in CUSTOM_COVERS

const CoverMedia = ({
  cover,
  active,
}: {
  cover: ProjectMediaCover
  active: boolean
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduced] = useState(prefersReducedMotion)

  useVideoInView(videoRef, {
    enabled: active && !reduced && cover.kind === 'video',
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
      muted
      loop
      playsInline
      preload={'none'}
      className={MEDIA_CLASS}
    />
  )
}

export const ProjectFrameBackground = ({
  cover,
  active,
}: {
  cover?: ProjectCover
  active: boolean
}) => {
  const { frameProgress } = useProjectFrame()
  const ditherOpacity = useTransform(
    frameProgress,
    [timeline.ditherFadeStart, timeline.ditherFadeEnd],
    [timeline.ditherOpacityAtStart, timeline.ditherOpacityAtEnd],
  )
  const CustomCover =
    cover && isCustomCover(cover) ? CUSTOM_COVERS[cover.kind] : undefined

  return (
    <div
      aria-hidden
      className={'pointer-events-none absolute inset-0 -z-[1] bg-surface'}
    >
      {CustomCover ? (
        <Suspense fallback={null}>
          <CustomCover active={active} />
        </Suspense>
      ) : (
        cover &&
        !isCustomCover(cover) && <CoverMedia cover={cover} active={active} />
      )}
      <motion.div
        className={'absolute inset-0'}
        style={{ ...DITHER_STYLE, opacity: ditherOpacity }}
      />
      <div
        className={
          'absolute inset-0 bg-gradient-to-t from-base via-base/70 to-base/20'
        }
      />
      <div
        className={
          'absolute inset-0 bg-gradient-to-r from-base/90 via-base/30 to-transparent'
        }
      />
    </div>
  )
}
