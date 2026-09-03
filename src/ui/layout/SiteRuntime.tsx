import { HudLayer } from 'ui/features/hud/HudLayer'
import { HudBoot } from 'ui/features/hud/HudBoot'
import { useLenis } from 'utils/hooks/useLenis'
import { usePageEntry } from 'utils/hooks/usePageEntry'

export const SiteRuntime = () => {
  useLenis()
  usePageEntry()

  return (
    <>
      <HudLayer />
      <HudBoot />
    </>
  )
}
