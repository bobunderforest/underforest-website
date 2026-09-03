import { ScrollReadoutProvider } from 'ui/fx/ScrollReadout'
import { PageDataProvider } from 'modules/page-data/page-data'
import type { PageDataProject } from 'modules/page-data/page-data-project'
import { SectionProject } from 'ui/sections/SectionProject'
import { ClampDivider } from 'ui/common/cyber-kit/ClampDivider'
import { SplitRoute } from 'ui/features/navigation/SplitRoute'

export const PageProject = ({ pageData }: { pageData: PageDataProject }) => (
  <PageDataProvider pageData={pageData}>
    <ScrollReadoutProvider>
      <ClampDivider className={'relative z-10'} />
      <SectionProject />
      <SplitRoute direction={'down'} />
    </ScrollReadoutProvider>
  </PageDataProvider>
)
