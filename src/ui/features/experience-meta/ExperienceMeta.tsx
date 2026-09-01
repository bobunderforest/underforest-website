import { LANGUAGES } from 'ui/features/experience-data/experience-data'
import { ExperienceChannels } from './ExperienceChannels'
import { ExperienceEducationList } from './ExperienceEducationList'
import { ExperienceExportButton } from './ExperienceExportButton'
import { ExperienceLanguageList } from './ExperienceLanguageList'
import { ExperienceProjectList } from './ExperienceProjectList'

export const ExperienceMeta = () => (
  <div className={'mt-12 grid gap-10'}>
    <div className={'grid grid-cols-2 gap-8 tablet-s:grid-cols-1 tablet-s:gap-6'}>
      <ExperienceLanguageList lines={LANGUAGES} />
      <ExperienceEducationList />
    </div>
    <ExperienceProjectList />
    <ExperienceChannels />
    <ExperienceExportButton />
  </div>
)
