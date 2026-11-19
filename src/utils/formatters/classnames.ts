import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { twMergeConfig } from './tailwind-merge-config.generated'

const twMerge = extendTailwindMerge(twMergeConfig)

export const cns = (...classes: ClassValue[]) => twMerge(clsx(...classes))
