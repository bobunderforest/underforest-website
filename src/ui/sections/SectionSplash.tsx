import { Section } from './Section'
import { Text } from 'ui/common/typography/Text'
import { ASCIIText } from 'ui/fx/AsciiText'
import { SocialLinks } from './SocialLinks'
import { FieldLabel } from './FieldLabel'
import type { ResponsiveValue } from 'utils/browser/breakpoints'
import { useResponsiveValue } from 'utils/hooks/useResponsiveValue'

const splashAsciiFontSize: ResponsiveValue<number> = {
  desktop: 8,
  'desktop-m': 7,
  'tablet-s': 6,
  'mobile-m': 5,
  'mobile-s': 4,
}

export const SectionSplash = () => {
  const asciiFontSize = useResponsiveValue(splashAsciiFontSize)

  return (
    <Section hideBorder id={'about'} index={'00'} stage={'Identity'}>
      <Text
        uppercase
        className={'mb-[50px] flex flex-wrap items-baseline gap-x-3 gap-y-1'}
      >
        <Text tag={'span'} tone={'primary'}>
          Frontend Developer
          <Text tag={'span'} tone={'accent'}>
            {' → '}
            Game Developer
          </Text>
        </Text>
      </Text>

      <div className={'relative mb-8'}>
        <h1 className={'sr-only'}>Dmitrii Podlesnyi</h1>
        <ASCIIText
          text={'DMITRII\nPODLESNYI'}
          enableWaves={true}
          asciiFontSize={asciiFontSize}
          textFontSize={400}
          ditherNoiseScale={0.15}
          ditherSpeed={2}
          ditherDotResolution={6}
          waveSpeed={1}
          waveXAmplitude={0.1}
          waveYAmplitude={0.0}
          waveZAmplitude={0.0}
          className={
            'aspect-[900/320] w-full desktop-m:aspect-[900/280] mobile-m:aspect-[9/4] mobile-s:aspect-[2/1]'
          }
        />
      </div>
      <div className={'mb-10'}>
        <SocialLinks />
      </div>
      <FieldLabel>about me</FieldLabel>
      <Text tag={'p'} tone={'primary'} className={'mb-4 max-w-[62ch]'}>
        I am a full-stack web developer with 10+ years of experience and a
        strong focus on front-end. I have contributed to building high-traffic
        platforms, Web3 solutions, and interactive 3D projects.
      </Text>
      <Text tag={'p'} tone={'soft'} className={'mb-4 max-w-[62ch]'}>
        I am excited about contributing to creative, challenging, and
        passion-driven projects.
      </Text>
      <Text tag={'p'} tone={'soft'} className={'mb-12 max-w-[62ch]'}>
        TODO: Write about game dev switch
        <br />
        TODO: Write about teamwork and collaboration processes experience
        <br />
        TODO: Write about scroll animations
        <br />
        TODO: Write about AI
      </Text>
    </Section>
  )
}
