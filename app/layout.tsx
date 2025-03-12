import type { ReactNode } from 'react';
import type { PageTree } from 'fumadocs-core/server';

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/app/layout.config';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';

import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

const docsTree: PageTree.Root = {
  name: 'Documentation',
  children: [
    { type: 'separator', name: 'Guides' },
    { type: 'page', name: 'Home', url: '/' },
    { type: 'page', name: 'Key System', url: '/key-system' },

    { type: 'separator', name: 'Addons' },
    { type: 'page', name: 'Getting Started', url: '/addons/getting_started' },
    { type: 'page', name: 'API', url: '/addons/api' },

    { type: 'separator', name: 'Purchase' },
    { type: 'page', name: 'Getting Started', url: '/purchase/getting_started' },
    {
      type: 'folder',
      name: 'Payment Methods',
      children: [
        { type: 'page', name: 'Official Shop', url: '/purchase/sellapp' },
        { type: 'page', name: 'Bloxproducts', url: '/purchase/bloxproducts' },
        { type: 'page', name: 'Robux', url: '/purchase/robux' }
      ]
    }
  ]
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <DocsLayout tree={docsTree} {...baseOptions}>
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
