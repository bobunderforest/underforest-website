import { useSyncExternalStore } from 'react'
import { getDpr } from 'utils/browser/dpr'

const SERVER_DPR = 1

const subscribe = () => () => {}

export const useDpr = () =>
  useSyncExternalStore(subscribe, getDpr, () => SERVER_DPR)
