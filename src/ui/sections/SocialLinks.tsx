import socials from 'app-data/socials.json'
import { Link } from 'ui/common/typography/Link'
import { FieldLabel } from './FieldLabel'

export const SocialLinks = () => (
  <div>
    <FieldLabel>channels</FieldLabel>
    <div
      className={
        'flex flex-wrap gap-x-5 gap-y-2 font-face-regular text-[12px] tracking-[0.08em]'
      }
    >
      {socials.map((social) => (
        <Link
          key={social.label}
          href={social.href}
          isExternal
          className={'text-accent before:text-muted before:content-["›_"]'}
        >
          {social.label}
        </Link>
      ))}
    </div>
  </div>
)
