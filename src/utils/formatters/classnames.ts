import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// https://github.com/dcastil/tailwind-merge/blob/v2.5.4/src/lib/default-config.ts
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      breakpoint: [
        'intro-special',
        'desktop-m',
        'desktop-s',
        'tablet-m',
        'tablet-s',
        'mobile-m',
        'mobile-s',
      ],
    },
    classGroups: {
      'font-size': [
        {
          text: [
            'regular',
            'control',
            'hint',
            'lead',
            'display',
            'title-1',
            'title-2',
            'title-3',
            'title-4',
            'title-5',
          ],
        },
      ],
      leading: [
        {
          leading: [
            'regular',
            'control',
            'hint',
            'lead',
            'display',
            'title-1',
            'title-2',
            'title-3',
            'title-4',
            'title-5',
          ],
        },
      ],
    },
  },
})

export const cns = (...classes: ClassValue[]) => twMerge(clsx(...classes))
