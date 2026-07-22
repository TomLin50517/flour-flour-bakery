import zhHant from './zh-hant.json';
import en from './en.json';
import ja from './ja.json';
import ko from './ko.json';
import businessInfo from '../data/business-info.json';

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

// 聯絡事實單一來源(src/data/business-info.json)。電話/Email/社群為共用值,
// 營業時間/地址為各語系;addressFull = 短地址 + 括註,供聯絡頁使用。
export function getBusinessInfo(lang: Lang) {
  const b = businessInfo as {
    phone: string; email: string; instagram: string; facebook: string;
    hours: Record<Lang, string>; hoursSpec: { opens: string; closes: string };
    address: Record<Lang, string>; addressNote: Record<Lang, string>;
  };
  return {
    phone: b.phone,
    email: b.email,
    instagram: b.instagram,
    facebook: b.facebook,
    hours: b.hours[lang],
    hoursSpec: b.hoursSpec, // 機器可讀營業時間(非語系),供 JSON-LD 使用,與 hours 顯示字串同源
    address: b.address[lang],
    addressNote: b.addressNote[lang],
    addressFull: b.address[lang] + b.addressNote[lang],
  };
}
