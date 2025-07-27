// const isDev = process.env.NODE_ENV === 'development';
const backendUrl = process.env.BACKEND_URL || 'http://localhost:9090';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['qa-images-evrit.yit.co.il'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
