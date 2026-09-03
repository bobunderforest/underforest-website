import { useSyncExternalStore } from 'react'

const SERVER_PATH = '/'

const subscribe = (onChange: () => void) => {
  document.addEventListener('astro:page-load', onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    document.removeEventListener('astro:page-load', onChange)
    window.removeEventListener('popstate', onChange)
  }
}

const getPath = () => window.location.pathname

export const useRoutePath = () =>
  useSyncExternalStore(subscribe, getPath, () => SERVER_PATH)
