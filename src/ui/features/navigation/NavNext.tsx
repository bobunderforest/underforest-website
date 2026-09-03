import { SectionContent } from 'ui/common/SectionContent'
import { SignalBorder } from 'ui/fx/SignalBorder'
import { FieldLabel } from 'ui/sections/FieldLabel'
import { NavTarget } from './NavTarget'
import { navTargetsExcept, type NavTargetId } from './nav-targets'
import { CrtDitherOverlay } from 'ui/fx/CrtDitherOverlay'

type Props = {
  current?: NavTargetId
  label?: string
}

export const NavNext = ({ current, label = 'route' }: Props) => {
  const targets = navTargetsExcept(current)

  return (
    <section data-stage={'Route'} className={'relative'}>
      <CrtDitherOverlay className={'top-16'} />
      <SignalBorder className={'z-10'} />
      <SectionContent isPadded classNameWrap={'relative z-10'}>
        <FieldLabel readout={'continue'}>{label}</FieldLabel>
        <nav className={'flex flex-col gap-[20px]'}>
          {targets.map((target) => (
            <NavTarget key={target.id} {...target} />
          ))}
        </nav>
      </SectionContent>
    </section>
  )
}
