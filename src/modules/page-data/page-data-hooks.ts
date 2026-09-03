import { usePageData } from './page-data'
import type { PageDataMain } from './page-data-main'
import type { PageDataProject } from './page-data-project'

export const usePageDataMain = <K extends keyof PageDataMain>(
  key: K,
): PageDataMain[K] => usePageData(key)

export const usePageDataProject = <K extends keyof PageDataProject>(
  key: K,
): PageDataProject[K] => usePageData(key)
