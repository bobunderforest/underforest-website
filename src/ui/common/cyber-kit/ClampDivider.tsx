import { cns } from 'utils/formatters/classnames'

const NODE_COUNT = 5

const Clamp = () => (
  <span className={'flex shrink-0 flex-col items-center'}>
    <span className={'h-[6px] w-[2px] bg-edge'} />
    <span className={'h-[2px] w-[28px] bg-edge'} />
    <span className={'h-[10px] w-px'} />
    <span className={'h-[2px] w-[28px] bg-edge'} />
    <span className={'h-[6px] w-[2px] bg-edge'} />
  </span>
)

export const ClampDivider = ({ className }: { className?: string }) => (
  <div aria-hidden className={cns('relative h-0 select-none', className)}>
    <span
      className={'absolute inset-x-0 top-0 h-[2px] -translate-y-1/2 bg-edge'}
    />
    <div
      className={
        'relative mx-auto flex w-content-width -translate-y-1/2 items-center justify-between px-content-padding'
      }
    >
      {Array.from({ length: NODE_COUNT }).map((_, i) => (
        <Clamp key={i} />
      ))}
    </div>
  </div>
)
