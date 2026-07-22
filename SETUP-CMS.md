# FlourFlour 內容管理（Sveltia CMS）設定指南

網站已內建一個內容管理後台：部署後可在 **`你的網址/admin/`** 開啟。
店員在網頁表單編輯「常見問題 / 公告 / 店家資訊」，四個語言各自填寫，
存檔後自動 commit 到 GitHub → Cloudflare 自動重建 → 約 1–2 分鐘上線。
**全程不需要碰 JSON、程式或 git 指令。**

> 對接的資料檔：`src/data/faq.json`、`announcement.json`、`business-info.json`
> （設定檔在 `public/admin/config.yml`）

---

## 程式碼位置對照（這套 CMS 的「code」分三處）

分清楚哪些是「我們自己做的、在本 repo」，哪些是「第三方開源、從 CDN 載入或另外部署」：

| # | 是什麼 | 位置 | 在本 repo？ |
|---|--------|------|:----------:|
| 1 | **Sveltia CMS 本體**（引擎） | 原始碼 `github.com/sveltia/sveltia-cms`；網站實際載入的建置版 `unpkg.com/@sveltia/cms@0.172.3/dist/sveltia-cms.js` | ❌ 第三方開源，從 CDN 載入 |
| 2 | **我們的 CMS 設定**（欄位、collections、後台頁） | `public/admin/index.html`、`public/admin/config.yml`（GitHub：`TomLin50517/flour-flour-bakery` → `public/admin/`）；上線後對外網址 `你的網址/admin/` | ✅ **就是我們做的部分** |
| 3 | **認證 Worker**（只有路徑 B 需要） | 原始碼 `github.com/sveltia/sveltia-cms-auth`；部署後得到自己的 `https://xxx.workers.dev`，填進 `config.yml` 的 `base_url` | ❌ 開源，另外部署為獨立 Cloudflare Worker |

> 📌 **版本鎖定**：第 1 項的 CDN 網址已鎖定版本 `@0.172.3`（見 `public/admin/index.html` 註解）。Sveltia 為 0.x 快速迭代,不鎖版本會抓最新版,上游 breaking change 或 unpkg 故障會讓 `/admin` 直接壞掉。升級時手動改該版本號並測試。
>
> 🔑 **密鑰去哪**：路徑 A 的個人存取權杖存在**你的瀏覽器本機**、路徑 B 的 `CLIENT_SECRET` 存在 **Cloudflare Worker 環境變數**——**兩者都不會、也絕不該 commit 進 repo**。

---

## 先決條件：把 `/admin` 部署上線
`public/admin/` 會隨網站一起部署。把本分支併入 `master`（或用 Cloudflare 的分支 preview）後，
`你的網址/admin/` 就會出現登入畫面。

---

## 登入方式（兩條路，先用 A，日後要多人再做 B）

### 路徑 A — 個人存取權杖（最快，適合你自己先用）
不需要 OAuth App、不需要部署 Worker。

1. 到 GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
2. 設定：
   - **Repository access**：只選 `TomLin50517/flour-flour-bakery`
   - **Permissions → Repository → Contents**：設為 **Read and write**
   - 有效期限自訂（到期需重發）
3. 產生後**複製權杖**（只顯示一次）。
4. 開 `你的網址/admin/` → 點 **「Sign In Using Access Token」** → 貼上權杖 → 進入後台。

> ⚠️ 權杖等同密碼，請自己保管、勿外傳。這條路適合**單一擁有者**；要給多位店員各自登入，請改用路徑 B。

### 路徑 B — GitHub 登入（正式多人自助用）
店員用自己的 GitHub 帳號登入，不必處理權杖。需要一次性設定 OAuth：

1. **建立 GitHub OAuth App**：GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**
   - Homepage URL：你的網址
   - Authorization callback URL：`https://<你的-auth-worker>.workers.dev/callback`（下一步會拿到）
   - 建立後記下 **Client ID** 與 **Client Secret**
2. **部署認證 Worker**：使用開源的 `sveltia-cms-auth`（Cloudflare Worker）
   - 專案與一鍵部署說明：<https://github.com/sveltia/sveltia-cms-auth>
   - 部署時設定環境變數：`GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`、`ALLOWED_DOMAINS`（填你的網域）
   - 部署完成後會得到 Worker 網址，例如 `https://xxx.workers.dev`
3. **填入設定檔**：把上面的 Worker 網址填進 `public/admin/config.yml` 的 `base_url:`（取代目前的 `REPLACE-WITH-...` 佔位），commit 上線。
4. 店員開 `你的網址/admin/` → 點 **「Sign In with GitHub」** 即可。
5. **新增店員**：到 repo 的 **Settings → Collaborators** 邀請他們的 GitHub 帳號（他們只用 email/密碼登入，不用懂 git）。

---

## 店員的編輯流程
1. 開 `你的網址/admin/`，登入。
2. 左側三個項目：**常見問題 / 網站公告 / 店家資訊**。
3. 點進去，各欄位**四個語言分別填寫**（繁中、English、日本語、한국어）。
4. 按 **Save / Publish** → 自動存回 GitHub → 網站約 1–2 分鐘自動更新。

> 提醒：目前設定為「存檔即直接上線 master」。若日後想改成「先審核再上線」，可再調整為 editorial workflow。

---

## 防呆機制（已內建）
`npm run build` 會先跑 `scripts/check-content.mjs`：三個內容檔只要**少任一語言**，
build（部署）就會失敗、擋下半套翻譯。所以店員若漏填某語言，不會意外上線。

---

## 常見問題
- **後台改壞了怎麼辦？** 所有變更都是 GitHub commit，可在 GitHub 上還原到前一版。
- **權杖過期？** 重新產生一個（路徑 A 步驟 1–3），再登入即可。
- **/admin 會被搜尋到嗎？** 不會，`/admin` 已設 `noindex`。
