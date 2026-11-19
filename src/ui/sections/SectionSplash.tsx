import { Section } from './Section'
import { Text, type TextTone } from 'ui/common/typography/Text'
import { ASCIIText } from 'ui/fx/AsciiText'
import { SocialLinks } from './SocialLinks'
import { ResumeLinks } from './ResumeLinks'
import { FieldLabelHeading } from './FieldLabel'
import type { ResponsiveValue } from 'utils/browser/breakpoints'
import { useResponsiveValue } from 'utils/hooks/useResponsiveValue'
import { CrtDitherOverlay } from 'ui/fx/CrtDitherOverlay'
import splash from 'app-data/splash.json'

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
    <Section id={'about'} stage={'Identity'} decoration={<CrtDitherOverlay />}>
      <FieldLabelHeading className={'mb-intersection-padding'}>
        {splash.role}
      </FieldLabelHeading>

      <div className={'relative mb-intersection-padding'}>
        <h1 className={'sr-only'}>{splash.nameLabel}</h1>
        <ASCIIText
          text={splash.name}
          enableWaves
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
            'aspect-[900/320] w-full light:invert desktop-m:aspect-[900/280] mobile-m:aspect-[9/4] mobile-s:aspect-[2/1]'
          }
        />
      </div>
      <div
        className={
          'mb-intersection-padding flex flex-col gap-intersection-padding'
        }
      >
        <SocialLinks />
        <ResumeLinks />
        <div>
          <FieldLabelHeading muted>{splash.aboutLabel}</FieldLabelHeading>
          {splash.about.map((paragraph, index) => (
            <Text
              key={index}
              tag={'p'}
              tone={paragraph.tone as TextTone}
              className={
                index < splash.about.length - 1
                  ? 'mb-4 max-w-prose-measure'
                  : 'max-w-prose-measure'
              }
            >
              {paragraph.text}
            </Text>
          ))}
        </div>
      </div>
    </Section>
  )
}
