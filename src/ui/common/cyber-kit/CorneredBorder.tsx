import { cns } from 'utils/formatters/classnames'

export const CorneredBorder = ({ className }: { className?: string }) => {
  const cornerClassName = cns(
    'absolute size-[7px] border-accent',
    className,
  )

  return (
    <>
      <span
        aria-hidden
        className={cns(
          cornerClassName,
          'top-[-1px] left-[-1px] border-t-2 border-l-2',
        )}
      />
      <span
        aria-hidden
        className={cns(
          cornerClassName,
          'top-[-1px] right-[-1px] border-t-2 border-r-2',
        )}
      />
      <span
        aria-hidden
        className={cns(
          cornerClassName,
          'bottom-[-1px] left-[-1px] border-b-2 border-l-2',
        )}
      />
      <span
        aria-hidden
        className={cns(
          cornerClassName,
          'right-[-1px] bottom-[-1px] border-r-2 border-b-2',
        )}
      />
    </>
  )
}
