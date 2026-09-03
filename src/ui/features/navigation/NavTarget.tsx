import { useState } from 'react'
import { ContourField } from 'ui/common/cyber-kit/ContourField'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { TextTitle } from 'ui/common/typography/TextTitle'
import { cns } from 'utils/formatters/classnames'
import { useContourFieldHover } from 'utils/hooks/useContourFieldHover'
import type { NavTarget as NavTargetData } from './nav-targets'

export const NavTarget = ({
  index,
  label,
  hint,
  readout,
  href,
}: NavTargetData) => {
  const [borderBlinkKey, setBorderBlinkKey] = useState(0)
  const hoverField = useContourFieldHover()

  const enter = () => {
    setBorderBlinkKey((key) => key + 1)
    hoverField.engage()
  }

  return (
    <Link
      href={href}
      onMouseEnter={enter}
      onMouseLeave={hoverField.release}
      onFocus={enter}
      onBlur={hoverField.release}
      className={'group relative block'}
    >
      <DataCaptureBorder blinkKey={borderBlinkKey} offset={4} size={11} />
      <div
        className={
          'hud-frame transition-colors duration-200 [--hud-cut:28px] group-hover:bg-accent tablet-s:[--hud-cut:18px]'
        }
      >
        <div
          className={cns(
            'hud-frame-fill relative [--hud-cut:27px] tablet-s:[--hud-cut:17px]',
            'px-[40px] py-[50px] transition-colors duration-200',
            'group-hover:bg-[color-mix(in_srgb,var(--color-accent)_9%,var(--color-base))]',
            'tablet-s:px-[24px] tablet-s:py-[32px]',
          )}
        >
          {hoverField.armed && (
            <ContourField
              animate={hoverField.active}
              palette={'dark-red'}
              className={cns(
                'transition-opacity duration-300',
                hoverField.active ? 'opacity-100' : 'opacity-0',
              )}
            />
          )}
          <div
            className={
              'relative flex items-center gap-[40px] tablet-s:gap-[20px]'
            }
          >
            <Text
              tag={'span'}
              size={'inherit'}
              face={'title'}
              tone={'accent'}
              className={
                'text-[40px] leading-[1] font-light italic tablet-s:text-[26px]'
              }
            >
              {index}
            </Text>

            <div className={'min-w-0 flex-1'}>
              <TextTitle
                tag={'h2'}
                size={1}
                uppercase
                className={
                  'mb-3 leading-[1] font-bold transition-colors duration-200 group-hover:text-accent'
                }
              >
                {label}
              </TextTitle>
              <Text
                size={'hint'}
                tone={'secondary'}
                uppercase
                className={'italic'}
              >
                {`// ${hint}`}
              </Text>
            </div>

            <div className={'flex flex-col items-end gap-4 mobile-m:hidden'}>
              <Text
                tag={'span'}
                size={'note'}
                face={'title'}
                tone={'system'}
                uppercase
                className={'tabular-nums'}
              >
                {readout}
              </Text>
              <span
                aria-hidden
                className={cns(
                  'hud-crosshair relative size-[34px] border border-edge',
                  'transition-colors duration-200 group-hover:border-accent',
                )}
              />
            </div>

            <Text
              tag={'span'}
              size={'inherit'}
              tone={'secondary'}
              aria-hidden
              className={cns(
                'text-[40px] leading-[1] transition-[color,transform] duration-200 tablet-s:text-[26px]',
                'group-hover:translate-x-[6px] group-hover:text-accent',
              )}
            >
              {'→'}
            </Text>
          </div>
        </div>
      </div>
      <span
        aria-hidden
        className={'hud-ticks mt-[6px] block h-[5px] w-full opacity-60'}
      />
    </Link>
  )
}
