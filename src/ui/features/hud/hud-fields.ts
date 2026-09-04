import hud from 'app-data/hud.json'
import projects from 'app-data/projects.json'
import { SKILLS } from 'ui/features/experience-data/experience-data'

export const HUD_MODEL = hud.model

const careerYears = new Date().getFullYear() - hud.careerStartYear

export const HUD_BUILD = `${hud.buildPrefix}${__BUILD_REV__}`

export const HUD_IDLE_STAGE = hud.idleStage

export type HudBootLine = {
  label: string
  status?: string | string[]
  denied?: boolean
  lead?: boolean
}

const bootTokens: Record<string, string> = {
  model: HUD_MODEL,
  years: String(careerYears),
  skills: String(SKILLS.length),
  projects: String(projects.projects.length),
}

const fillTokens = (text: string) =>
  text.replace(/\{(\w+)\}/g, (match, key) => bootTokens[key] ?? match)

export const HUD_BOOT_LINES: HudBootLine[] = (hud.boot as HudBootLine[]).map(
  (line) => ({
    ...line,
    label: fillTokens(line.label),
    status: Array.isArray(line.status)
      ? line.status.map(fillTokens)
      : line.status
        ? fillTokens(line.status)
        : undefined,
  }),
)
