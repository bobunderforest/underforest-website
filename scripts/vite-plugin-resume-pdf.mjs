import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateResumePdfs } from './gen-resume-pdf.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const APP_DATA = path.join(ROOT, 'src/app-data')

const RESUME_SOURCES = ['resume.json', 'experience.json', 'socials.json'].map(
  (file) => path.join(APP_DATA, file),
)

const isResumeSource = (file) => RESUME_SOURCES.includes(file)

export const resumePdf = () => {
  let pending

  const regenerate = async (logger) => {
    const files = await generateResumePdfs()
    logger?.info(`[resume] generated ${files.length} pdf variants`)
  }

  return {
    name: 'resume-pdf',
    buildStart() {
      pending ??= regenerate()
      return pending
    },
    configureServer(server) {
      server.watcher.add(RESUME_SOURCES)
      server.watcher.on('change', (file) =>
        isResumeSource(file) ? regenerate(server.config.logger) : undefined,
      )
    },
  }
}
