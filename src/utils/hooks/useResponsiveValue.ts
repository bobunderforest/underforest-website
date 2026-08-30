import { useMemo } from 'react'
import { useWindowSize } from 'utils/hooks/useWindowSize'
import {
  resolveResponsiveValue,
  type ResponsiveValue,
} from 'utils/browser/breakpoints'

export const useResponsiveValue = <T>(config: ResponsiveValue<T>) => {
  const { width } = useWindowSize()
  return useMemo(() => resolveResponsiveValue(config, width), [config, width])
}
