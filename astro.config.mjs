// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkAlert } from 'remark-github-blockquote-alert';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import remarkObsidian from './src/plugins/remark-obsidian.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://comstock.ch',
  // SSG (static output) is Astro's default.
  redirects: {
    '/': '/de/',
    '/about': '/de/about/',
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true, // /de/... and /en/... — explicit, paired URLs
    },
  },
  integrations: [mdx(), react(), sitemap({ i18n: { defaultLocale: 'de', locales: { de: 'de', en: 'en' } } })],
  markdown: {
    remarkPlugins: [remarkObsidian, remarkMath, remarkAlert],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'prepend', properties: { className: ['content-header-link'] } }],
      rehypeKatex,
    ],
    // Shiki is built in; replaces rehype-prism-plus.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
