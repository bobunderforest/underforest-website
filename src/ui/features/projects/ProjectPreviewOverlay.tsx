const DOT_PATTERN_STYLE = {
  backgroundImage:
    'radial-gradient(var(--color-muted) 0.6px, transparent 0.9px)',
  backgroundSize: '5px 5px',
  maskImage: 'linear-gradient(to top, black, transparent)',
}

export const ProjectPreviewOverlay = () => (
  <div data-theme={'dark'} className={'pointer-events-none absolute inset-0'}>
    <div
      className={`
        pointer-events-none absolute inset-0 bg-gradient-to-t from-base/50
        via-base/10 to-base/0 transition-colors duration-200
      `}
    />
    <div
      className={`
        pointer-events-none absolute inset-0
        bg-[radial-gradient(circle_at_85%_12%,transparent_0,rgba(0,0,0,0.2)_100%)]
      `}
    />
    <div
      style={DOT_PATTERN_STYLE}
      className={
        'pointer-events-none absolute inset-x-0 bottom-0 h-1/3 opacity-65'
      }
    />
  </div>
)
