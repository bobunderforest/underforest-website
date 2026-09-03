import { cns } from 'utils/formatters/classnames'

type Props = React.BaseProps & {
  id: string
  stage: string
  withEdge?: boolean
}

export const SectionShell = ({
  id,
  stage,
  withEdge,
  className,
  children,
}: Props) => (
  <section
    id={id}
    data-stage={stage}
    className={cns('relative', withEdge && 'border-b border-edge', className)}
  >
    {children}
  </section>
)
