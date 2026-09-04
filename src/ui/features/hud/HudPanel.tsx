import { motion, type MotionValue } from 'framer-motion'
import { Text } from 'ui/common/typography/Text'
import { cns } from 'utils/formatters/classnames'

type Align = 'left' | 'right'

type PanelProps = React.BaseProps & {
  title: string
  align?: Align
  className: string
  flipCut?: boolean
}

const PanelTab = ({ title, align }: { title: string; align: Align }) => (
  <div
    className={cns(
      'mb-[4px] flex items-center gap-[6px]',
      align === 'right' && 'flex-row-reverse',
    )}
  >
    <span
      className={
        'bg-accent px-[5px] py-[1px] text-[9px] leading-[1.4] tracking-[0.18em] text-base'
      }
    >
      {title}
    </span>
    <span className={'h-px flex-1 bg-edge'} />
    <span className={'size-[3px] bg-accent'} />
  </div>
)

export const HudPanel = ({
  title,
  align = 'left',
  className,
  flipCut = false,
  children,
}: PanelProps) => (
  <div className={cns('absolute w-[186px] mobile-m:w-[150px]', className)}>
    <PanelTab title={title} align={align} />

    <div className={cns('hud-frame', flipCut && 'hud-frame-flip')}>
      <div className={'hud-frame-fill px-[9px] py-[7px]'}>
        <Text
          size={'note'}
          uppercase
          className={'flex flex-col gap-[3px] tracking-[0.12em]'}
        >
          {children}
        </Text>
      </div>
    </div>

    {/* <div className={'hud-ticks mt-[4px] h-[4px] opacity-60'} /> */}
  </div>
)

type Tone = 'text' | 'system'

type ReadoutProps = {
  label: string
  value: string | MotionValue<string>
  tone?: Tone
}

const TONE_CLASSES: Record<Tone, string> = {
  text: 'text-text',
  system: 'text-system',
}

export const HudReadout = ({ label, value, tone = 'text' }: ReadoutProps) => (
  <div className={'flex items-baseline justify-between gap-2'}>
    <span className={'shrink-0 text-muted'}>{label}</span>
    <motion.span
      className={cns('hud-glow truncate tabular-nums', TONE_CLASSES[tone])}
    >
      {value}
    </motion.span>
  </div>
)

type Swatch = 'accent' | 'system' | 'info'

const SWATCH_CLASSES: Record<Swatch, string> = {
  accent: 'bg-accent',
  system: 'bg-system',
  info: 'bg-info',
}

export const HudLegend = ({
  swatch,
  children,
}: React.BaseProps & { swatch: Swatch }) => (
  <span className={'flex items-center gap-[5px] text-muted'}>
    <span className={cns('h-[2px] w-[9px]', SWATCH_CLASSES[swatch])} />
    {children}
  </span>
)
