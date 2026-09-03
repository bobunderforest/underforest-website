import { ScrollReadoutProvider } from 'ui/fx/ScrollReadout'
import { PageDataProvider } from 'modules/page-data/page-data'
import type { PageDataProject } from 'modules/page-data/page-data-project'
import { SectionProject } from 'ui/sections/SectionProject'

export const PageProject = ({ pageData }: { pageData: PageDataProject }) => (
  <PageDataProvider pageData={pageData}>
    <ScrollReadoutProvider>
      <SectionProject />
    </ScrollReadoutProvider>
  </PageDataProvider>
)
