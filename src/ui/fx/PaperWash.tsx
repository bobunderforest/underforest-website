import { cns } from 'utils/formatters/classnames'

export const PaperWash = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cns(
      'pointer-events-none absolute inset-0 bg-base opacity-0 transition-opacity duration-500',
      'light:opacity-15 light:group-focus-within:opacity-0 light:group-hover:opacity-0',
      className,
    )}
  />
)
