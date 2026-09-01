import { useMemo, useState } from 'react'
import { ExperienceContext } from './experience-data-context'
import type { ExperienceDomainFilter } from './types'

export const ExperienceDataProvider = ({ children }: React.BaseProps) => {
  const [domainFilter, setDomainFilter] =
    useState<ExperienceDomainFilter>('unified')
  const value = useMemo(
    () => ({ domainFilter, setDomainFilter }),
    [domainFilter],
  )

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  )
}
