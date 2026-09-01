import { Section } from './Section'
import { FieldLabel } from './FieldLabel'
import { ExperienceDataProvider } from 'ui/features/experience-data/ExperienceDataProvider'
import { ExperienceFilter } from 'ui/features/experience/ExperienceFilter'
import { SkillTagsContainer } from 'ui/features/skills/SkillTagsContainer'
import { ExperienceTrack } from 'ui/features/experience/ExperienceTrack'
import { SKILLS } from 'ui/features/experience-data/experience-data'
import { ExperienceExportButton } from 'ui/features/experience-meta/ExperienceExportButton'
import { ExperienceLanguageList } from 'ui/features/experience-meta/ExperienceLanguageList'
import { ExperienceEducationList } from 'ui/features/experience-meta/ExperienceEducationList'

const primaryCount = SKILLS.filter((skill) => skill.primary).length

export const SectionExperience = () => {
  return (
    <Section id={'resume'} index={'01'} stage={'DOSSIER'}>
      <ExperienceDataProvider>
        <ExperienceFilter className={'mb-5'} />
        <div className={'mb-15'}>
          <ExperienceExportButton />
        </div>

        <div className={'mb-10'}>
          <FieldLabel
            readout={`${primaryCount} primary · ${SKILLS.length} detected`}
          >
            skills
          </FieldLabel>
          <SkillTagsContainer />
        </div>

        <div className={'mb-15'}>
          <FieldLabel readout={'object trajectory · 2014 → 2026'}>
            tracking
          </FieldLabel>
          <ExperienceTrack />
        </div>

        <div className={'grid max-w-[800px] grid-cols-1 gap-10'}>
          <ExperienceLanguageList />
          <ExperienceEducationList />
          <ExperienceExportButton />
        </div>
      </ExperienceDataProvider>
    </Section>
  )
}
