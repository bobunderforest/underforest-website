// Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { whenPageSettled } from 'utils/browser/idle'
import { cns } from 'utils/formatters/classnames'

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uEnableWaves;
uniform float uWaveSpeed;
uniform float uWaveXAmplitude;
uniform float uWaveYAmplitude;
uniform float uWaveZAmplitude;

void main() {
    vUv = uv;
    float time = uTime * uWaveSpeed;

    float waveFactor = uEnableWaves;

    vec3 transformed = position;

    transformed.x += sin(time + position.y) * uWaveXAmplitude * waveFactor;
    transformed.y += cos(time + position.z) * uWaveYAmplitude * waveFactor;
    transformed.z += sin(time + position.x) * uWaveZAmplitude * waveFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;

    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`

function noiseHash(x: number, y: number, z: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return value - Math.floor(value)
}

interface PixelDitherOptions {
  pixelSize: number
  amount: number
  speed: number
  dotResolution: number
  noiseScale: number
}

const FRAME_INTERVAL_MS = 1000 / 30

class PixelDitherPass {
  renderer: THREE.WebGLRenderer
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
  sampleCanvas: HTMLCanvasElement
  sampleContext: CanvasRenderingContext2D | null
  options: PixelDitherOptions

  constructor(renderer: THREE.WebGLRenderer, options: PixelDitherOptions) {
    this.renderer = renderer
    this.options = {
      ...options,
      amount: THREE.MathUtils.clamp(options.amount, 0, 1),
      dotResolution: THREE.MathUtils.clamp(
        Math.round(options.dotResolution),
        1,
        4,
      ),
    }

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    Object.assign(this.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      imageRendering: 'pixelated',
    })
    this.sampleCanvas = document.createElement('canvas')
    this.sampleContext = this.sampleCanvas.getContext('2d')

    if (this.context) {
      this.context.imageSmoothingEnabled = false
    }
  }

  setSize(width: number, height: number) {
    this.renderer.setSize(width, height)
    if (this.context && this.sampleContext) {
      const columns = Math.floor(width / (this.options.pixelSize * 0.6))
      const rows = Math.floor(height / this.options.pixelSize)

      this.sampleCanvas.width = columns
      this.sampleCanvas.height = rows
      this.canvas.width = columns * this.options.dotResolution
      this.canvas.height = rows * this.options.dotResolution
      this.context.imageSmoothingEnabled = false
      this.sampleContext.imageSmoothingEnabled = false
    }
  }

  render(scene: THREE.Scene, camera: THREE.Camera, time: number) {
    this.renderer.render(scene, camera)

    const sampleWidth = this.sampleCanvas.width
    const sampleHeight = this.sampleCanvas.height
    const outputWidth = this.canvas.width
    const outputHeight = this.canvas.height
    if (
      this.context &&
      this.sampleContext &&
      sampleWidth &&
      sampleHeight &&
      outputWidth &&
      outputHeight
    ) {
      this.sampleContext.clearRect(0, 0, sampleWidth, sampleHeight)
      this.sampleContext.drawImage(
        this.renderer.domElement,
        0,
        0,
        sampleWidth,
        sampleHeight,
      )
      this.context.clearRect(0, 0, outputWidth, outputHeight)
      this.context.drawImage(this.sampleCanvas, 0, 0, outputWidth, outputHeight)
      this.applyDither(this.context, outputWidth, outputHeight, time)
    }
  }

  applyDither(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
  ) {
    const image = context.getImageData(0, 0, width, height)
    const blockColumns = Math.ceil(width / this.options.dotResolution)
    const blockRows = Math.ceil(height / this.options.dotResolution)
    const strengths = new Float32Array(blockColumns * blockRows)
    const areaRows = Math.max(2, Math.round(1 / this.options.noiseScale))
    const areaColumns = Math.round(areaRows / 0.6)
    const cycleTime = time * this.options.speed * 0.25

    for (let blockY = 0; blockY < blockRows; blockY++) {
      for (let blockX = 0; blockX < blockColumns; blockX++) {
        const areaX = Math.floor(blockX / areaColumns)
        const areaY = Math.floor(blockY / areaRows)
        const phaseOffset = noiseHash(areaX, areaY, 0)
        const areaTime = cycleTime + phaseOffset
        const cycle = Math.floor(areaTime)
        const phase = areaTime - cycle
        const isActive =
          noiseHash(areaX, areaY, cycle + 1) < this.options.amount
        const localX = ((blockX % areaColumns) + 0.5) / areaColumns
        const revealedUntil = THREE.MathUtils.clamp(phase / 0.3, 0, 1)
        const hiddenUntil = THREE.MathUtils.clamp((phase - 0.55) / 0.3, 0, 1)
        const isRevealed = localX <= revealedUntil
        const isNotHidden = localX >= hiddenUntil

        strengths[blockX + blockY * blockColumns] =
          isActive && isRevealed && isNotHidden ? 1 : 0
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixel = (x + y * width) * 4
        if (image.data[pixel + 3] === 0) continue

        const blockX = Math.floor(x / this.options.dotResolution)
        const blockY = Math.floor(y / this.options.dotResolution)
        const strength = strengths[blockX + blockY * blockColumns]
        const hidesBlock = (x + y) % 2 === 0

        if (hidesBlock) image.data[pixel + 3] *= 1 - strength
      }
    }

    context.putImageData(image, 0, 0)
  }
}

function createTextCanvas({
  text,
  fontSize,
  color,
}: {
  text: string
  fontSize: number
  color: string
}) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return canvas

  const font = `700 ${fontSize}px "Space Mono"`
  const lines = text.split('\n')
  context.font = font
  const metrics = context.measureText('Mg')
  const lineHeight = Math.ceil(
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
  )
  canvas.width =
    Math.ceil(
      Math.max(...lines.map((line) => context.measureText(line).width), 0),
    ) + 20
  canvas.height = lineHeight * lines.length + 20

  context.fillStyle = color
  context.font = font
  const firstBaseline = 10 + metrics.actualBoundingBoxAscent
  lines.forEach((line, index) => {
    context.fillText(line, 10, firstBaseline + index * lineHeight)
  })

  return canvas
}

interface DitherTextOptions {
  text: string
  asciiFontSize: number
  textFontSize: number
  textColor: string
  planeBaseHeight: number
  enableWaves: boolean
  waveSpeed: number
  waveXAmplitude: number
  waveYAmplitude: number
  waveZAmplitude: number
  ditherAmount: number
  ditherSpeed: number
  ditherDotResolution: number
  ditherNoiseScale: number
}

class DitherTextRenderer {
  options: DitherTextOptions
  container: HTMLElement
  placeholder: HTMLElement
  width: number
  height: number
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  texture!: THREE.CanvasTexture
  geometry!: THREE.PlaneGeometry
  material!: THREE.ShaderMaterial
  mesh!: THREE.Mesh
  renderer!: THREE.WebGLRenderer
  pixelPass!: PixelDitherPass
  animationFrameId: number = 0
  lastFrameTime: number | null = null
  lastRenderTime: number = 0
  elapsedTime: number = 0

  constructor(
    options: DitherTextOptions,
    containerElem: HTMLElement,
    placeholderElem: HTMLElement,
    width: number,
    height: number,
  ) {
    this.options = options
    this.container = containerElem
    this.placeholder = placeholderElem
    this.width = width
    this.height = height
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      1000,
    )
    this.camera.position.z = 30

    this.scene = new THREE.Scene()
  }

  async init() {
    try {
      await document.fonts.load(
        `700 ${this.options.textFontSize}px "Space Mono"`,
      )
    } catch (e) {}
    await document.fonts.ready
    this.setMesh()
    this.setRenderer()
  }

  setMesh() {
    const textCanvas = createTextCanvas({
      text: this.options.text,
      fontSize: this.options.textFontSize,
      color: this.options.textColor,
    })

    this.texture = new THREE.CanvasTexture(textCanvas)
    this.texture.minFilter = THREE.NearestFilter

    const textAspect = textCanvas.width / textCanvas.height
    const baseH = this.options.planeBaseHeight
    const planeW = baseH * textAspect
    const planeH = baseH

    this.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.options.enableWaves ? 1.0 : 0.0 },
        uWaveSpeed: { value: this.options.waveSpeed },
        uWaveXAmplitude: { value: this.options.waveXAmplitude },
        uWaveYAmplitude: { value: this.options.waveYAmplitude },
        uWaveZAmplitude: { value: this.options.waveZAmplitude },
      },
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    this.renderer.setPixelRatio(1)
    this.renderer.setClearColor(0x000000, 0)

    this.pixelPass = new PixelDitherPass(this.renderer, {
      pixelSize: this.options.asciiFontSize,
      amount: this.options.ditherAmount,
      speed: this.options.ditherSpeed,
      dotResolution: this.options.ditherDotResolution,
      noiseScale: this.options.ditherNoiseScale,
    })

    this.container.appendChild(this.pixelPass.canvas)
    this.setSize(this.width, this.height)
  }

  setSize(w: number, h: number) {
    this.width = w
    this.height = h

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()

    this.pixelPass.setSize(w, h)
    this.updatePlacement()
  }

  updatePlacement() {
    if (!this.mesh || this.width === 0 || this.height === 0) return

    const containerBounds = this.container.getBoundingClientRect()
    const placeholderBounds = this.placeholder.getBoundingClientRect()
    const cameraDistance = this.camera.position.z - this.mesh.position.z
    const visibleHeight =
      2 *
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) *
      cameraDistance
    const visibleWidth = visibleHeight * this.camera.aspect
    const left = placeholderBounds.left - containerBounds.left
    const centerY =
      placeholderBounds.top - containerBounds.top + placeholderBounds.height / 2
    const targetHeight =
      (placeholderBounds.height / containerBounds.height) * visibleHeight
    const targetWidth =
      (placeholderBounds.width / containerBounds.width) * visibleWidth
    const heightScale = targetHeight / this.options.planeBaseHeight
    const widthScale = targetWidth / this.geometry.parameters.width
    const scale = Math.min(heightScale, widthScale)
    const meshWidth = this.geometry.parameters.width * scale

    this.mesh.position.x =
      (left / containerBounds.width - 0.5) * visibleWidth + meshWidth / 2
    this.mesh.position.y =
      (0.5 - centerY / containerBounds.height) * visibleHeight
    this.mesh.scale.setScalar(scale)
  }

  start() {
    if (this.animationFrameId) return
    this.lastFrameTime = null
    const animateFrame = (frameTime: number) => {
      this.animationFrameId = requestAnimationFrame(animateFrame)
      if (this.lastFrameTime === null) this.lastFrameTime = frameTime
      const delta = Math.min((frameTime - this.lastFrameTime) / 1000, 0.05)
      this.lastFrameTime = frameTime
      this.elapsedTime += delta
      if (frameTime - this.lastRenderTime < FRAME_INTERVAL_MS) return
      this.lastRenderTime = frameTime
      this.render(this.elapsedTime)
    }
    this.animationFrameId = requestAnimationFrame(animateFrame)
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId)
    this.animationFrameId = 0
  }

  renderStill() {
    this.render(this.elapsedTime)
  }

  render(time: number) {
    ;(this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = time

    this.pixelPass.render(this.scene, this.camera, time)
  }

  dispose() {
    this.stop()
    this.pixelPass.canvas.remove()
    this.scene.remove(this.mesh)
    this.geometry.dispose()
    this.material.dispose()
    this.texture.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  }
}

type ASCIITextProps = Partial<DitherTextOptions> & {
  className?: string
}

export function ASCIIText({
  text = 'David!',
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = '#fdf9f3',
  planeBaseHeight = 8,
  enableWaves = true,
  waveSpeed = 5,
  waveXAmplitude = 0.5,
  waveYAmplitude = 0.15,
  waveZAmplitude = 1,
  ditherAmount = 0.35,
  ditherSpeed = 4,
  ditherDotResolution = 2,
  ditherNoiseScale = 0.18,
  className,
}: ASCIITextProps) {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<DitherTextRenderer | null>(null)

  useEffect(() => {
    const placeholder = placeholderRef.current
    if (!placeholder) return

    const container = document.createElement('div')
    container.className = 'dither-text-layer'
    container.setAttribute('aria-hidden', 'true')
    Object.assign(container.style, {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
    })
    placeholder.appendChild(container)

    let cancelled = false
    let initializing = false
    let hasSettled = false
    let isOnScreen = false

    const syncPlayback = () => {
      const renderer = rendererRef.current
      if (!renderer) return
      if (hasSettled && isOnScreen) renderer.start()
      else renderer.stop()
    }

    const options: DitherTextOptions = {
      text,
      asciiFontSize,
      textFontSize,
      textColor,
      planeBaseHeight,
      enableWaves,
      waveSpeed,
      waveXAmplitude,
      waveYAmplitude,
      waveZAmplitude,
      ditherAmount,
      ditherSpeed,
      ditherDotResolution,
      ditherNoiseScale,
    }

    const syncRenderer = async () => {
      const bounds = container.getBoundingClientRect()
      const targetBounds = placeholder.getBoundingClientRect()
      const hasSize =
        bounds.width > 0 &&
        bounds.height > 0 &&
        targetBounds.width > 0 &&
        targetBounds.height > 0
      if (!hasSize || cancelled) return

      if (rendererRef.current) {
        rendererRef.current.setSize(bounds.width, bounds.height)
        rendererRef.current.renderStill()
        return
      }
      if (initializing) return
      initializing = true

      const renderer = new DitherTextRenderer(
        options,
        container,
        placeholder,
        bounds.width,
        bounds.height,
      )
      await renderer.init()

      if (cancelled) {
        renderer.dispose()
        return
      }

      const currentBounds = container.getBoundingClientRect()
      renderer.setSize(currentBounds.width, currentBounds.height)
      rendererRef.current = renderer
      renderer.renderStill()
      syncPlayback()
    }

    const resizeObserver = new ResizeObserver(() => {
      void syncRenderer()
    })
    resizeObserver.observe(placeholder)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isOnScreen = entry.isIntersecting
      syncPlayback()
    })
    intersectionObserver.observe(placeholder)

    const cancelSettle = whenPageSettled(() => {
      hasSettled = true
      syncPlayback()
    })

    void syncRenderer()

    return () => {
      cancelled = true
      cancelSettle()
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current = null
      }
      container.remove()
    }
  }, [
    text,
    asciiFontSize,
    textFontSize,
    textColor,
    planeBaseHeight,
    enableWaves,
    waveSpeed,
    waveXAmplitude,
    waveYAmplitude,
    waveZAmplitude,
    ditherAmount,
    ditherSpeed,
    ditherDotResolution,
    ditherNoiseScale,
  ])

  return (
    <div
      ref={placeholderRef}
      className={cns('ascii-text-placeholder', className)}
      aria-hidden={'true'}
    />
  )
}
