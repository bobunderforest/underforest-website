import { ContourField } from 'ui/common/cyber-kit/ContourField'
import { SectionContent } from 'ui/common/SectionContent'
import { Text } from 'ui/common/typography/Text'
import { HUD_BUILD } from 'ui/features/hud/hud-fields'
import { FieldLabel } from 'ui/sections/FieldLabel'
import { ResumeLinks } from 'ui/sections/ResumeLinks'
import { SocialLinks } from 'ui/sections/SocialLinks'
import { cns } from 'utils/formatters/classnames'

export const Footer = () => (
  <footer className={'relative bg-base'}>
    <div className={'relative overflow-hidden'}>
      <ContourField animate inverted />
      <SectionContent isPadded className={'relative'}>
        <SocialLinks />
        <ResumeLinks className={'mt-[40px]'} />

        <div
          className={cns(
            'mt-[60px] mb-[100px] flex items-baseline justify-between gap-4 border-t border-edge pt-[14px]',
            'mobile-m:flex-col mobile-m:gap-2',
          )}
        >
          <FieldLabel readout={'eof'} gap={'none'}>
            end of stream
          </FieldLabel>
          <Text
            tag={'span'}
            size={'note'}
            face={'title'}
            tone={'dimmed'}
            uppercase
            className={'tabular-nums'}
          >
            {HUD_BUILD}
          </Text>
        </div>
      </SectionContent>
    </div>
  </footer>
)
