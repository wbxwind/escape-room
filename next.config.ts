import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.1.18', '192.168.1.*'],
}

export default nextConfig
