import { useRef } from 'react'
import { useInView } from 'framer-motion'

export const MountInView = ({
  children,
  className,
  decorative,
}: {
  children: React.ReactNode
  className?: string
  decorative?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef)

  return (
    <div ref={containerRef} aria-hidden={decorative} className={className}>
      {inView && children}
    </div>
  )
}
