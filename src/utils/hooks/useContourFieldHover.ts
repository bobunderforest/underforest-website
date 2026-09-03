import { useState } from 'react'

export const useContourFieldHover = (enabled = true) => {
  const [armed, setArmed] = useState(false)
  const [active, setActive] = useState(false)

  const engage = () => {
    if (!enabled) return
    setArmed(true)
    setActive(true)
  }
  const release = () => setActive(false)

  return { armed, active, engage, release }
}
