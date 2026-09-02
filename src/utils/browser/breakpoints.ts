export const breakpointMaxWidths = {
  'desktop-m': 1580,
  'desktop-s': 1420,
  'tablet-s': 1260,
  'mobile-m': 940,
  'mobile-s': 420,
} as const

export type BreakpointName = keyof typeof breakpointMaxWidths

const breakpointsLargestFirst = (
  Object.keys(breakpointMaxWidths) as BreakpointName[]
).sort((a, b) => breakpointMaxWidths[b] - breakpointMaxWidths[a])

export type ResponsiveValue<T> = { desktop: T } & Partial<
  Record<BreakpointName, T>
>

export const resolveResponsiveValue = <T>(
  config: ResponsiveValue<T>,
  viewportWidth: number,
) => {
  let value = config.desktop
  for (const name of breakpointsLargestFirst) {
    const override = config[name]
    if (override !== undefined && viewportWidth <= breakpointMaxWidths[name])
      value = override
  }
  return value
}
