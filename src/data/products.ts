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
