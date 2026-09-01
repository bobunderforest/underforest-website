import { Link } from 'ui/common/typography/Link'
import { SOCIALS } from 'ui/features/experience-data/experience-data'
import { FieldLabel } from 'ui/sections/FieldLabel'

export const ExperienceChannels = () => (
  <div>
    <FieldLabel>channels</FieldLabel>
    <div
      className={
        'mt-2 flex flex-wrap gap-x-5 gap-y-2 font-face-regular text-[12px] tracking-[0.08em]'
      }
    >
      {SOCIALS.map((social) => (
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
