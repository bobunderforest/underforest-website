import { useState } from 'react'
import { cns } from 'utils/formatters/classnames'
import { ContourField } from 'ui/common/cyber-kit/ContourField'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { useContourFieldHover } from 'utils/hooks/useContourFieldHover'

const accentStyles = {
  brand: {
    face: 'border-accent/55 bg-accent/[0.07] text-accent hover:border-accent hover:bg-accent hover:text-base',
    corners: 'border-accent',
  },
  blue: {
    face: 'border-system/55 bg-system/[0.07] text-system hover:border-system hover:bg-system hover:text-base',
    corners: 'border-system',
  },
  bone: {
    face: 'border-text/55 bg-text/[0.05] text-text hover:bg-text hover:text-base',
    corners: 'border-text',
  },
  atomic: {
    face: 'border-atomic-orange/55 bg-atomic-orange/[0.07] text-atomic-orange hover:border-atomic-orange hover:bg-atomic-orange hover:text-base',
    corners: 'border-atomic-orange',
  },
} as const

type Accent = keyof typeof accentStyles

type Props = Omit<React.ElementProps<'a' | 'button'>, 'ref'> & {
  href?: string
  download?: string
  isExternal?: boolean
  accent?: Accent
  disabled?: boolean
  compact?: boolean
  large?: boolean
  wide?: boolean
  quiet?: boolean
  field?: boolean
}

export const Button = ({
  href,
  download,
  isExternal,
  accent = 'brand',
  disabled,
  compact = false,
  large = false,
  wide = false,
  quiet = false,
  field = false,
  className,
  children,
  ...restProps
}: Props) => {
  const [borderBlinkKey, setBorderBlinkKey] = useState(0)
  const accentStyle = accentStyles[accent]
  const hoverField = useContourFieldHover(field)

  const engage = () => {
    if (disabled) return
    setBorderBlinkKey((key) => key + 1)
    hoverField.engage()
  }
  const text = (
    <Text
      tag={'span'}
      face={compact ? 'regular' : 'title'}
      size={compact ? 'hint' : large ? 'lead' : 'regular'}
      uppercase
      className={cns(
        large && 'tracking-[0.08em]',
        !compact && 'mobile-m:text-[15px]',
      )}
    >
      {children}
    </Text>
  )

  const buttonContent = quiet ? (
    <>
      <span aria-hidden className={'flex items-center gap-[5px] opacity-60'}>
        <span className={'size-[5px] rotate-45 border border-current'} />
        <span className={'h-px w-[14px] bg-current'} />
      </span>
      {text}
      <span aria-hidden className={'justify-self-end opacity-70'}>
        ↗
      </span>
    </>
  ) : (
    <>
      <span aria-hidden className={'flex items-center gap-[5px]'}>
        <span className={'size-[5px] bg-current'} />
        <span className={'h-px w-[10px] bg-current opacity-60'} />
      </span>
      {text}
      <Text
        tag={'span'}
        size={'hint'}
        face={'inherit'}
        aria-hidden
        className={'justify-self-end'}
      >
        ▚
      </Text>
      <DataCaptureBorder
        diagonal
        blinkKey={borderBlinkKey}
        className={accentStyle.corners}
      />
      {hoverField.armed && (
        <ContourField
          animate={hoverField.active}
          palette={'bold-accent'}
          className={cns(
            '-z-10 transition-opacity duration-300',
            hoverField.active ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </>
  )

  const faceClassName = cns(
    'relative grid grid-cols-[auto_1fr_auto] items-center gap-[10px] select-none',
    compact
      ? 'px-[12px] py-[9px]'
      : large
        ? 'min-h-[72px] px-[32px] py-[20px] mobile-m:min-h-[60px] mobile-m:px-[22px] mobile-m:py-[15px]'
        : 'px-[24px] py-[15px] mobile-m:px-[18px] mobile-m:py-[12px]',
    wide && 'w-full',
    quiet
      ? 'border border-transparent text-system/75 hover:bg-system/[0.07] hover:text-system'
      : ['border', accentStyle.face],
    field && 'hover:bg-transparent',
    !disabled && [
      'cursor-pointer',
      'transition-[background-color,color,border-color] duration-150',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
    ],
    disabled && 'pointer-events-none opacity-60 grayscale',
  )

  return (
    <span
      onMouseEnter={engage}
      onFocus={engage}
      onClick={engage}
      onMouseLeave={hoverField.release}
      onBlur={hoverField.release}
      className={cns(
        'inline-flex align-middle',
        'bg-base/50 backdrop-blur-md',
        wide && 'w-full',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      {disabled ? (
        <span aria-disabled className={faceClassName}>
          {buttonContent}
        </span>
      ) : href ? (
        <Link
          href={href}
          download={download}
          isExternal={isExternal}
          className={faceClassName}
          {...(restProps as React.ElementProps<'a'>)}
        >
          {buttonContent}
        </Link>
      ) : (
        <button
          className={faceClassName}
          {...(restProps as React.ElementProps<'button'>)}
        >
          {buttonContent}
        </button>
      )}
    </span>
  )
}
