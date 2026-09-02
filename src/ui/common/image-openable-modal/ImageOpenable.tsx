import { useCallback, useEffect, useState } from 'react'

import { cns } from 'utils/formatters/classnames'
import { openModal } from 'modules/modal/modalStore'

import { ModalImage } from './ModalImage'
import type { ImageModalPaging } from './ImageModalPaging'

export const ImageOpenable = ({
  src,
  alt = '',
  className,
  paging,
  index = 0,
}: React.BaseProps & {
  src: string
  alt?: string
  paging?: ImageModalPaging
  index?: number
}) => {
  const [modalOpened, setModalOpened] = useState(false)
  const [pagingIndex, setPagingIndex] = useState(index)

  useEffect(() => paging?.subscribe(setPagingIndex), [paging])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      paging?.setIndex(index)
      setPagingIndex(index)

      openModal(ModalImage, {
        imageUrl: src,
        rect,
        paging,
        onOpen: () => setModalOpened(true),
        onClose: () => setModalOpened(false),
      })
    },
    [src, paging, index],
  )

  const isActiveModalSource = modalOpened && (!paging || pagingIndex === index)

  return (
    <img
      alt={alt}
      className={cns(
        'cursor-zoom-in',
        className,
        isActiveModalSource && 'opacity-0',
      )}
      src={src}
      onClick={handleClick}
    />
  )
}
