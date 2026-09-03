import { SignalBorder } from 'ui/fx/SignalBorder'
import { cns } from 'utils/formatters/classnames'

type Props = React.BaseProps & {
  id: string
  stage: string
  hideSignal?: boolean
  withEdge?: boolean
}

export const SectionShell = ({
  id,
  stage,
  hideSignal,
  withEdge,
  className,
  children,
}: Props) => (
  <section
    id={id}
    data-stage={stage}
    className={cns('relative', withEdge && 'border-b border-edge', className)}
  >
    {!hideSignal && <SignalBorder className={'z-20'} />}
    {children}
  </section>
)
