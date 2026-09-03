import { useState } from 'react'
import { useContourFieldHover } from './useContourFieldHover'

export const useCaptureHover = ({ field = true, disabled = false } = {}) => {
  const hoverField = useContourFieldHover(field && !disabled)
  const [blinkKey, setBlinkKey] = useState(0)

  const engage = () => {
    if (disabled) return
    setBlinkKey((key) => key + 1)
    hoverField.engage()
  }

  return {
    armed: hoverField.armed,
    active: hoverField.active,
    blinkKey,
    engage,
    release: hoverField.release,
    handlers: {
      onMouseEnter: engage,
      onFocus: engage,
      onMouseLeave: hoverField.release,
      onBlur: hoverField.release,
    },
  }
}

export type CaptureHover = ReturnType<typeof useCaptureHover>
