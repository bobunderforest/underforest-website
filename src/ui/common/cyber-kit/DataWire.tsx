import { motion } from 'framer-motion'
import { motionEase } from 'utils/anim/motion-ease'
import { cns } from 'utils/formatters/classnames'

export const DataWire = ({ reduced }: { reduced: boolean }) => {
  const slideIn = reduced ? 0 : -16
  const transition = { duration: 0.32, ease: motionEase.enter }

  return (
    <motion.span
      aria-hidden
      className={cns(
        'pointer-events-none absolute top-1/2 left-full z-[3] -translate-y-1/2',
        'ml-[26px] block h-[7px] w-[54px]',
        'desktop-s:hidden',
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <motion.span
        className={
          'absolute top-1/2 left-0 h-px w-full origin-left -translate-y-1/2 bg-[repeating-linear-gradient(to_right,var(--color-accent)_0_5px,transparent_5px_10px)] opacity-70'
        }
        initial={{ scaleX: reduced ? 1 : 0.7 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: reduced ? 1 : 0.7 }}
        transition={transition}
      />
      <span
        className={
          'absolute top-1/2 left-0 size-[5px] -translate-x-1/2 -translate-y-1/2 border border-accent bg-base'
        }
      />
      <span
        className={
          'absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2'
        }
      >
        <motion.span
          className={'block size-[5px] border border-accent bg-base'}
          initial={{ x: slideIn, rotate: 45 }}
          animate={{ x: 0, rotate: 45 }}
          exit={{ x: slideIn, rotate: 45 }}
          transition={transition}
        />
      </span>
    </motion.span>
  )
}
