/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  productionBrowserSourceMaps: true,

  webpack(config) {
    return config
  },
}

export default nextConfig
