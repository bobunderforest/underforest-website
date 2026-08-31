import { createContextWithHook } from 'utils/primitives/create-context-with-hook'
import type { StickyScrollLayer } from 'utils/hooks/useStickyScrollLayer'

type ScrollStageValue = {
  active: boolean
  scroll: StickyScrollLayer | null
}

const detachedValue: ScrollStageValue = { active: false, scroll: null }

const { context, useContext: useScrollStageValue } =
  createContextWithHook<ScrollStageValue>(detachedValue)

export const ScrollStageContext = context

export const useScrollStageActive = () => useScrollStageValue().active

export const useScrollStage = () => {
  const { scroll } = useScrollStageValue()
  if (!scroll) {
    throw new Error('useScrollStage call outside a StickyScrollSection')
  }
  return scroll
}
