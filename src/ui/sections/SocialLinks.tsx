import socials from 'app-data/socials.json'
import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { FieldLabel } from './FieldLabel'

export const SocialLinks = () => (
  <div>
    <FieldLabel>channels</FieldLabel>
    <Text className={'flex flex-wrap gap-x-5 gap-y-2'}>
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
    </Text>
  </div>
)
