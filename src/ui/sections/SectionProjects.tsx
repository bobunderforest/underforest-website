import { Text } from 'ui/common/typography/Text'
import { Section } from './Section'

export const SectionProjects = () => {
  return (
    <Section
      id={'projects'}
      index={'03'}
      stage={'Detection'}
      readout={'4 candidates · NMS → 3'}
    >
      <Text tag={'p'} className={'max-w-[62ch] text-muted'}>
        Detection-framed project previews land here.
      </Text>
    </Section>
  )
}
