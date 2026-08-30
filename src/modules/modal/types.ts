type EmptyObj = Record<string, never>

export type ModalProps<P extends object = EmptyObj> = P

export type ModalComponentType<P extends object = EmptyObj> = React.FC<
  ModalProps<P>
>

export type ModalState = {
  openModal: <P extends object>(
    modal: ModalComponentType<P>,
    props: P,
  ) => {
    modalSession: string
    updateProps: (nextProps: P) => void
    closeModal: () => void
  }
  closeModal: <P extends object>(modal?: ModalComponentType<P>) => void
}
