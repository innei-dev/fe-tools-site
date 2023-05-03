/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  productionBrowserSourceMaps: true,

  webpack(config) {
    return config
  },
}

module.exports = nextConfig
