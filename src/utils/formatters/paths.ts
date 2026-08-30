export const toPublicSrc = (path: string): string =>
  path.startsWith('/') ? path : `/${path}`
