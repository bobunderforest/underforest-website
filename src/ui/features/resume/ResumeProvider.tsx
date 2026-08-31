import { useMemo, useState } from 'react'
import { ResumeContext } from './resume-context'
import type { Model } from './resume-data'

export const ResumeProvider = ({ children }: React.BaseProps) => {
  const [model, setModel] = useState<Model>('unified')
  const value = useMemo(() => ({ model, setModel }), [model])

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}
