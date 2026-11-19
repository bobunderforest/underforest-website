import { Section } from './Section'
import { CrtDitherOverlay } from 'ui/fx/CrtDitherOverlay'
import { FieldLabel } from './FieldLabel'
import { SkillAreaGrid } from 'ui/features/skills/SkillAreaGrid'
import { ExperienceTrack } from 'ui/features/experience/ExperienceTrack'
import { SKILLS } from 'ui/features/experience-data/experience-data'
import {
  ResumeDownloadButtons,
  ResumeExportLabel,
} from 'ui/features/experience-meta/ResumeDownloadButtons'
import { ExperienceLanguageList } from 'ui/features/experience-meta/ExperienceLanguageList'
import { ExperienceEducationList } from 'ui/features/experience-meta/ExperienceEducationList'
import { SectionTitle } from './SectionTitle'

const primaryCount = SKILLS.filter((skill) => skill.primary).length

export const SectionExperience = () => {
  return (
    <Section id={'resume'} stage={'RESUME'} decoration={<CrtDitherOverlay />}>
      <SectionTitle alias={'cv'} kicker={'complete'}>
        resume
      </SectionTitle>
      <div className={'mb-intersection-padding max-w-column-width'}>
        <ResumeExportLabel />
        <ResumeDownloadButtons />
      </div>

      <div className={'mb-intersection-padding'}>
        <FieldLabel
          readout={`${primaryCount} primary · ${SKILLS.length} total`}
        >
          skills
        </FieldLabel>
        <SkillAreaGrid />
      </div>

      <div className={'mb-intersection-padding'}>
        <FieldLabel readout={'object trajectory · 2014 → 2026'}>
          tracking
        </FieldLabel>
        <ExperienceTrack />
      </div>

      <div className={'grid max-w-column-width gap-10'}>
        <ExperienceLanguageList />
        <ExperienceEducationList />
      </div>
    </Section>
  )
}
