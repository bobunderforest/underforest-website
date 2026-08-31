import { useResumeModel } from './resume-context'
import type { Model } from './resume-data'
import { cns } from 'utils/formatters/classnames'

const OPTIONS: { value: Model; label: string }[] = [
  { value: 'web', label: 'web' },
  { value: 'unified', label: 'unified' },
  { value: 'game', label: 'gamedev' },
]

export const ModelSelect = () => {
  const { model, setModel } = useResumeModel()

  return (
    <div
      role={'group'}
      aria-label={'Model select'}
      className={'inline-flex border border-edge font-face-regular text-[13px]'}
    >
      {OPTIONS.map((option) => {
        const active = option.value === model
        return (
          <button
            key={option.value}
            type={'button'}
            aria-pressed={active}
            onClick={() => setModel(option.value)}
            className={cns(
              'cursor-pointer px-[14px] py-[8px] tracking-[0.12em] uppercase transition-colors duration-150',
              'border-r border-edge last:border-r-0',
              active
                ? 'bg-system text-black'
                : 'text-muted hover:text-text',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
