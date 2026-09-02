import { useId, useMemo } from 'react'

import { ImageModalPaging } from 'ui/common/image-openable-modal/ImageModalPaging'
import { MediaPreview } from 'ui/common/cyber-kit/MediaPreview'

type GalleryItem = {
  src: string
  alt?: string
}

export const ProjectStoryGallery = ({ items }: { items: GalleryItem[] }) => {
  const galleryId = useId()
  const paging = useMemo(
    () =>
      new ImageModalPaging(
        items.map((item) => item.src),
        {
          rectResolver: (index) => {
            const item = document.querySelector(
              `[data-gallery-id="${galleryId}"][data-gallery-index="${index}"]`,
            )
            return item?.getBoundingClientRect() ?? null
          },
        },
      ),
    [galleryId, items],
  )

  return (
    <div className={'grid grid-cols-4 gap-2 mobile-m:grid-cols-2'}>
      {items.map((item, index) => (
        <div
          key={item.src}
          data-gallery-id={galleryId}
          data-gallery-index={index}
        >
          <MediaPreview
            kind={'image'}
            src={item.src}
            alt={item.alt}
            paging={paging}
            index={index}
          />
        </div>
      ))}
    </div>
  )
}
