/* eslint-disable no-undef */
// const UnoCSS = require('@unocss/webpack').default

class UnoCSS {
  /**
   *
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.beforeRun.tapPromise('unocss', async () => {
      if (globalThis.uno_built) return
      globalThis.uno_watching = true
      spawn.sync('pnpm', ['uno-generate'], { stdio: 'inherit' })
    })
    compiler.hooks.watchRun.tap('unocss', () => {
      if (globalThis.uno_watching) return
      globalThis.uno_watching = true
      spawn('pnpm', ['uno-generate', '--watch'], { stdio: 'inherit' })
    })
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  productionBrowserSourceMaps: true,

  webpack(config) {
    // config.plugins.push(new UnoCSS())
    return config
  },
}

module.exports = nextConfig
