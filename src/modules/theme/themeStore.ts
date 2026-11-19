import { useStore } from '@nanostores/react'
import { atom } from 'nanostores'

import { THEME_BROWSER_COLORS, THEME_STORAGE_KEY, type Theme } from './theme'

const readTheme = (): Theme =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.theme === 'light'
    ? 'light'
    : 'dark'

export const themeStore = atom<Theme>(readTheme())

export const setTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_BROWSER_COLORS[theme])
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {}
  themeStore.set(theme)
}

export const toggleTheme = () =>
  setTheme(themeStore.get() === 'light' ? 'dark' : 'light')

export const useTheme = () => useStore(themeStore)
