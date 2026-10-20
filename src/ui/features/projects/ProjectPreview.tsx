import { lazy, Suspense, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import {
  ProjectBackground,
  type ProjectEntry,
} from 'ui/features/experience-data/types'
import { formatYearRange } from 'utils/formatters/dates'
import { useVideoInView } from 'utils/hooks/useVideoInView'
import { cns } from 'utils/formatters/classnames'
import { markProjectIndexReturn } from 'utils/browser/project-index-return'

const Kaleidoscope = lazy(() => import('ui/fx/FXKaleidoscope'))

const PreviewVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useVideoInView(videoRef, { smooth: true })

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload={'none'}
      className={
        'absolute inset-0 size-full object-cover brightness-75 contrast-110 grayscale-[0.2]'
      }
    />
  )
}

const PreviewKaleidoscope = () => {
  const hostRef = useRef<HTMLDivElement>(null)
  const active = useInView(hostRef, { amount: 0.15 })

  return (
    <div ref={hostRef} className={'absolute inset-0'}>
      {active && (
        <Suspense fallback={null}>
          <Kaleidoscope active={active} />
        </Suspense>
      )}
    </div>
  )
}

const ProjectPreviewMedia = ({ entry }: { entry: ProjectEntry }) => {
  const cover = entry.previewCover

  return (
    <div
      className={
        'pointer-events-none absolute inset-0 scale-100 transition-transform duration-500 group-hover:scale-[1.1] group-focus-visible:scale-[1.1]'
      }
    >
      {cover?.kind === 'video' && <PreviewVideo src={cover.src} />}
      {cover?.kind === 'image' && (
        <img
          src={cover.src}
          alt={''}
          aria-hidden
          loading={'lazy'}
          decoding={'async'}
          className={
            'absolute inset-0 size-full object-cover brightness-75 contrast-110 grayscale-[0.2]'
          }
        />
      )}
      {cover?.kind === ProjectBackground.Kaleidoscope && (
        <PreviewKaleidoscope />
      )}
      {!cover && <div className={'absolute inset-0 bg-surface'} />}
    </div>
  )
}

type Props = {
  entry: ProjectEntry
  className?: string
}

export const ProjectPreview = ({ entry, className }: Props) => {
  const [isTargeted, setIsTargeted] = useState(false)
  const previewText = entry.previewText
  const domains = entry.domains?.join(' · ')
  const years = formatYearRange(entry.from, entry.to, entry.period)

  return (
    <article className={cns('group relative min-w-0', className)}>
      <Link
        href={`/projects/${entry.id}`}
        aria-label={`Open ${entry.title} project record`}
        onMouseEnter={() => setIsTargeted(true)}
        onMouseLeave={() => setIsTargeted(false)}
        onFocus={() => setIsTargeted(true)}
        onBlur={() => setIsTargeted(false)}
        onClick={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return
          }
          markProjectIndexReturn(entry.id)
        }}
        className={
          'relative flex aspect-video overflow-hidden border border-edge bg-surface transition-colors duration-200 outline-none hover:border-accent focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
        }
      >
        <ProjectPreviewMedia entry={entry} />
        <div
          className={
            'absolute inset-0 bg-gradient-to-t from-base via-base/40 to-base/5 transition-colors duration-200 group-hover:via-base/55 group-focus-visible:via-base/55'
          }
        />
        <div
          className={
            'absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,transparent_0,rgba(0,0,0,0.5)_80%)]'
          }
        />
        <div
          style={{
            backgroundImage:
              'radial-gradient(var(--color-muted) 0.6px, transparent 0.9px)',
            backgroundSize: '5px 5px',
            maskImage: 'linear-gradient(to top, black, transparent)',
          }}
          className={
            'pointer-events-none absolute inset-x-0 bottom-0 h-1/3 opacity-25'
          }
        />
        <div className={'relative flex w-full flex-col justify-between p-6'}>
          <div className={'flex items-start justify-between gap-4'}>
            <Text
              tag={'span'}
              size={'note'}
              tone={'soft'}
              uppercase
              className={'max-w-[9rem]'}
            >
              {domains}
            </Text>
            <Text
              tag={'span'}
              size={'hint'}
              face={'title'}
              tone={'system'}
              uppercase
              className={'text-right'}
            >
              {years}
            </Text>
          </div>

          <div className={'pr-28'}>
            <Text
              tag={'h2'}
              size={'inherit'}
              face={'title'}
              tone={'primary'}
              uppercase
              className={
                'mb-3 max-w-[12ch] text-title-3 leading-[0.95] font-bold tracking-[0.06em]'
              }
            >
              {entry.title}
            </Text>
            {previewText && (
              <Text
                tag={'p'}
                size={'hint'}
                tone={'soft'}
                className={
                  'max-w-prose-measure transition-opacity duration-200 group-focus-visible:opacity-100'
                }
              >
                {previewText}
              </Text>
            )}
          </div>
        </div>
        <Text
          tag={'span'}
          size={'hint'}
          face={'title'}
          tone={'primary'}
          uppercase
          className={
            'absolute right-6 bottom-6 translate-x-2 opacity-0 transition duration-200 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100'
          }
        >
          open ↗
        </Text>
      </Link>
      <DataCaptureBorder
        muted
        blinkKey={isTargeted ? entry.id : undefined}
        offset={4}
        size={12}
        className={
          'z-10 group-focus-within:border-accent group-hover:border-accent'
        }
      />
    </article>
  )
}
