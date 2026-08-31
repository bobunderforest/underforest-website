import { useResumeModel } from './resume-context'
import { SKILLS, isDimmed, type Skill } from './resume-data'
import { cns } from 'utils/formatters/classnames'

const ordered = [...SKILLS].sort(
  (a, b) => Number(Boolean(b.primary)) - Number(Boolean(a.primary)),
)

const SkillTag = ({ skill, dimmed }: { skill: Skill; dimmed: boolean }) => {
  return (
    <li
      className={cns(
        'relative inline-flex items-center gap-[8px] border px-[11px] py-[6px]',
        'font-face-regular text-[12px] tracking-[0.1em] uppercase',
        'transition-opacity duration-300',
        skill.primary
          ? 'border-accent/70 bg-accent/[0.08] text-text'
          : 'border-muted/55 text-text',
        skill.rising && 'border-dashed',
        dimmed && 'opacity-30',
      )}
    >
      <span
        aria-hidden
        className={cns(
          'size-[6px] shrink-0',
          skill.primary ? 'bg-accent' : 'border border-muted/80',
        )}
      />
      {skill.label}
      {skill.rising && (
        <span aria-hidden className={'text-accent'}>
          ↑
        </span>
      )}
      {skill.primary && (
        <>
          <span
            aria-hidden
            className={
              'absolute -top-px -left-px size-[5px] border-t-2 border-l-2 border-accent'
            }
          />
          <span
            aria-hidden
            className={
              'absolute -right-px -bottom-px size-[5px] border-r-2 border-b-2 border-accent'
            }
          />
        </>
      )}
    </li>
  )
}

export const SkillVector = () => {
  const { model } = useResumeModel()

  return (
    <ul className={'mt-4 flex max-w-[760px] flex-wrap gap-[8px]'}>
      {ordered.map((skill) => (
        <SkillTag
          key={skill.label}
          skill={skill}
          dimmed={isDimmed(model, skill.domains)}
        />
      ))}
    </ul>
  )
}
