import { useCallback, useMemo, useRef, useState } from 'react'
import { ExperienceFilter } from 'ui/features/experience/ExperienceFilter'
import type {
  Domain,
  ExperienceDomainFilter,
} from 'ui/features/experience-data/types'
import { useExperienceDomainFilter } from 'ui/features/experience-data/experience-data-context'
import { WireEndpointMarker } from 'ui/common/cyber-kit/WireEndpointMarker'
import {
  wireElbowPath,
  type WirePoint,
} from 'ui/common/cyber-kit/wire-geometry'
import { useResizeObserver } from 'utils/hooks/useResizeObserver'
import { useSettledMeasure } from 'utils/hooks/useSettledMeasure'
import { cns } from 'utils/formatters/classnames'
import {
  DossierWireContext,
  createElementRegistry,
} from './dossier-wire-context'
import {
  RESUME_DOWNLOADS,
  ResumeDownloadButtons,
  ResumeExportLabel,
} from './ResumeDownloadButtons'

const WIRE_TURN_RATIO = 0.5
const WIRE_MIN_TURN = 14
const WIRE_MAX_CHAMFER = 8

const dossierWirePath = (source: WirePoint, target: WirePoint) =>
  wireElbowPath(source, target, {
    turnX:
      source.x +
      Math.max((target.x - source.x) * WIRE_TURN_RATIO, WIRE_MIN_TURN),
    maxChamfer: WIRE_MAX_CHAMFER,
  })

export const ExperienceDossierRouter = () => {
  const { domainFilter } = useExperienceDomainFilter()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [wire] = useState(() => ({
    sources: createElementRegistry<ExperienceDomainFilter>(),
    targets: createElementRegistry<Domain>(),
  }))
  const [routes, setRoutes] = useState<
    { from: Domain; source: WirePoint; target: WirePoint }[]
  >([])

  const measure = useCallback(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const base = wrap.getBoundingClientRect()

    const pointOf = (
      element: HTMLElement | undefined,
      edge: 'left' | 'right',
    ) => {
      if (!element) return null
      const rect = element.getBoundingClientRect()
      return {
        x: (edge === 'left' ? rect.left : rect.right) - base.left,
        y: rect.top + rect.height / 2 - base.top,
      }
    }

    setRoutes(
      RESUME_DOWNLOADS.flatMap(({ variant }) => {
        const source = pointOf(wire.sources.elements.get(variant), 'right')
        const target = pointOf(wire.targets.elements.get(variant), 'left')
        return source && target ? [{ from: variant, source, target }] : []
      }),
    )
  }, [wire])

  const registry = useMemo(
    () => ({
      registerSource: wire.sources.ref,
      registerTarget: wire.targets.ref,
    }),
    [wire],
  )

  useResizeObserver(wrapRef, measure)
  useSettledMeasure(measure)

  return (
    <DossierWireContext.Provider value={registry}>
      <div
        ref={wrapRef}
        className={cns(
          'relative isolate grid items-start',
          'grid-cols-[minmax(0,1fr)_minmax(19rem,26rem)] gap-x-12 gap-y-10',
          'tablet-s:grid-cols-1 tablet-s:gap-x-0 tablet-s:gap-y-8',
        )}
      >
        <svg
          aria-hidden
          className={
            'pointer-events-none absolute inset-0 -z-10 h-full w-full tablet-s:hidden'
          }
        >
          {routes.map(({ from, source, target }) => {
            const active = from === domainFilter
            return (
              <g
                key={from}
                className={'transition-opacity duration-200'}
                opacity={active ? 1 : 0.6}
              >
                <path
                  d={dossierWirePath(source, target)}
                  fill={'none'}
                  stroke={'var(--color-accent)'}
                  strokeWidth={1}
                  strokeDasharray={active ? undefined : '4 4'}
                />
                <WireEndpointMarker {...source} />
                <WireEndpointMarker {...target} />
              </g>
            )
          })}
        </svg>

        <ExperienceFilter orientation={'vertical'} className={'w-full'} />

        <div className={'relative flex flex-col gap-3 tablet-s:gap-4'}>
          <ResumeExportLabel
            gap={'none'}
            className={'absolute left-0 top-0 tablet-s:static'}
          />
          <ResumeDownloadButtons className={'pt-[40px] tablet-s:pt-0'} />
        </div>
      </div>
    </DossierWireContext.Provider>
  )
}
