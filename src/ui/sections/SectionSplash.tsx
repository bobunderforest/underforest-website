import { Section } from './Section'
import { Text } from 'ui/common/typography/Text'
import { ASCIIText } from 'ui/fx/AsciiText'

export const SectionSplash = () => {
  return (
    <Section
      id={'about'}
      index={'00'}
      stage={'Identity'}
      readout={'landmarks 4/4'}
    >
      <div
        className={
          'mb-[50px] flex flex-wrap items-baseline gap-x-3 gap-y-1 font-face-regular text-[16px] tracking-[0.12em] uppercase'
        }
      >
        <span className={'text-text'}>
          Frontend / Full-stack Developer
          <span className={'text-accent'}>
            {' → '}
            Game Developer
          </span>
        </span>
      </div>

      <div className={'relative mt-5'}>
        <h1 className={'sr-only'}>Dmitrii Podlesnyi</h1>
        <ASCIIText
          text={'DMITRII\nPODLESNYI'}
          enableWaves={true}
          asciiFontSize={8}
          textFontSize={400}
          ditherNoiseScale={0.2}
          ditherSpeed={1}
          ditherDotResolution={4}
          waveSpeed={1}
          waveXAmplitude={0.1}
          waveYAmplitude={0.0}
          waveZAmplitude={0.0}
          className={'aspect-[900/350] w-full'}
        />
      </div>
      <Text tag={'p'} className={'mt-8 max-w-[62ch] text-text'}>
        I am a full-stack web developer with 10+ years of experience and a
        strong focus on front-end. I have contributed to building high-traffic
        platforms, Web3 solutions, and interactive 3D projects.
      </Text>
      <Text tag={'p'} className={'mt-4 max-w-[62ch] text-text/85'}>
        I am excited about contributing to creative, challenging, and
        passion-driven projects.
      </Text>
    </Section>
  )
}
