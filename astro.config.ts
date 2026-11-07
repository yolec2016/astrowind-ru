import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',

  // Старые слаги категорий блога → канонические (23 категории были сведены к 7).
  redirects: {
    '/category/oem-odm': '/category/oem-i-odm',
    '/category/oem-and-odm': '/category/oem-i-odm',
    '/category/oem-sourcing': '/category/oem-i-odm',
    '/category/oem-manufacturing': '/category/oem-i-odm',
    '/category/oem-buying-guide': '/category/oem-i-odm',
    '/category/oem-proizvodstvo': '/category/oem-i-odm',
    '/category/proizvodstvo': '/category/oem-i-odm',
    '/category/zakupki': '/category/zakupki-i-import',
    '/category/zakupki-iz-kitaya': '/category/zakupki-i-import',
    '/category/import-guide': '/category/zakupki-i-import',
    '/category/import-i-logistika': '/category/zakupki-i-import',
    '/category/rukovodstvo-po-vyboru-proizvoditelya': '/category/zakupki-i-import',
    '/category/quality-control': '/category/kontrol-kachestva',
    '/category/certification-guide': '/category/sertifikaciya',
    '/category/certification-and-import': '/category/sertifikaciya',
    '/category/market-trends': '/category/trendy-rynka',
    '/category/market-insights': '/category/trendy-rynka',
    '/category/rynok-bytovoi-tekhniki': '/category/trendy-rynka',
    '/category/elektricheskie-chainiki': '/category/elektrochainiki',
    '/category/electric-pressure-cooker': '/category/skorovarki',
  },

  integrations: [
    sitemap({
      filter: (page) => {
        return (
          !page.includes('/tag/') &&
          !page.includes('/decapcms') &&
          !page.match(/\/blog\/\d+\/?$/) &&
          !page.match(/\/category\/[^/]+\/\d+\/?$/)
        );
      },
    }),

    mdx(),

    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'factory',
          'approval',
          'search',
          'globe',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
