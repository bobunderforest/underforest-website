import { createContextWithHook } from 'utils/primitives/create-context-with-hook'
import type { ExperienceDomainFilter } from './types'

type ExperienceContextValue = {
  domainFilter: ExperienceDomainFilter
  setDomainFilter: (domainFilter: ExperienceDomainFilter) => void
}

const { context, useContext } = createContextWithHook<ExperienceContextValue>({
  domainFilter: 'unified',
  setDomainFilter: () => {},
})

export const ExperienceContext = context
export const useExperienceDomainFilter = useContext
