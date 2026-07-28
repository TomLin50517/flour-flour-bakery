import zhHant from './zh-hant.json';
import en from './en.json';
import ja from './ja.json';
import ko from './ko.json';
import businessInfo from '../data/business-info.json';

export type Lang = 'zh-hant' | 'en' | 'ja' | 'ko';

export const locales: Lang[] = ['zh-hant', 'en', 'ja', 'ko'];

// 語系對照表的單一來源。⚠️ 元件請一律 import,不要各自重寫一份 —— 重複定義過去已造成
// 「改了一處、其他處沒跟上」的不一致。無法 import 的 inline script 請用 define:vars 傳入。
export const localePrefix: Record<Lang, string> = {
  'zh-hant': '',
  en: '/en',
  ja: '/ja',
  ko: '/ko',
};

// <html lang> / hreflang 用的 BCP-47 標記
export const htmlLang: Record<Lang, string> = {
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
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
    geo: { latitude: number; longitude: number }; mapsName: string;
    address: Record<Lang, string>; addressNote: Record<Lang, string>;
  };
  return {
    phone: b.phone,
    email: b.email,
    instagram: b.instagram,
    facebook: b.facebook,
    hours: b.hours[lang],
    hoursSpec: b.hoursSpec, // 機器可讀營業時間(非語系),供 JSON-LD 使用,與 hours 顯示字串同源
    geo: b.geo, // Google 商家實際座標(非語系):供 JSON-LD 使用
    // Google 商家「登錄名稱」(需與 Google 上完全一致,可能與品牌寫法不同)。
    // 地圖/導航一律用「店名 + 地址」查詢:直接用經緯度會被 Google 反查成最近門牌(曾顯示成隔壁 8 號)。
    mapsName: b.mapsName,
    mapsQuery: `${b.mapsName},${b.address[lang]}`,
    address: b.address[lang],
    addressNote: b.addressNote[lang],
    addressFull: b.address[lang] + b.addressNote[lang],
  };
}
