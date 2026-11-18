// Dev-only workaround: when a source file gains new Tailwind classes, the
// browser's copy of the stylesheet hot-updates, but Astro's server-side copy
// (inlined into SSR'd HTML) stays stale. ClientRouter navigations then swap the
// fresh <style> for the stale one and newly added classes lose their styles.
// This invalidates server-side CSS modules on every source change so the next
// SSR render regenerates them.

const SERVER_ENVIRONMENTS = new Set(['ssr', 'prerender', 'astro'])
const STYLE_FILE_RE = /\.(?:css|less|sass|scss|styl|stylus|pcss|postcss|sss)$/i
const CSS_MODULE_RE = /\.css(?:$|\?)/
const DEV_CSS_PREFIX = '\0virtual:astro:dev-css:'

const isServerCssModule = (id) =>
  id.startsWith(DEV_CSS_PREFIX) ||
  (CSS_MODULE_RE.test(id) && !id.includes('node_modules'))

export const tailwindDevCssSync = () => ({
  name: 'tailwind-dev-css-sync',
  apply: 'serve',
  hotUpdate({ file, timestamp }) {
    const env = this.environment
    if (!SERVER_ENVIRONMENTS.has(env.name)) return
    if (STYLE_FILE_RE.test(file)) return

    for (const [id, mod] of env.moduleGraph.idToModuleMap) {
      if (!isServerCssModule(id)) continue
      env.moduleGraph.invalidateModule(mod, undefined, timestamp, true)
      if (env.runner?.evaluatedModules) {
        const runnerMod = env.runner.evaluatedModules.getModuleById(id)
        if (runnerMod) env.runner.evaluatedModules.invalidateModule(runnerMod)
      }
    }
  },
})
