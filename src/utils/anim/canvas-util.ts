import { EventEmitter } from 'utils/primitives/event-subscription'
import { polyfillAnimFrame } from '../browser/animation-frame'

export class CanvasUtil {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  pixelRatio: number = 0
  width: number = 0
  height: number = 0
  widthRated: number = 0
  heightRated: number = 0

  isActive: boolean = true
  nowTime: number = Date.now()
  prevTime: number = Date.now()
  deltaTime: number = 0

  eventInit: EventEmitter
  eventFrame: EventEmitter

  constructor(args: { canvas: HTMLCanvasElement }) {
    this.canvas = args.canvas
    this.ctx = args.canvas.getContext('2d') as CanvasRenderingContext2D
    this.eventInit = new EventEmitter()
    this.eventFrame = new EventEmitter()

    window.addEventListener('resize', this.initialize)
  }

  initialize = () => {
    this.pixelRatio = window.devicePixelRatio
      ? Math.max(Number(window.devicePixelRatio), 1)
      : 1

    const { innerWidth, innerHeight } = window
    this.width = innerWidth
    this.height = innerHeight

    this.widthRated = this.width * this.pixelRatio
    this.heightRated = this.height * this.pixelRatio

    this.canvas.width = this.widthRated
    this.canvas.height = this.heightRated
    this.canvas.style.width = innerWidth + 'px'
    this.canvas.style.height = innerHeight + 'px'

    this.eventInit.fire()
  }

  executeFrame = () => {
    if (!this.isActive) return

    polyfillAnimFrame(this.executeFrame)

    const { ctx, pixelRatio, widthRated, heightRated } = this

    ctx.save()
    ctx.scale(pixelRatio, pixelRatio)
    ctx.clearRect(0, 0, widthRated, heightRated)

    this.prevTime = this.nowTime
    this.nowTime = Date.now()
    this.deltaTime = this.nowTime - this.prevTime

    this.eventFrame.fire()

    ctx.restore()
  }

  enable = () => {
    this.isActive = true
  }

  disable = () => {
    this.isActive = false
  }
}
