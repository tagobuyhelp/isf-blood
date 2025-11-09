/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'devcache',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
