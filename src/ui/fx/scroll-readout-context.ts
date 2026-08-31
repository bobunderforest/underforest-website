import { useEffect, useId, useMemo } from 'react'
import type { MotionValue } from 'framer-motion'
import { createContextWithHook } from 'utils/primitives/create-context-with-hook'

export type ScrollReadoutEntry = {
  id: string
  path: string[]
  progress: MotionValue<number>
}

type ScrollReadoutValue = {
  register: (entry: ScrollReadoutEntry) => () => void
}

const detachedValue: ScrollReadoutValue = { register: () => () => {} }

const { context, useContext: useScrollReadout } =
  createContextWithHook<ScrollReadoutValue>(detachedValue)

const { context: groupContext, useContext: useScrollReadoutGroup } =
  createContextWithHook<string[]>([])

export const ScrollReadoutContext = context

export const ScrollReadoutGroupContext = groupContext

export const useRegisterScrollReadout = ({
  label,
  progress,
}: {
  label?: string
  progress: MotionValue<number>
}) => {
  const { register } = useScrollReadout()
  const parentPath = useScrollReadoutGroup()
  const id = useId()

  const path = useMemo(
    () => (label ? [...parentPath, label] : parentPath),
    [parentPath, label],
  )

  useEffect(() => {
    if (!label || !import.meta.env.DEV) return
    return register({ id, path, progress })
  }, [register, id, label, path, progress])

  return path
}
