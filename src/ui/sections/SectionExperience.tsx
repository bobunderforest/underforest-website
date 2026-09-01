import { Section } from './Section'
import { FieldLabel } from './FieldLabel'
import { ExperienceDataProvider } from 'ui/features/experience-data/ExperienceDataProvider'
import { ExperienceFilter } from 'ui/features/experience/ExperienceFilter'
import { SkillTagsContainer } from 'ui/features/skills/SkillTagsContainer'
import { ExperienceTrack } from 'ui/features/experience/ExperienceTrack'
import { ExperienceMeta } from 'ui/features/experience-meta/ExperienceMeta'
import { SKILLS } from 'ui/features/experience-data/experience-data'

const primaryCount = SKILLS.filter((skill) => skill.primary).length

export const SectionExperience = () => {
  return (
    <Section
      id={'resume'}
      index={'01'}
      stage={'Feature Extraction'}
      readout={'class labels'}
    >
      <ExperienceDataProvider>
        <ExperienceFilter />

        <div className={'mt-10'}>
          <FieldLabel
            readout={`${primaryCount} primary · ${SKILLS.length} detected`}
          >
            skills
          </FieldLabel>
          <SkillTagsContainer />
        </div>

        <div className={'mt-14'}>
          <FieldLabel readout={'object trajectory · 2014 → 2026'}>
            tracking
          </FieldLabel>
          <ExperienceTrack />
        </div>

        <ExperienceMeta />
      </ExperienceDataProvider>
    </Section>
  )
}
