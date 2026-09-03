import { ContourField } from 'ui/common/cyber-kit/ContourField'
import type { ContourFieldPalette } from 'ui/common/cyber-kit/ContourField'
import type { CaptureHover } from 'utils/hooks/useCaptureHover'
import { cns } from 'utils/formatters/classnames'

export const ContourHoverField = ({
  hover,
  palette,
  className,
}: {
  hover: Pick<CaptureHover, 'armed' | 'active'>
  palette: ContourFieldPalette
  className?: string
}) =>
  hover.armed ? (
    <ContourField
      animate={hover.active}
      palette={palette}
      className={cns(
        'transition-opacity duration-300',
        hover.active ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  ) : null
