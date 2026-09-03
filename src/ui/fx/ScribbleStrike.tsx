import { cns } from 'utils/formatters/classnames'

export const ScribbleStrike = ({ className, children }: React.BaseProps) => (
  <s className={cns('scribble-strike', className)}>{children}</s>
)
