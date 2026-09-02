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

export const ChannelLink = ({ href, label, className }: Props) => (
  <Link
    href={href}
    isExternal
    className={cns(
      'group relative inline-flex items-stretch border border-edge transition-colors duration-150 hover:border-accent',
      className,
    )}
  >
    <DataCaptureBorder diagonal muted className={'group-hover:border-accent'} />
    <Text
      tag={'span'}
      face={'title'}
      size={'regular'}
      uppercase
      tone={'system'}
      className={
        'flex items-center bg-system/[0.08] px-[18px] py-[15px] tabular-nums transition-colors duration-150 group-hover:bg-accent group-hover:text-base mobile-m:px-[14px] mobile-m:py-[12px] mobile-m:text-[15px]'
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
        'flex items-center gap-[10px] px-[24px] py-[15px] mobile-m:px-[18px] mobile-m:py-[12px] mobile-m:text-[15px]'
      }
    >
      {label}
      <span aria-hidden className={'text-muted group-hover:text-accent'}>
        ↗
      </span>
    </Text>
  </Link>
)
