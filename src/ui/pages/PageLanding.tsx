import { ScrollReadoutProvider } from 'ui/fx/ScrollReadout'
import { PageDataProvider } from 'modules/page-data/page-data'
import type { PageDataMain } from 'modules/page-data/page-data-main'
import { EXPERIENCE_READOUT } from 'ui/features/experience-data/experience-data'
import { SectionProjects } from 'ui/sections/SectionProjects'
import { SectionExperience } from 'ui/sections/SectionExperience'
import { SplitRoute } from 'ui/features/navigation/SplitRoute'

export const PageLanding = ({ pageData }: { pageData: PageDataMain }) => (
  <PageDataProvider pageData={pageData}>
    <ScrollReadoutProvider>
      <SplitRoute
        direction={'down'}
        readouts={{
          projects: `${pageData.projects.length} subjects detected`,
          resume: EXPERIENCE_READOUT,
        }}
      />
      <SectionProjects />
      <SplitRoute direction={'between'} />
      <SectionExperience />
      <SplitRoute direction={'up'} />
    </ScrollReadoutProvider>
  </PageDataProvider>
)
