import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { twMergeExtend } from './tailwind-merge-config.generated'

const twMerge = extendTailwindMerge({ extend: twMergeExtend })

export const cns = (...classes: ClassValue[]) => twMerge(clsx(...classes))
