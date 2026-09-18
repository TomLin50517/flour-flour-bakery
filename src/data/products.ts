// products.ts — 讀取 src/data/products.json,對外提供「已在地化」的產品/分類。
// products.json 是單一來源,由 Sveltia CMS(/admin → 商品)編輯,含四語品名/說明與照片。
// (Excel + build-products 流程已退役,不再需要 `npm run products`。)
import data from './products.json';
import type { Lang } from '../i18n';

type LocaleMap = Record<Lang, string>;

export interface RawProduct {
  id: string;
  category: string;
  price: number;
  containsAlcohol: boolean;
  image: string | null;
  name: LocaleMap;
  tagline: LocaleMap;
}

export interface Product {
  id: string;
  category: string;
  price: number;
  containsAlcohol: boolean;
  image: string | null;
  name: string;
  tagline: string;
}

export interface CategorySpotlight {
  heading: string;
  body: string;
  image: string | null;
}

export interface Category {
  key: string;
  label: string;
  // 分類可以介紹不只一項特色食材(例如冰淇淋的香草、可可各自一段),故為陣列;未設定則為空陣列。
  spotlights: CategorySpotlight[];
  // 分類尚未準備好時可暫時隱藏(例如禮盒還沒定案):首頁對應區塊、產品頁頁籤與 ItemList
  // 結構化資料都不會渲染,不是單純 CSS 隱藏,搜尋引擎爬不到內容;之後準備好只要取消勾選即可恢復。
  hidden: boolean;
}

const FALLBACK: Lang = 'zh-hant';
const pick = (m: LocaleMap, lang: Lang) => m[lang] || m[FALLBACK];

export function getProducts(lang: Lang): Product[] {
  return (data.products as RawProduct[]).map((p) => ({
    id: p.id,
    category: p.category,
    price: p.price,
    containsAlcohol: p.containsAlcohol,
    image: p.image,
    name: pick(p.name, lang),
    tagline: pick(p.tagline, lang),
  }));
}

interface RawSpotlight {
  heading: LocaleMap;
  body: LocaleMap;
  image: string | null;
}

interface RawCategory {
  key: string;
  label: LocaleMap;
  spotlights?: RawSpotlight[];
  hidden?: boolean;
}

export function getCategories(lang: Lang): Category[] {
  return (data.categories as RawCategory[]).map((c) => ({
    key: c.key,
    label: pick(c.label, lang),
    spotlights: (c.spotlights || []).map((s) => ({
      heading: pick(s.heading, lang),
      body: pick(s.body, lang),
      image: s.image,
    })),
    hidden: c.hidden ?? false,
  }));
}
