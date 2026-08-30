import { clamp } from './clamp'
import { normalize } from './normalize'

export const narrow = (value: number, start: number, end: number) =>
  clamp(normalize(value, start, end), 0, 1)
