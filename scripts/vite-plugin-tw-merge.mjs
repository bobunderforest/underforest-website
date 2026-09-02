import { stylesDir, writeTwMergeConfig } from './gen-tw-merge.mjs'

const isThemeStylesheet = (file) =>
  file.startsWith(stylesDir) && file.endsWith('.css')

export const twMergeConfig = () => {
  let pending

  const regenerate = async (logger) => {
    const { changed } = await writeTwMergeConfig()
    if (changed.length)
      logger?.info(`[tailwind] regenerated ${changed.join(', ')}`)
  }

  return {
    name: 'tw-merge-config',
    buildStart() {
      pending ??= regenerate()
      return pending
    },
    configureServer(server) {
      server.watcher.on('change', (file) =>
        isThemeStylesheet(file) ? regenerate(server.config.logger) : undefined,
      )
    },
  }
}
