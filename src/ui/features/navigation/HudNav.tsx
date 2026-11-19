import { motion } from 'framer-motion'
import { Link } from 'ui/common/typography/Link'
import {
  HUD_TARGETS,
  isRouteActive,
  navTargetHref,
  type NavTarget,
} from './nav-targets'
import { motionEase } from 'utils/anim/motion-ease'
import { cns } from 'utils/formatters/classnames'
import { useRoutePath } from 'utils/hooks/useRoutePath'
import { useActiveStage } from 'utils/hooks/useActiveStage'
import { toggleTheme, useTheme } from 'modules/theme/themeStore'
import { useMounted } from 'utils/hooks/useMounted'

const CHIP_TRANSITION = { duration: 0.32, ease: motionEase.travel }

const HudNavCell = ({
  label,
  href,
  active,
}: NavTarget & { href: string; active: boolean }) => (
  <Link
    href={href}
    aria-current={active ? 'page' : undefined}
    className={cns(
      'relative flex cursor-pointer items-center px-[12px] py-[7px] no-underline transition-colors duration-150',
      active ? 'text-base' : 'text-muted hover:text-text',
    )}
  >
    {active && (
      <motion.span
        layoutId={'hud-nav-chip'}
        transition={CHIP_TRANSITION}
        className={'absolute inset-0 bg-accent'}
      />
    )}
    <span className={'relative'}>{label}</span>
  </Link>
)

const HudNavCells = ({ path }: { path: string }) => (
  <>
    {HUD_TARGETS.map((route) => (
      <HudNavCell
        key={route.id}
        {...route}
        href={navTargetHref(route, path)}
        active={isRouteActive(route, path)}
      />
    ))}
  </>
)

const HudNavStageCells = () => {
  const activeStage = useActiveStage()

  return (
    <>
      {HUD_TARGETS.map((route) => (
        <HudNavCell
          key={route.id}
          {...route}
          href={route.hash}
          active={route.stage === activeStage}
        />
      ))}
    </>
  )
}

const HudNavFrame = ({ children }: React.BaseProps) => (
  <div className={'hud-frame hud-frame-square'}>
    <div className={'hud-frame-fill flex h-full gap-[2px] p-[3px]'}>
      {children}
    </div>
  </div>
)

const HudThemeToggle = () => {
  const theme = useTheme()
  const mounted = useMounted()
  const isLightAfterHydration = mounted && theme === 'light'

  return (
    <button
      type={'button'}
      role={'switch'}
      aria-checked={isLightAfterHydration}
      aria-label={'Light theme'}
      onClick={toggleTheme}
      className={cns(
        'group/theme relative flex cursor-pointer items-center gap-[8px] px-[10px] py-[7px] uppercase',
        'text-muted transition-colors duration-150 hover:text-text',
      )}
    >
      <span>theme</span>
      <span
        aria-hidden
        className={
          'relative block h-[11px] w-[24px] border border-edge transition-colors duration-150 group-hover/theme:border-muted'
        }
      >
        <span
          className={cns(
            'absolute top-[1px] left-[1px] block size-[7px] bg-accent',
            'transition-transform duration-200 ease-out-cubic light:translate-x-[13px]',
          )}
        />
      </span>
    </button>
  )
}

export const HudNav = () => {
  const path = useRoutePath()
  const onLanding = path === '/'

  return (
    <nav
      aria-label={'Primary'}
      className={cns(
        'fixed inset-x-0 top-[26px] z-50 flex justify-center',
        'mobile-m:top-auto mobile-m:bottom-[26px]',
      )}
    >
      <div
        className={cns(
          'relative flex items-stretch gap-[8px] font-face-regular uppercase',
          'text-[11px] leading-none tracking-[0.12em] mobile-m:text-[10px]',
        )}
      >
        <HudNavFrame>
          {onLanding ? <HudNavStageCells /> : <HudNavCells path={path} />}
        </HudNavFrame>
        <HudNavFrame>
          <HudThemeToggle />
        </HudNavFrame>
        {/* <div className={'hud-ticks mt-[4px] h-[4px] opacity-60'} /> */}
      </div>
    </nav>
  )
}
