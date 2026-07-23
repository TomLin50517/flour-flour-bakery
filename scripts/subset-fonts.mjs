// subset-fonts.mjs — content-based 字型子集化(由 `npm run build` 在 astro build 前執行)。
//
// 為什麼:range-based 分塊為了湊齊頁面用到的字,會整塊整塊下載。實測繁中首頁需下載
// 1.75MB / 47 個檔,最後一個字型到 5.3 秒 → 首載必然出現「先系統字、字型到了再換」的閃動。
// 改為只打包網站真正用到的字之後:繁中 4 個檔 / 約 737KB,字型 CSS 從 144KB 降到約 1KB,
// 且檔案少到可以 preload → 字型能在首次繪製前到位,閃動消失。
//
// 為什麼不怕 CMS 改文案漏字:每次建置都重新掃描 src 下所有內容來源(.json/.astro),
// 所以「CMS 存檔 → 重新建置 → 新字自動納入子集」,新文字與其字型是同一次部署上線的。
// 萬一仍有漏網字元,CSS 字型堆疊還有系統 serif/sans 備援(顯示系統中文字,不是豆腐字)。
//
// 產出(public/fonts/,已 gitignore,每次建置重新產生):
//   - <字型>.<hash>.woff2  子集字型(檔名含內容雜湊 → 內容變更即自動破快取)
//   - fonts-<lang>.<hash>.css  該語系的 @font-face
//   - manifest.json  供 Base.astro 取得 CSS 路徑與要 preload 的關鍵字型
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontsDir = path.join(root, 'node_modules/@fontsource');
const outDir = path.join(root, 'public/fonts');

// ---- 1) 掃描所有內容來源,取出實際用到的字元 ----
const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(json|astro|md)$/.test(e.name)) files.push(p);
  }
};
walk(path.join(root, 'src'));
let text = '';
for (const f of files) text += fs.readFileSync(f, 'utf8');

const pick = (re) => {
  const s = new Set();
  for (const ch of text) if (re.test(ch)) s.add(ch);
  return s;
};
const han = pick(/[一-鿿㐀-䶿]/);
const kana = pick(/[぀-ヿ]/);
const hangul = pick(/[가-힯]/);
const cjkPunct = pick(/[　-〿＀-￯]/);
// 拉丁/數字/符號一律保留:CJK 字型也會用來排中英夾雜字串
const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');

const charsets = {
  zh: [...han, ...cjkPunct].join('') + ascii,
  ja: [...han, ...kana, ...cjkPunct].join('') + ascii,
  ko: [...hangul, ...cjkPunct].join('') + ascii,
};

// ---- 2) 要子集化的字型。來源為 @fontsource 的「整套腳本」單檔(非編號分塊)。
// family/weight 需與 global.css 的字型堆疊一致;critical=首屏關鍵(標題/內文),會被 preload。
// 每語系只保留「標題 500 + 內文 400」兩個字重,且兩個都 preload → 沒有任何延遲載入的 CJK 字型,
// 首載不會再出現「部分文字晚一步換字」。(查證:CJK 內文全站只用預設 400;heading 400 僅
// .card-title/手機選單使用,已統一為 500;body 500 僅聯絡表單成功訊息使用。)
const targets = [
  { lang: 'zh', pkg: 'noto-sans-tc',  file: 'noto-sans-tc-chinese-traditional-400-normal.woff2',  family: 'Noto Sans TC',  weight: 400, critical: true },
  { lang: 'zh', pkg: 'noto-serif-tc', file: 'noto-serif-tc-chinese-traditional-500-normal.woff2', family: 'Noto Serif TC', weight: 500, critical: true },
  { lang: 'ja', pkg: 'noto-sans-jp',    file: 'noto-sans-jp-japanese-400-normal.woff2',    family: 'Noto Sans JP',    weight: 400, critical: true },
  { lang: 'ja', pkg: 'shippori-mincho', file: 'shippori-mincho-japanese-500-normal.woff2', family: 'Shippori Mincho', weight: 500, critical: true },
  { lang: 'ko', pkg: 'noto-sans-kr',  file: 'noto-sans-kr-korean-400-normal.woff2',  family: 'Noto Sans KR',  weight: 400, critical: true },
  { lang: 'ko', pkg: 'noto-serif-kr', file: 'noto-serif-kr-korean-500-normal.woff2', family: 'Noto Serif KR', weight: 500, critical: true },
];

const kb = (n) => Math.round(n / 1024);
const hash8 = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const byLang = { zh: [], ja: [], ko: [] };
const totals = { zh: [0, 0], ja: [0, 0], ko: [0, 0] };

for (const t of targets) {
  const src = path.join(fontsDir, t.pkg, 'files', t.file);
  if (!fs.existsSync(src)) {
    console.error(`✗ 找不到來源字型:${src}\n  (請確認 @fontsource 套件已安裝)`);
    process.exit(1);
  }
  const orig = fs.readFileSync(src);
  const out = await subsetFont(orig, charsets[t.lang], { targetFormat: 'woff2' });
  const name = `${t.file.replace(/\.woff2$/, '')}.${hash8(out)}.woff2`;
  fs.writeFileSync(path.join(outDir, name), out);
  byLang[t.lang].push({ ...t, name, size: out.length });
  totals[t.lang][0] += orig.length;
  totals[t.lang][1] += out.length;
}

// ---- 3) 產生各語系 CSS 與 manifest ----
// font-display: optional — 字型若未在極短的 block 期內就緒,整頁沿用系統字且「不換字」→ 永不跳動。
// 搭配 preload + 小體積子集,絕大多數情況都來得及,仍顯示品牌字。
// (先前用 fallback:等不到就先畫系統字、之後換字;Chrome 嚴格執行該 100ms,標題會明顯跳一下。)
const manifest = {};
for (const lang of ['zh', 'ja', 'ko']) {
  const css = byLang[lang]
    .map(
      (f) => `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};` +
        `font-display:optional;src:url('/fonts/${f.name}') format('woff2');}`,
    )
    .join('\n');
  const cssName = `fonts-${lang}.${hash8(Buffer.from(css))}.css`;
  fs.writeFileSync(path.join(outDir, cssName), css);
  manifest[lang] = {
    css: `/fonts/${cssName}`,
    preload: byLang[lang].filter((f) => f.critical).map((f) => `/fonts/${f.name}`),
  };
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(
  `✓ 字型子集化完成:掃描 ${files.length} 個內容檔,保留字元 zh:${charsets.zh.length} ja:${charsets.ja.length} ko:${charsets.ko.length}`,
);
for (const l of ['zh', 'ja', 'ko']) {
  const [o, s] = totals[l];
  console.log(`  ${l}: ${kb(o)}KB → ${kb(s)}KB (${Math.round((1 - s / o) * 100)}% 減少, ${byLang[l].length} 個檔)`);
}
