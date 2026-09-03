import { Link } from 'ui/common/typography/Link'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { NAV_ROUTES, isRouteActive, type NavTarget } from './nav-targets'
import { cns } from 'utils/formatters/classnames'
import { useRoutePath } from 'utils/hooks/useRoutePath'

const HudNavCell = ({
  index,
  label,
  href,
  active,
}: NavTarget & { active: boolean }) => (
  <Link
    href={href}
    aria-current={active ? 'page' : undefined}
    className={cns(
      'relative flex cursor-pointer items-center px-[18px] py-[9px] no-underline transition-colors duration-150',
      'border-r border-edge last:border-r-0',
      active ? 'bg-accent text-base' : 'text-muted hover:text-text',
    )}
  >
    <span
      aria-hidden
      className={cns(
        'absolute top-[3px] left-[4px] text-[7px] leading-none tracking-normal',
        active ? 'text-base/55' : 'text-muted/60',
      )}
    >
      {index}
    </span>
    {label}
  </Link>
)

export const HudNav = () => {
  const path = useRoutePath()

  return (
    <nav
      aria-label={'Primary'}
      className={cns(
        'fixed inset-x-0 top-[26px] z-50 flex justify-center',
        'tablet-s:top-auto tablet-s:bottom-[26px]',
      )}
    >
      <div className={'relative'}>
        <DataCaptureBorder diagonal offset={4} size={9} />
        <div className={'hud-frame'}>
          <div className={'hud-frame-fill'}>
            <div
              className={
                'flex items-stretch font-face-regular text-[11px] leading-none tracking-[0.12em] uppercase mobile-m:text-[10px]'
              }
            >
              {NAV_ROUTES.map((route) => (
                <HudNavCell
                  key={route.href}
                  {...route}
                  active={isRouteActive(route.href, path)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={'hud-ticks mt-[4px] h-[4px] opacity-60'} />
      </div>
    </nav>
  )
}
