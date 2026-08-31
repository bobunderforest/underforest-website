import { useEffect, useRef } from 'react'

export const CanvasFrame = ({
  canvas,
  className,
  fit = 'contain',
}: {
  canvas: HTMLCanvasElement
  className?: string
  fit?: 'contain' | 'cover'
}) => {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    Object.assign(canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      objectFit: fit,
    })
    host.appendChild(canvas)
    return () => {
      if (canvas.parentNode === host) host.removeChild(canvas)
    }
  }, [canvas, fit])

  return <div ref={hostRef} className={className} aria-hidden />
}
