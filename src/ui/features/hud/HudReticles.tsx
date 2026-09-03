import { useRef } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'
import { cns } from 'utils/formatters/classnames'
import { useIsomorphicLayoutEffect } from 'utils/hooks/useIsomorphicLayoutEffect'

const CORNER_PLACEMENTS = [
  'top-0 left-0',
  'top-0 right-0 rotate-90',
  'right-0 bottom-0 rotate-180',
  'bottom-0 left-0 -rotate-90',
]

const ARM_TICKS = [28, 34, 40]

const EDGE_FRACTIONS = [0.25, 0.5, 0.75]
const CROSS_CYCLE_PX = 420
const CROSS_RATE_MIN = 0.55
const CROSS_RATE_RANGE = 1.5
const CROSS_BLINK_MS = 500

const wrap = (value: number) => ((value % 1) + 1) % 1

const pseudo = (seed: number) =>
  wrap(Math.sin(seed * 127.1 + 311.7) * 43758.5453)

type CrossTiming = { offset: number; rate: number }

const crossTiming = (index: number): CrossTiming => ({
  offset: pseudo(index),
  rate: CROSS_RATE_MIN + pseudo(index + 37) * CROSS_RATE_RANGE,
})

const crossTick = (scrollY: number, { offset, rate }: CrossTiming) =>
  Math.floor((scrollY / CROSS_CYCLE_PX) * rate + offset)

const isTickVisible = (tick: number) => ((tick % 2) + 2) % 2 === 0

const BLINK_PATTERN = [1, 0, 1, 0, 1]

const playBlink = (element: HTMLElement, visible: boolean) => {
  element.style.opacity = visible ? '1' : '0'
  element.animate?.(
    BLINK_PATTERN.map((step) => ({ opacity: visible ? step : 1 - step })),
    { duration: CROSS_BLINK_MS, easing: 'steps(1, end)' },
  )
}

const percent = (fraction: number) => `${fraction * 100}%`

const EDGES = [
  { edge: 'top-0', axis: 'left', shift: '-translate-x-1/2' },
  { edge: 'right-0', axis: 'top', shift: '-translate-y-1/2' },
  { edge: 'bottom-0', axis: 'left', shift: '-translate-x-1/2' },
  { edge: 'left-0', axis: 'top', shift: '-translate-y-1/2' },
] as const

const EDGE_MARKS = EDGES.flatMap(({ edge, axis, shift }) =>
  EDGE_FRACTIONS.map((fraction) => ({
    key: `${edge}-${fraction}`,
    className: `${edge} ${shift}`,
    style: { [axis]: percent(fraction) },
  })),
)

const CROSS_TIMINGS = EDGE_MARKS.map((_, index) => crossTiming(index))

const CornerReticle = () => (
  <>
    <span className={'absolute top-0 left-0 h-px w-[46px] bg-muted/55'} />
    <span className={'absolute top-0 left-0 h-[46px] w-px bg-muted/55'} />

    <span
      className={
        'absolute top-[15px] left-0 h-px w-[21px] origin-left -rotate-45 bg-accent/35'
      }
    />

    <span
      className={'absolute top-[9px] left-[9px] h-[2px] w-[17px] bg-accent'}
    />
    <span
      className={'absolute top-[9px] left-[9px] h-[17px] w-[2px] bg-accent'}
    />

    {ARM_TICKS.map((offset) => (
      <span
        key={`x-${offset}`}
        className={'absolute top-0 h-[5px] w-px bg-muted/40'}
        style={{ left: offset }}
      />
    ))}
    {ARM_TICKS.map((offset) => (
      <span
        key={`y-${offset}`}
        className={'absolute left-0 h-px w-[5px] bg-muted/40'}
        style={{ top: offset }}
      />
    ))}

    <span
      className={
        'absolute top-[26px] left-[26px] font-face-title text-[10px] leading-none text-muted/70'
      }
    >
      +
    </span>
  </>
)

export const HudReticles = ({ scrollY }: { scrollY: MotionValue<number> }) => {
  const crossRefs = useRef<(HTMLSpanElement | null)[]>([])
  const ticksRef = useRef<number[]>([])

  useIsomorphicLayoutEffect(() => {
    ticksRef.current = CROSS_TIMINGS.map((timing, index) => {
      const tick = crossTick(scrollY.get(), timing)
      const element = crossRefs.current[index]
      if (element) {
        element.style.opacity = String(isTickVisible(tick) ? 1 : 0)
      }
      return tick
    })
  }, [scrollY])

  useMotionValueEvent(scrollY, 'change', (value) => {
    CROSS_TIMINGS.forEach((timing, index) => {
      const element = crossRefs.current[index]
      if (!element) return
      const tick = crossTick(value, timing)
      if (tick === ticksRef.current[index]) return
      ticksRef.current[index] = tick
      playBlink(element, isTickVisible(tick))
    })
  })

  return (
    <div className={'absolute inset-[14px] mobile-m:inset-[8px]'}>
      {CORNER_PLACEMENTS.map((placement) => (
        <span key={placement} className={`absolute size-[46px] ${placement}`}>
          <CornerReticle />
        </span>
      ))}

      {EDGE_MARKS.map((mark, index) => (
        <span
          key={mark.key}
          ref={(element) => {
            crossRefs.current[index] = element
          }}
          style={mark.style}
          className={cns('hud-crosshair absolute size-[9px]', mark.className)}
        />
      ))}
    </div>
  )
}
