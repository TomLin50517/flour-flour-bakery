// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://flourflour.com.tw',
  output: 'static',
  // @fontsource 的 SCSS mixins(scss/mixins.scss)不在套件 exports 白名單,
  // 用 loadPaths 讓 Sass 以檔案路徑解析 node_modules,繞過 exports 限制(見 src/styles/fonts.scss)。
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['node_modules'],
        },
      },
    },
  },
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
