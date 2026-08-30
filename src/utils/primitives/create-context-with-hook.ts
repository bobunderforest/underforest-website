import { createContext, useContext } from 'react'

export const createContextWithHook = <D>(fallback?: D) => {
  const context = createContext<D | null>(fallback ?? null)

  const useContextHook = (): D => {
    const contextValue = useContext(context)
    if (contextValue === null) {
      if (fallback !== undefined) return fallback
      throw new Error(`useContext call out of context`)
    }
    return contextValue
  }

  return {
    context,
    useContext: useContextHook,
  }
}
