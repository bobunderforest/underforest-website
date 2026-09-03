import { useEffect } from 'react'
import { whenPageSettled } from 'utils/browser/idle'

// ResizeObserver reports size changes only: a block inserted or reflowed above
// a measured element moves it without resizing it, so geometry cached from a
// mount-time rect silently goes stale. Re-run once fonts swap and once the page
// settles to catch those position-only shifts.
export const useSettledMeasure = (measure: () => void) => {
  useEffect(() => {
    document.fonts?.ready.then(measure)
    return whenPageSettled(measure)
  }, [measure])
}
