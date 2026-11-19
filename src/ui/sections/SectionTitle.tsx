import { TextTitle } from 'ui/common/typography/TextTitle'

type Props = {
  kicker: string
  children: string
}

export const SectionTitle = ({ kicker, children }: Props) => (
  <header className={'mb-intersection-padding'}>
    <TextTitle
      tag={'span'}
      size={4}
      uppercase
      className={'mb-5 leading-[0.85] tracking-[0.04em]'}
    >
      {kicker}
    </TextTitle>
    <TextTitle
      tag={'h2'}
      size={1}
      uppercase
      className={
        'relative left-[-0.05em] leading-[0.85] font-bold tracking-[0.02em]'
      }
    >
      {children}
    </TextTitle>
  </header>
)
