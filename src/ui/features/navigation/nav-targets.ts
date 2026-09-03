export type NavTargetId = 'projects' | 'resume'

export type NavTarget = {
  id: NavTargetId
  index: string
  label: string
  hint: string
  readout: string
  href: string
}

export const NAV_ROUTES: NavTarget[] = [
  {
    id: 'projects',
    index: '01',
    label: 'Portfolio',
    hint: 'selected builds, opened one detection at a time',
    readout: 'detections',
    href: '/',
  },
  {
    id: 'resume',
    index: '02',
    label: 'Resume',
    hint: 'ten years of shipped work, classified by employer',
    readout: 'trace / history',
    href: '/resume',
  },
]

export const navTargetsExcept = (excluded?: NavTargetId) =>
  NAV_ROUTES.filter((target) => target.id !== excluded)

export const isRouteActive = (href: string, path: string) =>
  href === '/'
    ? path === '/' || path.startsWith('/projects')
    : path.startsWith(href)
