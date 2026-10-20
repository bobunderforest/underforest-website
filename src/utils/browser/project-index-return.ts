import { isBrowser } from './is-browser'

const storageKey = (projectId: string) => `underforest:project-index-return:${projectId}`

export const markProjectIndexReturn = (projectId: string) => {
  if (!isBrowser) return
  try {
    sessionStorage.setItem(storageKey(projectId), '1')
  } catch {}
}

export const consumeProjectIndexReturn = (projectId: string) => {
  if (!isBrowser) return false
  try {
    const key = storageKey(projectId)
    const shouldReturn = sessionStorage.getItem(key) === '1'
    sessionStorage.removeItem(key)
    return shouldReturn
  } catch {
    return false
  }
}
