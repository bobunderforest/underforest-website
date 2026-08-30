import { ScrollReadoutProvider } from 'ui/fx/ScrollReadout'
import { useLenis } from 'utils/hooks/useLenis'
import { useSectionRestore } from 'utils/hooks/useSectionRestore'
import { PageDataProvider } from 'modules/page-data/page-data'
import type { PageDataMain } from 'modules/page-data/page-data-main'

export const PageHome = ({ pageData }: { pageData: PageDataMain }) => {
  useLenis()
  useSectionRestore()

  return (
    <PageDataProvider pageData={pageData}>
      <ScrollReadoutProvider />
    </PageDataProvider>
  )
}
