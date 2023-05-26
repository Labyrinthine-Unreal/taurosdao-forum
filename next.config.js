/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
},
// env: {
//   NEXT_PUBLIC_FAUNA_SECRET_KEY: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY,
//   // CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
// },
}

module.exports = {
  webpack: (config, { isServer }) => {
      if (!isServer) {
          // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
          config.resolve.fallback = {
              fs: false
          }
      }

      return config;
  }
  
}
