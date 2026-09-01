import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { TextTitle } from 'ui/common/typography/TextTitle'
import {
  ExperienceDetails,
  ExperienceDetailsDisclosure,
} from '../experience-details/ExperienceDetails'
import { useExperienceDomainFilter } from 'ui/features/experience-data/experience-data-context'
import { isDimmed } from 'ui/features/experience-data/experience-data'
import type { ExperienceEntry as ExperienceEntryData } from 'ui/features/experience-data/types'
import { openExternal } from 'utils/browser/open-external'
import { cns } from 'utils/formatters/classnames'
import { useResponsiveValue } from 'utils/hooks/useResponsiveValue'
import {
  ExperienceAnchor,
  ExperienceDetectionFrame,
  ExperienceMarker,
  ExperienceTrackNode,
} from './ExperienceTrackParts'
import {
  ExperienceBreakNode,
  ExperienceEntryTags,
  ExperienceLinkRow,
  ExperienceMeta,
  ExperienceStatusNote,
  ExperienceSummary,
  ExperienceTitleRole,
  ExperienceTitleLink,
} from './ExperienceEntryParts'

type ExperienceEntryProps = {
  entry: ExperienceEntryData
  active: boolean
  detailsExpanded: boolean
  onInViewChange: (id: string, inView: boolean) => void
  onDetailsExpandedChange: (
    id: string,
    expanded: boolean,
    node: HTMLElement | null,
  ) => void
  onDetailsCollapseComplete: (id: string) => void
}

const fullEntryClick = {
  desktop: true,
  'tablet-s': false,
}

export const ExperienceEntry = ({
  entry,
  active,
  detailsExpanded,
  onInViewChange,
  onDetailsExpandedChange,
  onDetailsCollapseComplete,
}: ExperienceEntryProps) => {
  const { domainFilter } = useExperienceDomainFilter()
  const dimmed = isDimmed(domainFilter, entry.domains)
  const ref = useRef<HTMLLIElement>(null)
  const [hovered, setHovered] = useState(false)
  const [innerHovered, setInnerHovered] = useState(false)
  const fullEntryClickEnabled = useResponsiveValue(fullEntryClick)
  const hasDetails = Boolean(
    entry.details?.length ||
    entry.status ||
    entry.credits?.length ||
    entry.skills?.length ||
    entry.href ||
    entry.links?.length,
  )

  const clickable = Boolean(entry.href) && active && fullEntryClickEnabled
  const lit = clickable && hovered && !innerHovered

  useEffect(() => {
    if (entry.break) return

    const node = ref.current
    if (!node) return

    const observeActivationArea = () => {
      const activationAreaHeight = Math.max(window.innerHeight * 0.04, 1)
      const verticalMargin = Math.max(
        (window.innerHeight - activationAreaHeight) / 2,
        0,
      )
      const observer = new IntersectionObserver(
        ([intersection]) =>
          onInViewChange(entry.id, intersection.isIntersecting),
        { rootMargin: `-${verticalMargin}px 0px` },
      )

      observer.observe(node)
      return observer
    }

    let observer = observeActivationArea()
    const handleResize = () => {
      observer.disconnect()
      observer = observeActivationArea()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      onInViewChange(entry.id, false)
    }
  }, [entry.id, entry.break, onInViewChange])

  if (entry.break) {
    return <ExperienceBreakNode entry={entry} dimmed={dimmed} />
  }

  return (
    <ExperienceTrackNode ref={ref} dimmed={dimmed} active={active}>
      <div
        data-active={active}
        data-lit={lit}
        className={cns(
          'group relative isolate w-[600px] tablet-s:w-full',
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
        <ExperienceDetectionFrame />
        {clickable && (
          <span
            aria-hidden
            className={
              'absolute -top-[20px] -right-[26px] -bottom-[20px] -left-[26px] -z-[1]'
            }
          />
        )}
        <ExperienceEntryTags entry={entry} />
        <ExperienceAnchor className={'mb-2'}>
          <ExperienceMarker entry={entry} />
          <TextTitle
            size={4}
            tag={'h3'}
            tone={'primary'}
            className={'flex flex-wrap items-baseline gap-x-2.5 gap-y-1'}
          >
            {entry.href ? (
              <ExperienceTitleLink href={entry.href}>
                {entry.place} ↗
              </ExperienceTitleLink>
            ) : (
              entry.place
            )}
            <ExperienceTitleRole role={entry.role} />
          </TextTitle>
        </ExperienceAnchor>
        <ExperienceMeta entry={entry} />
        <ExperienceLinkRow entry={entry} />
        <ExperienceSummary
          lines={entry.summary}
          hasStatusNote={Boolean(entry.status?.note)}
        />
        {entry.status && <ExperienceStatusNote status={entry.status} />}
        {hasDetails && (
          <ExperienceDetailsDisclosure
            expanded={detailsExpanded}
            onExpandedChange={(expanded) =>
              onDetailsExpandedChange(entry.id, expanded, ref.current)
            }
            onCollapseComplete={() => onDetailsCollapseComplete(entry.id)}
            details={entry.details ?? []}
            status={entry.status}
            credits={entry.credits}
            skills={entry.skills}
            href={entry.href}
            links={entry.links}
          />
        )}
        <AnimatePresence>
          {active && hasDetails && (
            <ExperienceDetails
              key={'detail'}
              details={entry.details ?? []}
              status={entry.status}
              credits={entry.credits}
              skills={entry.skills}
              href={entry.href}
              links={entry.links}
            />
          )}
        </AnimatePresence>
      </div>
    </ExperienceTrackNode>
  )
}
