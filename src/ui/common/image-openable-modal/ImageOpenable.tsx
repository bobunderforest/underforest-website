import { useCallback, useState } from 'react'

import { cns } from 'utils/formatters/classnames'
import { openModal } from 'modules/modal/modalStore'

import { ModalImage } from './ModalImage'
import type { ImageModalPaging } from './ImageModalPaging'

export const ImageOpenable = ({
  src,
  className,
  paging,
  index = 0,
}: React.BaseProps & {
  src: string
  paging?: ImageModalPaging
  index?: number
}) => {
  const [isOpened, setOpened] = useState(false)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      paging?.setIndex(index)

      openModal(ModalImage, {
        imageUrl: src,
        rect,
        paging,
        onOpen: () => setOpened(true),
        onClose: () => setOpened(false),
      })
    },
    [src, paging, index],
  )

  return (
    <img
      alt=""
      className={cns('cursor-zoom-in', className, isOpened && 'opacity-0')}
      src={src}
      onClick={handleClick}
    />
  )
}
