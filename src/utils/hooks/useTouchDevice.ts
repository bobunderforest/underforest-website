import { useSyncExternalStore } from 'react'
import { isTouchDevice } from 'utils/browser/is-touch-device'

const subscribeNever = () => () => {}

export const useTouchDevice = () =>
  useSyncExternalStore(subscribeNever, isTouchDevice, () => false)
