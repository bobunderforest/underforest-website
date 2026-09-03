import { useScroll, useTransform, useVelocity, motion } from 'framer-motion'
import { HudLegend, HudPanel, HudReadout } from 'ui/features/hud/HudPanel'
import { HudReticles } from 'ui/features/hud/HudReticles'
import { HudVelocityGraph } from 'ui/features/hud/HudVelocityGraph'
import {
  HUD_BUILD,
  HUD_IDLE_STAGE,
  HUD_MODEL,
} from 'ui/features/hud/hud-fields'
import {
  useHudClock,
  useHudFrameRate,
  useHudPointer,
} from 'utils/anim/hud-signals'
import {
  formatDpr,
  formatFrameRate,
  formatProgress,
  formatVelocity,
  formatViewport,
} from 'utils/formatters/hud-readouts'
import { useActiveStage } from 'utils/hooks/useActiveStage'
import { useDpr } from 'utils/hooks/useDpr'
import { useMounted } from 'utils/hooks/useMounted'
import { useWindowSize } from 'utils/hooks/useWindowSize'

export const HudLayer = () => {
  const { scrollY, scrollYProgress } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const { cursor, velocity: pointerVelocity } = useHudPointer()

  const progress = useTransform(scrollYProgress, formatProgress)
  const scrollRate = useTransform(scrollVelocity, formatVelocity)
  const pointerRate = useTransform(pointerVelocity, formatVelocity)
  const clock = useHudClock()
  const frameRate = useHudFrameRate()
  const frameRateText = useTransform(frameRate, formatFrameRate)

  const stage = useActiveStage()
  const { width, height } = useWindowSize()
  const dpr = useDpr()
  const mounted = useMounted()

  if (!mounted) return null

  return (
    <div
      aria-hidden
      className={
        'pointer-events-none fixed inset-0 z-40 p-[20px] mobile-m:p-[12px]'
      }
    >
      <HudReticles scrollY={scrollY} />

      <HudPanel title={'pipeline'} className={'top-[26px] left-[26px]'}>
        <HudReadout label={'mdl'} value={HUD_MODEL} />
        <HudReadout
          label={'stg'}
          value={stage ?? HUD_IDLE_STAGE}
          tone={'system'}
        />
        <HudReadout label={'bld'} value={HUD_BUILD} />
      </HudPanel>

      <HudPanel
        title={'sensors'}
        align={'right'}
        className={'top-[26px] right-[26px]'}
      >
        <HudReadout label={'clk'} value={clock} />
        <HudReadout label={'vpt'} value={formatViewport(width, height)} />
        <HudReadout label={'dpr'} value={formatDpr(dpr)} />
        <HudReadout label={'cur'} value={cursor} />
      </HudPanel>

      <HudPanel
        title={'motion'}
        align={'right'}
        className={'right-[26px] bottom-[26px] tablet-s:hidden'}
      >
        <HudVelocityGraph
          scrollVelocity={scrollVelocity}
          pointerVelocity={pointerVelocity}
          frameRate={frameRate}
        />
        <div className={'mt-[5px] grid grid-cols-2 justify-between gap-1'}>
          <HudLegend swatch={'accent'}>
            scr <motion.span>{scrollRate}</motion.span>
          </HudLegend>
          <HudLegend swatch={'system'}>
            cur <motion.span>{pointerRate}</motion.span>
          </HudLegend>
          <HudReadout label={'pos'} value={progress} />
          <HudLegend swatch={'info'}>
            fps <motion.span>{frameRateText}</motion.span>
          </HudLegend>
        </div>
      </HudPanel>
    </div>
  )
}
