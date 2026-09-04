import type { ReactNode } from 'react'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { TextTitle } from 'ui/common/typography/TextTitle'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { ContourHoverField } from 'ui/fx/ContourHoverField'
import { FieldLabel } from 'ui/sections/FieldLabel'
import {
  NAV_ROUTES,
  navTargetHref,
  type NavTarget,
  type NavTargetId,
} from './nav-targets'
import { cns } from 'utils/formatters/classnames'
import { useCaptureHover } from 'utils/hooks/useCaptureHover'
import { useRoutePath } from 'utils/hooks/useRoutePath'
import { ClampDivider } from 'ui/common/cyber-kit/ClampDivider'

type Direction = 'down' | 'up'
type RouteMode = Direction | 'between'

const MODE_READOUT: Record<RouteMode, string> = {
  down: 'descend',
  up: 'ascend',
  between: 'reroute',
}
const DIRECTION_SIGN: Record<Direction, string> = { down: '+', up: '−' }

const CHEVRON_SLOTS = 21
const CHEVRON_TOP_BLEED = 3
const CHEVRON_STEP = 17
const CHEVRON_DEPTH = 38

const chevronPoints = (direction: Direction) =>
  Array.from({ length: CHEVRON_SLOTS + CHEVRON_TOP_BLEED }, (_, index) => {
    const top =
      (index - CHEVRON_TOP_BLEED) * CHEVRON_STEP +
      (CHEVRON_STEP - CHEVRON_DEPTH) / 2
    return direction === 'down'
      ? `2,${top} 50,${top + CHEVRON_DEPTH} 98,${top}`
      : `2,${top + CHEVRON_DEPTH} 50,${top} 98,${top + CHEVRON_DEPTH}`
  })

const CHEVRON_POINTS: Record<Direction, string[]> = {
  down: chevronPoints('down'),
  up: chevronPoints('up'),
}

const ChevronRail = ({ direction }: { direction: Direction }) => (
  <svg
    aria-hidden
    fill={'none'}
    stroke={'currentColor'}
    preserveAspectRatio={'xMidYMid slice'}
    viewBox={`0 0 100 ${CHEVRON_STEP * CHEVRON_SLOTS}`}
    className={cns(
      'pointer-events-none absolute inset-y-0 right-0 w-1/4 text-muted/45',
      'transition-colors duration-200 group-hover:text-accent/60',
    )}
  >
    {CHEVRON_POINTS[direction].map((points) => (
      <polyline
        key={points}
        points={points}
        strokeWidth={1}
        vectorEffect={'non-scaling-stroke'}
      />
    ))}
  </svg>
)

const halfDirection = (mode: RouteMode, targetIndex: number): Direction =>
  mode === 'between' ? (targetIndex === 0 ? 'up' : 'down') : mode

const RouteHalf = ({
  index,
  label,
  alias,
  kicker,
  hash,
  href,
  direction,
  align,
  readout,
}: Omit<NavTarget, 'readout'> & {
  href: string
  direction: Direction
  align: 'start' | 'end'
  readout?: ReactNode
}) => {
  const hover = useCaptureHover()

  return (
    <Link
      href={href}
      {...hover.handlers}
      className={cns(
        'group relative flex w-1/2 overflow-hidden bg-base',
        'focus-visible:outline-none',
        'min-h-[calc(var(--viewport-height)*0.8)] py-[clamp(48px,15vw,150px)]',
        align === 'start'
          ? 'pr-content-padding pl-content-outer-padded'
          : 'pr-content-outer-padded pl-content-padding',
        'tablet-s:min-h-[calc(var(--viewport-height)*0.52)] tablet-s:w-full',
        'tablet-s:py-[60px] tablet-s:pr-content-padding tablet-s:pl-content-outer-padded',
      )}
    >
      <ContourHoverField hover={hover} palette={'dark-red'} />

      <DataCaptureBorder
        muted
        offset={-18}
        size={16}
        className={'mobile-m:hidden'}
      />
      <DataCaptureBorder
        blinkKey={hover.blinkKey}
        offset={-18}
        size={16}
        className={cns(
          'transition-opacity duration-200 mobile-m:hidden',
          hover.active ? 'opacity-100' : 'opacity-0',
        )}
      />

      <ChevronRail direction={direction} />

      <div className={'relative flex flex-1 flex-col justify-between'}>
        <div className={'flex flex-col gap-4'}>
          <div className={'flex items-center gap-3'}>
            <Text
              tag={'span'}
              size={'note'}
              face={'title'}
              tone={'inverse'}
              uppercase
              className={
                'bg-muted px-2 py-1 tabular-nums transition-colors duration-200 group-hover:bg-accent'
              }
            >
              {`tgt·${index}`}
            </Text>
            <Text
              size={'hint'}
              tone={'secondary'}
              uppercase
              className={'italic'}
            >
              {`// aka ${alias}`}
            </Text>
          </div>
          <Text
            tag={'span'}
            size={'note'}
            face={'title'}
            tone={'system'}
            uppercase
            className={'tabular-nums mobile-m:hidden'}
          >
            {readout ?? `lock ${hash} · vec ${DIRECTION_SIGN[direction]}y`}
          </Text>
          {kicker && (
            <TextTitle
              tag={'span'}
              size={4}
              uppercase
              className={
                'leading-[0.85] tracking-[0.04em] transition-colors duration-200 group-hover:text-accent'
              }
            >
              {kicker}
            </TextTitle>
          )}
        </div>

        <TextTitle
          tag={'h2'}
          size={1}
          uppercase
          className={
            'relative left-[-0.05em] leading-[0.85] font-bold tracking-[0.02em] transition-colors duration-200 group-hover:text-accent'
          }
        >
          {label}
        </TextTitle>
      </div>

      <span
        aria-hidden
        className={cns(
          'pointer-events-none absolute inset-0 z-30 opacity-0',
          'outline-2 -outline-offset-2 outline-accent',
          'group-focus-visible:opacity-100',
        )}
      />
    </Link>
  )
}

export const SplitRoute = ({
  direction,
  readouts,
}: {
  direction: RouteMode
  readouts?: Partial<Record<NavTargetId, ReactNode>>
}) => {
  const path = useRoutePath()

  return (
    <section data-stage={'Route'} className={'relative'}>
      <ClampDivider className={'relative z-20'} />
      <FieldLabel
        readout={MODE_READOUT[direction]}
        className={
          'pointer-events-none absolute top-[18px] left-1/2 z-20 -translate-x-1/2 justify-center bg-base px-3 mobile-m:hidden'
        }
      >
        route
      </FieldLabel>
      <div
        className={cns(
          'relative z-10 flex w-full divide-x divide-edge border-y border-edge',
          'tablet-s:flex-col tablet-s:divide-x-0 tablet-s:divide-y',
        )}
      >
        {NAV_ROUTES.map((target, targetIndex) => (
          <RouteHalf
            key={target.id}
            {...target}
            href={navTargetHref(target, path)}
            direction={halfDirection(direction, targetIndex)}
            align={targetIndex === 0 ? 'start' : 'end'}
            readout={readouts?.[target.id]}
          />
        ))}
      </div>
      <ClampDivider className={'relative z-20'} />
    </section>
  )
}
