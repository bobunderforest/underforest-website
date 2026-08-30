import { useModalState } from './modalStore'
import { useScrollLock } from 'utils/hooks/useScrollLock'

export const ModalRenderer = () => {
  const { modalState } = useModalState()
  useScrollLock(!!modalState)
  return (
    <>
      {modalState && modalState.modal && (
        <modalState.modal open {...modalState.props} />
      )}
    </>
  )
}
