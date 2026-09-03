import { cns } from 'utils/formatters/classnames'
import { crtTexture } from './crt-texture'

const HOVER_TEXTURE = crtTexture({
  scanline: 'rgb(0 0 0 / 0.35)',
  dot: 'rgb(0 0 0 / 0.55)',
  dotFade: 'rgb(0 0 0 / 0.18)',
  dotSize: 7,
  dotRadii: [0.8, 1.15, 1.5],
  maskCore: '15%',
  maskFalloff: '55%',
})

const MODE_OPACITY = {
  hover: 'opacity-0 group-hover:opacity-40',
  on: 'opacity-40',
  muted: 'opacity-[0.16]',
} as const

export const CrtHoverTexture = ({
  mode = 'hover',
}: {
  mode?: keyof typeof MODE_OPACITY
}) => (
  <span
    aria-hidden
    style={HOVER_TEXTURE}
    className={cns(
      'pointer-events-none absolute inset-0 transition-opacity duration-150',
      MODE_OPACITY[mode],
    )}
  />
)
