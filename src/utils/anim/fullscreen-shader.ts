import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { compileShader, createProgram } from 'utils/anim/webgl-utils'
import { whenPageSettled } from 'utils/browser/idle'
import { getDpr } from 'utils/browser/dpr'
import { useResizeObserver } from 'utils/hooks/useResizeObserver'
import {
  createActivityRamp,
  stepActivityRamp,
} from 'utils/anim/activity-ramp'

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const TRIANGLE = new Float32Array([-1, -1, 3, -1, -1, 3])
const DELTA_CEILING_S = 0.05
const MAX_DPR = 2

const cappedDpr = () => getDpr(MAX_DPR)

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
  const elapsedRef = useRef(0)
  const activityRef = useRef(createActivityRamp())
  const [ready, setReady] = useState(false)
  const [settled, setSettled] = useState(false)
  const inView = useInView(canvasRef)

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
    if (!canvas || !enabled || !settled || !inView) return
    const gl = canvas.getContext('webgl')
    if (!gl) return
    if (extension && !gl.getExtension(extension)) return

    const vertexShader = compileShader(gl, VERTEX_SHADER, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(gl, fragment, gl.FRAGMENT_SHADER)
    if (!vertexShader || !fragmentShader) return
    const program = createProgram(gl, vertexShader, fragmentShader)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!program) return

    const buffer = gl.createBuffer()
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

    return () => {
      setReady(false)
      glRef.current = null
      resolutionRef.current = null
      timeRef.current = null
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [canvasRef, enabled, extension, fragment, inView, measure, settled])

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
