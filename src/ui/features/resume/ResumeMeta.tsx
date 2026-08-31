import { Link } from 'ui/common/typography/Link'
import { FieldLabel } from 'ui/sections/FieldLabel'
import {
  LANGUAGES,
  EDUCATION,
  PROJECTS,
  SOCIALS,
  type MetaLine,
} from './resume-data'

const LanguageList = ({ lines }: { lines: MetaLine[] }) => (
  <div>
    <FieldLabel>languages</FieldLabel>
    <dl className={'mt-2 grid gap-1 font-face-regular text-[13px]'}>
      {lines.map((line) => (
        <div key={line.term} className={'flex justify-between gap-4'}>
          <dt className={'text-text'}>{line.term}</dt>
          <dd className={'text-muted tabular-nums'}>{line.value}</dd>
        </div>
      ))}
    </dl>
  </div>
)

const EducationList = () => (
  <div>
    <FieldLabel>education</FieldLabel>
    <ul className={'mt-2 grid gap-3 font-face-regular text-[13px]'}>
      {EDUCATION.map((entry) => (
        <li key={entry.degree}>
          <div className={'flex justify-between gap-4'}>
            <span className={'text-text'}>{entry.degree}</span>
            <span className={'text-muted tabular-nums'}>
              {entry.from} — {entry.to}
            </span>
          </div>
          <div className={'text-muted'}>
            {entry.field} · {entry.place}, {entry.location}
          </div>
        </li>
      ))}
    </ul>
  </div>
)

const ProjectList = () => (
  <div>
    <FieldLabel readout={'unbounded'}>pet projects</FieldLabel>
    <ul className={'mt-2 grid gap-2 font-face-regular text-[13px]'}>
      {PROJECTS.map((project) => (
        <li
          key={project.label}
          className={'flex flex-wrap items-baseline gap-x-3 gap-y-1'}
        >
          <Link
            href={project.href}
            isExternal
            className={'link-dash text-text'}
          >
            {project.label} ↗
          </Link>
          <span className={'text-muted tabular-nums'}>{project.period}</span>
          {project.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              isExternal
              className={'link-dash text-accent'}
            >
              {link.label}
            </Link>
          ))}
        </li>
      ))}
    </ul>
  </div>
)

export const ResumeMeta = () => {
  return (
    <div className={'mt-12 grid gap-10'}>
      <div className={'grid grid-cols-2 gap-8 tablet-s:grid-cols-1 tablet-s:gap-6'}>
        <LanguageList lines={LANGUAGES} />
        <EducationList />
      </div>

      <ProjectList />

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

      <button
        type={'button'}
        className={
          'inline-flex w-max items-center gap-[10px] border border-accent px-[18px] py-[12px] font-face-regular text-[13px] tracking-[0.16em] text-accent uppercase transition-colors duration-150 hover:bg-accent hover:text-black'
        }
      >
        <span aria-hidden>▤</span>
        Export dossier — strip aesthetic layer for HR / ML filter
      </button>
    </div>
  )
}
