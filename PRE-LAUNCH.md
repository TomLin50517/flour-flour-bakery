# 上線前檢查清單（轉正式域名前必做）

> 這份清單記錄「切換到正式域名、正式對外營運**之前**」該完成的事。
> 目前站點仍在測試階段（Cloudflare 自動部署),以下項目確認完成後再上線。

---

## 🔤 字型自架（GDPR 合規 + 效能)— ✅ **已完成（2026-07）**

**現況**:字型已自架,改用 `@fontsource/*` 的 range-based woff2 子集,單一入口在
`src/styles/fonts.css`(Base.astro 與 404.astro 皆引用)。已移除所有 Google Fonts CDN
連結與 preconnect;建置產出中無任何 `fonts.googleapis` / `fonts.gstatic` 殘留,
四語系(zh-hant / en / ja / ko)顯示皆已驗證正常。以下保留原始說明作為背景與日後升級參考。

<details><summary>原始需求與作法(背景)</summary>

**先前狀況**:字型透過 Google Fonts CDN 載入（見 `src/layouts/Base.astro` 的 `<head>`)。

**為什麼要改**:
- Google Fonts CDN 會在每次載入時把**訪客 IP 傳給 Google**。IP 在 GDPR 下屬個人資料,未經同意傳送有合規風險(參考德國 LG München I, 2022 判例)。
- 本站客群為**外國旅客(含歐盟)**,風險較一般在地站高。
- 「字型是開源」只代表**可以合法自架**,不代表透過 CDN 載入就沒有隱私問題——這是兩回事。

**怎麼做**:
- 把字型自架成 `public/fonts/` 的 woff2,改用本地 `@font-face`,移除 `fonts.googleapis.com` / `fonts.gstatic.com` 的連結與 `preconnect`。
- **用「範圍型(range-based / unicode-range)」子集化**,不要用「內容型」。
  - 範圍型 = Google CDN 本身的做法,整套字切成小塊 lazy-load。**日後改文案、加新字都不必重做**。
  - 內容型 = 只留現有文字的字形,檔案最小,但**每次改文案都要重做**,漏字會變 □ 豆腐字。→ 不採用。
- 實作可用 `@fontsource/*` 套件(已切好範圍型 woff2 + CSS),或手動下載子集。
- 涉及 7 種字型家族:Cormorant Garamond、Inter、Noto Serif TC、Noto Sans TC、Shippori Mincho、Noto Sans JP、Noto Serif KR、Noto Sans KR。
- 改完務必確認**四語系(zh-hant / en / ja / ko)顯示都正常**。

**額外好處**:少一次跨網域連線、不再被 CDN 的 CSS 擋住渲染 → 載入更快。

> 💡 **若股東要換字型**:換字型跟自架是同一道工序,到時一次做完即可,不會白工。

參考:規格書 §3.2 / §6。

</details>

---

## 其他上線前項目（有想到再補)

- [ ] 確認 `site` 網址與 canonical / hreflang 指向正式域名(目前 `astro.config.mjs` 為 `https://flourflour.com.tw`)
- [x] 電話已填正式號碼(`02-6688-1688`);`check-content` 已加佔位值防呆,`XXXX`/`REPLACE` 會擋建置
- [x] JSON-LD 營業時間改讀 `business-info.json` 的 `hoursSpec`,與顯示文字同源(改一處即同步)
- [ ] **JSON-LD `geo` 座標**待 Google 商家申請下來後更新(`src/layouts/Base.astro`;目前為淡水概略值)
- [ ] Facebook 連結目前借用股東粉專,待自家粉專申請完成後更新 `business-info.json` 的 `facebook`
- [ ] 聯絡表單接寄信管道(Web3Forms → 官方 Gmail),待 Gmail 申請下來 + access key
- [ ] 流量分析工具是否安裝(目前 v1 未裝,見 `Base.astro` TODO)
