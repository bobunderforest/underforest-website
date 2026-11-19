export type NavTargetId = 'index' | 'projects' | 'resume'

export type NavTarget = {
  id: NavTargetId
  label: string
  alias: string
  hint: string
  kicker?: string
  readout: string
  hash: string
  stage: string
  pathPrefix?: string
}

export const INDEX_TARGET: NavTarget = {
  id: 'index',
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
    label: 'Projects',
    alias: 'portfolio',
    hint: 'selected builds, opened one detection at a time',
    kicker: 'selected',
    readout: 'detections',
    hash: '#projects',
    stage: 'Projects',
    pathPrefix: '/projects',
  },
  {
    id: 'resume',
    label: 'Resume',
    alias: 'cv',
    hint: 'ten years of shipped work, classified by employer',
    kicker: 'complete',
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
