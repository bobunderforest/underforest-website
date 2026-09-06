import { cns } from 'utils/formatters/classnames'
import { italicizeBold, typograf } from 'utils/formatters/typography'

export type TextTone =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'system'
  | 'inverse'
  | 'soft'
  | 'dimmed'
  | 'faint'

const TONE_CLASSES: Record<TextTone, string> = {
  primary: 'text-text',
  secondary: 'text-muted',
  accent: 'text-accent',
  system: 'text-system',
  inverse: 'text-base',
  soft: 'text-text/85',
  dimmed: 'text-muted/70',
  faint: 'text-text/60',
}

type Props = React.BaseProps &
  Omit<
    React.HTMLAttributes<HTMLElement>,
    'children' | 'className' | 'style'
  > & {
    tag?:
      | 'div'
      | 'span'
      | 'p'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'ul'
      | 'ol'
      | 'li'
      | 'dl'
      | 'dt'
      | 'dd'
      | 'button'
    ref?: React.Ref<HTMLElement>
    emphasis?: boolean
    size?: 'lead' | 'caption' | 'regular' | 'hint' | 'note' | 'inherit'
    face?: 'regular' | 'title' | 'inherit'
    weight?: 'normal' | 'medium' | 'semibold' | 'bold'
    tone?: TextTone
    uppercase?: boolean
    type?: 'button' | 'submit' | 'reset'
  }

export const Text = ({
  tag = 'div',
  className,
  style,
  children,
  ref,
  emphasis = false,
  size = 'regular',
  face = 'regular',
  weight,
  tone,
  uppercase = false,
  ...props
}: Props) => {
  const Tag = tag as React.ElementType

  const finalClass = cns(
    'text-pretty whitespace-pre-wrap [&_a]:text-accent [&_a]:link-dash',
    face === 'regular' && 'font-face-regular',
    face === 'title' && 'font-face-title',
    weight === 'normal' && 'font-normal',
    weight === 'medium' && 'font-medium',
    weight === 'semibold' && 'font-semibold',
    weight === 'bold' && 'font-bold',
    size === 'caption' && 'text-caption leading-[1.5]',
    size === 'lead' && 'text-lead leading-[1.5]',
    size === 'regular' && 'text-regular leading-[1.6]',
    size === 'hint' && 'text-hint leading-[1.5]',
    size === 'note' && 'text-[11px] leading-none mobile-m:text-[10px]',
    face === 'title' && 'tracking-[0.12em]',
    face === 'regular' && uppercase && 'tracking-[0.12em]',
    uppercase && 'uppercase',
    tone && TONE_CLASSES[tone],
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
    <Tag ref={ref} className={finalClass} style={style} {...props}>
      {children}
    </Tag>
  )
}
