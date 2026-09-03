import { HudLayer } from 'ui/features/hud/HudLayer'
import { HudBoot } from 'ui/features/hud/HudBoot'
import { useLenis } from 'utils/hooks/useLenis'
import { usePageEntry } from 'utils/hooks/usePageEntry'
import { useHashFocus } from 'utils/hooks/useHashFocus'

export const SiteRuntime = () => {
  useLenis()
  usePageEntry()
  useHashFocus()

  return (
    <>
      <HudLayer />
      <HudBoot />
    </>
  )
}
