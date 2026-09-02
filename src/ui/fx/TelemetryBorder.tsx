import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView, useScroll, useVelocity } from 'framer-motion'
import { useResizeObserver } from 'utils/hooks/useResizeObserver'
import { prefersReducedMotion } from 'utils/browser/prefers-reduced-motion'
import { whenPageSettled } from 'utils/browser/idle'
import { clamp } from 'utils/math/clamp'
import { cns } from 'utils/formatters/classnames'
import { toRgbTriple } from 'utils/formatters/color'
import { getDpr } from 'utils/browser/dpr'

const TRACE_BOTTOM = 12
const FRAME_MS = 33
const DELTA_CEILING_S = 0.05
const CALM_VELOCITY = 1400
const MAX_DPR = 2
const REST_TINT = 0.4

const RULER_STYLE: React.CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(90deg, var(--color-edge) 0 1px, transparent 1px 60px),' +
    'repeating-linear-gradient(90deg, var(--color-edge) 0 1px, transparent 1px 7px)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 8px, 100% 4px',
  backgroundPosition: 'left bottom',
}

export const TelemetryBorder = ({ className }: { className?: string }) => {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const size = useRef({ w: 0, h: 0, dpr: 1 })
  const tint = useRef({ edge: [0, 0, 0], system: [0, 0, 0] })
  const phase = useRef(0)
  const [settled, setSettled] = useState(false)
  const visible = useInView(host)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)

  const draw = useCallback((heat: number) => {
    const ctx = canvas.current?.getContext('2d')
    const { w, h, dpr } = size.current
    if (!ctx || w === 0) return

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const midY = (h - TRACE_BOTTOM) / 2
    const amp = 1.6 + heat * (h - TRACE_BOTTOM) * 0.42
    const ph = phase.current

    ctx.beginPath()
    for (let x = 0; x <= w; x += 2) {
      const t = x * 0.045
      const spike = Math.sin(t * 3.3 + ph * 2.1) ** 9 * amp * 1.3 * (0.3 + heat)
      const y =
        midY +
        Math.sin(t + ph) * amp +
        Math.sin(t * 2.7 - ph * 1.4) * amp * 0.35 +
        spike
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }

    const mix = clamp(REST_TINT + heat * 1.2, 0, 1)
    const { edge, system } = tint.current
    const rgb = edge.map((channel, i) =>
      Math.round(channel + (system[i] - channel) * mix),
    )
    ctx.strokeStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    ctx.lineWidth = 1
    ctx.stroke()
  }, [])

  const measure = useCallback(() => {
    const el = host.current
    const cv = canvas.current
    if (!el || !cv) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const dpr = getDpr(MAX_DPR)
    size.current = { w, h, dpr }
    const ctx = cv.getContext('2d')
    const styles = getComputedStyle(el)
    if (ctx) {
      tint.current = {
        edge: toRgbTriple(ctx, styles.getPropertyValue('--color-edge')),
        system: toRgbTriple(ctx, styles.getPropertyValue('--color-system')),
      }
    }
    cv.width = Math.round(w * dpr)
    cv.height = Math.round(h * dpr)
    draw(0)
  }, [draw])

  useResizeObserver(host, measure)
  useEffect(() => whenPageSettled(() => setSettled(true)), [])

  useEffect(() => {
    if (!settled || !visible || prefersReducedMotion()) return

    let frame = 0
    let previous = 0

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (previous === 0) previous = now
      const elapsed = now - previous
      if (elapsed < FRAME_MS) return
      previous = now

      const delta = Math.min(elapsed / 1000, DELTA_CEILING_S)
      const heat = clamp(Math.abs(velocity.get()) / CALM_VELOCITY / 3, 0, 1)
      phase.current += delta * (1.1 + heat * 5)
      draw(heat)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [settled, visible, velocity, draw])

  return (
    <div
      ref={host}
      aria-hidden
      className={cns(
        'pointer-events-none relative h-16 select-none',
        className,
      )}
    >
      <div className={'absolute inset-0 overflow-hidden'}>
        <span className={'absolute inset-x-0 top-0 h-[2px] bg-edge'} />
        <span className={'absolute inset-x-0 bottom-0 h-[2px] bg-edge'} />
        <canvas ref={canvas} className={'absolute inset-0 size-full'} />
        <div
          className={'absolute inset-x-0 bottom-0 h-2'}
          style={RULER_STYLE}
        />
      </div>
    </div>
  )
}
