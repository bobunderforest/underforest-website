import { createContextWithHook } from 'utils/primitives/create-context-with-hook'
import type { Domain, ExperienceDomainFilter } from '../experience-data/types'

export type ElementRegistry<K> = {
  elements: Map<K, HTMLElement>
  ref: (key: K) => (element: HTMLElement | null) => void
}

export const createElementRegistry = <K>(): ElementRegistry<K> => {
  const elements = new Map<K, HTMLElement>()
  const refs = new Map<K, (element: HTMLElement | null) => void>()

  return {
    elements,
    ref: (key) => {
      const existing = refs.get(key)
      if (existing) return existing

      const attach = (element: HTMLElement | null) => {
        if (element) elements.set(key, element)
        else elements.delete(key)
      }
      refs.set(key, attach)
      return attach
    },
  }
}

type DossierWireContextValue = {
  registerSource: ElementRegistry<ExperienceDomainFilter>['ref']
  registerTarget: ElementRegistry<Domain>['ref']
}

const noopRegister = () => () => {}

const { context, useContext } = createContextWithHook<DossierWireContextValue>({
  registerSource: noopRegister,
  registerTarget: noopRegister,
})

export const DossierWireContext = context
export const useDossierWire = useContext
