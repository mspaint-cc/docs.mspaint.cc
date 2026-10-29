import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: ['typescript', 'twoslash'],
  async redirects() {
    const stores = { mspaintcc: 'mspaintcc', bloxproducts: 'bloxproducts', cheapkeyz: 'cheapkeyz', charamarket: 'charamarket', YESU: 'yesucc', reiishop: 'reiishop', bennnyr: 'bennnyr', lunor: 'gato', gefesha: 'gefesha' };
    return [
      ...Object.entries(stores).map(([page, anchor]) => ({ source: `/purchase/${page}`, destination: `https://www.mspaint.cc/buy#${anchor}`, permanent: true })),
      { source: '/purchase/:path*', destination: 'https://www.mspaint.cc/buy', permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/obsidian.mdx',
        destination: '/llms.mdx/obsidian',
      },
      {
        source: '/obsidian/:path*.mdx',
        destination: '/llms.mdx/obsidian/:path*',
      },
    ];
  },
};

const withMDX = createMDX();
export default withMDX(config);