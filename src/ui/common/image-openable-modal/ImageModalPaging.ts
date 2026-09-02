export type ImageModalPagingListener = (index: number) => void

type ImageModalPagingOptions = {
  startIndex?: number
  rectResolver?: (index: number) => DOMRect | null
}

export class ImageModalPaging {
  private readonly images: string[]
  private index: number
  private readonly listeners = new Set<ImageModalPagingListener>()
  private readonly rectResolver?: (index: number) => DOMRect | null

  constructor(
    images: string[],
    { startIndex = 0, rectResolver }: ImageModalPagingOptions = {},
  ) {
    this.images = images
    this.index = this.clamp(startIndex)
    this.rectResolver = rectResolver
  }

  private clamp(index: number): number {
    return Math.min(Math.max(index, 0), this.images.length - 1)
  }

  get all(): readonly string[] {
    return this.images
  }

  get current(): string {
    return this.images[this.index]
  }

  get count(): number {
    return this.images.length
  }

  get position(): number {
    return this.index
  }

  get hasPrev(): boolean {
    return this.index > 0
  }

  get hasNext(): boolean {
    return this.index < this.images.length - 1
  }

  get activeRect(): DOMRect | null {
    return this.rectResolver?.(this.index) ?? null
  }

  setIndex(index: number): void {
    const next = this.clamp(index)
    if (next === this.index) return
    this.index = next
    this.emit()
  }

  prev(): string {
    this.setIndex(this.index - 1)
    return this.current
  }

  next(): string {
    this.setIndex(this.index + 1)
    return this.current
  }

  subscribe(listener: ImageModalPagingListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener(this.index))
  }
}
