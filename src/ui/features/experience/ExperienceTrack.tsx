import { useCallback, useRef, useState } from 'react'
import { EXPERIENCE } from 'ui/features/experience-data/experience-data'
import { ExperienceEntry } from './ExperienceEntry'

export const ExperienceTrack = () => {
  const inViewIds = useRef(new Set<string>())
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleInViewChange = useCallback((id: string, inView: boolean) => {
    const set = inViewIds.current
    if (inView) set.add(id)
    else set.delete(id)

    setActiveId((current) => {
      if (current && set.has(current)) return current
      const next = EXPERIENCE.find((entry) => set.has(entry.id))
      return next?.id ?? null
    })
  }, [])

  return (
    <ol className={'grid max-w-[880px]'}>
      {EXPERIENCE.map((entry) => (
        <ExperienceEntry
          key={entry.id}
          entry={entry}
          active={entry.id === activeId}
          onInViewChange={handleInViewChange}
        />
      ))}
    </ol>
  )
}
