import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prettier from 'prettier'
import { __unstable__loadDesignSystem } from 'tailwindcss'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ENTRY = path.join(ROOT, 'src/styles/global.css')
const BREAKPOINTS = path.join(ROOT, 'src/styles/tailwind-breakpoints.css')
const TW_MERGE_TARGET = path.join(
  ROOT,
  'src/utils/formatters/tailwind-merge-config.generated.ts',
)
const BREAKPOINTS_TARGET = path.join(ROOT, 'src/utils/browser/breakpoints.ts')

export const stylesDir = path.join(ROOT, 'src/styles')

const loadStylesheet = async (id, base) => {
  const file =
    id === 'tailwindcss'
      ? path.join(ROOT, 'node_modules/tailwindcss/index.css')
      : path.resolve(base, id)
  return {
    path: file,
    base: path.dirname(file),
    content: await fs.readFile(file, 'utf8'),
  }
}

const readThemeNamespace = (design, namespace) =>
  [...design.theme.entries()]
    .map(([key]) => key)
    .filter((key) => key.startsWith(namespace))
    .map((key) => key.slice(namespace.length))
    .filter((name) => !name.startsWith('shadow-'))
    .sort()

const readThemeValues = (design, namespace) =>
  Object.fromEntries(
    readThemeNamespace(design, namespace).map((name) => [
      name,
      design.theme.get([`${namespace}${name}`]),
    ]),
  )

const readCustomVariants = async () =>
  [
    ...(await fs.readFile(BREAKPOINTS, 'utf8')).matchAll(
      /^@custom-variant\s+([a-z0-9-]+)/gm,
    ),
  ].map(([, name]) => name)

const serialize = (value) => JSON.stringify(value, null, 2)

const loadDesign = async () =>
  __unstable__loadDesignSystem(await fs.readFile(ENTRY, 'utf8'), {
    base: stylesDir,
    loadStylesheet,
    loadModule: async () => ({ module: {}, base: ROOT }),
  })

const readBreakpointMaxWidths = (design, names) =>
  Object.fromEntries(
    names.map((name) => {
      const value = design.theme.get([`--bp-${name}`])
      const match = /^(\d+(?:\.\d+)?)px$/.exec(value)
      if (!match) throw new Error(`--bp-${name} must be a px value`)
      return [name, Number(match[1])]
    }),
  )

const buildSources = async () => {
  const design = await loadDesign()

  const breakpoints = await readCustomVariants()
  const breakpointMaxWidths = readBreakpointMaxWidths(design, breakpoints)
  const themeColors = readThemeValues(design, '--color-')
  const fontSizes = readThemeNamespace(design, '--text-')
  const leadings = readThemeNamespace(design, '--leading-')

  const classGroups = {
    ...(fontSizes.length && { 'font-size': [{ text: fontSizes }] }),
    ...(leadings.length && { leading: [{ leading: leadings }] }),
  }

  const twMerge = `import type { ConfigExtension, DefaultClassGroupIds, DefaultThemeGroupIds } from 'tailwind-merge'

type TwMergeExtend = NonNullable<
  ConfigExtension<DefaultClassGroupIds, DefaultThemeGroupIds>['extend']
>

export const twMergeExtend: TwMergeExtend = {
  theme: {
    breakpoint: ${serialize(breakpoints).replace(/\n/g, '\n    ')},
  },
  classGroups: ${serialize(classGroups).replace(/\n/g, '\n  ')},
}

export const themeColors = ${serialize(themeColors)} as const
`

  const responsiveBreakpoints = `export const breakpointMaxWidths = ${serialize(breakpointMaxWidths)} as const

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
`

  return { twMerge, responsiveBreakpoints }
}

const generate = async () => {
  const sources = await buildSources()
  return Promise.all(
    [
      [TW_MERGE_TARGET, sources.twMerge],
      [BREAKPOINTS_TARGET, sources.responsiveBreakpoints],
    ].map(async ([target, source]) => [
      target,
      await prettier.format(source, {
        ...(await prettier.resolveConfig(target)),
        filepath: target,
      }),
    ]),
  )
}

const compareTargets = async () => {
  const generated = await generate()
  return Promise.all(
    generated.map(async ([target, source]) => ({
      target,
      source,
      label: path.relative(ROOT, target),
      current: await fs.readFile(target, 'utf8').catch(() => null),
    })),
  )
}

export const writeTwMergeConfig = async () => {
  const compared = await compareTargets()
  const stale = compared.filter(({ current, source }) => current !== source)
  await Promise.all(
    stale.map(({ target, source }) => fs.writeFile(target, source)),
  )
  return { changed: stale.map(({ label }) => label) }
}

export const checkTwMergeConfig = async () =>
  compareTargets()
    .then((compared) =>
      compared.filter(({ current, source }) => current !== source),
    )
    .then((invalid) =>
      invalid.map(({ label, current }) => ({
        label,
        status: current === null ? 'missing' : 'stale',
      })),
    )

export const targetLabels = [TW_MERGE_TARGET, BREAKPOINTS_TARGET].map(
  (target) => path.relative(ROOT, target),
)

const runAsCli = async () => {
  if (process.argv.includes('--check')) {
    const invalid = await checkTwMergeConfig()
    if (!invalid.length) {
      console.log(`${targetLabels.join(', ')} are up to date`)
      return
    }
    console.error(
      `${invalid.map(({ label, status }) => `${label} is ${status}`).join(', ')} — run \`pnpm gen:tw-merge\``,
    )
    process.exitCode = 1
    return
  }

  const { changed } = await writeTwMergeConfig()
  console.log(
    changed.length
      ? `wrote ${changed.join(', ')}`
      : `${targetLabels.join(', ')} unchanged`,
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await runAsCli()
