// build-products.mjs — 由 Doc/Product.xlsx(唯一來源)+ src/data/products.i18n.json(英/日/韓譯文)
// 產生 src/data/products.json,並把每個產品的照片複製到 public/images/products/<id>.jpg。
//
// 用法:npm run products
// 相依:零(自行以 Node 內建 zlib 解 .xlsx 這個 zip,不裝任何套件)。
//
// 資料模型(每列 → 一個產品):{ id, category, price, containsAlcohol, image, name{locale}, tagline{locale} }
// 中文/價格/酒精/照片以 Excel 為準;id 與英日韓文字以 products.i18n.json 為準(以中文品名對應)。

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const XLSX = process.argv[2] || path.join(root, 'Doc', 'Product.xlsx');
const I18N = path.join(root, 'src', 'data', 'products.i18n.json');
const OUT = path.join(root, 'src', 'data', 'products.json');
const IMG_SRC_DIRS = [path.join(root, 'Image'), path.join(root, 'public', 'images')];
const IMG_OUT_DIR = path.join(root, 'public', 'images', 'products');

const LOCALES = ['zh-hant', 'en', 'ja', 'ko'];

// ---- 極簡 .xlsx(zip)讀取:只取 sharedStrings 與第一張工作表 ----
function unescapeXml(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, '&');
}

function readZipEntries(buf, wanted) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('不是有效的 .xlsx(找不到 zip 結尾)');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out = {};
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const fnLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + fnLen);
    if (wanted.includes(name)) {
      const lfn = buf.readUInt16LE(localOff + 26);
      const lex = buf.readUInt16LE(localOff + 28);
      const start = localOff + 30 + lfn + lex;
      const comp = buf.subarray(start, start + compSize);
      out[name] = (method === 8 ? zlib.inflateRawSync(comp) : comp).toString('utf8');
    }
    p += 46 + fnLen + extraLen + commentLen;
  }
  return out;
}

function parseSharedStrings(xml) {
  const out = [];
  const siRe = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = siRe.exec(xml))) {
    let text = '';
    const tRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let tm;
    while ((tm = tRe.exec(m[1]))) text += tm[1];
    out.push(unescapeXml(text));
  }
  return out;
}

function colToNum(letters) {
  let c = 0;
  for (const ch of letters) c = c * 26 + (ch.charCodeAt(0) - 64);
  return c;
}

function parseSheet(xml, shared) {
  const rows = [];
  const rowRe = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let rm;
  while ((rm = rowRe.exec(xml))) {
    const cells = {};
    let maxCol = 0;
    const cRe = /<c\s+r="([A-Z]+)\d+"([^>]*)>([\s\S]*?)<\/c>/g;
    let cm;
    while ((cm = cRe.exec(rm[1]))) {
      const col = colToNum(cm[1]);
      const t = (/t="([^"]+)"/.exec(cm[2]) || [])[1] || null;
      const v = (/<v>([\s\S]*?)<\/v>/.exec(cm[3]) || [])[1];
      let val = null;
      if (t === 's' && v != null) val = shared[parseInt(v, 10)];
      else if (t === 'inlineStr') val = unescapeXml((/<t[^>]*>([\s\S]*?)<\/t>/.exec(cm[3]) || [, ''])[1]);
      else if (v != null) val = unescapeXml(v);
      cells[col] = val;
      if (col > maxCol) maxCol = col;
    }
    const arr = [];
    for (let c = 1; c <= maxCol; c++) arr.push(cells[c] ?? null);
    rows.push(arr);
  }
  return rows;
}

function readXlsx(file) {
  const buf = fs.readFileSync(file);
  const e = readZipEntries(buf, ['xl/sharedStrings.xml', 'xl/worksheets/sheet1.xml']);
  const shared = e['xl/sharedStrings.xml'] ? parseSharedStrings(e['xl/sharedStrings.xml']) : [];
  return parseSheet(e['xl/worksheets/sheet1.xml'], shared);
}

// ---- 照片:找到來源,複製成 public/images/products/<id>.jpg ----
function copyPhoto(photo, id) {
  if (!photo) return null;
  let src = null;
  for (const d of IMG_SRC_DIRS) {
    const cand = path.join(d, photo);
    if (fs.existsSync(cand)) { src = cand; break; }
  }
  if (!src) { warnings.push(`找不到照片:${photo}(產品 ${id})`); return null; }
  const ext = path.extname(photo).toLowerCase() || '.jpg';
  const outName = `${id}${ext}`;
  fs.mkdirSync(IMG_OUT_DIR, { recursive: true });
  fs.copyFileSync(src, path.join(IMG_OUT_DIR, outName));
  return `/images/products/${outName}`;
}

// ---- 主流程 ----
const warnings = [];
const i18n = JSON.parse(fs.readFileSync(I18N, 'utf8'));
const rows = readXlsx(XLSX);
if (!rows.length) throw new Error('試算表沒有資料');

const header = rows[0].map((h) => (h || '').trim());
const col = (n) => header.indexOf(n);
const C = { cat: col('主標題'), name: col('產品名稱'), tagline: col('說明'), alcohol: col('酒精'), price: col('價格'), photo: col('照片') };
for (const [k, v] of Object.entries(C)) if (v < 0) throw new Error(`試算表缺少欄位:${k}`);

const catByMatch = new Map(i18n.categories.map((c) => [c.match, c]));
const catOrder = [];
const products = [];

for (const row of rows.slice(1)) {
  const zhName = (row[C.name] || '').trim();
  if (!zhName) continue;
  const catZh = (row[C.cat] || '').trim();
  const catDef = catByMatch.get(catZh);
  if (!catDef) warnings.push(`分類「${catZh}」在 products.i18n.json 沒有對應(產品 ${zhName})`);
  const catKey = catDef ? catDef.key : 'other';
  if (!catOrder.includes(catKey)) catOrder.push(catKey);

  const meta = i18n.products[zhName];
  if (!meta) warnings.push(`產品「${zhName}」缺英/日/韓譯文,暫以中文顯示`);
  const id = meta?.id || zhName.replace(/[^\w一-鿿]+/g, '-');
  const zhTagline = (row[C.tagline] || '').trim();

  const name = { 'zh-hant': zhName };
  const tagline = { 'zh-hant': zhTagline };
  for (const l of ['en', 'ja', 'ko']) {
    name[l] = meta?.[l]?.name || zhName;
    tagline[l] = meta?.[l]?.tagline || zhTagline;
  }

  products.push({
    id,
    category: catKey,
    price: Number(row[C.price]) || 0,
    containsAlcohol: (row[C.alcohol] || '').trim() === '有',
    image: copyPhoto((row[C.photo] || '').trim(), id),
    name,
    tagline,
  });
}

const categories = catOrder.map((key) => {
  const def = i18n.categories.find((c) => c.key === key);
  return { key, label: def ? def.label : { 'zh-hant': key, en: key, ja: key, ko: key } };
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ categories, products }, null, 2) + '\n', 'utf8');

console.log(`✓ 產生 ${path.relative(root, OUT)}:${products.length} 項產品、${categories.length} 個分類`);
console.log(`  分類順序:${categories.map((c) => c.label['zh-hant']).join(' / ')}`);
if (warnings.length) {
  console.log('\n⚠ 提醒:');
  for (const w of warnings) console.log('  - ' + w);
}
