# 給 UI/UX 設計師:帳號申請與連接教學(一次性設定)

這份文件只需要做**一次**。做完之後,之後每次工作請改看另一份《DESIGNER_GUIDE.md》。

總共要申請兩個帳號:**Claude(付費)**和**GitHub(免費)**。

---

## 第一步:申請 Claude 付費版(Pro,US$20/月起)

1. 瀏覽器打開 **claude.com**。
2. 註冊或登入帳號(用 email 就可以)。
3. 進入帳號設定裡的方案頁面,選擇 **Pro**,完成付款設定。
   - ⚠️ **一定要 Pro 或以上的付費方案**,免費版沒有 Claude Code 功能,無法用來改程式碼。
   - Pro 一般使用量就夠用。如果之後常常遇到「用量已達上限,請稍後再試」,再考慮升級到 Max,不用一開始就選最貴的方案。

## 第二步:申請 GitHub 帳號(免費版即可)

1. 瀏覽器打開 **github.com**。
2. 右上角 **Sign up**,輸入 email、設密碼,並選一個**使用者名稱**(username)。
   - 這個使用者名稱接下來要給網站負責人,**先想好、記下來**。
3. 完成 email 驗證信的確認。
4. 免費版就夠用,**不需要**升級任何付費方案。

## 第三步:把你的 GitHub 使用者名稱提供給網站負責人

把第二步設定好的**GitHub 使用者名稱**(不是密碼、不是 email)傳給網站負責人,讓他把你加進網站專案的協作者名單。

## 第四步:收到邀請信後,接受邀請

1. 網站負責人設定好之後,你申請 GitHub 時填的信箱會收到一封「You've been invited to collaborate」的邀請信。
2. 點信裡的連結,按 **Accept invitation**。
3. 接受後,到 github.com 應該就能看到 `flour-flour-bakery` 這個專案出現在你的帳號裡。

## 第五步:安裝 Claude Code

二選一,選你比較習慣的方式:

- **桌面應用程式(建議,不需要額外安裝其他東西)**:到 claude.com 下載 Claude 桌面版,打開後選上面的「Code」分頁。
- **終端機版(如果你的電腦已經裝過 Node.js、習慣用終端機)**:在終端機輸入 `npm install -g @anthropic-ai/claude-code` 安裝,再輸入 `claude` 啟動。

不確定選哪個就選第一種。

## 第六步:登入 Claude Code

打開 Claude Code 後,選擇用你的 **Claude 帳號**登入(不是用 API key 的方式),輸入第一步申請的帳號密碼完成登入。

## 第七步:把這個網站的程式碼下載到你電腦上

在 Claude Code 的對話框直接打字:

```
請幫我把 https://github.com/TomLin50517/flour-flour-bakery 這個 repo clone 到我電腦上
```

如果過程中它請你登入 GitHub,會跳出瀏覽器視窗,用**第二步申請的 GitHub 帳號**登入並授權就好。

⚠️ **下載的資料夾不要放進 OneDrive、Google Drive、Dropbox 這類會自動同步的資料夾**,放桌面或一般的文件資料夾即可。

---

## 完成!

以上都做完之後,帳號跟連接都設定好了,**不用再重複這些步驟**。之後每次要改版面,直接看《DESIGNER_GUIDE.md》就好。
