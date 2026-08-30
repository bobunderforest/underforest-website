namespace React {
  export type BaseProps = React.PropsWithChildren & {
    className?: string
    style?: React.CSSProperties
  }

  export type RefProps<T = HTMLDivElement> = BaseProps & {
    ref?: React.RefObject<T>
  }

  export type ExtendableProps<
    ExtendedProps = {},
    OverrideProps = {},
  > = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>

  export type ElementProps<
    T extends React.ElementType,
    Props = {},
  > = ExtendableProps<React.ComponentPropsWithRef<T>, Props>
}
