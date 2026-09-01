import { motion } from 'framer-motion'
import { cns } from 'utils/formatters/classnames'
import { Text, type TextTone } from 'ui/common/typography/Text'

export type TitleSize = 1 | 2 | 3 | 4

const SIZE_CLASSES: Record<TitleSize, string> = {
  1: 'text-title-1 leading-title-1 font-bold',
  2: 'text-title-2 leading-title-2 font-semibold',
  3: 'text-title-3 leading-title-3 font-semibold',
  4: 'text-title-4 leading-[1.15] font-bold',
}

type Props = React.BaseProps &
  React.ElementProps<'div'> & {
    size: TitleSize
    uppercase?: boolean
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    tone?: TextTone
  }

export const TextTitle = ({
  size,
  uppercase,
  tag,
  className,
  children,
  ref,
  ...props
}: Props) => {
  const finalClass = cns(
    'font-face-title text-balance',
    SIZE_CLASSES[size],
    uppercase ? 'tracking-[0.04em] uppercase' : 'tracking-[-2%]',
    className,
  )

  return (
    <Text tag={tag ?? `h${size}`} ref={ref} className={finalClass} {...props}>
      {children}
    </Text>
  )
}

export const TextTitleMotion = motion.create(TextTitle)
