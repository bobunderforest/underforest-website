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
      <ContourField animate inverted className={'light:mix-blend-multiply'} />
      <SectionContent isPadded className={'relative'}>
        <div className={'flex flex-col gap-intersection-padding'}>
          <SocialLinks />
          <ResumeLinks />
        </div>
      </SectionContent>
    </div>
  </footer>
)
