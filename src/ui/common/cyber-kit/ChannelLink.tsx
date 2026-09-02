import { useState } from 'react'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { cns } from 'utils/formatters/classnames'
import { channelTag } from 'utils/formatters/links'

type Props = {
  href: string
  label: string
  className?: string
}

export const ChannelLink = ({ href, label, className }: Props) => {
  const [borderBlinkKey, setBorderBlinkKey] = useState(0)
  return (
    <Link
      onMouseEnter={() => setBorderBlinkKey((key) => key + 1)}
      onClick={() => setBorderBlinkKey((key) => key + 1)}
      href={href}
      isExternal
      className={cns(
        'group relative inline-flex items-stretch border border-edge transition-colors duration-150 hover:border-accent',
        className,
      )}
    >
      <DataCaptureBorder
        diagonal
        muted
        blinkKey={borderBlinkKey}
        className={'group-hover:border-accent'}
      />
      <Text
        tag={'span'}
        face={'title'}
        size={'regular'}
        uppercase
        tone={'system'}
        className={
        'channel-link-tag flex items-center bg-system/[0.08] tabular-nums transition-colors duration-150 group-hover:bg-accent group-hover:text-base'
        }
      >
        {channelTag(href)}
      </Text>
      <Text
        tag={'span'}
        face={'title'}
        size={'regular'}
        uppercase
        tone={'primary'}
        className={
        'channel-link-label flex items-center'
        }
      >
        {label}
        <span aria-hidden className={'text-muted group-hover:text-accent'}>
          ↗
        </span>
      </Text>
    </Link>
  )
}
