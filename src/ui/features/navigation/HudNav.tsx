import { Link } from 'ui/common/typography/Link'
import {
  HUD_TARGETS,
  isRouteActive,
  navTargetHref,
  type NavTarget,
} from './nav-targets'
import { CrtDitherOverlay } from 'ui/fx/CrtDitherOverlay'
import { CrtHoverTexture } from 'ui/fx/CrtHoverTexture'
import { cns } from 'utils/formatters/classnames'
import { useRoutePath } from 'utils/hooks/useRoutePath'
import { useActiveStage } from 'utils/hooks/useActiveStage'

const HudNavCell = ({
  index,
  label,
  href,
  active,
}: NavTarget & { href: string; active: boolean }) => (
  <Link
    href={href}
    aria-current={active ? 'page' : undefined}
    className={cns(
      'relative flex cursor-pointer items-center overflow-hidden px-[18px] py-[9px] no-underline transition-colors duration-150',
      'border-r border-edge last:border-r-0',
      active ? 'bg-accent text-base' : 'text-muted hover:text-text',
    )}
  >
    {active && <CrtHoverTexture mode={'muted'} />}
    <span
      aria-hidden
      className={cns(
        'absolute top-[3px] left-[4px] text-[7px] leading-none tracking-normal',
        active ? 'text-base/55' : 'text-muted/60',
      )}
    >
      {index}
    </span>
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
      <div className={'relative'}>
        <div className={'hud-frame hud-frame-square'}>
          <div className={'hud-frame-fill relative'}>
            <CrtDitherOverlay />
            <div
              className={cns(
                'relative flex items-stretch font-face-regular uppercase',
                'text-[11px] leading-none tracking-[0.12em] mobile-m:text-[10px]',
              )}
            >
              {onLanding ? <HudNavStageCells /> : <HudNavCells path={path} />}
            </div>
          </div>
        </div>
        {/* <div className={'hud-ticks mt-[4px] h-[4px] opacity-60'} /> */}
      </div>
    </nav>
  )
}
