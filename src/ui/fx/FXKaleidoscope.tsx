import { useCallback, useEffect, useRef, useState } from 'react'

import { drawKaleidoscope } from 'utils/anim/kaleidoscope'
import { whenPageSettled } from 'utils/browser/idle'
import { themeColors } from 'utils/formatters/tailwind-merge-config.generated'
import { useResizeObserver } from 'utils/hooks/useResizeObserver'
import { createActivityRamp, stepActivityRamp } from 'utils/anim/activity-ramp'

const PATTERN_SRC = '/images/projects/kaleidoscope/pattern.jpg'
const MAX_CANVAS_PIXELS = 350_000
const MAX_CANVAS_SCALE = 0.75
const FRAME_INTERVAL_MS = 1000 / 30

const FXKaleidoscope = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const activityRef = useRef(createActivityRamp())
  const restartRef = useRef<() => void>(() => {})
  const [settled, setSettled] = useState(false)

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const width = Math.max(1, canvas.clientWidth)
    const height = Math.max(1, canvas.clientHeight)
    const pixelBudgetScale = Math.sqrt(MAX_CANVAS_PIXELS / (width * height))
    const scale = Math.min(MAX_CANVAS_SCALE, pixelBudgetScale)
    canvas.width = Math.max(1, Math.floor(width * scale))
    canvas.height = Math.max(1, Math.floor(height * scale))
  }, [])

  useResizeObserver(canvasRef, resize)

  useEffect(() => whenPageSettled(() => setSettled(true)), [])

  useEffect(() => {
    activeRef.current = active
    restartRef.current()
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || !settled) return

    const image = new Image()
    const pattern = document.createElement('canvas')
    const patternContext = pattern.getContext('2d')
    let frame = 0
    let previousTime: number | null = null
    let previousPaintTime = 0
    let angle = 0
    let running = false

    const draw = (now: number) => {
      if (!patternContext || document.visibilityState !== 'visible') {
        previousTime = null
        frame = requestAnimationFrame(draw)
        return
      }
      const delta = previousTime === null ? 0 : Math.min(now - previousTime, 50)
      previousTime = now
      const activity = stepActivityRamp(
        activityRef.current,
        activeRef.current,
        delta,
      )
      angle += delta * 0.0003 * activity
      const isPaintDue = now - previousPaintTime >= FRAME_INTERVAL_MS
      if (!isPaintDue) {
        frame = requestAnimationFrame(draw)
        return
      }
      previousPaintTime = now
      patternContext.clearRect(0, 0, pattern.width, pattern.height)
      patternContext.save()
      patternContext.translate(pattern.width / 2, pattern.height / 2)
      patternContext.rotate(angle)
      patternContext.drawImage(image, -image.width / 2, -image.height / 2)
      patternContext.restore()
      context.fillStyle = themeColors.base
      context.fillRect(0, 0, canvas.width, canvas.height)
      drawKaleidoscope({
        context,
        image: pattern,
        radius: Math.max(120, Math.max(canvas.width, canvas.height) / 7),
      })
      if (activeRef.current || activity > 0) {
        frame = requestAnimationFrame(draw)
      } else {
        running = false
      }
    }

    const restart = () => {
      if (running) return
      running = true
      previousTime = null
      frame = requestAnimationFrame(draw)
    }

    image.onload = () => {
      pattern.width = image.width
      pattern.height = image.height
      restartRef.current = restart
      restart()
    }
    image.src = PATTERN_SRC

    return () => {
      image.onload = null
      restartRef.current = () => {}
      cancelAnimationFrame(frame)
    }
  }, [settled])

  return <canvas ref={canvasRef} className={'block size-full'} />
}

export default FXKaleidoscope
