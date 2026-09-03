import { ScrollReadoutProvider } from 'ui/fx/ScrollReadout'
import { PageDataProvider } from 'modules/page-data/page-data'
import type { PageDataMain } from 'modules/page-data/page-data-main'
import { SectionProjects } from 'ui/sections/SectionProjects'

export const PageProjects = ({ pageData }: { pageData: PageDataMain }) => (
  <PageDataProvider pageData={pageData}>
    <ScrollReadoutProvider>
      <SectionProjects />
    </ScrollReadoutProvider>
  </PageDataProvider>
)
