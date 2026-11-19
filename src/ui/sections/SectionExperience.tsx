import { Section } from './Section'
import { CrtDitherOverlay } from 'ui/fx/CrtDitherOverlay'
import { FieldLabelHeading } from './FieldLabel'
import { SkillAreaGrid } from 'ui/features/skills/SkillAreaGrid'
import { ExperienceTrack } from 'ui/features/experience/ExperienceTrack'
import { ResumeDownloadButtons } from 'ui/features/experience-meta/ResumeDownloadButtons'
import { ExperienceLanguageList } from 'ui/features/experience-meta/ExperienceLanguageList'
import { ExperienceEducationList } from 'ui/features/experience-meta/ExperienceEducationList'
import { SectionTitle } from './SectionTitle'

export const SectionExperience = () => {
  return (
    <Section id={'resume'} stage={'RESUME'} decoration={<CrtDitherOverlay />}>
      <SectionTitle kicker={'complete'}>resume</SectionTitle>
      <div className={'mb-intersection-padding max-w-column-width'}>
        <FieldLabelHeading>download resume</FieldLabelHeading>
        <ResumeDownloadButtons />
      </div>

      <div className={'mb-intersection-padding'}>
        <FieldLabelHeading>skills</FieldLabelHeading>
        <SkillAreaGrid />
      </div>

      <div className={'mb-intersection-padding'}>
        <FieldLabelHeading readout={'2014 → 2026'}>timeline</FieldLabelHeading>
        <ExperienceTrack />
      </div>

      <div className={'grid max-w-column-width gap-10'}>
        <ExperienceLanguageList />
        <ExperienceEducationList />
      </div>
    </Section>
  )
}
