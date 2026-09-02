import { ScrollReadoutProvider } from 'ui/fx/ScrollReadout'
import { useLenis } from 'utils/hooks/useLenis'
import { useSectionRestore } from 'utils/hooks/useSectionRestore'
import { PageDataProvider } from 'modules/page-data/page-data'
import type { PageDataMain } from 'modules/page-data/page-data-main'
import { SectionSplash } from 'ui/sections/SectionSplash'
import { SectionExperience } from 'ui/sections/SectionExperience'
import { SectionProjects } from 'ui/sections/SectionProjects'
import { HudLayer } from 'ui/features/hud/HudLayer'
import { HudBoot } from 'ui/features/hud/HudBoot'

export const PageHome = ({ pageData }: { pageData: PageDataMain }) => {
  useLenis()
  useSectionRestore()

  return (
    <PageDataProvider pageData={pageData}>
      <ScrollReadoutProvider>
        <main>
          <SectionSplash />
          <SectionExperience />
          <SectionProjects />
        </main>
        <HudLayer />
        <HudBoot />
      </ScrollReadoutProvider>
    </PageDataProvider>
  )
}
