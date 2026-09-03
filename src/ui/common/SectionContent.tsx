import { cns } from 'utils/formatters/classnames'

type Props = React.BaseProps & {
  id?: string
  isPadded?: boolean
  classNameWrap?: string
}

export const SectionContent = ({
  id,
  isPadded,
  className,
  classNameWrap,
  children,
}: Props) => {
  return (
    <div id={id} className={cns('w-full', classNameWrap)}>
      <div
        className={cns(
          'relative px-content-padding',
          'mx-auto w-content-width',
          isPadded && 'py-section-padding',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
