import socials from 'app-data/socials.json'
import { ChannelLink } from 'ui/common/cyber-kit/ChannelLink'
import { FieldLabel } from './FieldLabel'

export const SocialLinks = () => (
  <div>
    <FieldLabel>socials</FieldLabel>
    <div className={'flex flex-wrap items-center gap-2'}>
      {socials.map((social) => (
        <ChannelLink key={social.href} {...social} />
      ))}
    </div>
  </div>
)
