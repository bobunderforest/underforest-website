import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { Link } from 'ui/common/typography/Link'
import { TextTitle } from 'ui/common/typography/TextTitle'
import { useCaptureHover } from 'utils/hooks/useCaptureHover'
import type { MouseEventHandler } from 'react'

type Props = {
  label: string
  href: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export const NavTarget = ({ label, href, onClick }: Props) => {
  const hover = useCaptureHover({ field: false })

  return (
    <Link
      href={href}
      {...hover.handlers}
      onClick={onClick}
      className={
        'group relative block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
      }
    >
      <DataCaptureBorder
        muted
        blinkKey={hover.blinkKey}
        offset={4}
        size={11}
        className={
          'transition-colors duration-200 group-hover:border-accent group-focus-visible:border-accent'
        }
      />
      <div
        className={
          'hud-frame transition-colors duration-200 group-hover:bg-accent group-focus-visible:bg-accent'
        }
      >
        <div
          className={
            'hud-frame-fill relative overflow-hidden bg-base px-[40px] py-[50px] tablet-s:px-[24px] tablet-s:py-[32px]'
          }
        >
          <TextTitle
            tag={'h2'}
            size={2}
            uppercase
            className={
              'relative max-w-[12ch] leading-[1] font-bold tracking-[-0.02em] transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent'
            }
          >
            {label}
          </TextTitle>
        </div>
      </div>
      <span
        aria-hidden
        className={'hud-ticks mt-[6px] block h-[5px] w-full opacity-60'}
      />
    </Link>
  )
}
