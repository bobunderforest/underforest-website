import { Link } from 'ui/common/typography/Link'
import { PROJECTS } from 'ui/features/experience-data/experience-data'
import { FieldLabel } from 'ui/sections/FieldLabel'

export const ExperienceProjectList = () => (
  <div>
    <FieldLabel readout={'unbounded'}>pet projects</FieldLabel>
    <ul className={'grid gap-2 font-face-regular text-hint'}>
      {PROJECTS.map((project) => (
        <li
          key={project.label}
          className={'flex flex-wrap items-baseline gap-x-3 gap-y-1'}
        >
          <Link
            href={project.href}
            isExternal
            className={'text-text link-dash'}
          >
            {project.label} ↗
          </Link>
          <span className={'text-muted tabular-nums'}>{project.period}</span>
          {project.links.map((link) => (
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
    </ul>
  </div>
)
