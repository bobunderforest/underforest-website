export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'underforest:theme'

export const THEME_BROWSER_COLORS: Record<Theme, string> = {
  dark: '#0a0b0a',
  light: '#ffffff',
}
