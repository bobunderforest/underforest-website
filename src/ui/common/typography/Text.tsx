import { cns } from 'utils/formatters/classnames'
import { italicizeBold, typograf } from 'utils/formatters/typography'

type Props = React.BaseProps & {
  tag?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  ref?: React.Ref<HTMLElement>
  emphasis?: boolean
}

export const Text = ({
  tag = 'div',
  className,
  style,
  children,
  ref,
  emphasis = false,
  ...props
}: Props) => {
  const Tag = tag as React.ElementType

  const finalClass = cns(
    'whitespace-pre-wrap text-pretty [&_a]:text-chroma',
    className,
  )

  if (typeof children === 'string') {
    const emphasizedChildren = emphasis ? italicizeBold(children) : children

    return (
      <Tag
        ref={ref}
        {...props}
        className={finalClass}
        style={style}
        dangerouslySetInnerHTML={{
          __html: typograf(emphasizedChildren),
        }}
      />
    )
  }

  return (
    <Tag ref={ref} className={finalClass} style={style}>
      {children}
    </Tag>
  )
}
