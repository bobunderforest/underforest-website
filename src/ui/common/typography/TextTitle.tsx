import { motion } from 'framer-motion'
import { cns } from 'utils/formatters/classnames'
import { Text } from 'ui/common/typography/Text'

export type TitleSize = 1 | 2 | 3

const SIZE_CLASSES: Record<TitleSize, string> = {
  1: 'text-title-1 leading-title-1 font-bold',
  2: 'text-title-2 leading-title-2 font-semibold',
  3: 'text-title-3 leading-title-3 font-semibold',
}

type Props = React.BaseProps &
  React.ElementProps<'div'> & {
    size: TitleSize
    uppercase?: boolean
  }

export const TextTitle = ({
  size,
  uppercase,
  className,
  children,
  ref,
  ...props
}: Props) => {
  const finalClass = cns(
    'font-face-title tracking-[-2%] text-balance',
    SIZE_CLASSES[size],
    uppercase && 'uppercase',
    className,
  )

  return (
    <Text tag={`h${size}`} ref={ref} className={finalClass} {...props}>
      {children}
    </Text>
  )
}

export const TextTitleMotion = motion.create(TextTitle)
