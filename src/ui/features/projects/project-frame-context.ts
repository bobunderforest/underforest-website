import type { MotionValue } from 'framer-motion'
import { createContextWithHook } from 'utils/primitives/create-context-with-hook'

type ProjectFrameContextValue = {
  slot: string
  locked: boolean
  confidence: MotionValue<string>
  frameProgress: MotionValue<number>
}

const { context, useContext } =
  createContextWithHook<ProjectFrameContextValue>()

export const ProjectFrameContext = context
export const useProjectFrame = useContext
