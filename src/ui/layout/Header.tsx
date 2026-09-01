import { createContext, useContext, useRef, useState } from 'react'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { headerControls } from 'utils/app/header'
import { cns } from 'utils/formatters/classnames'
import { useIsVisible } from 'utils/hooks/useIsVisible'
import { useScrollLock } from 'utils/hooks/useScrollLock'

const ANIM_DELAY_STEP = 0.05

type HeaderContext = {
  isContrast?: boolean
  isAnimated?: boolean
  onControlClick?: () => void
}

const headerContext = createContext<HeaderContext>({
  isContrast: undefined,
  isAnimated: undefined,
  onControlClick: undefined,
})

type HeaderControlProps = React.BaseProps & {
  href?: string
  isContrast?: boolean
  primary?: boolean
  animDelay?: number
  onClick?: () => void
}

const HeaderControl = ({
  href,
  isContrast: isContrastProp,
  primary,
  children,
  onClick,
  className,
  animDelay,
}: HeaderControlProps) => {
  const Tag = href ? Link : 'div'

  const {
    isContrast: isContrastContext,
    isAnimated,
    onControlClick,
  } = useContext(headerContext)

  const isContrast =
    isContrastContext !== undefined ? isContrastContext : isContrastProp

  const item = (
    <Tag
      href={href}
      className={cns(
        'ease flex h-[40px] flex-[0_0_auto] cursor-pointer items-center justify-center border-2 px-[18px] backdrop-blur-md transition-colors duration-200',

        !primary &&
          !isContrast &&
          'border-text/60 bg-base/35 text-text hover:border-text hover:bg-text hover:text-base',

        !primary &&
          isContrast &&
          'border-base/40 text-base hover:bg-base hover:text-text',

        primary &&
          'border-text bg-accent text-base shadow-[3px_3px_0_0_var(--color-text)] hover:bg-text hover:text-accent',

        className,
      )}
      onClick={() => {
        onClick?.()
        onControlClick?.()
      }}
    >
      <Text tag={'span'} face={'title'} uppercase>
        {children}
      </Text>
    </Tag>
  )

  if (isAnimated) {
    return (
      <div
        className={'animate-header-mobile-item'}
        style={{ animationDelay: `${animDelay ?? 0}s` }}
      >
        {item}
      </div>
    )
  }

  return item
}

type HeaderBodyProps = HeaderContext & {
  classNameWrap?: string
  classNameInner?: string
  ref?: React.RefObject<HTMLDivElement | null>
}

export const HeaderBody = ({
  isContrast,
  isAnimated,
  onControlClick,
  classNameWrap,
  classNameInner,
  ref,
}: HeaderBodyProps) => {
  return (
    <headerContext.Provider value={{ isContrast, isAnimated, onControlClick }}>
      <div
        className={cns(
          'fixed top-0 left-0 z-99 flex h-0 w-full justify-center',
          'mobile-m:absolute mobile-m:left-content-outer mobile-m:w-[280px] mobile-m:justify-start',
          classNameWrap,
        )}
      >
        <header
          ref={ref}
          className={cns(
            'flex h-fit w-fit items-center justify-center gap-[16px] pt-[20px]',
            'mobile-m:flex-col mobile-m:items-start mobile-m:justify-start mobile-m:pl-content-padding',
            classNameInner,
          )}
        >
          {headerControls.map((control, i) => (
            <HeaderControl
              key={control.href}
              href={control.href}
              primary={control.primary}
              animDelay={i * ANIM_DELAY_STEP}
            >
              {control.label}
            </HeaderControl>
          ))}
        </header>
      </div>
    </headerContext.Provider>
  )
}

type HeaderProps = {
  isContrast?: boolean
}

export const Header = ({ isContrast }: HeaderProps) => {
  const [isOpened, setOpened] = useState(false)

  const headerBasicRef = useRef<HTMLDivElement | null>(null)
  const isVisible = useIsVisible(headerBasicRef)

  useScrollLock(isOpened)

  return (
    <>
      <HeaderBody
        ref={headerBasicRef}
        isContrast={isContrast}
        classNameWrap={'mobile-m:hidden'}
      />

      {/* Mobile control */}
      <HeaderControl
        isContrast={isContrast}
        className={cns(
          'animate-header-mobile-btn fixed top-[20px] z-100 flex size-[40px] rounded-[50%] p-0 mobile-m:right-content-outer-padded',
          isVisible && 'min-[921px]:hidden',
        )}
        onClick={() => setOpened(!isOpened)}
      >
        <div className={'flex flex-col items-start gap-[5px]'}>
          <div
            className={cns(
              'h-[2px] w-[14px] bg-[currentColor] transition-transform',
              isOpened && 'transform-[translate(0px,3px)_rotate(45deg)]',
            )}
          ></div>
          <div
            className={cns(
              'h-[2px] w-[10px] bg-[currentColor] transition-transform',
              isOpened &&
                'w-[14px] transform-[translate(0px,-4px)_rotate(-45deg)]',
            )}
          ></div>
        </div>
      </HeaderControl>

      {/* Mobile menu */}
      {isOpened && (
        <div
          className={'fixed top-0 left-0 z-99 hidden size-full mobile-m:block'}
        >
          <div
            onClick={() => setOpened(false)}
            className={cns(
              'absolute top-0 left-0 size-full',
              'animate-header-mobile-bg backdrop-blur-xl',
            )}
          />
          <HeaderBody
            isAnimated
            isContrast={isContrast}
            onControlClick={() => setOpened(false)}
            classNameWrap={
              'top-[60px] h-fit pb-[60px] mobile-m:!left-[initial] mobile-m:!right-content-outer-padded !justify-end'
            }
            classNameInner={'!items-end'}
          />
        </div>
      )}
    </>
  )
}
