import zhHant from './zh-hant.json';
import en from './en.json';
import ja from './ja.json';
import ko from './ko.json';

export type Lang = 'zh-hant' | 'en' | 'ja' | 'ko';

export const locales: Lang[] = ['zh-hant', 'en', 'ja', 'ko'];

export const localePrefix: Record<Lang, string> = {
  'zh-hant': '',
  en: '/en',
  ja: '/ja',
  ko: '/ko',
};

const dict = { 'zh-hant': zhHant, en, ja, ko };

export function getDict(lang: Lang) {
  return dict[lang];
}
