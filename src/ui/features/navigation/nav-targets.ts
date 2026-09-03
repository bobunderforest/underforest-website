export type NavTargetId = 'index' | 'projects' | 'resume'

export type NavTarget = {
  id: NavTargetId
  index: string
  label: string
  alias: string
  hint: string
  readout: string
  hash: string
  stage: string
  pathPrefix?: string
}

export const INDEX_TARGET: NavTarget = {
  id: 'index',
  index: '00',
  label: 'Index',
  alias: 'identity',
  hint: 'who is speaking, and from where',
  readout: 'origin',
  hash: '#about',
  stage: 'Identity',
}

export const NAV_ROUTES: NavTarget[] = [
  {
    id: 'projects',
    index: '01',
    label: 'Projects',
    alias: 'portfolio',
    hint: 'selected builds, opened one detection at a time',
    readout: 'detections',
    hash: '#projects',
    stage: 'Projects',
    pathPrefix: '/projects',
  },
  {
    id: 'resume',
    index: '02',
    label: 'Resume',
    alias: 'cv',
    hint: 'ten years of shipped work, classified by employer',
    readout: 'trace / history',
    hash: '#resume',
    stage: 'RESUME',
  },
]

export const HUD_TARGETS: NavTarget[] = [INDEX_TARGET, ...NAV_ROUTES]

export const LANDING_PATH = '/'

export const navTargetHref = (target: NavTarget, path: string) =>
  path === LANDING_PATH ? target.hash : `${LANDING_PATH}${target.hash}`

export const isRouteActive = (target: NavTarget, path: string) =>
  Boolean(target.pathPrefix && path.startsWith(target.pathPrefix))
