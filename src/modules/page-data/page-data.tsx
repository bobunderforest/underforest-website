import { createContextWithHook } from 'utils/primitives/create-context-with-hook'

const { context: pageDataContext, useContext: usePageDataContext } =
  createContextWithHook<object>({})

export const usePageData = <
  D extends { [key: string]: unknown },
  K extends keyof D,
>(
  key: K,
) => {
  return (usePageDataContext() as D)[key]
}

export const PageDataProvider = <D extends object>({
  pageData,
  children,
}: React.PropsWithChildren & {
  pageData: D
}) => {
  return (
    <pageDataContext.Provider value={pageData}>
      {children}
    </pageDataContext.Provider>
  )
}
