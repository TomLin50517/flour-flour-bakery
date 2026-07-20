// products.ts — 讀取 build-products.mjs 產生的 products.json,對外提供「已在地化」的產品/分類。
// 資料來源:Doc/Product.xlsx(中文/價格/酒精/照片)+ products.i18n.json(英日韓)→ products.json。
// 不要手改 products.json;改內容請編輯 Excel 後執行 `npm run products`。
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

export interface Category {
  key: string;
  label: string;
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

export function getCategories(lang: Lang): Category[] {
  return (data.categories as { key: string; label: LocaleMap }[]).map((c) => ({
    key: c.key,
    label: pick(c.label, lang),
  }));
}
