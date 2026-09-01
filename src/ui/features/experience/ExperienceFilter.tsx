import { useExperienceDomainFilter } from 'ui/features/experience-data/experience-data-context'
import type { ExperienceDomainFilter } from 'ui/features/experience-data/types'
import { cns } from 'utils/formatters/classnames'
import { Text } from 'ui/common/typography/Text'

const OPTIONS: { value: ExperienceDomainFilter; label: string }[] = [
  { value: 'web', label: 'web' },
  { value: 'unified', label: 'unified' },
  { value: 'game', label: 'gamedev' },
]

type Props = {
  className?: string
}

export const ExperienceFilter = ({ className }: Props) => {
  const { domainFilter, setDomainFilter } = useExperienceDomainFilter()

  return (
    <Text
      uppercase
      role={'group'}
      aria-label={'Experience domain filter'}
      className={cns('inline-flex border border-edge', className)}
    >
      {OPTIONS.map((option) => {
        const active = option.value === domainFilter
        return (
          <button
            key={option.value}
            type={'button'}
            aria-pressed={active}
            onClick={() => setDomainFilter(option.value)}
            className={cns(
              'cursor-pointer px-[14px] py-[8px] transition-colors duration-150',
              'border-r border-edge last:border-r-0',
              active ? 'bg-system text-black' : 'text-muted hover:text-text',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </Text>
  )
}
