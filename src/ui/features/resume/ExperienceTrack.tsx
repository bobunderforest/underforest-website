import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, useInView } from 'framer-motion'
import { Link } from 'ui/common/typography/Link'
import { useResumeModel } from './resume-context'
import { ExperienceDetail } from './ExperienceDetail'
import {
  EXPERIENCE,
  EXPERIENCE_STATUS_LABEL,
  isDimmed,
  type ExperienceEntry,
  type ExperienceStatus,
} from './resume-data'
import { cns } from 'utils/formatters/classnames'
import { formatDateRange } from 'utils/formatters/dates'

const nodeClass = (dimmed: boolean) =>
  cns(
    'relative py-8 pl-16 transition-opacity duration-300',
    'before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px before:bg-edge',
    'first:before:top-8 last:before:bottom-auto last:before:h-[42px]',
    dimmed && 'opacity-30',
  )

const reticleClass =
  'absolute size-[7px] border-accent opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100'

const DetectionFrame = () => (
  <span
    aria-hidden
    className={
      'pointer-events-none absolute -top-[20px] -bottom-[20px] -left-[26px] -right-[26px] -z-10'
    }
  >
    <span
      className={cns(
        'absolute inset-0 border border-accent/40 bg-accent/[0.06] opacity-0 transition-[opacity,border-color,background-color] duration-300 group-data-[active=true]:opacity-100',
        'group-data-[lit=true]:border-accent/65 group-data-[lit=true]:bg-accent/[0.09]',
      )}
    />
    <span className={cns(reticleClass, 'top-[-1px] left-[-1px] border-t-2 border-l-2')} />
    <span className={cns(reticleClass, 'top-[-1px] right-[-1px] border-t-2 border-r-2')} />
    <span className={cns(reticleClass, 'bottom-[-1px] left-[-1px] border-b-2 border-l-2')} />
    <span className={cns(reticleClass, 'right-[-1px] bottom-[-1px] border-r-2 border-b-2')} />
  </span>
)

const anchorClass =
  'relative before:absolute before:top-[10px] before:left-[-64px] before:h-px before:w-[58px] before:bg-muted/30'

const titleLinkClass = cns(
  'link-dash text-accent',
  'group-data-[lit=true]:decoration-current',
)

const innerLinkClass = 'link-dash -m-1 p-1 text-accent'

const openExternal = (href: string) =>
  window.open(href, '_blank', 'noopener,noreferrer')

const Marker = ({ entry }: { entry: ExperienceEntry }) => (
  <span
    aria-hidden
    className={cns(
      'absolute z-[1] border-2 bg-base',
      entry.break
        ? 'top-[7px] left-[-67px] size-[6px] border-muted'
        : 'top-[5px] left-[-69px] size-[10px]',
      !entry.break && entry.reclassified && 'border-accent bg-accent',
      !entry.break && !entry.reclassified && 'border-system',
    )}
  />
)

const tagClass =
  'inline-flex items-center gap-[6px] border px-[6px] py-[1px] font-face-regular text-[11px] tracking-[0.14em] uppercase'

const ReclassifiedTag = () => (
  <span className={cns(tagClass, 'border-accent text-accent')}>
    Reclassified · web → gamedev
  </span>
)

const StatusTag = ({ status }: { status: ExperienceStatus }) => (
  <span className={cns(tagClass, 'border-muted/60 text-muted')}>
    <span aria-hidden>⊘</span>
    {EXPERIENCE_STATUS_LABEL[status.kind]}
  </span>
)

const EntryTags = ({ entry }: { entry: ExperienceEntry }) =>
  entry.reclassified || entry.status ? (
    <div className={'mb-2 flex flex-wrap gap-2'}>
      {entry.reclassified && <ReclassifiedTag />}
      {entry.status && <StatusTag status={entry.status} />}
    </div>
  ) : null

const StatusNote = ({ status }: { status: ExperienceStatus }) =>
  status.note ? (
    <p
      className={
        'mt-3 hidden max-w-[62ch] font-face-regular text-[13px] leading-[1.5] text-muted italic desktop-s:block'
      }
    >
      {status.note}
    </p>
  ) : null

const Meta = ({ entry }: { entry: ExperienceEntry }) => (
  <div
    className={
      'mt-1 font-face-regular text-[12px] tracking-[0.08em] text-muted uppercase transition-colors duration-300 group-data-[active=true]:text-text'
    }
  >
    <span className={'tabular-nums'}>
      {formatDateRange(entry.from, entry.to, 'short')}
    </span>
    {entry.role && <> · {entry.role}</>}
    {entry.employment && <> · {entry.employment}</>}
  </div>
)

const Summary = ({ lines }: { lines: string[] }) => (
  <ul
    className={
      'mt-3 max-w-[62ch] font-face-regular text-[14px] text-muted transition-colors duration-300 group-data-[active=true]:text-text'
    }
  >
    {lines.map((line) => (
      <li
        key={line}
        className={cns(
          'relative py-[3px] pl-[22px]',
          'before:absolute before:top-0 before:bottom-0 before:left-[3px] before:w-px before:bg-muted/35',
          'last:before:bottom-auto last:before:h-[13px]',
          'after:absolute after:top-[13px] after:left-[3px] after:h-px after:w-[13px] after:bg-muted/35',
        )}
      >
        {line}
      </li>
    ))}
  </ul>
)

const LinkRow = ({ entry }: { entry: ExperienceEntry }) =>
  entry.links && entry.links.length > 0 ? (
    <div
      className={
        'mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-face-regular text-[12px] tracking-[0.06em]'
      }
    >
      {entry.links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          isExternal
          data-inner
          className={innerLinkClass}
        >
          {link.label}
        </Link>
      ))}
    </div>
  ) : null

type NodeProps = {
  entry: ExperienceEntry
  active: boolean
  onInViewChange: (id: string, inView: boolean) => void
}

const ExperienceNode = ({ entry, active, onInViewChange }: NodeProps) => {
  const { model } = useResumeModel()
  const dimmed = isDimmed(model, entry.domains)
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: '-48% 0px -48% 0px' })
  const [hovered, setHovered] = useState(false)
  const [innerHovered, setInnerHovered] = useState(false)

  const clickable = Boolean(entry.href) && active
  const lit = clickable && hovered && !innerHovered

  useEffect(() => {
    if (entry.break) return
    onInViewChange(entry.id, inView)
  }, [entry.id, entry.break, inView, onInViewChange])

  if (entry.break) {
    return (
      <li ref={ref} className={nodeClass(dimmed)}>
        <div className={anchorClass}>
          <Marker entry={entry} />
          <div
            className={
              'font-face-regular text-[12px] tracking-[0.08em] text-muted/70 uppercase'
            }
          >
            <span className={'tabular-nums'}>
              {formatDateRange(entry.from, entry.to, 'short')}
            </span>{' '}
            · signal gap
          </div>
        </div>
        <p className={'mt-1.5 text-[14px] text-muted/70 italic'}>
          {entry.summary.join(' ')}
        </p>
      </li>
    )
  }

  return (
    <li ref={ref} className={cns(nodeClass(dimmed), active && 'z-[1]')}>
      <div
        data-active={active}
        data-lit={lit}
        className={cns(
          'group relative isolate w-fit max-w-full',
          clickable && 'cursor-pointer',
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false)
          setInnerHovered(false)
        }}
        onMouseOver={(e) =>
          setInnerHovered(
            Boolean((e.target as HTMLElement).closest('[data-inner]')),
          )
        }
        onClick={
          clickable
            ? (e) => {
                if ((e.target as HTMLElement).closest('a, button')) return
                openExternal(entry.href as string)
              }
            : undefined
        }
      >
        <DetectionFrame />
        {clickable && (
          <span
            aria-hidden
            className={
              'absolute -top-[20px] -right-[26px] -bottom-[20px] -left-[26px] -z-[1]'
            }
          />
        )}
        <EntryTags entry={entry} />
        <div className={anchorClass}>
          <Marker entry={entry} />
          <h3
            className={
              'font-face-title text-[18px] leading-[1.15] font-bold text-text'
            }
          >
            {entry.href ? (
              <Link href={entry.href} isExternal className={titleLinkClass}>
                {entry.place} ↗
              </Link>
            ) : (
              entry.place
            )}
          </h3>
        </div>
        <Meta entry={entry} />
        <LinkRow entry={entry} />
        <Summary lines={entry.summary} />
        {entry.status && <StatusNote status={entry.status} />}
        <AnimatePresence>
          {active &&
            (entry.details?.length || entry.status || entry.credits?.length) && (
              <ExperienceDetail
                key={'detail'}
                details={entry.details ?? []}
                status={entry.status}
                credits={entry.credits}
              />
            )}
        </AnimatePresence>
      </div>
    </li>
  )
}

export const ExperienceTrack = () => {
  const inViewIds = useRef(new Set<string>())
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleInViewChange = useCallback((id: string, inView: boolean) => {
    const set = inViewIds.current
    if (inView) set.add(id)
    else set.delete(id)

    setActiveId((current) => {
      if (current && set.has(current)) return current
      const next = EXPERIENCE.find((entry) => set.has(entry.id))
      return next ? next.id : current
    })
  }, [])

  return (
    <ol className={'mt-4 grid max-w-[880px]'}>
      {EXPERIENCE.map((entry) => (
        <ExperienceNode
          key={entry.id}
          entry={entry}
          active={entry.id === activeId}
          onInViewChange={handleInViewChange}
        />
      ))}
    </ol>
  )
}
