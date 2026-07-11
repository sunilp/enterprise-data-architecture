import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeMkdocsLinks } from './src/lib/rehype-mkdocs-links.mjs';

export default defineConfig({
  site: 'https://sunilprakash.com',
  base: '/enterprise-data-architecture',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: { theme: 'github-light' },
    rehypePlugins: [rehypeMkdocsLinks],
  },
});
