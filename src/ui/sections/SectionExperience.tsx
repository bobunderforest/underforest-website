import { Section } from './Section'
import { FieldLabel } from './FieldLabel'
import { ExperienceDataProvider } from 'ui/features/experience-data/ExperienceDataProvider'
import { ExperienceFilter } from 'ui/features/experience/ExperienceFilter'
import { SkillTagsContainer } from 'ui/features/skills/SkillTagsContainer'
import { ExperienceTrack } from 'ui/features/experience/ExperienceTrack'
import { EXPERIENCE, SKILLS } from 'ui/features/experience-data/experience-data'
import { ExperienceExportButton } from 'ui/features/experience-meta/ExperienceExportButton'
import { ExperienceLanguageList } from 'ui/features/experience-meta/ExperienceLanguageList'
import { ExperienceEducationList } from 'ui/features/experience-meta/ExperienceEducationList'

const primaryCount = SKILLS.filter((skill) => skill.primary).length

export const SectionExperience = () => {
  return (
    <ExperienceDataProvider>
      <Section
        id={'resume'}
        index={'02'}
        stage={'DOSSIER'}
        stageAlias={'resume'}
        header={{
          label: 'domain filter',
          readout: `${EXPERIENCE.length} entries · ${SKILLS.length} skills detected`,
          control: <ExperienceFilter />,
        }}
      >
        <div className={'mb-intersection-padding'}>
          <ExperienceExportButton />
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
          <ExperienceExportButton />
        </div>
      </Section>
    </ExperienceDataProvider>
  )
}
