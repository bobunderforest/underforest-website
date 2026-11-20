import { useState } from 'react'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import type { ProjectEntry } from 'ui/features/experience-data/types'
import { formatYearRange } from 'utils/formatters/dates'
import { cns } from 'utils/formatters/classnames'
import { ProjectPreviewMedia } from './ProjectPreview'
import { ProjectPreviewOverlay } from './ProjectPreviewOverlay'

type Props = {
  entry: ProjectEntry
  index: number
  className?: string
}

const GitHubIcon = () => (
  <svg viewBox={'0 0 16 16'} aria-hidden className={'size-4 fill-current'}>
    <path
      d={
        'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z'
      }
    />
  </svg>
)

export const SketchPreview = ({ entry, index, className }: Props) => {
  const [isTargeted, setIsTargeted] = useState(false)
  const title = entry.title.replace(/\s*\n\s*/g, ' ')
  const years = formatYearRange(entry.from, entry.to, entry.period)
  const githubHref = entry.links?.find((link) =>
    /github\.com/.test(link.href),
  )?.href

  return (
    <article
      onMouseEnter={() => setIsTargeted(true)}
      onMouseLeave={() => setIsTargeted(false)}
      onFocus={() => setIsTargeted(true)}
      onBlur={() => setIsTargeted(false)}
      className={cns(
        `
          group relative flex min-w-0 flex-col border border-edge bg-surface
          transition-colors duration-200
          focus-within:border-accent
          hover:border-accent
        `,
        className,
      )}
    >
      <Link
        href={entry.href}
        isExternal
        aria-label={`Run ${title} demo`}
        className={`
          relative block aspect-[4/3] overflow-hidden outline-none
          focus-visible:outline-2 focus-visible:outline-offset-4
          focus-visible:outline-accent
        `}
      >
        <ProjectPreviewMedia entry={entry} />
        <ProjectPreviewOverlay />
        <div data-theme={'dark'} className={'absolute inset-0'}>
          <Text
            tag={'span'}
            size={'hint'}
            face={'title'}
            uppercase
            className={'absolute top-3 right-3 text-right'}
          >
            {years}
          </Text>
          <Text
            tag={'span'}
            size={'hint'}
            face={'title'}
            tone={'primary'}
            uppercase
            className={`
              absolute right-3 bottom-3 translate-x-2 opacity-0 transition
              duration-200
              group-focus-within:translate-x-0 group-focus-within:opacity-100
              group-hover:translate-x-0 group-hover:opacity-100
              motion-reduce:translate-x-0 motion-reduce:opacity-100
            `}
          >
            open ↗
          </Text>
        </div>
      </Link>
      <div
        className={`
          flex flex-1 flex-col gap-2 border-t border-edge px-3 py-2.5
          transition-colors duration-200
          group-focus-within:border-accent
          group-hover:border-accent
        `}
      >
        <div className={'flex items-start justify-between gap-3'}>
          <Text
            tag={'h3'}
            size={'hint'}
            face={'title'}
            tone={'primary'}
            uppercase
            className={'min-w-0 tracking-[0.06em]'}
          >
            {title}
          </Text>
          {githubHref && (
            <Link
              href={githubHref}
              isExternal
              aria-label={`${title} source on GitHub`}
              className={`
                shrink-0 text-muted transition-colors duration-200 outline-none
                hover:text-accent
                focus-visible:text-accent focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-accent
              `}
            >
              <GitHubIcon />
            </Link>
          )}
        </div>
        {entry.previewText && (
          <Text tag={'p'} size={'hint'} tone={'dimmed'}>
            {entry.previewText}
          </Text>
        )}
      </div>
      <DataCaptureBorder
        muted
        blinkKey={isTargeted ? entry.id : undefined}
        offset={4}
        size={8}
        className={`
          z-10 opacity-0 transition-opacity duration-200
          group-focus-within:border-accent group-focus-within:opacity-100
          group-hover:border-accent group-hover:opacity-100
        `}
      />
    </article>
  )
}
