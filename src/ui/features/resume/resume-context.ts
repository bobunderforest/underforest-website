import { createContextWithHook } from 'utils/primitives/create-context-with-hook'
import type { Model } from './resume-data'

type ResumeContextValue = {
  model: Model
  setModel: (model: Model) => void
}

const { context, useContext } = createContextWithHook<ResumeContextValue>({
  model: 'unified',
  setModel: () => {},
})

export const ResumeContext = context
export const useResumeModel = useContext
