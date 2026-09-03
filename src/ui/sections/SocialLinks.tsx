import socials from 'app-data/socials.json'
import {
  ChannelLink,
  type ChannelLinkProps,
} from 'ui/common/cyber-kit/ChannelLink'
import { FieldLabel } from './FieldLabel'

const socialLinks = socials as ChannelLinkProps[]

export const SocialLinks = () => (
  <div>
    <FieldLabel>socials</FieldLabel>
    <div
      className={
        'flex max-w-column-width flex-wrap items-center gap-[8px] mobile-m:gap-[6px]'
      }
    >
      {socialLinks.map((social) => (
        <ChannelLink key={social.href} {...social} />
      ))}
    </div>
  </div>
)
