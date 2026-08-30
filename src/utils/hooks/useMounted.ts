import { useSyncExternalStore } from 'react'

const subscribeNever = () => () => {}

export const useMounted = () =>
  useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  )
