import type { RefObject } from 'react'

type Props = React.ElementProps<
  'a',
  {
    isExternal?: boolean
    elRef?: RefObject<HTMLAnchorElement>
  }
>

export const Link = ({
  isExternal,
  elRef,
  href,
  target,
  rel,
  ...props
}: Props) => {
  if (isExternal) {
    return (
      <a
        ref={elRef}
        href={href}
        target={target || '_blank'}
        rel={rel || 'noopener noreferrer'}
        {...props}
      />
    )
  }
  return <a href={href} ref={elRef} target={target} rel={rel} {...props} />
}
