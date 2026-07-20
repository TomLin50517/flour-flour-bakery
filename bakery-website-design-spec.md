# 「flour flour BAKERY」精品烘焙官網 — 設計規格文件

> 版本 v2.3|2026-07-09|狀態:**已確認,可實作**
> 已確認決策:溫暖精品方向/Cloudflare Pages/網域 flourflour.tw(已註冊)/開源字體/分析僅留插入點
> v2.0:依品牌 Logo 初稿全面改版 — 品牌名、色彩、字體、敘事對齊 flour flour 品牌識別
> 用途:交由 Claude Code 依本文件實作

---

## 0. v2.0 改版說明(與 v1.1 的差異)

Logo 初稿的品牌調性為**溫暖、柔美、精品**(玫瑰金、圓體字、花卉曲線),與 v1.1 的「日式極簡」(直角、墨色、禪意留白)方向不同。本版以品牌識別為準做了以下調整:

| 項目 | v1.1(日式極簡) | v2.0(flour flour) |
|---|---|---|
| 品牌 | 木白 KIHAKU(虛構) | flour flour BAKERY(EST. 2024) |
| 色彩 | 米白×墨色×抹茶灰綠 | 奶油白×玫瑰金×橄欖綠×深可可(依品牌色彩計畫) |
| 字體 | Noto Serif 明朝體 | 圓體(柔軟)+ Didot 系 serif(精品),見 §3.2 |
| 造型 | 全站直角、禁陰影 | 柔和圓角、極淡陰影(呼應 Logo 柔美曲線) |
| 敘事 | 日本修業、柴窯 | 淡水夕陽、河岸、龍眼花、魔法烘焙(依設計概念) |

保留不變:多頁式 5 頁、四語系 Astro i18n 架構、大量留白的精品排版原則、驗收標準框架。

## 1. 專案概述

| 項目 | 內容 |
|---|---|
| 品牌 | flour flour BAKERY(EST. 2024) |
| 定位 | 淡水在地精品烘焙:以夕陽、河岸與花卉為靈感,「用魔法般的烘焙,為每一天帶來美好與溫暖」 |
| 網站目標 | 建立品牌質感、展示產品、引導來店/電話預訂 |
| 結構 | 多頁式(5 頁) |
| 語言 | 四語系:繁中(預設)/ 英文 / 日文 / 韓文,Astro 靜態產生獨立語系頁面 |
| 範圍外 | 電商購物車、會員系統、CMS 後台(留擴充彈性) |

## 2. 品牌概念(依 Logo 初稿)

- **品牌名**:flour flour BAKERY(logo 文字為全小寫 `flour flour`,網站標題沿用)
- **品牌花**:自然花卉 + 淡水夕陽 + 龍眼花意象 + 可頌的弧度,組成品牌識別「Flour Flour 的品牌花」— 網站以此作為核心視覺母題(分隔符、bullet、hover 細節、favicon)
- **Slogan(繁中)**:「為每一天,帶來美好與溫暖。」(源自設計概念文案,Hero 用短版)
- **敘事主軸**:淡水河岸的夕陽光芒 × 花朵的柔美 × 職人烘焙的日常魔法
- **基本資料(虛構,待確認)**:
  - 電話:02-2621-XXXX
  - Email:hello@flourflour.tw
  - 地址:新北市淡水區中正路 123 號(近淡水老街/河岸)
  - 營業:週三–週日 11:00–19:00(週一、二公休)
  - 社群:Instagram @flourflour.bakery / LINE 官方帳號 @flourflour

## 3. 設計系統(依品牌色彩計畫與字體建議)

### 3.1 色彩

對應 Logo 初稿五色計畫(色值為據圖估校,實作時以品牌方提供之標準色替換):

| Token | 色值(暫定) | 品牌色 | 用途 |
|---|---|---|---|
| `--color-bg` | `#F7EFE3` | 奶油白 | 主背景(純淨・質感) |
| `--color-surface` | `#FFFDF8` | — | 卡片/區塊面 |
| `--color-ink` | `#3A2E25` | 深可可 | 主文字(沉穩・香醇) |
| `--color-ink-soft` | `#8A7C6C` | 米灰色 | 次要文字(柔和・優雅) |
| `--color-rosegold` | `#B5764E` | 玫瑰金 | 品牌重點:logo、CTA、hover、價格(溫暖・精品) |
| `--color-olive` | `#8E9668` | 橄欖綠 | 輔助:標籤、季節限定 badge、footer 深化區(自然・安心) |
| `--color-line` | `#E8DECD` | — | 分隔線、邊框 |

原則:奶油白為大面積基底,玫瑰金作為唯一高注目色(占比 <8%),橄欖綠僅作點綴;深色區塊(footer/引言區)可用深可可底 + 玫瑰金字,重現 Logo 深色版的質感。

### 3.2 字體

品牌建議字體(思源柔黑/Avenir Next Rounded/Didot)中,後兩者為商用授權字體,網站採以下可自由使用之替代方案(視覺等效):

| 品牌建議 | 網站採用 | 用途 |
|---|---|---|
| Didot Elegant | Playfair Display (400/500 italic 點綴) | 英文標題、品牌名、價格數字 |
| Avenir Next Rounded | Quicksand (300/400/500) | 英文內文、UI 元素、導覽 |
| 思源柔黑 Light | jf open 粉圓 Open Huninn(自架 woff2);備援 Noto Sans TC | 繁中標題與內文(圓體柔軟感) |
| —(日文) | Zen Maru Gothic (300/400) | 日文版(圓體,調性一致) |
| —(韓文) | Gowun Dodum;備援 Noto Sans KR | 韓文版 |

- 標題字距 `letter-spacing: 0.12em`(英文 `0.06em`),行高 1.5;內文 16px、行高 1.9(英文 1.7)
- 品牌名 `flour flour` 全站維持小寫 + 寬字距,模仿 logo 標準字
- 字型按語系子集載入,`font-display: swap`
- 文案長度差異:英/韓文平均比中文長 30–50%,按鈕與導覽需以最長語系驗版
- 若 Open Huninn 自架成本高,v1 可先用 Noto Sans TC Light 上線,字型檔後補

### 3.3 版面與造型

- 內容最大寬 `1120px`,置中;section 垂直留白 `120px`(mobile `72px`)
- 8px spacing scale;格線 12 欄
- 圓角:卡片/圖片 `12px`、按鈕 `999px`(膠囊形,呼應可頌弧度與圓體字)
- 陰影:僅卡片 hover 時 `0 8px 24px rgba(58,46,37,0.08)`(極淡、暖色),平時以 1px `--color-line` 邊框分層
- 動效:進場 fade-up 600ms;hover 圖片 scale(1.03) 800ms;品牌花 SVG 可做 hover 微旋轉(≤5°);不用彈跳/花俏動畫
- 裝飾:品牌花 SVG 線稿(玫瑰金 1.5px 線)作為 section 分隔與空白處點綴,每屏最多 1 處

### 3.4 影像風格(佔位規格)

- 夕陽暖光/自然光、淺景深、奶油白或木質背景;可安排淡水河岸、夕陽剪影情境照呼應品牌故事
- 比例:Hero 滿版全幅(非 16:9 裁框)、產品卡 4:5、故事區 3:2
- v1 用 `--color-line` 色塊佔位 + 圖說標明拍攝需求

### 3.5 Logo 資產需求(請品牌方提供)

- 主 logo(品牌花 + flour flour BAKERY 直式)SVG + PNG(透明底)
- 橫式簡化版(header 用,高度 ≤48px 仍清晰)
- 品牌花單獨圖形(favicon、裝飾用)SVG
- 深色背景版(footer 深可可區用,玫瑰金/奶油白線稿)
- 暫無檔案時,實作先以文字標準字(Playfair Display 小寫 + 字距)+ 簡化花朵 SVG 佔位

## 4. 網站架構(Sitemap)

```
/            首頁(品牌入口,各區精華 + 導流)
/story       品牌故事
/products    產品介紹(列表;v1 不做單品獨立頁,用同頁展開)
/service     客服中心(FAQ、訂購須知)
/contact     聯絡我們
/privacy     隱私權政策(footer 連結,不入主導覽)
```

四語系 URL:繁中為根路徑,其餘加語系前綴 —— `/`(繁中)、`/en/...`、`/ja/...`、`/ko/...`,共 24 個靜態頁面(6 頁 × 4 語系)+ 404 由 Astro 自動產生。

- **Header(全站共用)**:左 logo(橫式),右導覽:品牌故事/產品/客服/聯絡我們 + 語言切換器(`繁中|EN|日本語|한국어`,切換時停留在同一頁面的對應語系);mobile 漢堡選單全屏展開(奶油白底),語言切換置於選單底部
- **Footer(全站共用)**:深可可底、玫瑰金/奶油白字,三欄 — 品牌花線稿+短述+社群 icon/快速連結/聯絡資訊+營業時間;底部版權列 `© 2026 flour flour BAKERY · EST. 2024` + 隱私權政策連結
- **公告列(選配)**:header 上方一條橄欖綠底細列,顯示公休/節慶預購公告;文案存於 i18n JSON,`announcement.enabled: false` 時整列不輸出 — 開店營運常用,避免日後改版

## 5. 頁面規格

### 5.1 首頁 `/`

| 區塊 | 內容 | 備註 |
|---|---|---|
| Hero | 滿版影像(淡水夕陽光感)+ 品牌花 logo 置中 + slogan「為每一天,帶來美好與溫暖。」+ CTA「認識 flour flour →」 | 影像高度 92vh;文字奶油白,壓深色半透明漸層 |
| 特別推薦 | 3 款精選產品卡(圖 4:5/品名/一句描述/玫瑰金價格) | 連到 /products |
| 故事引言 | 左圖(河岸夕陽)右文,2–3 句品牌摘要 + 「閱讀故事 →」 | 品牌花線稿點綴 |
| 資訊帶 | 營業時間/地址/電話 三欄一列 | 連到 /contact |

### 5.2 品牌故事 `/story`

1. 頁首:窄幅 banner(40vh,夕陽色調)+ 頁標題「我們的故事|Our Story」
2. 五章敘事(每章:英文小標 + 在地語標題 + 40–80 字內文 + 一張 3:2 圖,左右交錯):
   - 01 The River|河 — 2024 年創立於淡水河岸,漲退潮教會我們等待
   - 02 The Flour|粉 — 日本粉與台灣本地小麥,湯種與低溫長時間發酵
   - 03 The Flower|花 — 品牌花(花瓣/夕陽/水面)與三芝龍眼花蜜
   - 04 The Fold|摺 — 可頌二十七層、三次三摺,摺進空氣
   - 05 The Light|光 — 傍晚五點半的夕陽河光,留給當天最後一爐
3. 理念金句區:深可可滿版底 + 玫瑰金 serif 大字引言 + 品牌花線稿
4. 頁尾 CTA:「看看今天的麵包 →」導向 /products

### 5.3 產品介紹 `/products`

- 頁首窄幅 banner + 分類 tab(錨點切換);分類與順序由試算表決定(目前:**經典可頌 / 丹麥棒 / 特色禮盒**)
- 產品卡:圖 4:5(圓角 12px)→ 品名 → **一句說明標語** → 玫瑰金價格;含酒精品項另加「含酒精」飲食標籤(銅色小 tag,隨語系在地化)
- 桌機 3 欄、平板 2 欄、手機 1 欄
- **首頁「特別推薦」= 產品清單前三筆**;要換推薦,把該幾列在試算表移到最前即可
- **產品資料來源(單一來源)= `Doc/Product.xlsx`**,欄位:主標題(分類)/產品名稱/說明/酒精(有·無)/價格/照片
  - 流程:編輯 Excel → 執行 `npm run products` → 產生 `src/data/products.json`,照片自動由 `Image/` 複製到 `public/images/products/<id>.jpg`
  - 英/日/韓譯文與 id 對照在 `src/data/products.i18n.json`(以中文品名為 key);`products.json` 為產生檔,勿手改
  - 中文品名、價格、酒精、照片以 Excel 為準;改中文品名時請同步更新 i18n 對照的 key
- 頁尾備註列:「產品每日限量,建議來電預留」+ 電話 CTA

### 5.4 客服中心 `/service`

1. **FAQ 手風琴**(accordion,單開模式),兩分類:
   - 訂購:如何預訂?(電話/LINE)|可否宅配?(常溫甜點可,麵包不宅配)|大量訂購?(3 日前預訂)
   - 商品:保存方式與期限|過敏原標示|是否有素食選項
2. **訂購須知卡**:取貨時間、付款方式(現金/轉帳/LINE Pay)、取消政策
3. **側欄聯絡引導**:「找不到答案?」→ 電話/LINE 按鈕 + 連到 /contact

### 5.5 聯絡我們 `/contact`

| 區塊 | 內容 |
|---|---|
| 左欄:資訊 | 電話(`tel:` 連結)/Email(`mailto:`)/地址/營業時間/社群 icon |
| 右欄:地圖 | Google Maps 採 **click-to-load 門面**:先顯示靜態佔位(地圖示意 + 「載入地圖」按鈕),點擊後才注入 iframe — 避免第三方資源拖累 Lighthouse 與載入第三方 cookie |
| 下方:表單 | 姓名*/電話/Email*/主旨下拉(一般詢問・大量訂購・合作提案)/訊息*;送出後前端顯示成功訊息(v1 不接後端,預留 API 端點註解) |

表單驗證:必填 + Email 格式,錯誤訊息顯示於欄位下方(玫瑰金色),文案走 i18n 字典。加 honeypot 隱藏欄位防機器人(接後端時沿用)。表單下方一行小字連結至隱私權政策(個資告知)。

### 5.7 隱私權政策 `/privacy`

- 純文字頁(單欄窄版 720px),內容:蒐集項目(姓名/電話/Email)、目的(回覆詢問與訂購)、保存期限、當事人權利、聯絡窗口 — 對應個資法告知義務
- 四語系皆需產生;由 AI 產出範本文字,**上線前建議法務/專業者過目**
- footer 與聯絡表單皆連結至此頁

### 5.6 404 頁 `/404`

- **設計**:奶油白滿版留白 + 品牌花線稿(可微動畫:花瓣輕微飄落或 3° 搖曳)+ 文案「這片麵包好像被買走了。」+ 兩個 CTA:「回首頁」(膠囊主按鈕)、「看看今天的麵包 →」(文字連結);維持 header/footer,使用者不迷路
- **i18n 限制**:靜態主機對所有路徑只回傳一份 `404.html`,無法按語系預產生。處理方式:預設顯示繁中,頁面掛一段輕量 JS 讀取 `location.pathname` 前綴(`/en/`、`/ja/`、`/ko/`)切換為對應語系文案(四語文案內嵌於同一頁,無額外請求)
- **技術**:`src/pages/404.astro`;回應標頭須為 HTTP 404(Astro 靜態輸出預設正確)
- 驗收:四個語系路徑下打錯網址,文案語系正確、CTA 導向對應語系首頁

## 6. 技術規格(給 Claude Code)

| 項目 | 決定 |
|---|---|
| 技術棧 | Astro(靜態輸出 `output: 'static'`)+ vanilla JS,不引入前端框架 |
| i18n | Astro 內建 i18n routing:`defaultLocale: 'zh-hant'`(根路徑不帶前綴)、`locales: ['zh-hant', 'en', 'ja', 'ko']` |
| 檔案結構 | `src/pages/[...5 頁]`、`src/pages/{en,ja,ko}/[...5 頁]`(薄殼,共用同一組版型)、`src/layouts/Base.astro`、`src/components/`(Header/Footer/ProductCard/FAQ/LangSwitcher/BrandFlower)、`src/i18n/{zh-hant,en,ja,ko}.json`(全部文案)、`src/styles/global.css`、`public/images/`、`public/fonts/`(Open Huninn 子集) |
| 內容管理 | 所有文案(含產品清單、FAQ)集中於 `src/i18n/*.json`,頁面不寫死文字;新增語系只需加一份 JSON |
| 翻譯內容 | 四語系文案由實作時一併產出(品牌敘事採在地化改寫,非直譯;`flour flour BAKERY` 品牌名各語系不翻譯,維持英文小寫) |
| 共用區塊 | Header/Footer 為 Astro component,單一來源;品牌花為 inline SVG component(可調色) |
| RWD 斷點 | 1120 / 768 / 480 px,mobile-first |
| JS 功能 | 漢堡選單、FAQ accordion、產品分類 tab、scroll fade-up(IntersectionObserver)、表單驗證(錯誤訊息亦走 i18n 字典) |
| 佔位圖 | 以 CSS 背景色塊 `--color-line` + 置中文字標示規格(如「Hero 滿版 淡水夕陽河岸」) |
| SEO | 各頁各語系獨立 title/meta description、Open Graph、`<html lang>` 對應語系、每頁輸出 `hreflang` alternate 連結(含 `x-default` 指向繁中)、sitemap.xml 含全部 24 頁 |
| 結構化資料 | 全站注入 JSON-LD `Bakery`(LocalBusiness 子型):店名、地址、geo 座標、營業時間、電話、社群 `sameAs`;/products 加 `ItemList` — 在地店家 SEO 關鍵 |
| 分享資產 | OG image 1200×630(品牌花 + 標準字,奶油白底,四語系共用)、favicon(品牌花 SVG + 32px PNG + 180px apple-touch-icon)、`site.webmanifest` |
| 圖片格式 | 實照上線時輸出 WebP(JPEG 備援 `<picture>`),單張 ≤200KB |
| 瀏覽器支援 | 近兩版 Chrome/Safari/Edge/Firefox + iOS Safari 16+;不支援 IE |
| 部署 ✅ | Cloudflare Pages,連 GitHub repo 自動部署;正式網域 `flourflour.tw`(已註冊,DNS 指向 Pages);canonical/OG/sitemap/JSON-LD 皆以 `https://flourflour.tw` 為 base URL |
| 流量分析 ✅ | v1 不安裝,`Base.astro` head 留註解插入點;下一版再評估 GA4 vs Plausible |
| 無障礙 | 對比 ≥ 4.5:1(注意玫瑰金字在奶油白底需 500 字重以上或加深色值)、focus 樣式、alt 文字、accordion 用 `aria-expanded`、語言切換器有 `aria-label` |
| 效能 | 圖片 lazy loading、字型按語系子集載入、Astro 零 JS 預設(僅互動元件掛 script)、Lighthouse 目標 ≥ 90 |

## 7. 驗收清單

- [ ] 6 頁 × 4 語系(共 24 頁,含 /privacy)+ 404 頁皆正確產生且互相導覽,mobile 選單正常
- [ ] JSON-LD 通過 Google Rich Results Test;OG image 與 favicon 正確顯示
- [ ] 聯絡表單含 honeypot 與隱私政策連結;地圖為 click-to-load
- [ ] 404 頁回傳 HTTP 404,且依 URL 語系前綴顯示對應文案(§5.6)
- [ ] 語言切換器在任一頁面切換後停留在同頁對應語系,無 404
- [ ] 每頁 `hreflang` alternate 完整、`<html lang>` 正確
- [ ] 四語系文案無缺漏(不出現 fallback 原文或 JSON key)
- [ ] 三種斷點 × 最長語系(英/韓)版面不破版
- [ ] FAQ、tab、表單驗證功能正常,錯誤訊息隨語系切換
- [ ] 色彩符合 §3.1 品牌五色計畫,玫瑰金占比 <8%,對比達 4.5:1
- [ ] 各語系字型正確載入(繁中圓體/英文 Playfair+Quicksand/日文 Zen Maru/韓文 Gowun)
- [ ] 品牌名全站維持 `flour flour` 小寫標準字
- [ ] Lighthouse Performance/Accessibility/SEO ≥ 90(抽驗繁中與英文版)

## 8. 確認狀態與待補事項

1. ~~設計方向切換~~ ✅ **已確認(2026-07-09)**:採「溫暖精品」方向,對齊 Logo(圓角、玫瑰金、圓體字),保留精品留白密度
2. **色值**:§3.1 為據 Logo 圖估色,若有品牌標準色號(Pantone/HEX)請提供;暫以估校值實作
3. **Logo 檔案**:需 §3.5 所列 SVG/PNG;暫無則先以文字+花朵 SVG 佔位
4. **虛構資料**:淡水店址/電話/Email/產品與價格為示範,請確認或提供實際資料
5. ~~字體授權~~ ✅ **已確認**:v1 採開源字體(Quicksand/Playfair Display/Open Huninn 等,§3.2);後續版本再評估是否購入 Avenir Next Rounded/Didot 授權改回
6. 四語系文案先由 AI 產出在地化版本 — 上線前建議日/韓文找母語者校對
7. 聯絡表單 v1 僅前端 — 需要真的收到信可於下一版接 Formspree 或自建 API
8. ~~部署與網域~~ ✅ **已確認**:Cloudflare Pages + `flourflour.tw`(已註冊)
9. ~~流量分析~~ ✅ **已確認**:v1 僅留插入點,不安裝
10. **隱私權政策**:AI 產出範本,上線前建議法務過目(§5.7)
11. 網站範圍外但建議同步做:**Google Business Profile** 登錄(店址、營業時間、照片)— 在地搜尋流量通常大於官網自然流量
