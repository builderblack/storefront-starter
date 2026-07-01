/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@builderblack/storefront-sdk'],
  images: {
    remotePatterns: [
      // Allow images served from any BuilderBlack tenant's /files/* path.
      // The platform serves uploads under api.builderblack.com/files/<bucket>/<obj>.
      { protocol: 'https', hostname: 'api.builderblack.com', pathname: '/files/**' },
      // Allow self-hosted MinIO endpoints in development.
      { protocol: 'http',  hostname: 'localhost', pathname: '/files/**' },
    ],
  },
};

module.exports = nextConfig;
