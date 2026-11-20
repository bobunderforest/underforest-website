import { useScroll, useTransform, useVelocity, motion } from 'framer-motion'
import { HudLegend, HudPanel, HudReadout } from 'ui/features/hud/HudPanel'
import { HudReticles } from 'ui/features/hud/HudReticles'
import { HudVelocityGraph } from 'ui/features/hud/HudVelocityGraph'
import { useHudFrameRate, useHudPointerVelocity } from 'utils/anim/hud-signals'
import {
  formatFrameRate,
  formatProgress,
  formatVelocity,
} from 'utils/formatters/hud-readouts'
import { useMounted } from 'utils/hooks/useMounted'

export const HudLayer = () => {
  const { scrollY, scrollYProgress } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const pointerVelocity = useHudPointerVelocity()

  const progress = useTransform(scrollYProgress, formatProgress)
  const scrollRate = useTransform(scrollVelocity, formatVelocity)
  const pointerRate = useTransform(pointerVelocity, formatVelocity)
  const frameRate = useHudFrameRate()
  const frameRateText = useTransform(frameRate, formatFrameRate)

  const mounted = useMounted()

  if (!mounted) return null

  return (
    <div
      aria-hidden
      className={`
        pointer-events-none fixed inset-0 z-40 p-[20px]
        mobile-m:p-[12px]
      `}
    >
      <HudReticles scrollY={scrollY} />

      <HudPanel
        title={'motion'}
        align={'right'}
        className={`
          group pointer-events-auto right-[26px] bottom-[26px]
          tablet-s:hidden
        `}
      >
        <HudVelocityGraph
          scrollVelocity={scrollVelocity}
          pointerVelocity={pointerVelocity}
          frameRate={frameRate}
        />
        <div
          className={`
            absolute inset-0 mt-[5px] grid grid-cols-2 justify-between gap-1
            bg-base p-2 opacity-0
            group-hover:opacity-100
          `}
        >
          <HudLegend swatch={'scroll'}>
            scr <motion.span>{scrollRate}</motion.span>
          </HudLegend>
          <HudLegend swatch={'pointer'}>
            cur <motion.span>{pointerRate}</motion.span>
          </HudLegend>
          <HudReadout label={'pos'} value={progress} />
          <HudLegend swatch={'fps'}>
            fps <motion.span>{frameRateText}</motion.span>
          </HudLegend>
        </div>
      </HudPanel>
    </div>
  )
}
