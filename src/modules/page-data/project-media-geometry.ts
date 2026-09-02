import { open } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import type {
  MediaGeometry,
  ProjectEntry,
  ProjectStoryBlock,
} from 'ui/features/experience-data/types'

const publicDirectory = fileURLToPath(
  new URL('../../../public/', import.meta.url),
)

const readUint64 = (buffer: Buffer, offset: number) =>
  Number(buffer.readBigUInt64BE(offset))

const findVideoTrackGeometry = (buffer: Buffer): MediaGeometry | undefined => {
  const visitBoxes = (
    start: number,
    end: number,
  ): MediaGeometry | undefined => {
    let offset = start
    while (offset + 8 <= end) {
      const initialSize = buffer.readUInt32BE(offset)
      const type = buffer.toString('ascii', offset + 4, offset + 8)
      const headerSize = initialSize === 1 ? 16 : 8
      const size =
        initialSize === 1 ? readUint64(buffer, offset + 8) : initialSize
      const boxEnd = size === 0 ? end : offset + size
      if (size < headerSize || boxEnd > end) break

      if (type === 'tkhd' && size >= 92) {
        const width = buffer.readUInt32BE(boxEnd - 8) / 65536
        const height = buffer.readUInt32BE(boxEnd - 4) / 65536
        if (width > 0 && height > 0) {
          return { width, height, aspectRatio: width / height }
        }
      }

      if (type === 'moov' || type === 'trak') {
        const geometry = visitBoxes(offset + headerSize, boxEnd)
        if (geometry) return geometry
      }
      offset = boxEnd
    }
  }

  return visitBoxes(0, buffer.length)
}

const MP4_PROBE_BYTES = 512 * 1024

const readVideoGeometry = async (
  path: string,
): Promise<MediaGeometry | undefined> => {
  const file = await open(path, 'r')
  try {
    const { size } = await file.stat()
    const windowSize = Math.min(size, MP4_PROBE_BYTES)
    const head = Buffer.alloc(windowSize)
    await file.read(head, 0, windowSize, 0)
    const headGeometry = findVideoTrackGeometry(head)
    if (headGeometry || size <= windowSize) return headGeometry

    const tail = Buffer.alloc(windowSize)
    await file.read(tail, 0, windowSize, size - windowSize)
    return findVideoTrackGeometry(tail)
  } finally {
    await file.close()
  }
}

const geometryCache = new Map<string, Promise<MediaGeometry | undefined>>()

const readMediaGeometry = async (
  src: string,
): Promise<MediaGeometry | undefined> => {
  if (!src.startsWith('/')) return undefined
  const path = `${publicDirectory}${src.slice(1)}`
  if (src.toLowerCase().endsWith('.mp4')) {
    return readVideoGeometry(path)
  }
  const metadata = await sharp(path).metadata()
  if (!metadata.width || !metadata.height) return undefined
  return {
    width: metadata.width,
    height: metadata.height,
    aspectRatio: metadata.width / metadata.height,
  }
}

const resolveMediaGeometry = (src: string) => {
  const cached = geometryCache.get(src)
  if (cached) return cached
  const pending = readMediaGeometry(src)
  geometryCache.set(src, pending)
  return pending
}

const enrichBlock = async (
  block: ProjectStoryBlock,
): Promise<ProjectStoryBlock> => {
  if (block.kind === 'image' || block.kind === 'video') {
    return { ...block, ...(await resolveMediaGeometry(block.src)) }
  }
  if (block.kind === 'gallery') {
    return {
      ...block,
      items: await Promise.all(
        block.items.map(async (item) => ({
          ...item,
          ...(await resolveMediaGeometry(item.src)),
        })),
      ),
    }
  }
  return block
}

export const resolveProjectMediaGeometry = async (
  projects: ProjectEntry[],
): Promise<ProjectEntry[]> =>
  Promise.all(
    projects.map(async (project) => ({
      ...project,
      story: await Promise.all(project.story.map(enrichBlock)),
    })),
  )
