const ROMAN_UNITS: readonly [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

export const padCount = (index: number): string =>
  String(index + 1).padStart(2, '0')

export const padIndex = (index: number): string => String(index).padStart(2, '0')

export const toRoman = (value: number): string => {
  let remaining = value
  let result = ''
  for (const [unit, symbol] of ROMAN_UNITS) {
    while (remaining >= unit) {
      result += symbol
      remaining -= unit
    }
  }
  return result
}
