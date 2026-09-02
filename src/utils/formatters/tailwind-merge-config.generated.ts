import type {
  ConfigExtension,
  DefaultClassGroupIds,
  DefaultThemeGroupIds,
} from 'tailwind-merge'

type TwMergeExtend = NonNullable<
  ConfigExtension<DefaultClassGroupIds, DefaultThemeGroupIds>['extend']
>

export const twMergeExtend: TwMergeExtend = {
  theme: {
    breakpoint: ['desktop-m', 'desktop-s', 'tablet-s', 'mobile-m', 'mobile-s'],
  },
  classGroups: {
    'font-size': [
      {
        text: [
          'caption',
          'display',
          'hint',
          'lead',
          'regular',
          'title-1',
          'title-2',
          'title-3',
          'title-4',
        ],
      },
    ],
    leading: [
      {
        leading: [
          'caption',
          'display',
          'hint',
          'lead',
          'regular',
          'title-1',
          'title-2',
          'title-3',
          'title-4',
        ],
      },
    ],
  },
}

export const themeColors = {
  accent: '#ff6a1f',
  background: 'var(--color-base)',
  base: '#000',
  black: '#000',
  edge: 'rgb(83, 76, 76)',
  info: '#4d8dff',
  muted: '#8b8484',
  surface: '#131418',
  system: '#34e39b',
  text: '#fff',
  white: '#fff',
} as const
