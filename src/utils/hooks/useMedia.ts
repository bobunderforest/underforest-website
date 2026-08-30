import { useState } from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

type Args = {
  defaultValue?: boolean
}

export function useMediaQuery(
  query: string,
  { defaultValue = false }: Args = {},
): boolean {
  const [matches, setMatches] = useState<boolean>(defaultValue)

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)

    const handleChange = () => {
      setMatches(matchMedia.matches)
    }

    handleChange()

    requestAnimationFrame(() => {
      handleChange()
    })

    // Use deprecated `addListener` and `removeListener` to support Safari < 14 (#135)
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange)
    } else {
      matchMedia.addEventListener('change', handleChange)
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange)
      } else {
        matchMedia.removeEventListener('change', handleChange)
      }
    }
  }, [query])

  return matches
}

export const useMediaDesktopM = () => {
  return useMediaQuery('(max-width: 1580px)')
}

export const useMediaTabletM = () => {
  return useMediaQuery('(max-width: 1420px)')
}

export const useMediaMobileM = () => {
  return useMediaQuery('(max-width: 920px)')
}

export const useMediaMobileS = () => {
  return useMediaQuery('(max-width: 320px)')
}
