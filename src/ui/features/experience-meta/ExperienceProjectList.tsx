import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'
import { PROJECTS } from 'ui/features/projects/projects-data'
import { FieldLabel } from 'ui/sections/FieldLabel'

export const ExperienceProjectList = () => (
  <div>
    <FieldLabel readout={'unbounded'}>pet projects</FieldLabel>
    <Text tag={'ul'} size={'hint'} className={'grid gap-2'}>
      {PROJECTS.map((project) => (
        <li
          key={project.id}
          className={'flex flex-wrap items-baseline gap-x-3 gap-y-1'}
        >
          <Link
            href={project.href}
            isExternal
            className={'text-text link-dash'}
          >
            {project.title} ↗
          </Link>
          <Text
            tag={'span'}
            size={'hint'}
            tone={'secondary'}
            className={'tabular-nums'}
          >
            {project.periodLabel}
          </Text>
          {project.links?.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              isExternal
              className={'text-accent link-dash'}
            >
              {link.label}
            </Link>
          ))}
        </li>
      ))}
    </Text>
  </div>
)
