import { Section } from './Section'
import { CrtDitherOverlay } from 'ui/fx/CrtDitherOverlay'
import { FieldLabel } from './FieldLabel'
import { ExperienceDataProvider } from 'ui/features/experience-data/ExperienceDataProvider'
import { SkillTagsContainer } from 'ui/features/skills/SkillTagsContainer'
import { ExperienceTrack } from 'ui/features/experience/ExperienceTrack'
import {
  EXPERIENCE_READOUT,
  SKILLS,
} from 'ui/features/experience-data/experience-data'
import { ExperienceDossierRouter } from 'ui/features/experience-meta/ExperienceDossierRouter'
import {
  ResumeDownloadButtons,
  ResumeExportLabel,
} from 'ui/features/experience-meta/ResumeDownloadButtons'
import { ExperienceLanguageList } from 'ui/features/experience-meta/ExperienceLanguageList'
import { ExperienceEducationList } from 'ui/features/experience-meta/ExperienceEducationList'

const primaryCount = SKILLS.filter((skill) => skill.primary).length

export const SectionExperience = () => {
  return (
    <ExperienceDataProvider>
      <Section id={'resume'} stage={'RESUME'} decoration={<CrtDitherOverlay />}>
        <div className={'mb-intersection-padding'}>
          <FieldLabel readout={EXPERIENCE_READOUT}>
            domain filter · dossier export
          </FieldLabel>
          <ExperienceDossierRouter />
        </div>

        <div className={'mb-intersection-padding'}>
          <FieldLabel
            readout={`${primaryCount} primary · ${SKILLS.length} detected`}
          >
            skills
          </FieldLabel>
          <SkillTagsContainer />
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
          <div>
            <ResumeExportLabel />
            <ResumeDownloadButtons />
          </div>
        </div>
      </Section>
    </ExperienceDataProvider>
  )
}
