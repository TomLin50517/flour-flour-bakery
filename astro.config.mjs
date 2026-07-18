// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://flourflour.tw',
  output: 'static',
  i18n: {
    defaultLocale: 'zh-hant',
    locales: ['zh-hant', 'en', 'ja', 'ko'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'zh-hant',
        locales: {
          'zh-hant': 'zh-Hant',
          en: 'en',
          ja: 'ja',
          ko: 'ko',
        },
      },
    }),
  ],
});
