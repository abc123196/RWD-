// ---------------------------------------------------------------
// 未來串接 MySQL 的關鍵設定：
// 現在留空（null），前端會讀取 data/ 資料夾裡的示範 JSON。
// 之後架好後端 API（例如 Node.js + Express + mysql2，或 PHP + PDO）後，
// 只要把這裡改成後端網址，例如：
//   const API_BASE_URL = "https://your-backend.example.com/api";
// 後端需提供兩個端點：
//   GET {API_BASE_URL}/news         -> 回傳與 data/news.json 相同格式的陣列
//   GET {API_BASE_URL}/chart-data   -> 回傳與 data/chart-data.json 相同格式的物件
// 前端其餘程式碼完全不需要修改。
// ---------------------------------------------------------------
const API_BASE_URL = null;

function setToday() {
  const el = document.getElementById("today");
  const now = new Date();
  el.textContent = now.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

async function fetchJSON(localPath, apiPath) {
  const url = API_BASE_URL ? `${API_BASE_URL}${apiPath}` : localPath;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`無法載入 ${url}`);
  return res.json();
}

function renderNews(items) {
  const list = document.getElementById("news-list");
  const count = document.getElementById("news-count");
  list.innerHTML = "";

  if (!items || items.length === 0) {
    list.innerHTML = '<li class="news-empty">目前沒有消息</li>';
    count.textContent = "0";
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "news-item";
    li.innerHTML = `
      <span class="news-date">${item.date ?? ""}</span>
      <h3 class="news-title">${item.title ?? ""}</h3>
      <p class="news-summary">${item.summary ?? ""}</p>
    `;
    list.appendChild(li);
  });

  count.textContent = String(items.length);
}

function renderStats(values) {
  const row = document.getElementById("stat-row");
  if (!values || values.length === 0) {
    row.innerHTML = "";
    return;
  }
  const latest = values[values.length - 1];
  const prev = values.length > 1 ? values[values.length - 2] : latest;
  const change = latest - prev;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  row.innerHTML = `
    <div>
      <dt>最新值</dt>
      <dd>${latest.toLocaleString("zh-TW")}</dd>
    </div>
    <div>
      <dt>較前一筆</dt>
      <dd>${change >= 0 ? "+" : ""}${change.toLocaleString("zh-TW")}</dd>
    </div>
    <div>
      <dt>平均值</dt>
      <dd>${avg.toLocaleString("zh-TW", { maximumFractionDigits: 1 })}</dd>
    </div>
  `;
}

function renderChart(data) {
  const ctx = document.getElementById("mainChart");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: data.seriesName ?? "數值",
          data: data.values,
          borderColor: "#C9A66B",
          backgroundColor: "rgba(201, 166, 107, 0.15)",
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.25,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "#A9BFBD" } },
      },
      scales: {
        x: { ticks: { color: "#A9BFBD" }, grid: { color: "#2E5A5E" } },
        y: { ticks: { color: "#A9BFBD" }, grid: { color: "#2E5A5E" } },
      },
    },
  });
  renderStats(data.values);
}

async function init() {
  setToday();

  const statusEl = document.getElementById("chart-status");
  statusEl.textContent = API_BASE_URL ? "已連接資料庫" : "示範資料";

  try {
    const news = await fetchJSON("news.json", "/news");
    renderNews(news);
  } catch (err) {
    document.getElementById("news-list").innerHTML =
      '<li class="news-empty">消息載入失敗，請確認資料來源</li>';
    console.error(err);
  }

  try {
    const chartData = await fetchJSON("chart-data.json", "/chart-data");
    renderChart(chartData);
  } catch (err) {
    console.error(err);
  }
}

init();
