/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    FAUNADB_SECRET: process.env.FAUNADB_SECRET,
  },
};

module.exports = nextConfig;
