export const HUD_MODEL = 'deck-v11 / clip-vit-l'

export const HUD_BUILD = `rev.${__BUILD_REV__}`

export const HUD_IDLE_STAGE = 'standby'

export type HudBootLine = {
  label: string
  status?: string
  denied?: boolean
  lead?: boolean
}

export const HUD_BOOT_LINES: HudBootLine[] = [
  { label: 'init vision pipeline', status: 'ok' },
  { label: `load model ${HUD_MODEL}`, status: 'ok' },
  { label: 'calibrate optics', status: 'ok' },
  { label: 'request optical sensor', status: 'denied', denied: true },
  { label: 'fallback: dom introspection', status: 'ok' },
  { label: 'subject detected · visitor 0.99', lead: true },
  { label: 'begin analysis', lead: true },
]
