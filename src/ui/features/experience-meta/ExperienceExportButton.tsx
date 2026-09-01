import { Text } from 'ui/common/typography/Text'

export const ExperienceExportButton = () => (
  <Text
    tag={'button'}
    type={'button'}
    tone={'accent'}
    uppercase
    className={
      'inline-flex w-max items-center gap-[10px] border border-accent px-[18px] py-[12px] transition-colors duration-150 hover:bg-accent hover:text-black'
    }
  >
    <span aria-hidden>▤</span>
    Export dossier — strip aesthetic layer for HR / ML filter
  </Text>
)
