import { usePageData } from './page-data'
import type { PageDataMain } from './page-data-main'

export const usePageDataMain = <K extends keyof PageDataMain>(
  key: K,
): PageDataMain[K] => usePageData(key)
