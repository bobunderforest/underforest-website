import { ScrollReadoutProvider } from 'ui/fx/ScrollReadout'
import { PageDataProvider } from 'modules/page-data/page-data'
import type { PageDataMain } from 'modules/page-data/page-data-main'
import { SectionProjects } from 'ui/sections/SectionProjects'
import { SectionExperience } from 'ui/sections/SectionExperience'
import { ClampDivider } from 'ui/common/cyber-kit/ClampDivider'

export const PageLanding = ({ pageData }: { pageData: PageDataMain }) => (
  <PageDataProvider pageData={pageData}>
    <ScrollReadoutProvider>
      <SectionProjects />
      <ClampDivider className={'relative z-10'} />
      <SectionExperience />
    </ScrollReadoutProvider>
  </PageDataProvider>
)
