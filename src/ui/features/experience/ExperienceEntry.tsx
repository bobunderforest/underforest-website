import { useCallback, useState } from 'react'
import { TextTitle } from 'ui/common/typography/TextTitle'
import { ExperienceDetailsDisclosure } from '../experience-details/ExperienceDetails'
import { useExperienceDomainFilter } from 'ui/features/experience-data/experience-data-context'
import {
  hasExperienceDetails,
  isDimmed,
} from 'ui/features/experience-data/experience-data'
import type { ExperienceEntry as ExperienceEntryData } from 'ui/features/experience-data/types'
import { openExternal } from 'utils/browser/open-external'
import { cns } from 'utils/formatters/classnames'
import { useResponsiveValue } from 'utils/hooks/useResponsiveValue'
import { useCenterActivationObserver } from 'utils/hooks/useCenterActivationObserver'
import { ProjectTitleChart } from 'ui/features/projects/ProjectTitleChart'
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
  reached: boolean
  detailsExpanded: boolean
  onInViewChange: (id: string, inView: boolean) => void
  onDetailsExpandedChange: (
    id: string,
    expanded: boolean,
    node: HTMLElement | null,
  ) => void
  onDetailsCollapseComplete: (id: string) => void
  entryRef: React.RefObject<HTMLLIElement | null>
  bodyRef: React.RefObject<HTMLDivElement | null>
}

const fullEntryClick = {
  desktop: true,
  'tablet-s': false,
}

export const ExperienceEntry = ({
  entry,
  active,
  reached,
  detailsExpanded,
  onInViewChange,
  onDetailsExpandedChange,
  onDetailsCollapseComplete,
  entryRef: ref,
  bodyRef,
}: ExperienceEntryProps) => {
  const { domainFilter } = useExperienceDomainFilter()
  const dimmed = isDimmed(domainFilter, entry.domains)
  const [hovered, setHovered] = useState(false)
  const [innerHovered, setInnerHovered] = useState(false)
  const fullEntryClickEnabled = useResponsiveValue(fullEntryClick)
  const handleInView = useCallback(
    (inView: boolean) => onInViewChange(entry.id, inView),
    [entry.id, onInViewChange],
  )
  const hasDetails = hasExperienceDetails(entry)

  const clickable = Boolean(entry.href) && active && fullEntryClickEnabled
  const lit = clickable && hovered && !innerHovered

  useCenterActivationObserver(ref, handleInView)

  if (entry.break) {
    return (
      <ExperienceBreakNode entry={entry} dimmed={dimmed} entryRef={ref} />
    )
  }

  return (
    <ExperienceTrackNode ref={ref} dimmed={dimmed} active={active}>
      <div
        ref={bodyRef}
        data-active={active}
        data-reached={reached}
        data-lit={lit}
        className={cns(
          'group relative isolate w-[600px] desktop-s:w-[460px] tablet-s:w-full',
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
        <ExperienceDetectionFrame blinkKey={active ? entry.id : undefined} />
        {active && (
          <ProjectTitleChart
            animate
            palette={'dark-red'}
            className={
              '-top-[19px] -right-[25px] -bottom-[19px] -left-[25px] size-auto overflow-hidden'
            }
          />
        )}
        {clickable && (
          <span
            aria-hidden
            className={
              'absolute -top-[20px] -right-[26px] -bottom-[20px] -left-[26px] -z-[1]'
            }
          />
        )}
        <div className={'relative z-[1]'}>
          <ExperienceEntryTags entry={entry} />
          <ExperienceMeta entry={entry} />
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
          <ExperienceLinkRow entry={entry} />
          <ExperienceSummary
            lines={entry.summary}
            hasStatusNote={Boolean(entry.status?.note)}
          />
          {entry.status && <ExperienceStatusNote status={entry.status} />}
          {hasDetails && (
            <ExperienceDetailsDisclosure
              entry={entry}
              expanded={detailsExpanded}
              onExpandedChange={(expanded) =>
                onDetailsExpandedChange(entry.id, expanded, ref.current)
              }
              onCollapseComplete={() => onDetailsCollapseComplete(entry.id)}
            />
          )}
        </div>
      </div>
    </ExperienceTrackNode>
  )
}
