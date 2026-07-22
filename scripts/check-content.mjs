// check-content.mjs — 上線前防呆:確認單一來源內容檔(faq / announcement)四語齊全。
// 由 `npm run build` 於 astro build 前執行;缺任何語言就讓 build 失敗,避免半套翻譯上線。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = ['zh-hant', 'en', 'ja', 'ko'];
const errors = [];

const read = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

// ---- FAQ:每題需有 id、group,且四語都有非空的 q 與 a ----
const faq = read('src/data/faq.json');
if (!Array.isArray(faq.items)) errors.push('faq.json:缺少 items 陣列');
const seenIds = new Set();
for (const [i, item] of (faq.items || []).entries()) {
  const where = `faq.json[${i}]${item?.id ? ` (${item.id})` : ''}`;
  if (!nonEmpty(item?.id)) errors.push(`${where}:缺少 id`);
  else if (seenIds.has(item.id)) errors.push(`${where}:id 重複`);
  else seenIds.add(item.id);
  if (!nonEmpty(item?.group)) errors.push(`${where}:缺少 group`);
  for (const l of LOCALES) {
    if (!item?.[l] || !nonEmpty(item[l].q) || !nonEmpty(item[l].a)) {
      errors.push(`${where}:缺少 ${l} 的 q/a`);
    }
  }
}

// ---- 公告:四語 text 都要有(即使目前 enabled=false) ----
const ann = read('src/data/announcement.json');
if (typeof ann.enabled !== 'boolean') errors.push('announcement.json:enabled 必須是 true/false');
for (const l of LOCALES) {
  if (!nonEmpty(ann?.[l])) errors.push(`announcement.json:缺少 ${l} 文字`);
}

// ---- 聯絡事實:電話/Email/社群非空;營業時間/地址/括註四語齊全 ----
const biz = read('src/data/business-info.json');
for (const k of ['phone', 'email', 'instagram', 'facebook']) {
  if (!nonEmpty(biz?.[k])) errors.push(`business-info.json:缺少 ${k}`);
}
for (const field of ['hours', 'address', 'addressNote']) {
  for (const l of LOCALES) {
    if (!nonEmpty(biz?.[field]?.[l])) errors.push(`business-info.json:${field} 缺少 ${l}`);
  }
}

// ---- 商品:分類四語 label;每項 id 唯一、分類有效、price 為數字、四語 name/tagline(image 可空) ----
const products = read('src/data/products.json');
const catKeys = new Set((products.categories || []).map((c) => c.key));
for (const [i, c] of (products.categories || []).entries()) {
  const where = `products.json categories[${i}]${c?.key ? ` (${c.key})` : ''}`;
  if (!nonEmpty(c?.key)) errors.push(`${where}:缺少 key`);
  for (const l of LOCALES) if (!nonEmpty(c?.label?.[l])) errors.push(`${where}:label 缺少 ${l}`);
}
const seenPid = new Set();
for (const [i, p] of (products.products || []).entries()) {
  const where = `products.json products[${i}]${p?.id ? ` (${p.id})` : ''}`;
  if (!nonEmpty(p?.id)) errors.push(`${where}:缺少 id`);
  else if (seenPid.has(p.id)) errors.push(`${where}:id 重複`);
  else seenPid.add(p.id);
  if (!catKeys.has(p?.category)) errors.push(`${where}:分類「${p?.category}」不在 categories 清單`);
  if (typeof p?.price !== 'number') errors.push(`${where}:price 必須是數字`);
  for (const field of ['name', 'tagline']) {
    for (const l of LOCALES) if (!nonEmpty(p?.[field]?.[l])) errors.push(`${where}:${field} 缺少 ${l}`);
  }
}

if (errors.length) {
  console.error('\n✗ 內容完整性檢查未通過:');
  for (const e of errors) console.error('  - ' + e);
  console.error(`\n共 ${errors.length} 項問題,請補齊四語後再上線。\n`);
  process.exit(1);
}
console.log(
  `✓ 內容完整性檢查通過:FAQ ${faq.items.length} 題、商品 ${products.products.length} 項、公告與聯絡事實四語齊全。`,
);
