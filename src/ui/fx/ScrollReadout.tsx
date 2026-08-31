import { useCallback, useMemo, useState } from 'react'
import { useMotionValueEvent } from 'framer-motion'
import {
  ScrollReadoutContext,
  type ScrollReadoutEntry,
} from 'ui/fx/scroll-readout-context'

const pathKey = (path: string[]) => path.join('\u0000')

const nest = (entries: ScrollReadoutEntry[]) => {
  const childrenOf = new Map<string, ScrollReadoutEntry[]>()

  entries.forEach((entry) => {
    const parentKey = pathKey(entry.path.slice(0, -1))
    childrenOf.set(parentKey, [...(childrenOf.get(parentKey) ?? []), entry])
  })

  const walk = (key: string): ScrollReadoutEntry[] =>
    (childrenOf.get(key) ?? []).flatMap((entry) => [
      entry,
      ...walk(pathKey(entry.path)),
    ])

  return walk('')
}

const ScrollReadoutRow = ({ path, progress }: ScrollReadoutEntry) => {
  const [percent, setPercent] = useState(() => Math.round(progress.get() * 100))

  useMotionValueEvent(progress, 'change', (value) => {
    setPercent(Math.round(value * 100))
  })

  const depth = path.length - 1

  return (
    <div
      className={'flex justify-between gap-4'}
      style={{ paddingLeft: depth * 12 }}
    >
      <span className={depth ? 'text-text/60' : undefined}>
        {path[depth]}
      </span>
      <span>{percent}%</span>
    </div>
  )
}

export const ScrollReadoutProvider = ({ children }: React.BaseProps) => {
  const [entries, setEntries] = useState<ScrollReadoutEntry[]>([])

  const register = useCallback((entry: ScrollReadoutEntry) => {
    setEntries((prev) => [...prev.filter((e) => e.id !== entry.id), entry])
    return () => setEntries((prev) => prev.filter((e) => e.id !== entry.id))
  }, [])

  const value = useMemo(() => ({ register }), [register])

  return (
    <ScrollReadoutContext.Provider value={value}>
      {children}
      {entries.length > 0 && (
        <div
          className={
            'text-xs pointer-events-none fixed top-3 left-3 z-[9999] flex flex-col gap-1 border border-edge bg-surface/85 px-3 py-2 font-face-regular text-text tabular-nums'
          }
        >
          {nest(entries).map((entry) => (
            <ScrollReadoutRow key={entry.id} {...entry} />
          ))}
        </div>
      )}
    </ScrollReadoutContext.Provider>
  )
}
