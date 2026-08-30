import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { useMemo } from 'react'

/**
 * Tyoes
 */
type EmptyObj = Record<string, never>

export type ModalProps<P extends object = EmptyObj> = P

export type ModalComponentType<P extends object = EmptyObj> = React.FC<
  ModalProps<P>
>

/**
 * Store
 */
export const modalStore = atom<{
  modal: ModalComponentType<any>
  props: object
} | null>(null)

/**
 * Actions
 */
export const openModal = <P extends object>(
  modal: ModalComponentType<P>,
  props: P,
) => {
  modalStore.set({ modal, props })
}

export const closeModal = () => {
  modalStore.set(null)
}

/**
 * Hooks
 */
export const useModalActions = () => {
  return useMemo(() => ({ openModal, closeModal }), [])
}

export const useModalState = () => {
  const modalState = useStore(modalStore)

  return useMemo(
    () => ({
      modalState,
      openModal,
      closeModal,
    }),
    [modalState],
  )
}
