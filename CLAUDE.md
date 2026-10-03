# FlourFlour Bakery 官網 — 給 Claude 的專案規則

這份文件給任何在這個 repo 工作的 Claude 看(包含網站負責人自己的 session,以及之後協作的設計師/工程師各自的 Claude session)。目的是把目前只存在於單次對話記憶裡的規矩,固定寫下來,讓每個人、每個 Claude session 一開始就讀得到,不用重新摸索一次。

**找不到答案時不要猜,先問使用者。** 這裡沒寫到的事(尤其牽涉品牌調性、視覺判斷、要不要上線)屬於人的決定,不是程式規則。

## 專案是什麼

Astro 7 靜態站,4 語言(`zh-hant` 預設無前綴、`en`、`ja`、`ko`),部署在 Cloudflare Workers 靜態資源(純靜態,無 Worker 腳本)。`master` 是正式站分支,推上去會自動部署到 `flourflour.com.tw`。

## 架構速覽

- **頁面** = `src/pages/**` 手動四語複製(每個語系一份 `.astro` 檔),共用 `src/components/templates/*.astro` 的內容邏輯,外殼是 `src/layouts/Base.astro`。
- **語系工具單一來源**:`src/i18n/index.ts`(`localePrefix`、`canonicalPathFor()`、`getBusinessInfo()`)。元件一律 import 這裡的函式,不要各自重寫語系對照表——過去重複定義造成過「改一處、其他處沒跟上」的不一致。
- **文案**:`src/i18n/{zh-hant,en,ja,ko}.json`,四份結構完全對稱。改一個 key 一定四個檔都要改。

## 內容資料:CMS 編輯,不要手動搬進 i18n 檔

以下內容**不在** i18n JSON 裡,是獨立的單一來源資料檔,透過 `/admin`(Sveltia CMS)編輯,存檔會直接 commit 到 repo:

- `src/data/products.json` — 商品(5 條產品線)。首頁「特別推薦」= 陣列前三項,改順序就改排列。新增分類要同時改這裡的 `categories` 和 `public/admin/config.yml` 的 select 選項。
- `src/data/faq.json`、`src/data/announcement.json`、`src/data/business-info.json`(電話/信箱/社群/營業時間/地址/座標)。

這些事實**不要**手動複製回 `src/i18n/*.json`——標籤文字留在 i18n,事實內容只存在這些 `data/*.json`,所有讀取的地方(Footer/Home/Contact/Service/Base JSON-LD 等)都從同一處拿值,改一處即同步。

`node scripts/check-content.mjs`(`npm run build` 會自動跑)檢查這些檔案四語齊全、沒有佔位字串(`XXXX`/`待填`/`TBD` 之類),缺一個語言會讓 build 失敗。

## 字型與排版:設計師的權責,但有一條管線要跟著動

字型、字重、排版這些視覺決定屬於 UI/UX 設計師的權責範圍,**不是禁止更動的區域**。但這個站的中文/日文/韓文字型不是整包載入,是「只打包網站實際用到的字」的子集化檔案(`scripts/subset-fonts.mjs`,建置前自動執行),背後有三個環節是連動的,改字型時要一起檢查:

1. **`scripts/subset-fonts.mjs` 的 `targets`**:定義每個語系用哪個字型套件、哪個字重。換字型/加字重,這裡要加一筆對應設定。
2. **`src/layouts/Base.astro` 的字型 preload**:目前預載了會在首屏出現的關鍵字重(避免「先系統字、字型到了再跳換」的閃動)。新增/更換字重後,這裡對應的 preload 也要跟著加,不然新字重會沒被預載、反而製造新的閃動。
3. **`font-display: optional`**(`subset-fonts.mjs` 產生的 CSS、`src/styles/fonts-common.scss` 的拉丁字型都是這個設定):這是刻意的取捨——字型若沒在極短時間內就緒,就整頁用系統字、**不換字**,換成 `swap`/`fallback` 會在 Chrome 造成明顯的標題跳動,這件事使用者已經實測否決過兩次,**不要「優化」回去**。換字型本身不受這個設定限制,但如果新字型檔案變大(更多字重、更多字集),使用者看到系統字的機率會變高——這是設計取捨,讓負責的人知道、自己決定就好,不是技術上的禁令。

另外:CJK 文字目前每語系只有「標題 500 + 內文 400」兩個字重在用,新增文字不需要手動處理字型——建置時會重新掃描整個 `src/**`,CMS 新存的文案跟它用到的字會在同一次部署上線。

## 漸進增強 / 動畫

- **首屏(第一個畫面看到的範圍)內容不能被 JS 擋住顯示**。`Base.astro` 結尾的 script 只對「完全在首屏以下」的元素加 `.reveal-armed`(進場動畫的隱藏狀態),首屏元素一律直接顯示,不依賴 JS/IntersectionObserver——這條線不能動,之前把首屏也納入動畫系統造成過「空白一下才跳出內容」的明顯頓感。
- 進場動畫時間是使用者實測調過的(文字 650ms、圖片 1200ms),沒有逾時保險提前揭示畫面外的元素——改動前先看 `global.css` 裡 reveal 區塊和 `Base.astro` 的註解。

## 本機開發

- 專案資料夾在 OneDrive 同步路徑裡,**不要隨便跑 `astro build`**:它會重建 `dist/`(約 3500 個檔案),OneDrive 會整批同步這個大量刪除/重建的動作。驗證改動優先用 `astro dev`(或 Claude Code 的瀏覽器預覽工具)+ `node scripts/check-content.mjs`,兩者都不會動到 `dist/`。只有「只能在正式建置產物裡驗證的改動」(字型雜湊、sitemap、SSG 產出的 HTML)才需要真的 build 一次,而且要說明為什麼。
- Cloudflare 每次 push 到 `master` 都會從原始碼重新建置,建置失敗會保留前一個版本繼續上線,所以跳過本機 build 風險很低。

## Git 協作流程(多人/多個 Claude session 共用這個 repo 時)

- **不要直接 push 到 `master`**。在自己的分支上工作,改完開 Pull Request,等 review 通過才合併。`master` 的異動會自動部署到正式站 `flourflour.com.tw`,直接 push 等於沒人看過就上線。
- **分支名用小寫、連字號分隔**,不要用斜線分層(例如 `designer-hero-update`,不要 `feature/designer/hero-update`)——Cloudflare 會把分支名轉成預覽網址的一部分,簡單的名字轉出來的網址才好分享、好記。
- 這個 repo 已經接了 Cloudflare 的 Git 整合,且已開啟「Builds for non-production branches」。**只要分支上有開著的 PR,Cloudflare 會自動在 PR 留言貼上這個分支的預覽網址**(一個穩定的分支別名網址 + 一個對應這次 commit 的版本網址),每次 push 都會更新。這個預覽網址跟正式站幾乎一樣,但網域不同、還沒上線。

### 不用等使用者問,改完、push 完就主動回報預覽結果

這點對設計師這種非技術使用者特別重要:**不要等他問「幫我看一下」才行動,每次 push 完一輪修改,主動查、主動回報**,流程:

1. 確認目前分支有沒有開著的 PR:`gh pr view`(沒有的話用 `gh pr create` 開一個,標題/描述簡單寫清楚改了什麼)。
2. 用 `gh pr checks` 確認這次 push 對應的 Cloudflare 建置已經「成功」,不是還在跑或失敗——沒建好就先別貼網址,避免使用者點進去看到舊版本或錯誤頁,以為是自己改壞了。還在跑就等一下再查,不要用固定秒數硬等,查到狀態變成功/失敗為止。
3. **第一次**開 PR 時,看 PR 留言找 Cloudflare 貼的預覽網址:`gh pr view --comments`,把網址回覆給使用者,或者自己用瀏覽器工具打開截圖給他看。
4. **同一個分支之後的每一輪修改**,預覽網址是固定的分支別名網址,不用重新查一次留言——直接跟使用者說「已更新,重新整理剛剛那個網址就會看到最新結果」。
5. **不要自己手動拼預覽網址**(分支名裡的大寫字母/特殊字元會被 Cloudflare 轉換,拼出來的網址不保證對),第一次一律用 PR 留言裡現成的連結。
6. 不要自己把分支合併到 `master`,也不要建議使用者直接合併——合併前需要原本負責這個站的人(網站所有者)過一次確認。

## 品牌 / 視覺規範參考資料

`Doc/` 底下有品牌識別、視覺風格相關的參考文件(例如 Design Constitution、Brand Visual Bible),這些檔案**刻意不進版控**(repo 是公開的,內部品牌資料不適合公開)。如果需要參考這些內容,直接問網站所有者要檔案,不要假設這個資料夾裡的東西都在 git 歷史裡找得到。
