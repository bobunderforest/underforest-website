import { useEffect, useEffectEvent, useState, type ReactNode } from 'react'
import { whenPageSettled } from 'utils/browser/idle'

type Props = {
  children: ReactNode
  onSettled?: () => void
}

export const AfterPageSettled = ({ children, onSettled }: Props) => {
  const [hasSettled, setHasSettled] = useState(false)
  const handleSettled = useEffectEvent(() => {
    setHasSettled(true)
    onSettled?.()
  })

  useEffect(() => whenPageSettled(handleSettled), [])

  return hasSettled ? children : null
}
