import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Text } from 'ui/common/typography/Text'
import { HUD_BOOT_LINES, type HudBootLine } from 'ui/features/hud/hud-fields'
import { motionEase } from 'utils/anim/motion-ease'
import { cns } from 'utils/formatters/classnames'
import { useBootSequence } from 'utils/hooks/useBootSequence'
import { useMounted } from 'utils/hooks/useMounted'
import { useScrollLock } from 'utils/hooks/useScrollLock'

const EXIT_DURATION = 0.4
const BOOTING_CLASS = 'is-booting'

const HudBootRow = ({ label, status, denied, lead }: HudBootLine) => (
  <div className={cns('flex items-baseline gap-3', lead && 'mt-[10px]')}>
    <span className={lead ? 'text-text' : 'text-muted'}>{label}</span>
    {status && (
      <>
        <span
          className={
            'min-w-[24px] flex-1 border-b border-dotted border-muted/45'
          }
        />
        <span className={denied ? 'text-accent' : 'text-system'}>
          {Array.isArray(status) ? status.join(' · ') : status}
        </span>
      </>
    )}
  </div>
)

const HudBootOverlay = () => {
  const { active, revealed, finish } = useBootSequence(HUD_BOOT_LINES.length)

  useScrollLock(active)

  useEffect(() => {
    document.documentElement.classList.remove(BOOTING_CLASS)
  }, [])

  useEffect(() => {
    if (!active) return
    window.addEventListener('keydown', finish)
    return () => window.removeEventListener('keydown', finish)
  }, [active, finish])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden
          onClick={finish}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_DURATION, ease: motionEase.exit }}
          className={
            'fixed inset-0 z-[201] flex cursor-pointer items-center bg-base px-[8vw] mobile-m:px-[6vw]'
          }
        >
          <Text
            size={'hint'}
            uppercase
            className={
              'flex w-full max-w-[540px] flex-col gap-[6px] tracking-[0.14em]'
            }
          >
            {HUD_BOOT_LINES.slice(0, revealed).map((line) => (
              <HudBootRow key={line.label} {...line} />
            ))}
            <span
              className={
                'mt-[6px] h-[11px] w-[7px] animate-data-capture-blink bg-accent animate-infinite'
              }
            />
          </Text>

          <Text
            size={'note'}
            uppercase
            tone={'dimmed'}
            className={
              'absolute bottom-[26px] left-[8vw] tracking-[0.2em] mobile-m:left-[6vw]'
            }
          >
            click to skip
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const HudBoot = () => (useMounted() ? <HudBootOverlay /> : null)
