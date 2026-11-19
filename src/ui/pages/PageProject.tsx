import { PageDataProvider } from 'modules/page-data/page-data'
import type { PageDataProject } from 'modules/page-data/page-data-project'
import { SectionProject } from 'ui/sections/SectionProject'
import { ClampDivider } from 'ui/common/cyber-kit/ClampDivider'

export const PageProject = ({ pageData }: { pageData: PageDataProject }) => (
  <PageDataProvider pageData={pageData}>
    <ClampDivider className={'relative z-10'} />
    <SectionProject />
  </PageDataProvider>
)
