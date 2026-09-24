// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// 無尾斜線網址 → 有尾斜線正式網址的「永久」轉址(Cloudflare 靜態資源的 _redirects)。
// 主機內建的 html_handling 只會回 307(暫時轉址),無法改成永久,所以在這裡由實際建置出的頁面
// 自動產生 301 規則:新增/刪除頁面不需手動維護。只涵蓋網頁路徑,不動 robots/sitemap/圖片等檔案。
const trailingSlashRedirects = {
  name: 'trailing-slash-redirects',
  hooks: {
    'astro:build:done': ({ pages, dir }) => {
      const lines = pages
        .map((p) => p.pathname.replace(/\/$/, ''))
        .filter((path) => path && path !== '404')
        .map((path) => `/${path} /${path}/ 301`);
      writeFileSync(fileURLToPath(new URL('_redirects', dir)), lines.join('\n') + '\n');
    },
  },
};

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
    trailingSlashRedirects,
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
