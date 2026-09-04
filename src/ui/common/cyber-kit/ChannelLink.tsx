import { useState, type ReactNode } from 'react'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { cns } from 'utils/formatters/classnames'
import { channelTag } from 'utils/formatters/links'
import { CrtHoverTexture } from 'ui/fx/CrtHoverTexture'
import { ScribbleStrike } from 'ui/fx/ScribbleStrike'

const channelTones = {
  system: {
    face: 'border-edge hover:border-system',
    corners: 'group-hover:border-system',
    tag: 'bg-system/[0.08] text-system group-hover:bg-system',
    arrow: 'text-muted group-hover:text-system',
    outline: 'focus-visible:outline-system',
  },
  atomic: {
    face: 'border-atomic-orange/60 bg-atomic-orange/[0.06] hover:border-atomic-orange',
    corners: 'border-atomic-orange group-hover:border-atomic-orange',
    tag: 'bg-atomic-orange/[0.18] text-atomic-orange group-hover:bg-atomic-orange',
    arrow: 'text-atomic-orange',
    outline: 'focus-visible:outline-atomic-orange',
  },
} as const

type Tone = keyof typeof channelTones

export type ChannelLinkProps = {
  href: string
  label: string
  tone?: Tone
  scribbled?: boolean
  trailingIcon?: ReactNode
  className?: string
}

export const ChannelLink = ({
  href,
  label,
  tone = 'system',
  scribbled = false,
  trailingIcon,
  className,
}: ChannelLinkProps) => {
  const [borderBlinkKey, setBorderBlinkKey] = useState(0)
  const toneStyle = channelTones[tone]
  return (
    <Link
      onMouseEnter={() => setBorderBlinkKey((key) => key + 1)}
      onClick={() => setBorderBlinkKey((key) => key + 1)}
      href={href}
      isExternal
      className={cns(
        'group relative inline-flex items-stretch border bg-base/50 backdrop-blur-md transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        toneStyle.face,
        toneStyle.outline,
        className,
      )}
    >
      <DataCaptureBorder
        diagonal
        muted={tone === 'system'}
        blinkKey={borderBlinkKey}
        className={toneStyle.corners}
      />
      <Text
        tag={'span'}
        face={'title'}
        size={'inherit'}
        uppercase
        className={cns(
          'relative flex items-center overflow-hidden tabular-nums transition-colors duration-150 group-hover:text-base',
          'px-[18px] py-[15px] text-[15px] leading-[1.6]',
          'desktop-m:text-[14px]',
          'tablet-s:px-[16px] tablet-s:py-[13px] tablet-s:text-[13px]',
          'mobile-m:px-[12px] mobile-m:py-[10px] mobile-m:text-[12px]',
          'mobile-s:px-[10px] mobile-s:py-[9px]',
          toneStyle.tag,
        )}
      >
        <CrtHoverTexture />
        <span className={'relative z-10'}>{channelTag(href)}</span>
      </Text>
      <Text
        tag={'span'}
        face={'title'}
        size={'inherit'}
        uppercase
        tone={'primary'}
        className={cns(
          'flex items-center',
          'gap-[10px] px-[24px] py-[15px] text-[15px] leading-[1.6]',
          'desktop-m:text-[14px]',
          'tablet-s:gap-[8px] tablet-s:px-[20px] tablet-s:py-[13px] tablet-s:text-[13px]',
          'mobile-m:gap-[7px] mobile-m:px-[15px] mobile-m:py-[10px] mobile-m:text-[12px]',
          'mobile-s:gap-[6px] mobile-s:px-[12px] mobile-s:py-[9px]',
        )}
      >
        {scribbled ? <ScribbleStrike>{label}</ScribbleStrike> : label}
        <span aria-hidden className={cns('flex items-center', toneStyle.arrow)}>
          {trailingIcon ?? '↗'}
        </span>
      </Text>
    </Link>
  )
}
