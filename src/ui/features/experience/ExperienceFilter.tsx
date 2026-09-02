import { useState } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { useExperienceDomainFilter } from 'ui/features/experience-data/experience-data-context'
import type { ExperienceDomainFilter } from 'ui/features/experience-data/types'
import { cns } from 'utils/formatters/classnames'
import { Text } from 'ui/common/typography/Text'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { motionEase } from 'utils/anim/motion-ease'

const OPTIONS: {
  value: ExperienceDomainFilter
  label: string
  index: string
}[] = [
  { value: 'web', label: 'web', index: '01' },
  { value: 'unified', label: 'unified', index: '02' },
  { value: 'game', label: 'gamedev', index: '03' },
]

type Props = {
  className?: string
}

const FilterLockPlate = ({ reclassifying }: { reclassifying: boolean }) => (
  <motion.span
    aria-hidden
    layoutId={'experience-filter-lock'}
    transition={{ duration: 0.32, ease: motionEase.travel }}
    className={'absolute inset-0 -z-10 overflow-hidden bg-system'}
  >
    {reclassifying && (
      <motion.span
        key={'reclassification-scan'}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 0] }}
        transition={{ duration: 0.38, ease: motionEase.travel }}
        className={'absolute inset-0 origin-left bg-accent'}
      />
    )}
    <span
      className={
        'absolute top-0 left-0 size-[6px] border-t border-l border-accent'
      }
    />
    <span
      className={
        'absolute top-0 right-0 size-[6px] border-t border-r border-accent'
      }
    />
    <span
      className={
        'absolute bottom-0 left-0 size-[6px] border-b border-l border-accent'
      }
    />
    <span
      className={
        'absolute right-0 bottom-0 size-[6px] border-r border-b border-accent'
      }
    />
  </motion.span>
)

export const ExperienceFilter = ({ className }: Props) => {
  const { domainFilter, setDomainFilter } = useExperienceDomainFilter()
  const [reclassifying, setReclassifying] = useState(false)

  return (
    <LayoutGroup id={'experience-domain-filter'}>
      <Text
        uppercase
        role={'group'}
        aria-label={'Experience domain filter'}
        className={cns('relative inline-flex border border-edge', className)}
      >
        <DataCaptureBorder diagonal offset={5} size={9} />
        {OPTIONS.map((option) => {
          const active = option.value === domainFilter
          const selectOption = () => {
            if (active) return
            setReclassifying(true)
            setDomainFilter(option.value)
          }

          return (
            <button
              key={option.value}
              type={'button'}
              aria-pressed={active}
              onClick={selectOption}
              className={cns(
                'relative isolate cursor-pointer overflow-hidden px-[25px] py-[10px] uppercase',
                'border-r border-edge last:border-r-0',
                'transition-colors duration-150',
                active ? 'text-black' : 'text-muted hover:text-text',
              )}
            >
              {active && <FilterLockPlate reclassifying={reclassifying} />}
              <span
                aria-hidden
                className={cns(
                  'absolute top-[3px] left-[5px] text-[7px] leading-none tracking-normal',
                  active ? 'text-black/55' : 'text-muted/60',
                )}
              >
                {option.index}
              </span>
              <span className={'relative'}>{option.label}</span>
            </button>
          )
        })}
      </Text>
    </LayoutGroup>
  )
}
