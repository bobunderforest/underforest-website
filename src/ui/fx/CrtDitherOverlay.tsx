import { cns } from 'utils/formatters/classnames'
import { crtTexture } from './crt-texture'

const DITHER_TEXTURE = crtTexture({
  scanline: 'rgb(52 227 155 / 0.16)',
  dot: 'rgb(52 227 155 / 0.48)',
  dotFade: 'rgb(52 227 155 / 0.14)',
  dotSize: 8,
  dotRadii: [0.95, 1.35, 1.75],
  maskCore: '12%',
  maskFalloff: '48%',
})

export const CrtDitherOverlay = ({
  className = 'top-0',
}: {
  className?: string
}) => (
  <div
    aria-hidden
    className={cns(
      'pointer-events-none absolute right-0 bottom-0 left-0 z-0 overflow-hidden',
      className,
    )}
  >
    <div className={'absolute inset-0 opacity-28'} style={DITHER_TEXTURE} />
    <div
      className={
        'absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-system)_4%,transparent)_0%,transparent_76%)]'
      }
    />
  </div>
)
