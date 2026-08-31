import { Section } from './Section'
import { FieldLabel } from './FieldLabel'
import { ResumeProvider } from 'ui/features/resume/ResumeProvider'
import { ModelSelect } from 'ui/features/resume/ModelSelect'
import { SkillVector } from 'ui/features/resume/SkillTag'
import { ExperienceTrack } from 'ui/features/resume/ExperienceTrack'
import { ResumeMeta } from 'ui/features/resume/ResumeMeta'
import { SKILLS } from 'ui/features/resume/resume-data'

const primaryCount = SKILLS.filter((skill) => skill.primary).length

export const SectionExperience = () => {
  return (
    <Section
      id={'resume'}
      index={'01'}
      stage={'Feature Extraction'}
      readout={'class labels'}
    >
      <ResumeProvider>
        <ModelSelect />

        <div className={'mt-10'}>
          <FieldLabel
            readout={`${primaryCount} primary · ${SKILLS.length} detected`}
          >
            skills
          </FieldLabel>
          <SkillVector />
        </div>

        <div className={'mt-14'}>
          <FieldLabel readout={'object trajectory · 2014 → 2026'}>
            tracking
          </FieldLabel>
          <ExperienceTrack />
        </div>

        <ResumeMeta />
      </ResumeProvider>
    </Section>
  )
}
