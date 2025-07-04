const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/just-gojuon' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/just-gojuon/' : '',
  experimental: {
    optimizePackageImports: ['@/components'],
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/public/typing-game/**',
        ],
      };
    }
    return config;
  },
}
module.exports = nextConfig
