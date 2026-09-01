import { motion } from 'framer-motion'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { Text } from 'ui/common/typography/Text'
import { useProjectFrame } from './project-frame-context'

export const ProjectFrameHud = () => {
  const { slot, locked, confidence } = useProjectFrame()

  return (
    <div aria-hidden className={'pointer-events-none absolute inset-0'}>
      <span className={'absolute inset-[12px]'}>
        <DataCaptureBorder muted={!locked} />
      </span>

      <Text
        size={'hint'}
        uppercase
        tone={locked ? 'accent' : 'dimmed'}
        className={
          'absolute top-[26px] left-[26px] flex items-center gap-2 transition-colors duration-300'
        }
      >
        <span className={'tabular-nums'}>P-{slot}</span>
        <span className={'inline-block h-px w-6 bg-current'} />
        <span>{locked ? 'locked' : 'tracking'}</span>
      </Text>

      <Text
        size={'hint'}
        uppercase
        tone={'system'}
        className={
          'absolute right-[26px] bottom-[26px] flex items-center gap-2'
        }
      >
        <span>conf</span>
        <motion.span className={'tabular-nums'}>{confidence}</motion.span>
        <span>{locked ? '▲' : '▽'}</span>
      </Text>
    </div>
  )
}
