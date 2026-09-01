import { cns } from 'utils/formatters/classnames'

const NODE_COUNT = 5

const Clamp = () => (
  <span className={'flex shrink-0 flex-col items-center'}>
    <span className={'h-[6px] w-[2px] bg-edge'} />
    <span className={'h-[2px] w-[28px] bg-edge'} />
    <span className={'h-[10px] w-px bg-transparent'} />
    <span className={'h-[2px] w-[28px] bg-edge'} />
    <span className={'h-[6px] w-[2px] bg-edge'} />
  </span>
)

export const BusDivider = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cns(
      'relative flex h-20 w-full items-center select-none',
      className,
    )}
  >
    <span className={'absolute inset-x-0 h-[2px] bg-edge'} />
    <div
      className={'relative flex w-full items-center justify-between px-[9%]'}
    >
      {Array.from({ length: NODE_COUNT }).map((_, i) => (
        <Clamp key={i} />
      ))}
    </div>
  </div>
)
