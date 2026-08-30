import headerJson from 'app-data/header.json'
import { urls } from './urls'

type UrlKey = keyof typeof urls.hashIds

export type HeaderControlItem = {
  label: string
  href: string
  primary: boolean
}

export const headerControls: HeaderControlItem[] = headerJson.controls.map(
  (control) => ({
    label: control.label,
    href: urls[control.url as UrlKey],
    primary: control.primary,
  }),
)
