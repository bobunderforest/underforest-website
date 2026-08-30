import { useEffect, useRef, useState, type RefObject } from 'react'
import { toPublicSrc } from 'utils/formatters/paths'

type ShapeMaskArgs = {
  src: string | undefined
  boxWidth: number
  boxHeight: number
  imageHeight: number
  enabled?: boolean
  imageRef?: RefObject<HTMLImageElement | null>
}

const isDecoded = (
  image: HTMLImageElement | null | undefined,
): image is HTMLImageElement => Boolean(image?.complete && image.naturalWidth)

export const useShapeMask = ({
  src,
  boxWidth,
  boxHeight,
  imageHeight,
  enabled = true,
  imageRef,
}: ShapeMaskArgs) => {
  const [mask, setMask] = useState<string>()
  const [wasEnabled, setWasEnabled] = useState(enabled)
  const maskUrlRef = useRef<string>(undefined)

  if (enabled && !wasEnabled) setWasEnabled(true)

  useEffect(
    () => () => {
      if (maskUrlRef.current) URL.revokeObjectURL(maskUrlRef.current)
    },
    [],
  )

  useEffect(() => {
    if (!wasEnabled || !src || !boxWidth || !boxHeight || !imageHeight) return
    let cancelled = false

    const drawFrom = (image: HTMLImageElement) => {
      if (cancelled) return
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(boxWidth)
      canvas.height = Math.round(boxHeight)
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const drawnHeight = Math.round(imageHeight)
      ctx.drawImage(
        image,
        0,
        canvas.height - drawnHeight,
        canvas.width,
        drawnHeight,
      )
      canvas.toBlob((blob) => {
        if (cancelled || !blob) return
        const nextUrl = URL.createObjectURL(blob)
        if (maskUrlRef.current) URL.revokeObjectURL(maskUrlRef.current)
        maskUrlRef.current = nextUrl
        setMask(nextUrl)
      }, 'image/png')
    }

    const renderedImage = imageRef?.current
    let detachLoader = () => {}

    if (isDecoded(renderedImage)) {
      drawFrom(renderedImage)
    } else {
      const loader = new Image()
      const onLoad = () => drawFrom(loader)
      loader.addEventListener('load', onLoad, { once: true })
      loader.src = toPublicSrc(src)
      detachLoader = () => loader.removeEventListener('load', onLoad)
    }

    return () => {
      cancelled = true
      detachLoader()
    }
  }, [wasEnabled, src, boxWidth, boxHeight, imageHeight, imageRef])

  return mask
}
