import { useKeyPress } from 'utils/hooks/useKeyPress'
import { useModalActions } from 'modules/modal/modalStore'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { calcCoverOffset, type CoverOffset } from 'utils/math/calc-cover'
import { cns } from 'utils/formatters/classnames'
import { useTouchDevice } from 'utils/hooks/useTouchDevice'
import type { Swiper as SwiperClass } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import type { ImageModalPaging } from './ImageModalPaging'

const TIME_OPEN = 250
const TIME_CLOSE = 300

type Props = {
  imageUrl: string
  rect: DOMRect
  onOpen: () => void
  onClose: () => void
  paging?: ImageModalPaging
}

type Phase = 'entering' | 'open' | 'exiting'

type Zoom = {
  url: string
  rect: DOMRect
  offset: CoverOffset
  cropped: boolean
}

const loadSize = (url: string): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const img = document.createElement('img')
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.src = url
  })

export const ModalImage = ({
  imageUrl,
  rect,
  onOpen,
  onClose,
  paging,
}: Props) => {
  const isTouchDevice = useTouchDevice()
  const { closeModal } = useModalActions()

  const images = useMemo(() => paging?.all ?? [imageUrl], [paging, imageUrl])
  const startIndex = paging?.position ?? 0

  const swiperRef = useRef<SwiperClass | null>(null)
  const [phase, setPhase] = useState<Phase>('entering')
  const [zoom, setZoom] = useState<Zoom | null>(null)
  const [activeIndex, setActiveIndex] = useState(startIndex)

  const canPrev = activeIndex > 0
  const canNext = activeIndex < images.length - 1

  // Open: zoom-crop from the source rect into the fullscreen
  useEffect(() => {
    let raf = 0
    let timer = 0

    loadSize(images[startIndex]).then(({ width, height }) => {
      const offset = calcCoverOffset(width, height, rect.width, rect.height)
      setZoom({ url: images[startIndex], rect, offset, cropped: true })
      raf = requestAnimationFrame(() => {
        onOpen()
        setZoom((z) => (z ? { ...z, cropped: false } : z))
        timer = window.setTimeout(() => {
          setPhase('open')
          setZoom(null)
        }, TIME_OPEN)
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [])

  // Close: zoom-crop from the fullscreen to source rect
  const handleClose = useCallback(() => {
    if (phase === 'exiting') return

    const targetRect = paging?.activeRect ?? rect
    const el = swiperRef.current?.slides[
      swiperRef.current.activeIndex
    ]?.querySelector('img') as HTMLImageElement | undefined
    const natW = el?.naturalWidth || targetRect.width
    const natH = el?.naturalHeight || targetRect.height
    const offset = calcCoverOffset(
      natW,
      natH,
      targetRect.width,
      targetRect.height,
    )

    setPhase('exiting')
    setZoom({
      url: images[activeIndex],
      rect: targetRect,
      offset,
      cropped: false,
    })
    requestAnimationFrame(() => {
      setZoom((z) => (z ? { ...z, cropped: true } : z))
    })
    window.setTimeout(() => {
      onClose()
      requestAnimationFrame(closeModal)
    }, TIME_CLOSE)
  }, [phase, paging, rect, activeIndex, images, closeModal, onClose])

  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), [])
  const handleNext = useCallback(() => swiperRef.current?.slideNext(), [])

  useKeyPress('Escape', handleClose)
  useKeyPress('ArrowLeft', handlePrev)
  useKeyPress('ArrowRight', handleNext)

  if (phase === 'entering' && !zoom) return null

  return (
    <div className={'fixed top-0 left-0 z-[999] h-full w-full'}>
      {/* Background */}
      <div
        className={cns(
          'absolute top-0 left-0 h-full w-full bg-black transition-opacity duration-200 ease-in-out-sine',
          phase === 'open' ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Carousel */}
      {phase === 'open' && (
        <div
          onClick={handleClose}
          className={'absolute top-0 left-0 h-full w-full cursor-zoom-out'}
        >
          <Swiper
            onSwiper={(s) => (swiperRef.current = s)}
            initialSlide={startIndex}
            allowTouchMove={isTouchDevice}
            slidesPerView={1}
            centeredSlides
            spaceBetween={40}
            resizeObserver
            className={'h-full w-full'}
            onActiveIndexChange={(s) => {
              setActiveIndex(s.activeIndex)
              paging?.setIndex(s.activeIndex)
            }}
          >
            {images.map((url, i) => (
              <SwiperSlide key={i}>
                <img
                  src={url}
                  className={'h-full w-full object-contain'}
                  alt=""
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Zoom-crop overlay for open/close animation */}
      {zoom && (
        <div
          onClick={handleClose}
          className={
            'absolute top-0 left-0 h-full w-full cursor-zoom-out overflow-hidden transition-all duration-250 ease-in-out-sine'
          }
          style={
            zoom.cropped
              ? {
                  top: zoom.rect.y,
                  left: zoom.rect.x,
                  width: zoom.rect.width,
                  height: zoom.rect.height,
                }
              : {}
          }
        >
          <div
            className={
              'absolute top-0 left-0 h-full w-full bg-contain bg-center bg-no-repeat transition-all duration-250 ease-in-out-sine'
            }
            style={
              zoom.cropped
                ? {
                    top: `${(zoom.offset.marginTop / zoom.rect.height) * 100}%`,
                    left: `${(zoom.offset.marginLeft / zoom.rect.width) * 100}%`,
                    width: `${(zoom.offset.width / zoom.rect.width) * 100}%`,
                    height: `${(zoom.offset.height / zoom.rect.height) * 100}%`,
                  }
                : {}
            }
          >
            <img
              src={zoom.url}
              className={'absolute top-0 left-0 h-full w-full object-contain'}
              alt=""
            />
          </div>
        </div>
      )}

      {/* Paging Controls */}
      {paging && !isTouchDevice && phase === 'open' && (
        <>
          <button
            type={'button'}
            aria-label={'Previous image'}
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className={cns(
              'absolute top-0 left-0 z-1 flex h-full w-[15%] cursor-pointer items-center justify-start pl-[40px] text-white transition-opacity mobile-m:pl-[15px]',
              !canPrev && 'pointer-events-none opacity-0',
            )}
          >
            <ArrowIcon direction={'left'} />
          </button>

          <button
            type={'button'}
            aria-label={'Next image'}
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className={cns(
              'absolute top-0 right-0 z-1 flex h-full w-[15%] cursor-pointer items-center justify-end pr-[40px] text-white transition-opacity mobile-m:pr-[15px]',
              !canNext && 'pointer-events-none opacity-0',
            )}
          >
            <ArrowIcon direction={'right'} />
          </button>
        </>
      )}
    </div>
  )
}

const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    width={'44'}
    height={'44'}
    viewBox={'0 0 24 24'}
    fill={'none'}
    stroke={'currentColor'}
    strokeWidth={'1.5'}
    strokeLinecap={'round'}
    strokeLinejoin={'round'}
    className={cns(direction === 'right' && 'rotate-180')}
    aria-hidden={'true'}
  >
    <path d={'M15 18l-6-6 6-6'} />
  </svg>
)
