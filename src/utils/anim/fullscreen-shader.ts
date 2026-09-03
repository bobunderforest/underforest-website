import { useCallback, useEffect, useRef, useState } from 'react'
import { compileShader, createProgram } from 'utils/anim/webgl-utils'
import { whenPageSettled } from 'utils/browser/idle'
import { getDpr } from 'utils/browser/dpr'
import { useResizeObserver } from 'utils/hooks/useResizeObserver'
import { createActivityRamp, stepActivityRamp } from 'utils/anim/activity-ramp'

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const TRIANGLE = new Float32Array([-1, -1, 3, -1, -1, 3])
const DELTA_CEILING_S = 0.05
const MAX_DPR = 2
const PHASE_PERIOD_S = 1000

const cappedDpr = () => getDpr(MAX_DPR)

const startingPhase = () => Math.random() * PHASE_PERIOD_S

type Options = {
  fragment: string
  animate: boolean
  enabled?: boolean
  extension?: string
  pixelRatio?: () => number
}

export const useFullscreenShader = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  {
    fragment,
    animate,
    enabled = true,
    extension,
    pixelRatio = cappedDpr,
  }: Options,
) => {
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const resolutionRef = useRef<WebGLUniformLocation | null>(null)
  const timeRef = useRef<WebGLUniformLocation | null>(null)
  const [phaseOrigin] = useState(startingPhase)
  const elapsedRef = useRef(phaseOrigin)
  const activityRef = useRef(createActivityRamp())
  const [ready, setReady] = useState(false)
  const [settled, setSettled] = useState(false)
  const [contextEpoch, setContextEpoch] = useState(0)

  const measure = useCallback(() => {
    const canvas = canvasRef.current
    const gl = glRef.current
    const resolution = resolutionRef.current
    if (!canvas || !gl || !resolution) return
    const ratio = pixelRatio()
    const width = Math.max(1, Math.floor(canvas.clientWidth * ratio))
    const height = Math.max(1, Math.floor(canvas.clientHeight * ratio))
    if (canvas.width === width && canvas.height === height) return
    canvas.width = width
    canvas.height = height
    gl.viewport(0, 0, width, height)
    gl.uniform2f(resolution, width, height)
  }, [canvasRef, pixelRatio])

  useResizeObserver(canvasRef, measure)

  useEffect(() => whenPageSettled(() => setSettled(true)), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const handleContextLost = (event: Event) => {
      event.preventDefault()
      setReady(false)
      glRef.current = null
      resolutionRef.current = null
      timeRef.current = null
    }
    const handleContextRestored = () => {
      setContextEpoch((epoch) => epoch + 1)
    }
    canvas.addEventListener('webglcontextlost', handleContextLost)
    canvas.addEventListener('webglcontextrestored', handleContextRestored)
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
    }
  }, [canvasRef])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !enabled || !settled) return
    const gl = canvas.getContext('webgl')
    if (!gl) return
    if (extension && !gl.getExtension(extension)) return
    if (gl.isContextLost()) return
    let buffer: WebGLBuffer | null = null
    let program: WebGLProgram | null = null

    const releaseResources = () => {
      setReady(false)
      glRef.current = null
      resolutionRef.current = null
      timeRef.current = null
      if (!gl.isContextLost()) {
        if (buffer) gl.deleteBuffer(buffer)
        if (program) gl.deleteProgram(program)
      }
      buffer = null
      program = null
    }

    const initializeResources = () => {
      const vertexShader = compileShader(gl, VERTEX_SHADER, gl.VERTEX_SHADER)
      const fragmentShader = compileShader(gl, fragment, gl.FRAGMENT_SHADER)
      if (!vertexShader || !fragmentShader) return
      program = createProgram(gl, vertexShader, fragmentShader)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      if (!program) return

      buffer = gl.createBuffer()
      if (!buffer) return
      const position = gl.getAttribLocation(program, 'position')
      const resolution = gl.getUniformLocation(program, 'uResolution')
      const time = gl.getUniformLocation(program, 'uTime')
      if (!resolution || !time) return

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, TRIANGLE, gl.STATIC_DRAW)
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

      glRef.current = gl
      resolutionRef.current = resolution
      timeRef.current = time
      measure()
      setReady(true)
    }

    initializeResources()

    return () => {
      releaseResources()
    }
  }, [canvasRef, contextEpoch, enabled, extension, fragment, measure, settled])

  useEffect(() => {
    const gl = glRef.current
    const time = timeRef.current
    if (!ready || !gl || !time) return

    const draw = () => {
      gl.uniform1f(time, elapsedRef.current)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    draw()

    let frame = 0
    let previous: number | null = null
    const render = (now: number) => {
      if (document.visibilityState === 'visible') {
        const delta =
          previous === null
            ? 0
            : Math.min((now - previous) / 1000, DELTA_CEILING_S)
        const activity = stepActivityRamp(
          activityRef.current,
          animate,
          delta * 1000,
        )
        elapsedRef.current += delta * activity
        draw()
        if (!animate && activity === 0) return
      }
      previous = now
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    return () => cancelAnimationFrame(frame)
  }, [animate, ready])
}
