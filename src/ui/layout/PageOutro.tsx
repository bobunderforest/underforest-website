import { NavNext } from 'ui/features/navigation/NavNext'
import { Footer } from 'ui/layout/Footer'
import type { NavTargetId } from 'ui/features/navigation/nav-targets'

export const PageOutro = ({ current }: { current?: NavTargetId }) => (
  <>
    <NavNext current={current} />
    <Footer />
  </>
)
