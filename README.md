# 資訊看板（RWD 網頁模板）

一個響應式（RWD）網頁，包含：
- **最新消息**：目前讀取 `data/news.json`
- **資料圖表**：目前讀取 `data/chart-data.json`，用 Chart.js 繪製折線圖

## 本機預覽

由於使用了 `fetch()` 讀取 JSON 檔，直接用瀏覽器開 `index.html` 可能會因為瀏覽器的安全限制而讀不到資料。建議用簡單的本機伺服器開啟，例如：

```bash
# 在 site 資料夾內執行
python3 -m http.server 8000
```

然後開瀏覽器到 `http://localhost:8000`。

## 上傳到 GitHub 並用 GitHub Pages 發布

1. 在 GitHub 建立一個新的 repository。
2. 把這個資料夾裡的所有檔案 push 上去：
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/你的帳號/你的repo.git
   git push -u origin main
   ```
3. 到 repo 的 **Settings → Pages**，Source 選擇 `main` 分支、`/ (root)` 資料夾，儲存。
4. 幾分鐘後，GitHub 會提供一個網址，例如 `https://你的帳號.github.io/你的repo/`。

## 未來串接 MySQL

前端本身無法直接連 MySQL，需要先架一個後端 API（例如 Node.js + Express + `mysql2`，或 PHP + PDO），提供以下兩個端點：

- `GET /news` → 回傳與 `data/news.json` 相同格式的陣列
- `GET /chart-data` → 回傳與 `data/chart-data.json` 相同格式的物件

架好後端後，打開 `js/main.js`，把最上面的：

```js
const API_BASE_URL = null;
```

改成：

```js
const API_BASE_URL = "https://your-backend.example.com/api";
```

前端其餘程式碼不需要更動，就會改成讀取真實資料庫的資料。記得後端要設定 CORS，允許 GitHub Pages 的網域呼叫 API。
