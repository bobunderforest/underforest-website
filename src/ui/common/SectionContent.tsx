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
          'relative mx-auto w-content-width px-content-padding',
          isPadded && 'py-section-padding',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
