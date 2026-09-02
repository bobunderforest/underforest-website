import socials from 'app-data/socials.json'
import { ChannelLink } from 'ui/common/cyber-kit/ChannelLink'
import { FieldLabel } from './FieldLabel'

export const SocialLinks = () => (
  <div>
    <FieldLabel>socials</FieldLabel>
    <div className={'channel-link-list flex flex-wrap items-center'}>
      {socials.map((social) => (
        <ChannelLink key={social.href} {...social} />
      ))}
    </div>
  </div>
)
