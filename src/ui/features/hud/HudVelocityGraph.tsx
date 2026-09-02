import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import { useHudFrames } from 'utils/anim/hud-signals'
import { getDpr } from 'utils/browser/dpr'
import { useElementSize } from 'utils/hooks/useElementSize'
import { clamp } from 'utils/math/clamp'

const SAMPLES = 88
const MAX_DPR = 2
const SCROLL_FULL_SCALE = 4200
const POINTER_FULL_SCALE = 2600
const FRAME_RATE_FULL_SCALE = 120
const GRID_ROWS = 3
const TRACE_WIDTH = 1.25
const GLOW_WIDTH = 4
const GLOW_ALPHA = 0.18
const SAMPLE_EPSILON = 0.001

type Trace = {
  values: Float32Array
  color: string
  source: MotionValue<number>
  project: (value: number) => number
  lastValue: number
}

const readThemeColors = <T extends string>(tokens: readonly T[]) => {
  const styles = getComputedStyle(document.documentElement)
  return Object.fromEntries(
    tokens.map((token) => [token, styles.getPropertyValue(token).trim()]),
  ) as Record<T, string>
}

const burstCurve = (fullScale: number) => (value: number) =>
  Math.sqrt(clamp(Math.abs(value) / fullScale, 0, 1))

const drawGrid = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
) => {
  context.strokeStyle = color
  context.lineWidth = 1
  context.globalAlpha = 0.35
  context.beginPath()
  for (let row = 0; row <= GRID_ROWS; row += 1) {
    const y = Math.round((height / GRID_ROWS) * row) + 0.5
    context.moveTo(0, y)
    context.lineTo(width, y)
  }
  context.stroke()
  context.globalAlpha = 1
}

const drawTrace = (
  context: CanvasRenderingContext2D,
  { values, color }: Trace,
  head: number,
  width: number,
  height: number,
) => {
  const step = width / (SAMPLES - 1)

  context.strokeStyle = color
  context.lineJoin = 'round'
  context.beginPath()

  for (let index = 0; index < SAMPLES; index += 1) {
    const value = values[(head + index) % SAMPLES]
    const x = index * step
    const y = height - value * (height - TRACE_WIDTH) - TRACE_WIDTH / 2
    if (index === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }

  context.lineWidth = GLOW_WIDTH
  context.globalAlpha = GLOW_ALPHA
  context.stroke()

  context.lineWidth = TRACE_WIDTH
  context.globalAlpha = 1
  context.stroke()
}

const TRACE_SPECS = [
  { token: '--color-accent', project: burstCurve(SCROLL_FULL_SCALE) },
  { token: '--color-system', project: burstCurve(POINTER_FULL_SCALE) },
  {
    token: '--color-info',
    project: (value: number) => clamp(value / FRAME_RATE_FULL_SCALE, 0, 1),
  },
] as const

const TRACE_TOKENS = [
  '--color-edge',
  ...TRACE_SPECS.map(({ token }) => token),
] as const

type Props = {
  scrollVelocity: MotionValue<number>
  pointerVelocity: MotionValue<number>
  frameRate: MotionValue<number>
}

export const HudVelocityGraph = ({
  scrollVelocity,
  pointerVelocity,
  frameRate,
}: Props) => {
  const { ref: boxRef, width, height } = useElementSize<HTMLDivElement>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  const stateRef = useRef({
    head: 0,
    steadyFrames: 0,
    gridColor: '',
    traces: [] as Trace[],
  })

  useEffect(() => {
    const state = stateRef.current
    const colors = readThemeColors(TRACE_TOKENS)
    state.gridColor = colors['--color-edge']
    state.traces = TRACE_SPECS.map(({ token, project }, index) => ({
      values: new Float32Array(SAMPLES),
      color: colors[token],
      source: [scrollVelocity, pointerVelocity, frameRate][index],
      project,
      lastValue: 0,
    }))
  }, [scrollVelocity, pointerVelocity, frameRate])

  useEffect(() => {
    const state = stateRef.current

    const canvas = canvasRef.current
    if (!canvas || !width || !height) return
    const dpr = getDpr(MAX_DPR)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    const context = canvas.getContext('2d')
    if (!context) return
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    contextRef.current = context
    drawGrid(context, width, height, state.gridColor)
  }, [width, height])

  useHudFrames(() => {
    const context = contextRef.current
    const state = stateRef.current
    if (!context || !width || !height) return

    let moved = false
    state.traces.forEach((trace) => {
      const value = trace.project(trace.source.get())
      if (Math.abs(value - trace.lastValue) > SAMPLE_EPSILON) moved = true
      trace.lastValue = value
      trace.values[state.head] = value
    })
    state.head = (state.head + 1) % SAMPLES
    state.steadyFrames = moved ? 0 : state.steadyFrames + 1
    if (state.steadyFrames >= SAMPLES) return

    context.clearRect(0, 0, width, height)
    drawGrid(context, width, height, state.gridColor)
    state.traces.forEach((trace) =>
      drawTrace(context, trace, state.head, width, height),
    )
  })

  return (
    <div ref={boxRef} className={'relative h-[38px] w-full'}>
      <canvas ref={canvasRef} className={'block size-full'} />
    </div>
  )
}
