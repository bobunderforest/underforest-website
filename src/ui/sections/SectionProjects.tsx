import { Text } from 'ui/common/typography/Text'
import { Section } from './Section'

export const SectionProjects = () => {
  return (
    <Section id={'projects'} index={'03'} stage={'Detection'}>
      <Text tag={'p'} tone={'secondary'} className={'max-w-[62ch]'}>
        Detection-framed project previews land here.
      </Text>
    </Section>
  )
}
