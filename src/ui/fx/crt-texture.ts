type Options = {
  scanline: string
  dot: string
  dotFade: string
  dotSize: number
  dotRadii: [core: number, fade: number, edge: number]
  maskCore: string
  maskFalloff: string
}

export const crtTexture = ({
  scanline,
  dot,
  dotFade,
  dotSize,
  dotRadii: [core, fade, edge],
  maskCore,
  maskFalloff,
}: Options): React.CSSProperties => {
  const mask = `radial-gradient(ellipse at center, black ${maskCore}, rgb(0 0 0 / 0.65) ${maskFalloff}, transparent 100%)`
  return {
    backgroundImage: [
      `repeating-linear-gradient(to bottom, transparent 0, transparent 3px, ${scanline} 4px)`,
      `radial-gradient(circle, ${dot} ${core}px, ${dotFade} ${fade}px, transparent ${edge}px)`,
    ].join(', '),
    backgroundSize: `100% 4px, ${dotSize}px ${dotSize}px`,
    maskImage: mask,
    WebkitMaskImage: mask,
  }
}
