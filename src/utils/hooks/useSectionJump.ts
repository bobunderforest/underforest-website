import { useSyncExternalStore } from 'react'
import { sectionJump } from 'utils/anim/section-jump'

const subscribe = (onChange: () => void) => sectionJump.watch(onChange)

export const useSectionJump = () =>
  useSyncExternalStore(
    subscribe,
    () => sectionJump.get(),
    () => null,
  )
